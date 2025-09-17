'use client';

import SignInButton from '@/components/authButtons/SignInButton';
import SignUpButton from '@/components/authButtons/SignUpButton';
import { useTranslations } from 'next-intl';
import { Box, Paper, Typography, Stack } from '@mui/material';

export default function OnboardingPage() {
  const t = useTranslations('OnboardingPage');

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        backgroundColor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: { xs: 4, sm: 6 },
          maxWidth: '50%',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 3,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'grey.100',
        }}
      >
        <Typography variant="h4" component="h1" fontWeight={600}>
          {t('welcome')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('welcomeSubtitle')}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
          <SignInButton />
          <SignUpButton />
        </Stack>
      </Paper>
    </Box>
  );
}
