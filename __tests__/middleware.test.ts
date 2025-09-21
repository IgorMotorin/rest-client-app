type MiddlewareConfig = { matcher: string | string[] };
const isMiddlewareConfig = (v: unknown): v is MiddlewareConfig =>
  typeof v === 'object' && v !== null && 'matcher' in v;

describe('middleware.ts', () => {
  it('creates handler with routing', async () => {
    const intlMod = await import('next-intl/middleware');
    const createMiddleware = intlMod.default as jest.Mock;

    const { routing } = await import('@/i18n/routing');
    const mwMod = await import('@/middleware');

    const createdHandler = createMiddleware.mock.results[0]?.value;
    expect(createMiddleware).toHaveBeenCalledWith(routing);
    expect(mwMod.default).toBe(createdHandler);
  });

  it('exports expected matcher', async () => {
    const mwMod = await import('@/middleware');
    const cfg = mwMod.config;

    expect(isMiddlewareConfig(cfg)).toBe(true);
    if (isMiddlewareConfig(cfg)) {
      expect(cfg.matcher).toBe('/((?!api|trpc|_next|_vercel|.*\\..*).*)');
    }
  });
});
