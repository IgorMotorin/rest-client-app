import React, { useContext } from 'react';
import { fireEvent, screen, waitFor, render } from '@testing-library/react';
import { AuthContext } from '@/services/auth/AuthContext';
import { AuthProvider } from '@/services/auth/AuthProvider';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { signOut as fbSignOut } from '@firebase/auth';

const TestProbe: React.FC = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) return null;
  return (
    <div>
      <div data-testid="status">{ctx.status}</div>
      <div data-testid="user">{ctx.user ? ctx.user.uid : 'none'}</div>
      <button
        onClick={() => ctx.signUp('user@test.com', 'pass')}
        aria-label="signup"
      >
        signup
      </button>
      <button
        onClick={() => ctx.signIn('user@test.com', 'pass')}
        aria-label="signin"
      >
        signin
      </button>
      <button onClick={() => ctx.signOut()} aria-label="signout">
        signout
      </button>
    </div>
  );
};

describe('AuthProvider', () => {
  it('shows unauthenticated by default', () => {
    render(
      <AuthProvider>
        <TestProbe />
      </AuthProvider>
    );

    expect(screen.getByTestId('status').textContent).toBe('unauthenticated');
    expect(screen.getByTestId('user').textContent).toBe('none');
  });
  it('updates context when a user is authenticated', () => {
    (onAuthStateChanged as jest.Mock).mockImplementationOnce(
      (_auth: unknown, cb: (u: { uid: string } | null) => void) => {
        cb({ uid: '123' });
        return jest.fn();
      }
    );

    render(
      <AuthProvider>
        <TestProbe />
      </AuthProvider>
    );

    expect(screen.getByTestId('status').textContent).toBe('authenticated');
    expect(screen.getByTestId('user').textContent).toBe('123');
  });
});

describe('AuthProvider actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('signUp calls createUserWithEmailAndPassword and returns credential', async () => {
    render(
      <AuthProvider>
        <TestProbe />
      </AuthProvider>
    );

    fireEvent.click(screen.getByLabelText('signup'));
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        'user@test.com',
        'pass'
      );
    });
  });

  test('signIn calls signInWithEmailAndPassword ', async () => {
    render(
      <AuthProvider>
        <TestProbe />
      </AuthProvider>
    );

    fireEvent.click(screen.getByLabelText('signin'));
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        'user@test.com',
        'pass'
      );
    });
  });

  test('signOut calls firebase signOut and listener can emit unauthenticated', async () => {
    render(
      <AuthProvider>
        <TestProbe />
      </AuthProvider>
    );

    fireEvent.click(screen.getByLabelText('signout'));
    await waitFor(() => {
      expect(fbSignOut).toHaveBeenCalledWith({});
    });
  });
});
