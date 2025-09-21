import { AuthContextValue } from '@/services/auth/auth.types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthContext } from '@/services/auth/AuthContext';
import { createNavigation } from 'next-intl/navigation';
import React from 'react';
import { FirebaseError } from '@firebase/app';
import { SignUp } from '@/components/auth/SignUp';

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
      <SignUp />
    </AuthContext.Provider>
  );
};

describe('SignUp', () => {
  it('signs up and navigates to protected', async () => {
    const signUpMock = jest.fn().mockResolvedValue({ uid: '123' });
    renderWithCtx({
      status: 'unauthenticated',
      user: null,
      signUp: signUpMock,
    });

    fireEvent.change(screen.getByPlaceholderText(/emailPlaceholder/i), {
      target: { value: 'test@user.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/^passwordPlaceholder$/i), {
      target: { value: 'OIndknaka1$' },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/^confirmPasswordPlaceholder$/i),
      { target: { value: 'OIndknaka1$' } }
    );
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(signUpMock).toHaveBeenCalled();
    });
    expect(router.replace).toHaveBeenCalledWith('/');
  });
  it('shows auth error when sign up fails', async () => {
    const signUpMock = jest
      .fn()
      .mockRejectedValue(
        new FirebaseError('auth/email-already-in-use', 'nope')
      );
    renderWithCtx({
      status: 'unauthenticated',
      user: null,
      signUp: signUpMock,
    });

    fireEvent.change(screen.getByPlaceholderText(/emailPlaceholder/i), {
      target: { value: 'test@user.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/^passwordPlaceholder$/i), {
      target: { value: 'OIndknaka1$' },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/^confirmPasswordPlaceholder$/i),
      { target: { value: 'OIndknaka1$' } }
    );
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    const msg = await screen.findByText('email-already-in-use');
    expect(msg).toBeInTheDocument();
    expect(router.replace).not.toHaveBeenCalled();
  });
  it('checks the password strength', async () => {
    const signUpMock = jest.fn();
    renderWithCtx({
      status: 'unauthenticated',
      user: null,
      signUp: signUpMock,
    });
    fireEvent.change(screen.getByPlaceholderText(/emailPlaceholder/i), {
      target: { value: 'test@user.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/^passwordPlaceholder$/i), {
      target: { value: 'weakPass' },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/^confirmPasswordPlaceholder$/i),
      { target: { value: 'weakPass' } }
    );
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    const msg = await screen.findByText('validation.password.digit');
    expect(msg).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });
});
