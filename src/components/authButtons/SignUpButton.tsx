'use client';

import { useRouter } from '@/i18n/navigation';
import Button from '@mui/material/Button';
import { useTranslations } from 'next-intl';

export default function SignUpButton() {
  const tSignUp = useTranslations('SignIn');
  const router = useRouter();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => router.push('/sign-up')}
    >
      {tSignUp('signUp')}
    </Button>
  );
}
