import React from 'react';
import { FormControl, TextField } from '@mui/material';

const InputField = () => {
  return (
    <FormControl className={'flex-4'}>
      <TextField
        className={'flex-4'}
        id="outlined-basic"
        label="Enter or paste endpoint URL"
        variant="outlined"
        size="small"
      />
    </FormControl>
  );
};

export default InputField;
