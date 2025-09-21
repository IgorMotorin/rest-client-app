import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InputField from '@/components/rest/InputField';

type Variables = Record<string, string>;

type RestStore = {
  url: string;
  setUrl: (v: string) => void;
};

type VarsStore = {
  variables: Variables;
  setVariables: (v: Variables) => void;
};

type FirebaseUser = { uid: string };

const setUrlMock: jest.Mock<void, [string]> = jest.fn();
const setVariablesMock: jest.Mock<void, [Variables]> = jest.fn();

let restState: RestStore = {
  url: '',
  setUrl: setUrlMock,
};

let varsState: VarsStore = {
  variables: {},
  setVariables: setVariablesMock,
};

jest.mock('@/store/restStore', () => ({
  useRestStore: (selector: (s: RestStore) => unknown) => selector(restState),
}));

jest.mock('@/store/variablesStore', () => ({
  useVariablesStore: (selector: (s: VarsStore) => unknown) =>
    selector(varsState),
}));

const replaceVariablesMock = jest.fn<
  [string | undefined, boolean],
  [string, Record<string, string>]
>((input: string) => [input, false]);
const textToBase64Mock = jest.fn<string, [string, string, number]>(() => 'enc');

jest.mock('@/accessory/function', () => ({
  replaceVariables: (t: string, v: Variables) => replaceVariablesMock(t, v),
  textToBase64: (t: string, p: string, d: number) => textToBase64Mock(t, p, d),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => (key === 'url' ? 'URL' : key),
  useLocale: () => 'en',
}));

jest.mock('@/i18n/navigation', () => ({
  usePathname: () => '/path',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

const toastErrorMock: jest.Mock<void, [string]> = jest.fn();
jest.mock('sonner', () => ({
  Toaster: () => <div data-testid="toaster" />,
  toast: { error: (m: string) => toastErrorMock(m) },
}));

let authUser: FirebaseUser | null = { uid: 'u1' };
jest.mock('@/services/auth/useFirebaseAuth', () => ({
  useFirebaseAuth: () => ({ user: authUser }),
}));

let replaceStateSpy: ReturnType<typeof jest.spyOn>;

beforeEach(() => {
  restState = { url: '', setUrl: setUrlMock };
  varsState = { variables: {}, setVariables: setVariablesMock };
  setUrlMock.mockClear();
  setVariablesMock.mockClear();
  replaceVariablesMock.mockClear();
  textToBase64Mock.mockClear();
  toastErrorMock.mockClear();
  replaceStateSpy = jest.spyOn(window.history, 'replaceState');
  authUser = { uid: 'u1' };
  Storage.prototype.getItem = jest.fn().mockReturnValue('');
});

afterEach(() => {
  replaceStateSpy.mockRestore();
});

test('typing updates the url in the store', () => {
  render(<InputField />);
  const input = screen.getByRole('textbox', { name: 'URL' });
  fireEvent.change(input, { target: { value: 'https://api.example.com' } });
  expect(setUrlMock).toHaveBeenCalledWith('https://api.example.com');
});

test('when onVars=true and vars===url, shows error-prefixed label and toasts', async () => {
  restState.url = 'https://api.example.com/{{id}}';
  varsState.variables = {};
  replaceVariablesMock.mockImplementation((input: string) => [input, true]);
  render(<InputField />);
  await waitFor(() =>
    expect(
      screen.getByRole('textbox', { name: `URL: ${restState.url}` })
    ).toBeInTheDocument()
  );
  expect(toastErrorMock).toHaveBeenCalledWith('Variable not found');
  expect(textToBase64Mock).toHaveBeenCalledWith(restState.url, '/path', 2);
  expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/enenc');
});

test('when onVars=true and vars!==url, label shows substituted url', async () => {
  restState.url = 'https://api.example.com/{{id}}';
  varsState.variables = { id: '42' };
  replaceVariablesMock.mockImplementation(() => [
    'https://api.example.com/42',
    true,
  ]);
  render(<InputField />);
  await waitFor(() =>
    expect(
      screen.getByRole('textbox', { name: 'https://api.example.com/42' })
    ).toBeInTheDocument()
  );
  expect(toastErrorMock).not.toHaveBeenCalled();
  expect(textToBase64Mock).toHaveBeenCalledWith(
    'https://api.example.com/42',
    '/path',
    2
  );
  expect(window.history.replaceState).toHaveBeenCalledWith(null, '', '/enenc');
});

test('when onVars=false, label uses translation key "URL"', async () => {
  restState.url = 'https://x.test';
  varsState.variables = { id: '1' };
  replaceVariablesMock.mockImplementation((input: string) => [input, false]);
  render(<InputField />);
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: 'URL' })).toBeInTheDocument()
  );
  expect(textToBase64Mock).toHaveBeenCalledWith('https://x.test', '/path', 2);
  expect(window.history.replaceState).toHaveBeenCalled();
});

test('hydrates variables from localStorage using user uid as key', async () => {
  authUser = { uid: 'u1' };
  const stored = JSON.stringify({ token: 'abc', region: 'us' });
  (Storage.prototype.getItem as jest.Mock).mockReturnValue(stored);
  render(<InputField />);
  await waitFor(() =>
    expect(setVariablesMock).toHaveBeenCalledWith({
      token: 'abc',
      region: 'us',
    })
  );
});
