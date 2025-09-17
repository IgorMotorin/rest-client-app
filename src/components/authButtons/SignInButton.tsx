'use client';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function SignInButton() {
  const tSignIn = useTranslations('SignUp');
  const router = useRouter();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => router.push('/sign-in')}
    >
      {tSignIn('signIn')}
    </Button>
  );
}
