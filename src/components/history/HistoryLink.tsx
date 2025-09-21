'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { LoadingSpinner } from '@/components/auth/OnboardingUI';
import NextLink from 'next/link';
import { Link as MuiLink } from '@mui/material';

export default function HistoryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
  };

  return (
    <>
      <MuiLink
        component={NextLink}
        href={href}
        underline="hover"
        sx={{ fontWeight: 'bold' }}
        onClick={handleClick}
      >
        {children}
      </MuiLink>

      {loading &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
            }}
          >
            <LoadingSpinner />
          </div>,
          document.body
        )}
    </>
  );
}
