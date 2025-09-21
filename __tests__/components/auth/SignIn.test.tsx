import { AuthContextValue } from '@/services/auth/auth.types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthContext } from '@/services/auth/AuthContext';
import { createNavigation } from 'next-intl/navigation';
import { SignIn } from '@/components/auth/SignIn';
import React from 'react';
import { FirebaseError } from '@firebase/app';

const router = createNavigation().useRouter() as unknown as {
  push: jest.Mock;
  replace: jest.Mock;
};

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
      <SignIn />
    </AuthContext.Provider>
  );
};

describe('SignIn', () => {
  it('signs in and navigates to protected', async () => {
    const signInMock = jest.fn().mockResolvedValue({ uid: '123' });
    renderWithCtx({
      status: 'unauthenticated',
      user: null,
      signIn: signInMock,
    });

    fireEvent.change(screen.getByPlaceholderText(/emailPlaceholder/i), {
      target: { value: 'test@user.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/passwordPlaceholder/i), {
      target: { value: 'pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalled();
    });
    expect(router.replace).toHaveBeenCalledWith('/');
  });
  it('shows auth error when sign in fails', async () => {
    const signInMock = jest
      .fn()
      .mockRejectedValue(new FirebaseError('auth/invalid-credential', 'nope'));
    renderWithCtx({
      status: 'unauthenticated',
      user: null,
      signIn: signInMock,
    });

    fireEvent.change(screen.getByPlaceholderText(/emailPlaceholder/i), {
      target: { value: 'test@user.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/passwordPlaceholder/i), {
      target: { value: 'pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    const msg = await screen.findByText('invalid-credential');
    expect(msg).toBeInTheDocument();
    expect(router.replace).not.toHaveBeenCalled();
  });
});
