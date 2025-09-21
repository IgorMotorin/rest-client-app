import { buildRestUrl } from '@/lib/urlBuilder';

type Item = Parameters<typeof buildRestUrl>[1];

describe('buildRestUrl', () => {
  it('returns /:locale/:method when endpoint is empty and no params', () => {
    const item = { method: 'GET' } as unknown as Item;
    expect(buildRestUrl('en', item)).toBe('/en/GET');
  });

  it('includes base64(endpoint) and optional base64(timestamp) as path segments', () => {
    const item = {
      method: 'POST',
      endpoint: 'https://api.example.com/users',
      timestamp: '2025-09-21T10:11:12Z',
    } as unknown as Item;

    const expectedEndpoint = btoa('https://api.example.com/users');
    const expectedTs = btoa('2025-09-21T10:11:12Z');

    expect(buildRestUrl('ru', item)).toBe(
      `/ru/POST/${expectedEndpoint}/${expectedTs}`
    );
  });

  it('omits timestamp segment when timestamp is missing', () => {
    const item = {
      method: 'DELETE',
      endpoint: '/v1/resource',
    } as unknown as Item;

    const expectedEndpoint = btoa('/v1/resource');
    expect(buildRestUrl('en', item)).toBe(`/en/DELETE/${expectedEndpoint}`);
  });

  it('builds URLSearchParams: headers prefixed with h., rows with no key skipped, undefined values -> empty', () => {
    const item = {
      method: 'GET',
      endpoint: '',
      headers: [
        { key: 'Auth', value: 'token' },
        { key: '', value: 'ignored' },
        { key: 'X-Foo', value: undefined as unknown as string },
      ],
      query: [
        { key: 'q1', value: 'abc' },
        { key: 'q2', value: undefined as unknown as string },
        { key: '', value: 'ignored' },
        { key: 'q1', value: 'def' },
      ],
    } as unknown as Item;

    const url = buildRestUrl('en', item);
    const [path, qs = ''] = url.split('?');
    expect(path).toBe('/en/GET');

    const params = new URLSearchParams(qs);
    expect(params.get('h.Auth')).toBe('token');
    expect(params.get('h.X-Foo')).toBe('');
    expect(params.has('h.')).toBe(false);

    expect(params.getAll('q1')).toEqual(['abc', 'def']);
    expect(params.get('q2')).toBe('');
  });

  it('returns no query string when headers/query are missing or empty', () => {
    const item = {
      method: 'PUT',
      endpoint: '',
      headers: [],
      query: [],
    } as unknown as Item;
    expect(buildRestUrl('en', item)).toBe('/en/PUT');
  });
});
