import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@/components/auth/PublicOnly', () => ({
  __esModule: true,
  PublicOnly: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="public-only">{children}</div>
  ),
}));

import PublicLayout from '@/app/[locale]/(public)/layout';

it('wraps children with PublicOnly', async () => {
  const ui = await PublicLayout({ children: <div data-testid="child" /> });
  render(ui);
  expect(screen.getByTestId('public-only')).toBeInTheDocument();
  expect(screen.getByTestId('child')).toBeInTheDocument();
});
