import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';

jest.mock('@/accessory/constants', () => ({
  __esModule: true,
  methods: ['get', 'post'],
}));

jest.mock('next-intl', () => ({
  __esModule: true,
  useTranslations: () => (k: string) => k,
  useLocale: () => 'en',
}));

jest.mock('@/i18n/navigation', () => ({
  __esModule: true,
  usePathname: () => '/en/rest',
}));

jest.mock('@/store/restStore', () => {
  const setMethod: jest.MockedFunction<(m: string) => void> = jest.fn();

  const state: { method: string; setMethod: typeof setMethod } = {
    method: 'get',
    setMethod,
  };

  return {
    useRestStore: (selector: (s: typeof state) => unknown) => selector(state),
    __getState: () => state,
  };
});

import * as restStore from '@/store/restStore';
declare module '@/store/restStore' {
  export function __getState(): {
    method: string;
    setMethod: jest.MockedFunction<(m: string) => void>;
  };
}

import SelectInput from '@/components/rest/SelectInput';

describe('SelectInput', () => {
  let replaceSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    replaceSpy = jest.spyOn(window.history, 'replaceState');
  });

  afterEach(() => {
    replaceSpy.mockRestore();
  });

  it('lists methods and updates store + URL when a method is chosen', async () => {
    render(<SelectInput />);

    const trigger = screen.getByLabelText('select');
    fireEvent.mouseDown(trigger);

    const listbox = await screen.findByRole('listbox');
    within(listbox).getByRole('option', { name: 'GET' });
    const postOption = within(listbox).getByRole('option', { name: 'POST' });

    fireEvent.click(postOption);

    await waitFor(() => {
      const state = restStore.__getState();
      if (state.setMethod.mock.calls.length === 0) {
        throw new Error('setMethod was not called');
      }
      const lastArgs =
        state.setMethod.mock.calls[state.setMethod.mock.calls.length - 1];
      if (lastArgs[0] !== 'post') {
        throw new Error(
          `setMethod called with "${lastArgs[0]}", expected "post"`
        );
      }
    });

    await waitFor(() => {
      const last = replaceSpy.mock.calls.at(-1);
      if (!last) throw new Error('history.replaceState not called');
      const url = last[2];
      if (url !== '/en/post/rest') {
        throw new Error(`Unexpected URL: ${String(url)}`);
      }
    });
  });
});
