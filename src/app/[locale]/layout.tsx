/* eslint-disable react-refresh/only-export-components -- Next.js requires metadata export */
import type { Metadata } from 'next';
import '../globals.css';
import React from 'react';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export const metadata: Metadata = {
  title: 'Final Task',
  description: 'Project for the RS School React Course 2025',
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
