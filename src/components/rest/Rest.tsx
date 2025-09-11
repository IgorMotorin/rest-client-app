'use client';
import React from 'react';
import SelectInput from './SelectInput';
import InputField from './InputField';

import { Box } from '@mui/system';
import { Button } from '@mui/material';

import CustomTabs from './CustomTabs';

export default function Rest({ method = '' }: { method: string }) {
  console.log(method);

  return (
    <>
      <Box className={'flex mt-2'}>
        <SelectInput></SelectInput>
        <InputField></InputField>
        <Button variant="contained">Send</Button>
      </Box>
      <CustomTabs></CustomTabs>
    </>
  );
}
