'use client';
import React, { useEffect } from 'react';
import SelectInput from '../../../../components/rest/SelectInput';
import InputField from '../../../../components/rest/InputField';
import CustomTabs from '../../../../components/rest/CustomTabs';
import { methods } from '@/accessory/constants';
import { Box, Container } from '@mui/system';
import { Button, Typography } from '@mui/material';
import {
  useRestStore,
  queryDefault,
  headersDefault,
  bodyTableDefault,
} from '@/store/restStore';
import { useTranslations } from 'next-intl';
import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';
import { sendRequest } from '@/lib/sendRequest';
import { usePathname, useSearchParams } from 'next/navigation';
import { parseRestUrl } from '@/lib/parseRestUrl';

export default function Rest({ method = '' }: { method: string }) {
  const t = useTranslations('Rest');
  const { user } = useFirebaseAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setMethod = useRestStore((s) => s.setMethod);
  const setUrl = useRestStore((s) => s.setUrl);
  const setHeaders = useRestStore((s) => s.setHeaders);
  const setQuery = useRestStore((s) => s.setQuery);
  const setBody = useRestStore((s) => s.setBody);
  const setBodyTable = useRestStore((s) => s.setBodyTable);

  useEffect(() => {
    if (methods.includes(method.toLowerCase())) {
      setMethod(method.toLowerCase());
    }
  }, [method, setMethod]);

  useEffect(() => {
    const fullUrl =
      pathname + (searchParams.toString() ? '?' + searchParams.toString() : '');
    const item = parseRestUrl(fullUrl);
    if (!item) return;

    setMethod(item.method);
    setUrl(item.endpoint);
    setQuery(item.query.length ? item.query : queryDefault);
    setHeaders(item.headers.length ? item.headers : headersDefault);
    setBodyTable(item.bodyTable.length ? item.bodyTable : bodyTableDefault);
    setBody(item.body || { select: 'none', text: '', json: '{}' });
  }, [
    pathname,
    searchParams,
    setMethod,
    setUrl,
    setQuery,
    setHeaders,
    setBody,
    setBodyTable,
  ]);

  const handleSend = async () => {
    if (!user) return;
    await sendRequest(user.uid);
  };

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
