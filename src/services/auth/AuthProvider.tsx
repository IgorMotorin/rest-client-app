'use client';

import React, { useEffect, useState } from 'react';
import { AuthStatus } from '@/services/auth/auth.types';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
  signOut as fbSignOut,
  createUserWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthContext } from '@/services/auth/AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthStatus(user ? 'authenticated' : 'unauthenticated');
    });
    return () => unsub();
  }, []);

  const signIn = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await fbSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        status: authStatus,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
