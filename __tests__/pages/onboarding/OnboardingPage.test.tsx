import OnboardingPage from '@/app/[locale]/(public)/(auth)/onboarding/page';
import { fireEvent, render, screen } from '@testing-library/react';
import { createNavigation } from 'next-intl/navigation';

const router = createNavigation().useRouter() as unknown as {
  push: jest.Mock;
  replace: jest.Mock;
};

describe('OnboardingPage', () => {
  it('renders headings and sign-in / sign-up links', async () => {
    render(<OnboardingPage />);

    expect(
      screen.getByRole('heading', { name: 'welcome' })
    ).toBeInTheDocument();
    expect(screen.getByText('welcomeSubtitle')).toBeInTheDocument();

    const signInBtn = screen.getByRole('button', { name: 'signIn' });
    const signUpBtn = screen.getByRole('button', { name: 'signUp' });

    fireEvent.click(signInBtn);
    expect(router.push).toHaveBeenCalledWith('/sign-in');

    fireEvent.click(signUpBtn);
    expect(router.push).toHaveBeenCalledWith('/sign-up');
  });
});
