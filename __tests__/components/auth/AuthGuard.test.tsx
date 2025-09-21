import { AuthGuard } from '@/components/auth/AuthGuard';
import { AuthContext } from '@/services/auth/AuthContext';
import { render, screen } from '@testing-library/react';
import { AuthContextValue } from '@/services/auth/auth.types';
import { User } from '@firebase/auth';

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
      <AuthGuard>
        <div>PROTECTED_CONTENT</div>
      </AuthGuard>
    </AuthContext.Provider>
  );
};

describe('AuthGuard', () => {
  it('shows children when authenticated', () => {
    renderWithCtx({ status: 'authenticated', user: { uid: '123' } as User });
    expect(screen.getByText('PROTECTED_CONTENT')).toBeInTheDocument();
  });
  it('redirects to sign-in when unauthenticated', () => {
    try {
      renderWithCtx({ status: 'unauthenticated', user: null });
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toContain('NEXT_REDIRECT');
    }
  });
});
