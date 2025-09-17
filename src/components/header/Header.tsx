'use client';
import Logo from '@/components/logo/Logo';
import LangButton from '@/components/langButton/LangButton';
import { Box, Container, Stack } from '@mui/material';
import SignOut from '@/components/authButtons/SignOutButton';
import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';
import SignUpButton from '@/components/authButtons/SignUpButton';
import SignInButton from '@/components/authButtons/SignInButton';

export default function Header() {
  const { user } = useFirebaseAuth();

  return (
    <Box
      component="header"
      px={2}
      py={2}
      position="sticky"
      top={0}
      zIndex={10}
      boxShadow={1}
      bgcolor="background.paper"
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Logo />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          alignItems="center"
        >
          <LangButton />
          {user ? (
            <SignOut />
          ) : (
            <Stack direction="row" spacing={1.5}>
              <SignInButton />
              <SignUpButton />
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
