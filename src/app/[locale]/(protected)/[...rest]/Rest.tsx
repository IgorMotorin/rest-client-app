'use client';
import React, { useEffect, useState } from 'react';
import SelectInput from '../../../../components/rest/SelectInput';
import InputField from '../../../../components/rest/InputField';
import { methods } from '@/accessory/constants';

import { Box, Container } from '@mui/system';
import { Button, Typography } from '@mui/material';

import CustomTabs from '../../../../components/rest/CustomTabs';
import { tQuery, useRestStore } from '@/store/restStore';
import { useTranslations } from 'next-intl';
import { base64ToText } from '@/accessory/function';
import { sendRequest } from '@/lib/sendRequest';
import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';
import { Toaster, toast } from 'sonner';

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
  const setQuery = useRestStore((state) => state.setQuery);

  const setResponse = useRestStore((state) => state.setResponse);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useFirebaseAuth();
  const userId = user?.uid;

  const handleSend = async () => {
    setLoading(true);
    setError('');
    if (!userId) {
      setError('User not logged in');
      toast.error('User not logged in');
      setLoading(false);
      return;
    }
    try {
      const { response, responseBody, historyItem } = await sendRequest(userId);
      console.log('Request sent, response:', response, responseBody);
      if (response) {
        setResponse(response);
      }
      console.log('History item saved:', historyItem);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

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
      const headersArr: tQuery = [];
      const queryArr: tQuery = [];
      params.forEach((value, key) => {
        if (key.startsWith('h.')) {
          headersArr.push({
            id: headersArr.length,
            key: key.replace('h.', ''),
            value,
            select: true,
          });
        } else {
          queryArr.push({
            id: queryArr.length,
            key,
            value,
            select: true,
          });
        }
      });
      setHeaders(headersArr);
      setQuery(queryArr);
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
      <Box className={'flex m-2'}>
        <SelectInput></SelectInput>
        <InputField></InputField>
        <Button variant="contained" onClick={handleSend} disabled={loading}>
          {loading ? t('sending') : t('send')}
        </Button>
      </Box>
      {error && (
        <Typography color="error" sx={{ m: 1 }}>
          {error}
        </Typography>
      )}
      <CustomTabs />
      <Toaster></Toaster>
    </Container>
  );
}
