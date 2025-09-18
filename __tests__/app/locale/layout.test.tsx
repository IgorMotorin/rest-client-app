import React from 'react';
import LocaleLayout from '@/app/[locale]/layout';
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@/services/auth/AuthProvider', () => {
  return {
    __esModule: true,
    AuthProvider: ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': 'auth-provider' }, children),
  };
});

describe('[locale]/layout', () => {
  it('renders html[lang] and wraps children with providers on supported locale', async () => {
    const ui = await LocaleLayout({
      children: <div data-testid="child" />,
      params: Promise.resolve({ locale: 'en' }),
    });

    const html = '<!doctype html>' + renderToStaticMarkup(ui);
    const doc = new DOMParser().parseFromString(html, 'text/html');

    expect(doc.documentElement.getAttribute('lang')).toBe('en');
    expect(doc.querySelector('[data-testid="intl-client"]')).not.toBeNull();
    expect(doc.querySelector('[data-testid="auth-provider"]')).not.toBeNull();
    expect(doc.querySelector('[data-testid="child"]')).not.toBeNull();
  });

  it('calls notFound on unsupported locale', async () => {
    await expect(
      LocaleLayout({
        children: <div />,
        params: Promise.resolve({ locale: 'fr' }),
      })
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
