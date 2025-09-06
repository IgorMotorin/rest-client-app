'use client';

import { useContext } from 'react';
import { AuthContext } from '@/services/auth/AuthContext';

export function useFirebaseAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useFirebaseAuth must be used within an AuthProvider!');
  }
  return ctx;
}
