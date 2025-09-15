import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import Header from '@/components/header/Header';

type Props = {
  children: React.ReactNode;
};

export default async function ProtectedLayout({ children }: Props) {
  return (
    <AuthGuard>
      <Header />
      {children}
    </AuthGuard>
  );
}
