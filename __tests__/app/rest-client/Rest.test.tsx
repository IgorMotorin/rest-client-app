import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { AuthContextValue } from '@/services/auth/auth.types';
import type { User, UserCredential } from '@firebase/auth';

type Row = { id: number; key: string; value: string; select: boolean };
type SetFn<T> = (v: T) => void;

type StoreState = {
  setUrl: jest.MockedFunction<SetFn<string>>;
  setMethod: jest.MockedFunction<SetFn<string>>;
  setBody: jest.MockedFunction<SetFn<unknown>>;
  setBodyTable: jest.MockedFunction<SetFn<unknown>>;
  setHeaders: jest.MockedFunction<SetFn<Row[]>>;
  setQuery: jest.MockedFunction<SetFn<Row[]>>;
  setResponse: jest.MockedFunction<SetFn<unknown>>;
};
type StoreMockModule = { __getState: () => StoreState };

jest.mock('@/store/restStore', () => {
  const state: StoreState = {
    setUrl: jest.fn(),
    setMethod: jest.fn(),
    setBody: jest.fn(),
    setBodyTable: jest.fn(),
    setHeaders: jest.fn(),
    setQuery: jest.fn(),
    setResponse: jest.fn(),
  };

  const headersDefault: Row[] = [{ id: 0, key: '', value: '', select: false }];
  const queryDefault: Row[] = [{ id: 0, key: '', value: '', select: false }];

  return {
    useRestStore: (selector: (s: StoreState) => unknown) => selector(state),
    headersDefault,
    queryDefault,
    tQuery: undefined,
    __getState: () => state,
  };
});

jest.mock('@/components/rest/SelectInput', () => {
  function MockSelect() {
    return <div data-testid="select-input" />;
  }
  return { __esModule: true as const, default: MockSelect };
});
jest.mock('@/components/rest/InputField', () => {
  function MockInput() {
    return <div data-testid="input-field" />;
  }
  return { __esModule: true as const, default: MockInput };
});
jest.mock('@/components/rest/CustomTabs', () => {
  function MockTabs() {
    return <div data-testid="custom-tabs" />;
  }
  return { __esModule: true as const, default: MockTabs };
});

jest.mock('sonner', () => {
  const toast = {
    error: jest.fn() as jest.MockedFunction<(msg: string) => void>,
  };
  function Toaster() {
    return <div data-testid="toaster" />;
  }
  return { __esModule: true as const, toast, Toaster };
});

jest.mock('@/accessory/function', () => ({
  __esModule: true,
  base64ToText: (s: string) => `decoded:${s}`,
}));

jest.mock('@/lib/sendRequest', () => ({
  __esModule: true,
  sendRequest: jest.fn(),
}));
jest.mock('@/lib/getBody', () => ({
  __esModule: true,
  getBody: jest.fn(),
}));

jest.mock('@/services/auth/useFirebaseAuth', () => ({
  __esModule: true,
  useFirebaseAuth: jest.fn(),
}));

import Rest from '@/app/[locale]/(protected)/[...rest]/Rest';
import * as storeMod from '@/store/restStore';
import { sendRequest } from '@/lib/sendRequest';
import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';

beforeAll(() => {
  if (typeof (globalThis as { atob?: unknown }).atob !== 'function') {
    Object.defineProperty(globalThis, 'atob', {
      configurable: true,
      writable: true,
      value: (input: string) => Buffer.from(input, 'base64').toString('binary'),
    });
  }
});

const baseAuth: AuthContextValue = {
  status: 'unauthenticated',
  user: null,
  signIn: async (): Promise<UserCredential> => {
    throw new Error('not used');
  },
  signUp: async (): Promise<UserCredential> => {
    throw new Error('not used');
  },
  signOut: async (): Promise<void> => {},
};

describe('Rest component', () => {
  let getItemSpy: jest.SpyInstance<string | null, [key: string]>;

  beforeEach(() => {
    jest.clearAllMocks();
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
  });

  afterEach(() => {
    getItemSpy.mockRestore();
  });

  it('shows error when sending without a logged-in user', async () => {
    (
      useFirebaseAuth as jest.MockedFunction<typeof useFirebaseAuth>
    ).mockReturnValue(baseAuth);

    render(<Rest rest={''} search={{}} />);

    const button = screen.getByRole('button', { name: 'send' });
    fireEvent.click(button);

    expect(await screen.findByText('User not logged in')).toBeInTheDocument();

    expect(sendRequest).not.toHaveBeenCalled();

    const store = (storeMod as unknown as StoreMockModule).__getState();
    expect(store.setResponse).not.toHaveBeenCalled();
  });

  it('calls sendRequest(userId) and forwards response to setResponse', async () => {
    const user = { uid: 'u1' } as unknown as User;
    (
      useFirebaseAuth as jest.MockedFunction<typeof useFirebaseAuth>
    ).mockReturnValue({ ...baseAuth, status: 'authenticated', user });

    const sendRequestMock = sendRequest as unknown as jest.MockedFunction<
      (uid: string) => Promise<{ response: { status: number } }>
    >;
    sendRequestMock.mockResolvedValue({ response: { status: 201 } });

    render(<Rest rest={''} search={{}} />);

    fireEvent.click(screen.getByRole('button', { name: 'send' }));

    await waitFor(() => {
      expect(sendRequestMock).toHaveBeenCalledWith('u1');
    });

    const store = (storeMod as unknown as StoreMockModule).__getState();
    await waitFor(() => {
      expect(store.setResponse).toHaveBeenCalledWith(
        expect.objectContaining({ status: 201 })
      );
    });
  });

  it('parses search params into headers and query arrays', async () => {
    (
      useFirebaseAuth as jest.MockedFunction<typeof useFirebaseAuth>
    ).mockReturnValue(baseAuth);

    render(<Rest rest={''} search={{ 'h.X-Token': 'abc', page: '1' }} />);

    const store = (storeMod as unknown as StoreMockModule).__getState();

    await waitFor(() => {
      expect(store.setHeaders).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            key: 'X-Token',
            value: 'abc',
            select: true,
          }),
        ])
      );
      expect(store.setQuery).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ key: 'page', value: '1', select: true }),
        ])
      );
    });

    expect(screen.getByTestId('select-input')).toBeInTheDocument();
    expect(screen.getByTestId('input-field')).toBeInTheDocument();
    expect(screen.getByTestId('custom-tabs')).toBeInTheDocument();
  });
});
