'use client';
import React, { useEffect } from 'react';
import SelectInput from './SelectInput';
import InputField from './InputField';
import { methods } from '@/accessory/constants';

import { Box } from '@mui/system';
import { Button } from '@mui/material';

import CustomTabs from './CustomTabs';
import { useRestStore } from '@/store/restStore';

export default function Rest({ method = '' }: { method: string }) {
  const setMethod = useRestStore((state) => state.setMethod);
  useEffect(() => {
    if (methods.includes(method.toLowerCase())) {
      setMethod(method.toLowerCase());
    }
  }, [method, setMethod]);
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
