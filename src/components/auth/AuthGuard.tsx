'use client';

import React, { useEffect } from 'react';
import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';
import { LoadingSpinner } from '@/components/auth/OnboardingUI';
import { useRouter } from '@/i18n/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, status } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!user) {
      router.replace('/onboarding');
    }
  }, [user, status, router]);

  if (status === 'loading' || !user) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
