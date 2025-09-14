import React from 'react';
import { FormControl, TextField } from '@mui/material';
import { useRestStore } from '@/store/restStore';

const InputField = () => {
  const url = useRestStore((state) => state.url);
  const setUrl = useRestStore((state) => state.setUrl);

  return (
    <FormControl className={'flex-4'}>
      <TextField
        className={'flex-4'}
        id="outlined-basic"
        label="Enter or paste endpoint URL"
        variant="outlined"
        size="small"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
      />
    </FormControl>
  );
};

export default InputField;
