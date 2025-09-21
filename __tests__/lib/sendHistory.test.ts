import { sendHistory } from '@/lib/sendHistory';
import type { HistoryItem } from '@/lib/sendHistory';

type FetchFn = (input: unknown, init?: unknown) => Promise<unknown>;

describe('sendHistory', () => {
  let originalFetch: unknown;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    originalFetch = (globalThis as { fetch?: unknown }).fetch;

    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: jest.fn() as unknown,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: originalFetch,
    });
  });

  const makeItem = (): HistoryItem => ({
    timestamp: '2025-09-21T10:11:12Z',
    latency: 123,
    statusCode: 200,
    method: 'GET',
    requestSize: 10,
    responseSize: 20,
    error: null,
    endpoint: 'https://api.example.com',
    query: [],
    headers: [],
    body: { type: 'raw', value: 'hi' } as unknown as HistoryItem['body'],
    bodyTable: [] as HistoryItem['bodyTable'],
  });

  it('POSTs to /api/log-request with JSON body including userId and item', async () => {
    const mockFetch =
      globalThis.fetch as unknown as jest.MockedFunction<FetchFn>;
    mockFetch.mockResolvedValue({});

    const item = makeItem();
    await expect(sendHistory('user-123', item)).resolves.toBeUndefined();

    expect(mockFetch).toHaveBeenCalledTimes(1);

    const call = mockFetch.mock.calls[0] ?? [];
    const url = call[0];
    const init = call[1];

    expect(url).toBe('/api/log-request');

    const method =
      typeof init === 'object' && init !== null && 'method' in init
        ? (init as { method?: unknown }).method
        : undefined;
    expect(method).toBe('POST');

    const headers =
      typeof init === 'object' && init !== null && 'headers' in init
        ? (init as { headers?: unknown }).headers
        : undefined;
    expect(headers).toEqual({ 'Content-Type': 'application/json' });

    const bodyStr =
      typeof init === 'object' && init !== null && 'body' in init
        ? (init as { body?: unknown }).body
        : undefined;
    expect(typeof bodyStr).toBe('string');

    const parsed =
      typeof bodyStr === 'string'
        ? (JSON.parse(bodyStr) as Record<string, unknown>)
        : {};
    expect(parsed.userId).toBe('user-123');
    expect(parsed.method).toBe(item.method);
    expect(parsed.endpoint).toBe(item.endpoint);
  });

  it('rethrows fetch Error message', async () => {
    const mockFetch =
      globalThis.fetch as unknown as jest.MockedFunction<FetchFn>;
    mockFetch.mockRejectedValue(new Error('boom'));

    await expect(sendHistory('u1', makeItem())).rejects.toThrow('boom');
  });

  it('throws "Unknown error" for non-Error rejections', async () => {
    const mockFetch =
      globalThis.fetch as unknown as jest.MockedFunction<FetchFn>;
    mockFetch.mockRejectedValue('fail'); // non-Error

    await expect(sendHistory('u1', makeItem())).rejects.toThrow(
      'Unknown error'
    );
  });
});
