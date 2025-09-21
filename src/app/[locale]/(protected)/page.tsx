'use client';
import HomeNavigation from '@/app/[locale]/(protected)/HomeNavigation';
import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';
import { useTranslations } from 'next-intl';
import { Box, Typography, Stack, Container } from '@mui/material';

export default function Home() {
  const t = useTranslations('HomePage');
  const { user } = useFirebaseAuth();

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: { xs: 6, sm: 8, md: 12 },
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} textAlign="center">
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            {t('welcomeTitle', { userEmail: user?.email ?? '' })}
          </Typography>

          <HomeNavigation />
        </Stack>
      </Container>
    </Box>
  );
}
