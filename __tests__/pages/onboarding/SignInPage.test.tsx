import { render, screen } from '@testing-library/react';

jest.mock('@/components/auth/SignIn', () => ({
  __esModule: true,
  SignIn: () => <div data-testid="sign-in-stub" />,
}));

import SignInPage from '@/app/[locale]/(public)/(auth)/sign-in/page';

describe('SignInPage', () => {
  it('renders the SignIn component', () => {
    render(<SignInPage />);
    expect(screen.getByTestId('sign-in-stub')).toBeInTheDocument();
  });
});
