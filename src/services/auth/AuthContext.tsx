'use client';

import { createContext } from 'react';
import { AuthContextValue } from '@/services/auth/auth.types';

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
