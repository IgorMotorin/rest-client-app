'use client';
import React, { use } from 'react';
import SelectInput from '@/components/SelectInput';
import InputField from '@/components/InputField';

import { Box } from '@mui/system';
import { Button } from '@mui/material';

import CustomTabs from '@/components/CustomTabs';

export default function Restful({
  params,
}: {
  params: Promise<{ method: string }>;
}) {
  const { method } = use(params);
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
