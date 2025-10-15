import { render, screen } from '@testing-library/react';

jest.mock('@/components/auth/SignUp', () => ({
  __esModule: true,
  SignUp: () => <div data-testid="sign-up-stub" />,
}));

import SignUpPage from '@/app/[locale]/(public)/(auth)/sign-up/page';

describe('SignUpPage', () => {
  it('renders the SignUp component', () => {
    render(<SignUpPage />);
    expect(screen.getByTestId('sign-up-stub')).toBeInTheDocument();
  });
});
