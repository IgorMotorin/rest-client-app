import { render, screen } from '@testing-library/react';
import HistoryPage from '@/app/[locale]/(protected)/history/page';
import { cookies } from 'next/headers';
import { verifyIdToken } from '@/lib/firebaseAdmin';
import React from 'react';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('@/lib/firebaseAdmin', () => ({
  verifyIdToken: jest.fn(),
}));

jest.mock('@/components/history/History', () => ({
  __esModule: true,
  default: ({ userId, locale }: { userId: string; locale: string }) => (
    <div data-testid="history-component">
      History for {userId} ({locale})
    </div>
  ),
}));

describe('HistoryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign-in message if token is missing', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const props: Parameters<typeof HistoryPage>[0] = {
      params: { locale: 'en' },
    };
    const result = await HistoryPage(props);
    render(result as React.ReactElement);

    expect(screen.getByText(/please sign in/i)).toBeInTheDocument();
  });

  it('renders History component if token is valid', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: 'valid-token' }),
    });
    (verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'user123' });

    const props: Parameters<typeof HistoryPage>[0] = {
      params: { locale: 'en' },
    };
    const result = await HistoryPage(props);

    render(result as React.ReactElement);

    const historyEl = screen.getByTestId('history-component');
    expect(historyEl).toBeInTheDocument();
    expect(historyEl).toHaveTextContent('History for user123 (en)');
  });

  it('renders unauthorized message if token is invalid', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue({ value: 'invalid-token' }),
    });
    (verifyIdToken as jest.Mock).mockRejectedValue(new Error('Invalid token'));

    const props: Parameters<typeof HistoryPage>[0] = {
      params: { locale: 'en' },
    };
    const result = await HistoryPage(props);

    render(result as React.ReactElement);

    expect(screen.getByText(/unauthorized/i)).toBeInTheDocument();
  });
});
