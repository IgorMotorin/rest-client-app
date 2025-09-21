import { fetchRequest } from '@/lib/fetchRequest';

type Options = {
  method: string;
  headers?: Record<string, string>;
  body?: string | null;
};

type MockResponse = {
  clone: () => { text: () => Promise<string> };
};

type FetchFn = (input: string, init?: Options) => Promise<MockResponse>;

describe('fetchRequest', () => {
  const originalFetch = (globalThis as { fetch?: unknown }).fetch;

  let mockFetch: jest.MockedFunction<FetchFn>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockFetch = jest.fn<ReturnType<FetchFn>, Parameters<FetchFn>>();
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: mockFetch,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: originalFetch,
    });
  });

  it('returns response and body on success', async () => {
    const bodyText = 'hello';
    const resp: MockResponse = {
      clone: () => ({ text: () => Promise.resolve(bodyText) }),
    };
    mockFetch.mockResolvedValue(resp);

    const url = 'https://api.example.com/users';
    const options: Options = { method: 'GET', headers: { A: '1' }, body: null };

    const { response, responseBody, error } = await fetchRequest(url, options);

    expect(mockFetch).toHaveBeenCalledWith(url, options);
    expect(responseBody).toBe(bodyText);
    expect(error).toBeNull();
    // We don't rely on DOM Response; ensuring non-null is enough for this unit:
    expect(response).not.toBeNull();
  });

  it('maps fetch rejection with Error to its message', async () => {
    mockFetch.mockRejectedValue(new Error('boom'));

    const { response, responseBody, error } = await fetchRequest('https://x', {
      method: 'POST',
    });

    expect(response).toBeNull();
    expect(responseBody).toBeNull();
    expect(error).toBe('boom');
  });

  it('maps non-Error rejection to "Network error"', async () => {
    mockFetch.mockRejectedValue('fail'); // non-Error

    const { response, responseBody, error } = await fetchRequest('https://x', {
      method: 'POST',
    });

    expect(response).toBeNull();
    expect(responseBody).toBeNull();
    expect(error).toBe('Network error');
  });

  it('handles error thrown by response.clone().text()', async () => {
    const resp: MockResponse = {
      clone: () => ({ text: () => Promise.reject(new Error('text failed')) }),
    };
    mockFetch.mockResolvedValue(resp);

    const { response, responseBody, error } = await fetchRequest('https://x', {
      method: 'GET',
    });

    expect(response).not.toBeNull();
    expect(responseBody).toBeNull();
    expect(error).toBe('text failed');
  });
});
