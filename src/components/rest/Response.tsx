import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import { Toaster } from 'sonner';
import React, { JSX, Suspense, useEffect, useState } from 'react';
import { useRestStore } from '@/store/restStore';
import { Typography } from '@mui/material';

function AsyncComponent() {
  const response = useRestStore((state) => state.response);
  const [data, setData] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (response) {
        const text = await response.clone().text();
        if (mounted) {
          setData(text);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      mounted = false;
    };
  }, [response]);

  if (loading) return <div>Loading...</div>;

  return (
    <TextField
      id="outlined-multiline-static"
      value={data}
      multiline
      rows={4}
      fullWidth
    />
  );
}

export default function Response(): JSX.Element {
  const response = useRestStore((state) => state.response);

  return (
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '98%' } }}
      noValidate
      autoComplete="off"
    >
      <Typography>URL: {response?.url}</Typography>
      <Typography>Status: {response?.status}</Typography>
      <Suspense fallback={<div>Loading...</div>}>
        <AsyncComponent />
      </Suspense>
      <Toaster />
    </Box>
  );
}
