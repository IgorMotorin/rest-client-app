import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('react', () => {
  const actual: typeof import('react') = jest.requireActual('react');
  return {
    __esModule: true,
    ...actual,
    default: actual,
    use: <T,>(x: T): T => x,
  };
});

import CatchAllPage from '@/app/[locale]/(protected)/[...rest]/page';

describe('CatchAllPage', () => {
  it('calls notFound()', () => {
    const paramsValue = { rest: 'unknown-segment' };
    const searchParamsValue: Record<string, string> = {};

    const params = paramsValue as unknown as Promise<typeof paramsValue>;
    const searchParams = searchParamsValue as unknown as Promise<
      typeof searchParamsValue
    >;

    expect(() =>
      renderToStaticMarkup(
        <CatchAllPage params={params} searchParams={searchParams} />
      )
    ).toThrow('NEXT_NOT_FOUND');
  });
});
