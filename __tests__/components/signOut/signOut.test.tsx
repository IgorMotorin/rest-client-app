// __tests__/components/SignOut.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignOut from '@/components/authButtons/SignOutButton';

const mockSignOut = jest.fn();
const mockReplace = jest.fn();

jest.mock('@/services/auth/useFirebaseAuth', () => ({
  __esModule: true,
  useFirebaseAuth: () => ({
    signOut: mockSignOut,
  }),
}));

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      signOut: 'Sign Out',
      signOutError: 'Sign out failed',
    };
    return map[key] || key;
  },
}));

describe('SignOut component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign out button', () => {
    render(<SignOut />);
    const button = screen.getByRole('button', { name: 'Sign Out' });
    expect(button).toBeInTheDocument();
  });

  it('calls signOut and router.replace on successful click', async () => {
    mockSignOut.mockResolvedValueOnce(undefined);

    render(<SignOut />);
    const button = screen.getByRole('button', { name: 'Sign Out' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockReplace).toHaveBeenCalledWith('/signin');
    });
  });

  it('shows error snackbar if signOut fails', async () => {
    mockSignOut.mockRejectedValueOnce(new Error('Failed'));

    render(<SignOut />);
    const button = screen.getByRole('button', { name: 'Sign Out' });
    fireEvent.click(button);

    const alert = await screen.findByText('Sign out failed');
    expect(alert).toBeInTheDocument();
  });
});
