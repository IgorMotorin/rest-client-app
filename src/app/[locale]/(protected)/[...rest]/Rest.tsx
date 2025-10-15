'use client';
import React, { useEffect, useState } from 'react';
import SelectInput from '@/components/rest/SelectInput';
import InputField from '@/components/rest/InputField';
import { methods } from '@/accessory/constants';
import CustomTabs from '@/components/rest/CustomTabs';
import { Box, Container } from '@mui/system';
import { Button, Typography } from '@mui/material';
import {
  headersDefault,
  queryDefault,
  tQuery,
  useRestStore,
} from '@/store/restStore';
import { useTranslations } from 'next-intl';
import { base64ToText } from '@/accessory/function';
import { sendRequest } from '@/lib/sendRequest';
import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';
import { Toaster, toast } from 'sonner';
import { getBody } from '@/lib/getBody';

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
  const setBody = useRestStore((state) => state.setBody);
  const setBodyTable = useRestStore((state) => state.setBodyTable);
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
      const { response } = await sendRequest(userId);
      if (response) {
        setResponse(response);
      }
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
    const [method, url, tsEncoded] = rest;
    const timestamp = url && tsEncoded ? atob(tsEncoded) : '';

    if (method && methods.includes(rest[0].toLowerCase())) {
      setMethod(rest[0].toLowerCase());
    }
    if (url) {
      setUrl(base64ToText(url));
    }
    if (timestamp && userId) {
      getBody(userId, timestamp)
        .then((data) => {
          if (data?.body) {
            setBody({
              json: data.body.json,
              select: data.body.select,
              text: data.body.text,
            });
            setBodyTable(data.bodyTable || []);
          }
        })
        .catch(() => {});
    }

    if (Object.keys(search).length > 0) {
      const params = new URLSearchParams(search);
      const headersArr: tQuery = [...headersDefault];
      const queryArr: tQuery = [...queryDefault];
      params.forEach((value, key) => {
        if (key.startsWith('h.')) {
          const emptyIndex = headersArr.findIndex((h) => !h.select && !h.key);
          if (emptyIndex >= 0) {
            headersArr[emptyIndex] = {
              id: headersArr[emptyIndex].id,
              key: key.replace('h.', ''),
              value,
              select: true,
            };
          } else {
            headersArr.push({
              id: headersArr.length,
              key: key.replace('h.', ''),
              value,
              select: true,
            });
          }
        } else {
          const emptyIndex = queryArr.findIndex((q) => !q.select && !q.key);
          if (emptyIndex >= 0) {
            queryArr[emptyIndex] = {
              id: queryArr[emptyIndex].id,
              key,
              value,
              select: true,
            };
          } else {
            queryArr.push({
              id: queryArr.length,
              key,
              value,
              select: true,
            });
          }
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
