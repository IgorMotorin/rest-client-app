'use client';

import { Box, Link } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

export default function HomeNavigation() {
  const t = useTranslations('HomeNavigation');
  const tabs = [
    { name: 'rest', path: 'get/' },
    { name: 'history', path: 'history/' },
    { name: 'variables', path: 'variables/' },
  ];

  const locale = useLocale();

  return (
    <Box
      component="nav"
      sx={{ display: 'flex', gap: 5, justifyContent: 'center' }}
    >
      {tabs.map((tab) => {
        return (
          <Link
            key={tab.name}
            href={`/${locale}/${tab.path}`}
            sx={{
              fontSize: '1.5rem',
              textDecoration: 'none',
              borderBottom: '2px solid transparent',
              transition: 'border-color 0.3s',
              '&:hover': {
                borderBottomColor: 'primary.main',
              },
            }}
          >
            {t(tab.name)}
          </Link>
        );
      })}
    </Box>
  );
}
