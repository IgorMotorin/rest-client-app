// __tests__/lib/sendRequest.test.ts
import { sendRequest } from '@/lib/sendRequest';
import { useRestStore } from '@/store/restStore';
import * as fr from '@/lib/fetchRequest';
import * as sh from '@/lib/sendHistory';

jest.mock('@/store/restStore', () => ({
  useRestStore: { getState: jest.fn() },
}));

jest.mock('@/lib/fetchRequest', () => ({
  fetchRequest: jest.fn(),
}));

jest.mock('@/lib/sendHistory', () => ({
  sendHistory: jest.fn(),
}));

type GetStateFn = () => unknown;
const getStateMock =
  useRestStore.getState as unknown as jest.MockedFunction<GetStateFn>;
const fetchRequestMock = fr.fetchRequest as jest.MockedFunction<
  typeof fr.fetchRequest
>;
const sendHistoryMock = sh.sendHistory as jest.MockedFunction<
  typeof sh.sendHistory
>;

describe('sendRequest', () => {
  const restorePerfNow = () => jest.spyOn(performance, 'now').mockRestore();

  beforeEach(() => {
    jest.clearAllMocks();
    // Fix the wall clock for timestamp
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-02T03:04:05.678Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    try {
      restorePerfNow();
    } catch {
      /* noop */
    }
  });

  it('GET: sends without body, filters headers by select, computes sizes/latency, calls sendHistory', async () => {
    // Store state (only used fields included)
    getStateMock.mockReturnValue({
      url: 'https://api.example.com/users',
      method: 'GET',
      headers: [
        { select: true, key: 'X-Auth', value: 't' },
        { select: false, key: 'Skip', value: 'x' },
      ],
      body: { select: 'text', text: 'ignored', json: '{"ignored":true}' },
      bodyTable: [],
      query: [{ key: 'q', value: '1', select: true }],
    });

    // Deterministic latency
    jest
      .spyOn(performance, 'now')
      .mockReturnValueOnce(100.0) // start
      .mockReturnValueOnce(250.1239); // end → latency 150.124 → toFixed(3) => 150.124 (then Number => 150.124)

    // Mock request/response
    fetchRequestMock.mockResolvedValue({
      response: { status: 204 } as unknown as Response,
      responseBody: 'OK',
      error: null,
    });

    sendHistoryMock.mockResolvedValue();

    const result = await sendRequest('user-123');

    // fetchRequest called with body null and filtered headers
    expect(fetchRequestMock).toHaveBeenCalledTimes(1);
    expect(fetchRequestMock).toHaveBeenCalledWith(
      'https://api.example.com/users',
      {
        method: 'GET',
        headers: { 'X-Auth': 't' },
        body: null,
      }
    );

    // history payload
    expect(sendHistoryMock).toHaveBeenCalledTimes(1);
    const [uid, item] = sendHistoryMock.mock.calls[0];
    expect(uid).toBe('user-123');

    // timestamp stable via fake timers
    expect(item.timestamp).toBe('2025-01-02T03:04:05.678Z');
    expect(item.method).toBe('GET');
    expect(item.statusCode).toBe(204);
    expect(item.latency).toBe(150.124);
    expect(item.endpoint).toBe('https://api.example.com/users');

    // sizes
    expect(item.requestSize).toBe(0); // body null
    expect(item.responseSize).toBe(2); // "OK"

    // pass-through fields from state
    expect(item.headers).toEqual([
      { select: true, key: 'X-Auth', value: 't' },
      { select: false, key: 'Skip', value: 'x' },
    ]);
    expect(item.query).toEqual([{ key: 'q', value: '1', select: true }]);

    // function return value mirrors what was sent
    expect(result.historyItem).toMatchObject({
      method: 'GET',
      statusCode: 204,
      endpoint: 'https://api.example.com/users',
    });
    expect(result.responseBody).toBe('OK');
  });

  it('POST form: builds JSON body from selected rows and computes sizes correctly', async () => {
    // Build form body: only selected rows included
    getStateMock.mockReturnValue({
      url: 'https://api.example.com/submit',
      method: 'POST',
      headers: [
        { select: true, key: 'Content-Type', value: 'application/json' },
      ],
      body: { select: 'form', text: '', json: '' },
      bodyTable: [
        { select: true, key: 'a', value: '1' },
        { select: false, key: 'b', value: '2' },
        { select: true, key: 'c', value: '✓' }, // include a non-ascii char to prove UTF-8 sizing
      ],
      query: [],
    });

    // Deterministic latency
    jest
      .spyOn(performance, 'now')
      .mockReturnValueOnce(10.0)
      .mockReturnValueOnce(20.0);

    const bodyObj = { a: '1', c: '✓' };
    const bodyStr = JSON.stringify(bodyObj); // "✓" is 2 bytes in UTF-8

    fetchRequestMock.mockResolvedValue({
      response: { status: 201 } as unknown as Response,
      responseBody: 'xyz',
      error: null,
    });

    sendHistoryMock.mockResolvedValue();

    const result = await sendRequest('u-1');

    // fetchRequest receives constructed body
    expect(fetchRequestMock).toHaveBeenCalledWith(
      'https://api.example.com/submit',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyStr,
      }
    );

    // history item checks
    const [, item] = sendHistoryMock.mock.calls[0];
    expect(item.method).toBe('POST');
    expect(item.statusCode).toBe(201);
    expect(item.requestSize).toBe(new TextEncoder().encode(bodyStr).length);
    expect(item.responseSize).toBe(3); // "xyz"
    expect(result.historyItem.requestSize).toBe(item.requestSize);
    expect(result.historyItem.responseSize).toBe(3);
  });

  it('PUT json: uses body.json as request body', async () => {
    const json = '{"hello":"world"}';
    getStateMock.mockReturnValue({
      url: 'https://api.example.com/put',
      method: 'PUT',
      headers: [],
      body: { select: 'json', text: '', json },
      bodyTable: [],
      query: [],
    });

    jest
      .spyOn(performance, 'now')
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(2);

    fetchRequestMock.mockResolvedValue({
      response: { status: 200 } as unknown as Response,
      responseBody: '',
      error: null,
    });

    sendHistoryMock.mockResolvedValue();

    await sendRequest('uid');

    expect(fetchRequestMock).toHaveBeenCalledWith(
      'https://api.example.com/put',
      {
        method: 'PUT',
        headers: {},
        body: json,
      }
    );
    const [, item] = sendHistoryMock.mock.calls[0];
    expect(item.requestSize).toBe(new TextEncoder().encode(json).length);
    expect(item.responseSize).toBe(0);
  });
});
