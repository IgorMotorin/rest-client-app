import { render, screen } from '@testing-library/react';
import Home from '@/app/[locale]/(protected)/page';

jest.mock('@/services/auth/useFirebaseAuth', () => ({
  __esModule: true,
  useFirebaseAuth: () => ({
    user: { email: 'user@test.com' },
    isLoading: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
}));

jest.mock('@/app/[locale]/(protected)/HomeNavigation', () => ({
  __esModule: true,
  default: () => <div data-testid="home-nav" />,
}));

describe('HomePage', () => {
  it('renders a title', () => {
    render(<Home />);
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toBeInTheDocument();
  });
});
