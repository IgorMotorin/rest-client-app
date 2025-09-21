import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('sonner', () => ({
  __esModule: true as const,
  Toaster: () => <div data-testid="toaster" />,
}));

type ResponseLike = {
  url?: string;
  status?: number;
  clone: () => { text: () => Promise<string> };
};

jest.mock('@/store/restStore', () => {
  const state = { response: null as ResponseLike | null };
  return {
    useRestStore: (selector: (s: typeof state) => unknown) => selector(state),
    __setResponse: (r: ResponseLike | null) => {
      state.response = r;
    },
  };
});

declare module '@/store/restStore' {
  export function __setResponse(
    r: {
      url?: string;
      status?: number;
      clone: () => { text: () => Promise<string> };
    } | null
  ): void;
}

import Response from '@/components/rest/Response';
import * as restStore from '@/store/restStore';

function makeResponse(url: string, status: number, body: string): ResponseLike {
  return { url, status, clone: () => ({ text: () => Promise.resolve(body) }) };
}

describe('Response (no assertions)', () => {
  it('renders URL, status, and async-loaded body when response exists', async () => {
    restStore.__setResponse(
      makeResponse('http://api.example.com/x', 200, 'hello!')
    );

    render(<Response />);

    screen.getByText((t: string) =>
      t.includes('URL: http://api.example.com/x')
    );
    screen.getByText((t: string) => t.trim() === 'Status: 200');

    await screen.findByDisplayValue('hello!');
  });

  it('renders empty text field and blank meta when response is null', async () => {
    restStore.__setResponse(null);

    render(<Response />);

    screen.getByText((t: string) => t.trim() === 'URL:');
    screen.getByText((t: string) => t.trim() === 'Status:');

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    if (textarea.value !== '') {
      throw new Error(`Expected empty textarea, got "${textarea.value}"`);
    }
  });
});
