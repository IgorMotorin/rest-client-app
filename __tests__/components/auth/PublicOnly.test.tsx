import { AuthContextValue } from '@/services/auth/auth.types';
import { render, screen } from '@testing-library/react';
import { AuthContext } from '@/services/auth/AuthContext';
import { PublicOnly } from '@/components/auth/PublicOnly';
import { User } from '@firebase/auth';

jest.mock('@/components/auth/OnboardingUI', () => ({
  LoadingSpinner: () => <div data-testid="spinner" />,
}));

describe('PublicOnly', () => {
  const renderWithCtx = (value: Partial<AuthContextValue>) => {
    const defaultValue: AuthContextValue = {
      status: 'loading',
      user: null,
      signIn: async () => {
        throw new Error('not implemented');
      },
      signUp: async () => {
        throw new Error('not implemented');
      },
      signOut: async () => {
        throw new Error('not implemented');
      },
    };

    return render(
      <AuthContext.Provider value={{ ...defaultValue, ...value }}>
        <PublicOnly>
          <div>PUBLIC_CONTENT</div>
        </PublicOnly>
      </AuthContext.Provider>
    );
  };
  it('renders children when unauthenticated', () => {
    renderWithCtx({ status: 'unauthenticated', user: null });
    expect(screen.getByText('PUBLIC_CONTENT')).toBeInTheDocument();
  });
  it('redirects to homepage when authenticated', () => {
    try {
      renderWithCtx({ status: 'authenticated', user: { uid: '123' } as User });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toContain('NEXT_REDIRECT');
    }
  });
  it('shows a loading spinner while determining authentication status', () => {
    renderWithCtx({ status: 'loading', user: { uid: '123' } as User });
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByText('PUBLIC_CONTENT')).not.toBeInTheDocument();
  });
});
