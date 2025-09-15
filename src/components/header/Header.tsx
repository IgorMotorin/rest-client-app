import Logo from '@/components/logo/Logo';
import LangButton from '@/components/langButton/LangButton';
import { Box, Container } from '@mui/material';

export default function Header() {
  return (
    <Box
      component="header"
      px={2}
      py={2}
      bgcolor="background.paper"
      boxShadow={1}
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
        <LangButton />
      </Container>
    </Box>
  );
}
