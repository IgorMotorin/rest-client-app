import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default async function PublicLayout({ children }: Props) {
  return <>{children}</>;
}
