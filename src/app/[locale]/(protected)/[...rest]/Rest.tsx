'use client';
import React, { useEffect } from 'react';
import SelectInput from '../../../../components/rest/SelectInput';
import InputField from '../../../../components/rest/InputField';
import CustomTabs from '../../../../components/rest/CustomTabs';
import { methods } from '@/accessory/constants';
import { Box, Container } from '@mui/system';
import { Button, Typography } from '@mui/material';

import CustomTabs from '../../../../components/rest/CustomTabs';
import { tQuery, useRestStore } from '@/store/restStore';
import { useTranslations } from 'next-intl';
import { base64ToText } from '@/accessory/function';

export default function Rest({
  rest = '',
  search,
}: {
  rest: string;
  search: { [key: string]: string };
}) {
  const t = useTranslations('Rest');
  const setUrl = useRestStore((state) => state.setUrl);

  const setMethod = useRestStore((state) => state.setMethod);

  const body = useRestStore((state) => state.body);
  const setBody = useRestStore((state) => state.setBody);

  const setHeaders = useRestStore((state) => state.setHeaders);

  useEffect(() => {
    const [method, url, bodyUrl] = rest;

    if (method && methods.includes(rest[0].toLowerCase())) {
      setMethod(rest[0].toLowerCase());
    }
    if (url) {
      setUrl(base64ToText(url));
    }
    if (bodyUrl) {
      const out = base64ToText(bodyUrl);
      setBody({ ...body, json: out, select: 'json' });
    }

    if (Object.keys(search).length > 0) {
      const params = new URLSearchParams(search);
      const arr: tQuery = [];
      params.forEach((value, key) =>
        arr.push({
          id: arr.length,
          key: key,
          value: value,
          select: true,
        })
      );
      setHeaders(arr);
    }
  }, [rest, search]);
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
      <Box className="flex m-2">
        <SelectInput />
        <InputField />
        <Button variant="contained" onClick={handleSend}>
          {t('send')}
        </Button>
      </Box>
      <CustomTabs />
    </Container>
  );
}
