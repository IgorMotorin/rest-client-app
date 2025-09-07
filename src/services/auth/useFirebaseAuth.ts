'use client';

import { useContext } from 'react';
import { AuthContext } from '@/services/auth/AuthContext';

/**
 * React hook for accessing Firebase authentication context.
 *
 * This hook must be used within an <AuthProvider>, otherwise
 * it will throw an error.
 *
 * Returns the current authentication context, which includes:
 * - `user`: the current Firebase user or `null`
 * - `status`: "loading" | "authenticated" | "unauthenticated"
 * - `signIn(email, password)`: signs in with email/password
 * - `signUp(email, password)`: creates a new user
 * - `signOut()`: signs out the current user
 *
 * @throws {Error} If used outside an <AuthProvider>.
 *
 * @example
 * const { user, status, signIn, signOut } = useFirebaseAuth();
 *
 * if (status === "authenticated") {
 *   return <p>Welcome {user?.email}</p>;
 * }
 */
export function useFirebaseAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useFirebaseAuth must be used within an AuthProvider!');
  }
  return ctx;
}
