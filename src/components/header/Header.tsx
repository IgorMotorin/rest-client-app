'use client';
import Logo from '@/components/logo/Logo';
import LangButton from '@/components/langButton/LangButton';
import { Box, Container, Stack } from '@mui/material';
import SignOut from '@/components/authButtons/SignOutButton';
import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';
import SignUpButton from '@/components/authButtons/SignUpButton';
import SignInButton from '@/components/authButtons/SignInButton';
import { useEffect, useState } from 'react';

export default function Header() {
  const { user } = useFirebaseAuth();
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box
      component="header"
      px={2}
      py={scroll ? 1 : 2}
      position="sticky"
      top={0}
      zIndex={10}
      boxShadow={scroll ? 4 : 1}
      bgcolor={scroll ? 'lightblue' : 'background.paper'}
      sx={{
        transition: 'all 0.3s ease',
      }}
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
