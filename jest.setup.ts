import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import React from 'react';

globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
globalThis.TextDecoder =
  TextDecoder as unknown as typeof globalThis.TextDecoder;

jest.mock('firebase/app', () => {
  const initializeApp = jest.fn(() => ({}));
  const getApps = jest.fn(() => [] as unknown as Array<unknown>);
  const getApp = jest.fn(() => ({}));
  return { initializeApp, getApps, getApp };
});
jest.mock('@firebase/auth', () => {
  const auth = {};

  const onAuthStateChanged = jest.fn(
    (
      _auth: object,
      cb: (user: { uid: string; email?: string } | null) => void
    ) => {
      cb(null);
      return jest.fn();
    }
  );

  const initializeAuth = jest.fn(() => auth);
  const getAuth = jest.fn(() => auth);

  const browserLocalPersistence = {} as const;
  const browserSessionPersistence = {} as const;
  const indexedDBLocalPersistence = {} as const;

  const signInWithEmailAndPassword = jest.fn();
  const createUserWithEmailAndPassword = jest.fn();
  const signOut = jest.fn();
  const GoogleAuthProvider = jest.fn();
  const signInWithPopup = jest.fn();

  return {
    onAuthStateChanged,
    initializeAuth,
    getAuth,
    browserLocalPersistence,
    browserSessionPersistence,
    indexedDBLocalPersistence,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
  };
});
jest.mock('@firebase/firestore', () => {
  const getFirestore = jest.fn(() => ({}));
  return { getFirestore };
});
jest.mock('@firebase/storage', () => {
  const getStorage = jest.fn(() => ({}));
  return { getStorage };
});

const pushMock = jest.fn();
const replaceMock = jest.fn();
const routerMock = { push: pushMock, replace: replaceMock };

class NextRedirectError extends Error {
  readonly digest: string;
  constructor(url: string) {
    super(`NEXT_REDIRECT:${url}`);
    this.digest = 'NEXT_REDIRECT';
  }
}

jest.mock('next-intl', () => ({
  __esModule: true,
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
  hasLocale: (locales: readonly string[], value: string) =>
    locales.includes(value),
  NextIntlClientProvider: ({ children }: { children?: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'intl-client' }, children),
}));

jest.mock('next-intl/navigation', () => ({
  __esModule: true as const,
  useRouter: () => routerMock,
  createNavigation: () => ({
    redirect: (url: string): never => {
      throw new NextRedirectError(url);
    },
    usePathname: () => '/',
    Link: 'a',
    useRouter: () => routerMock,
    getPathname: () => '/',
  }),
}));

jest.mock('next-intl/routing', () => ({
  __esModule: true,
  defineRouting: <T>(config: T): T => config,
  routing: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  },
}));

jest.mock('next-intl/server', () => ({
  __esModule: true,
  getRequestConfig: <
    T extends (ctx: { requestLocale: string | Promise<string> }) => unknown,
  >(
    fn: T
  ) => fn,
}));

jest.mock('next-intl/middleware', () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()),
}));

jest.mock('next/headers', () => ({
  headers: () => new Map([['accept-language', 'en-US,en;q=0.9']]),
}));

jest.mock('next/navigation', () => ({
  __esModule: true,
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
  useServerInsertedHTML: (cb: () => React.ReactNode) => {
    if (typeof cb === 'function') cb();
  },
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}) as Record<string, string>,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
