'use client';
import React, { useEffect } from 'react';
import SelectInput from './SelectInput';
import InputField from './InputField';
import { methods } from '@/accessory/constants';

import { Box } from '@mui/system';
import { Button } from '@mui/material';

import CustomTabs from './CustomTabs';
import { useRestStore } from '@/store/restStore';
import { useTranslations } from 'next-intl';

export default function Rest({ method = '' }: { method: string }) {
  const t = useTranslations('Rest');
  const setMethod = useRestStore((state) => state.setMethod);
  useEffect(() => {
    if (methods.includes(method.toLowerCase())) {
      setMethod(method.toLowerCase());
    }
  }, [method, setMethod]);
  return (
    <>
      <Box className={'flex m-2'}>
        <SelectInput></SelectInput>
        <InputField></InputField>
        <Button variant="contained">{t('send')}</Button>
      </Box>
      <CustomTabs></CustomTabs>
    </>
  );
}
