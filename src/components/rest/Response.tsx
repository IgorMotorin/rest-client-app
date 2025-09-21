import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import { Toaster } from 'sonner';
import React, { cache, JSX, Suspense, use } from 'react';
import { useRestStore } from '@/store/restStore';
import { Typography } from '@mui/material';

const fetchData = cache(async () => {
  const response = useRestStore((state) => state.response);
  if (response) return response.clone().text();
});

function AsyncComponent() {
  const data = use(fetchData());
  return (
    <TextField
      id="outlined-multiline-static"
      label={'Response'}
      multiline
      color={'primary'}
      minRows={4}
      value={data || ''}
      disabled={true}
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
        <AsyncComponent></AsyncComponent>
      </Suspense>

      <Toaster />
    </Box>
  );
}
