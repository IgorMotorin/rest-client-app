import CatchAllPage from '@/app/[locale]/(protected)/[...rest]/page';

describe('CatchAllPage', () => {
  it('calls notFound()', () => {
    expect(() => CatchAllPage()).toThrow('NEXT_NOT_FOUND');
  });
});
