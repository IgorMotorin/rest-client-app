'use client';
import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';
import { Alert, Button, Snackbar } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';

export default function SignOut() {
  const { signOut } = useFirebaseAuth();
  const router = useRouter();
  const tSignOut = useTranslations('SignOut');
  const [error, setError] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/signin');
    } catch {
      setError(true);
    }
  };
  return (
    <>
      <Button variant="contained" color="primary" onClick={handleSignOut}>
        {tSignOut('signOut')}
      </Button>
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(false)} severity="error">
          {tSignOut('signOutError')}
        </Alert>
      </Snackbar>
    </>
  );
}
