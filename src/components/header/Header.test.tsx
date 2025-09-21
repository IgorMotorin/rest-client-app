import { act, render, screen } from '@testing-library/react';
import Header from '@/components/header/Header';
import { User } from 'firebase/auth';
import { AuthContextValue } from '@/services/auth/auth.types';
import { AuthContext } from '@/services/auth/AuthContext';
import React from 'react';

jest.mock('@/components/logo/Logo', () => {
  function MockLogo() {
    return <div data-testid="logo" />;
  }
  return MockLogo;
});

jest.mock('@/components/langButton/LangButton', () => {
  function MockLangButton() {
    return <button>Lang</button>;
  }
  return MockLangButton;
});

jest.mock('@/components/authButtons/SignOutButton', () => {
  function MockSignOut() {
    return <button>SignOut</button>;
  }
  return MockSignOut;
});

jest.mock('@/components/authButtons/SignInButton', () => {
  function MockSignIn() {
    return <button>SignIn</button>;
  }
  return MockSignIn;
});

jest.mock('@/components/authButtons/SignUpButton', () => {
  function MockSignUp() {
    return <button>SignUp</button>;
  }
  return MockSignUp;
});

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
      <Header />
    </AuthContext.Provider>
  );
};

describe('Header', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders logo, language button, and sign-in/up when user is not logged in', () => {
    renderWithCtx({
      status: 'unauthenticated',
      user: null,
    });

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByText('Lang')).toBeInTheDocument();
    expect(screen.getByText('SignIn')).toBeInTheDocument();
    expect(screen.getByText('SignUp')).toBeInTheDocument();
  });

  it('renders sign-out button when user is logged in', () => {
    renderWithCtx({ status: 'authenticated', user: { uid: '123' } as User });

    expect(screen.getByText('SignOut')).toBeInTheDocument();
  });

  it('registers a scroll listener and cleans it up', () => {
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');

    renderWithCtx({ status: 'unauthenticated', user: null });

    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    Object.defineProperty(window, 'scrollY', {
      value: 100,
      configurable: true,
    });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    addSpy.mockClear();
    removeSpy.mockClear();

    const { unmount } = renderWithCtx({
      status: 'unauthenticated',
      user: null,
    });
    act(() => {
      unmount();
    });

    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
