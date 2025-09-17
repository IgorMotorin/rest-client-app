import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';

type Props = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({ children }: Props) {
  return <AuthGuard>{children}</AuthGuard>;
}
