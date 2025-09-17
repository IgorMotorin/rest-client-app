'use client';
import React, { useEffect } from 'react';
import SelectInput from '../../../../components/rest/SelectInput';
import InputField from '../../../../components/rest/InputField';
import { methods } from '@/accessory/constants';

import { Box, Container } from '@mui/system';
import { Button, Typography } from '@mui/material';

import CustomTabs from '../../../../components/rest/CustomTabs';
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
    <Container maxWidth="xl">
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {t('rest')}
      </Typography>
      <Box className={'flex m-2'}>
        <SelectInput></SelectInput>
        <InputField></InputField>
        <Button variant="contained">{t('send')}</Button>
      </Box>
      <CustomTabs></CustomTabs>
    </Container>
  );
}
