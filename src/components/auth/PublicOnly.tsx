'use client';

import React, { useEffect } from 'react';
import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';
import { useRouter } from '@/i18n/navigation';
import { LoadingSpinner } from '@/components/auth/OnboardingUI';

export function PublicOnly({ children }: { children: React.ReactNode }) {
  const { status } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(`/`);
    }
  }, [status, router]);

  if (status === 'authenticated') return null;
  if (status === 'loading') {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
