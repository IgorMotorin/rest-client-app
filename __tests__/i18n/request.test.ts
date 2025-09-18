import requestConfig from '@/i18n/request';

describe('i18n request config', () => {
  it('uses the requested locale when supported', async () => {
    const res = await requestConfig({ requestLocale: Promise.resolve('ru') });
    expect(res.locale).toBe('ru');
    expect(res.messages).toBeDefined();
  });

  it('falls back to default when requested locale is unsupported', async () => {
    const res = await requestConfig({ requestLocale: Promise.resolve('fr') });
    expect(res.locale).toBe('en');
    expect(res.messages).toBeDefined();
  });

  it('accepts a plain string requestLocale too', async () => {
    const res = await requestConfig({ requestLocale: Promise.resolve('en') });
    expect(res.locale).toBe('en');
  });
});
