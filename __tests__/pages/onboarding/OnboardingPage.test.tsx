import OnboardingPage from '@/app/[locale]/(public)/(auth)/onboarding/page';
import { render, screen } from '@testing-library/react';

describe('OnboardingPage', () => {
  it('renders headings and sign-in / sign-up links', () => {
    render(<OnboardingPage />);

    expect(
      screen.getByRole('heading', { name: 'welcome' })
    ).toBeInTheDocument();
    expect(screen.getByText('welcomeSubtitle')).toBeInTheDocument();

    const signInLink = screen.getByRole('link', {
      name: 'signIn',
    });
    const signUpLink = screen.getByRole('link', {
      name: 'signUp',
    });

    expect(signInLink).toHaveAttribute('href', '/sign-in');
    expect(signUpLink).toHaveAttribute('href', '/sign-up');
  });
});
