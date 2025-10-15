import { saveTokenCookie } from '@/lib/saveTokenCookie';
import { auth } from '@/lib/firebase';

jest.mock('@/lib/firebase', () => ({ auth: {} }));

describe('saveTokenCookie', () => {
  let originalCookieDesc: PropertyDescriptor | undefined;
  let setCalls = 0;
  let lastSetValue = '';

  beforeEach(() => {
    originalCookieDesc = Object.getOwnPropertyDescriptor(
      Document.prototype,
      'cookie'
    );

    if (!originalCookieDesc || typeof originalCookieDesc.set !== 'function') {
      throw new Error('document.cookie setter not found');
    }

    Object.defineProperty(Document.prototype, 'cookie', {
      configurable: true,
      get: originalCookieDesc.get,
      set: (value: string) => {
        setCalls += 1;
        lastSetValue = value;
        originalCookieDesc?.set?.call(document, value);
      },
    });

    Object.defineProperty(auth as object, 'currentUser', {
      configurable: true,
      get: () => null,
    });

    setCalls = 0;
    lastSetValue = '';
  });

  afterEach(() => {
    if (originalCookieDesc) {
      Object.defineProperty(Document.prototype, 'cookie', originalCookieDesc);
    }
    document.cookie = 'token=; Max-Age=0; path=/';
  });

  it('does nothing when there is no current user', async () => {
    await saveTokenCookie();

    expect(setCalls).toBe(0);
    expect(document.cookie).not.toContain('token=');
  });

  it('writes the token cookie when there is a current user', async () => {
    const token = 'abc.123.jwt';

    Object.defineProperty(auth as object, 'currentUser', {
      configurable: true,
      get: () => ({
        getIdToken: async () => token,
      }),
    });

    await saveTokenCookie();

    expect(lastSetValue).toBe(`token=${token}; path=/; samesite=lax`);
    expect(document.cookie).toContain(`token=${token}`);
    expect(setCalls).toBe(1);
  });
});
