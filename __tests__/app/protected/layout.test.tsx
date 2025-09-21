import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@/components/auth/AuthGuard', () => ({
  __esModule: true,
  AuthGuard: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="auth-guard">{children}</div>
  ),
}));

import ProtectedLayout from '@/app/[locale]/(protected)/layout';

it('wraps children with AuthGuard', async () => {
  const ui = await ProtectedLayout({ children: <div data-testid="child" /> });
  render(ui);
  expect(screen.getByTestId('auth-guard')).toBeInTheDocument();
  expect(screen.getByTestId('child')).toBeInTheDocument();
});
