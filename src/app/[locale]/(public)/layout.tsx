import React from 'react';
import { PublicOnly } from '@/components/auth/PublicOnly';

type Props = {
  children: React.ReactNode;
};

export default async function PublicLayout({ children }: Props) {
  return <PublicOnly>{children}</PublicOnly>;
}
