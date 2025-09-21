import React from 'react';
import { render, screen } from '@testing-library/react';
import type { AuthContextValue } from '@/services/auth/auth.types';
import type { User, UserCredential } from '@firebase/auth';

type VarsRow = { id: number; key: string; value: string; select: boolean };
type SetVariables = (rows: VarsRow[]) => void;

type StoreShape = {
  variables: VarsRow[];
  setVariables: jest.MockedFunction<SetVariables>;
};
type StoreMockModule = {
  __getStore: () => StoreShape;
};

type TableProps = {
  rows: unknown;
  setRows: (r: unknown) => void;
  setLocalStorage: (r: unknown) => void;
};
type TableMockModule = {
  __getLastProps: () => TableProps | undefined;
};

jest.mock('@/store/variablesStore', () => {
  const state = {
    variables: [] as VarsRow[],
    setVariables: jest.fn((rows: VarsRow[]) => {
      state.variables = rows;
    }) as unknown as jest.MockedFunction<SetVariables>,
  };

  return {
    useVariablesStore: (selector: (s: typeof state) => unknown) =>
      selector(state),
    __getStore: () => state,
  };
});

jest.mock('@/components/variables/VariablesTable', () => {
  const capture: jest.MockedFunction<(props: TableProps) => void> = jest.fn();

  function MockVariablesTable(props: TableProps) {
    capture(props);
    return <div data-testid="vars-table" />;
  }

  return {
    __esModule: true as const,
    default: MockVariablesTable,
    __getLastProps: () => {
      const calls = capture.mock.calls;
      return calls.length ? calls[calls.length - 1]?.[0] : undefined;
    },
  };
});

jest.mock('@/services/auth/useFirebaseAuth', () => ({
  __esModule: true,
  useFirebaseAuth: jest.fn(),
}));

import Variables from '@/app/[locale]/(protected)/[...rest]/Variables';
import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';
import * as storeMod from '@/store/variablesStore';
import * as tableMod from '@/components/variables/VariablesTable';

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

describe('Variables page', () => {
  let getSpy: jest.SpyInstance<string | null, [key: string]>;
  let setSpy: jest.SpyInstance<void, [key: string, value: string]>;

  beforeEach(() => {
    jest.clearAllMocks();
    getSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    setSpy = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    getSpy.mockRestore();
    setSpy.mockRestore();
  });

  it('uses key "variables" when no user; does not load; setLocalStorage writes with that key', () => {
    (
      useFirebaseAuth as jest.MockedFunction<typeof useFirebaseAuth>
    ).mockReturnValue(baseAuth);

    render(<Variables />);

    expect(screen.getByText('variables')).toBeInTheDocument();
    expect(screen.getByTestId('vars-table')).toBeInTheDocument();

    expect(getSpy).toHaveBeenCalledWith('variables');

    const store = (storeMod as unknown as StoreMockModule).__getStore();
    expect(store.setVariables).not.toHaveBeenCalled();
    const table = (tableMod as unknown as TableMockModule).__getLastProps();
    const rows: VarsRow[] = [{ id: 1, key: 'a', value: '1', select: true }];
    table?.setLocalStorage(rows);

    expect(setSpy).toHaveBeenCalledWith('variables', JSON.stringify(rows));
  });

  it('uses user uid as key; loads rows; setLocalStorage writes with uid key', () => {
    const user = { uid: 'uid-123' } as Pick<User, 'uid'> as User;
    (
      useFirebaseAuth as jest.MockedFunction<typeof useFirebaseAuth>
    ).mockReturnValue({ ...baseAuth, status: 'authenticated', user });

    const STORED_ROWS: VarsRow[] = [
      { id: 2, key: 'b', value: '2', select: true },
    ];
    getSpy.mockImplementation((k) =>
      k === 'uid-123' ? JSON.stringify(STORED_ROWS) : null
    );

    render(<Variables />);

    const store = (storeMod as unknown as StoreMockModule).__getStore();
    expect(store.setVariables).toHaveBeenCalledWith(STORED_ROWS);
    expect(getSpy).toHaveBeenCalledWith('uid-123');

    const table = (tableMod as unknown as TableMockModule).__getLastProps();
    const rows: VarsRow[] = [{ id: 3, key: 'x', value: '9', select: false }];
    table?.setLocalStorage(rows);

    expect(setSpy).toHaveBeenCalledWith('uid-123', JSON.stringify(rows));
  });
});
