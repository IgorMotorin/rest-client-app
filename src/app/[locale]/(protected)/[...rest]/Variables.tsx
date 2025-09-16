'use client';
import { useTranslations } from 'next-intl';
import React, { useEffect, useMemo } from 'react';

import { useVariablesStore } from '@/store/variablesStore';
import VariablesTable, { tRows } from '@/components/variables/VariablesTable';
import { Container } from '@mui/system';
import { Typography } from '@mui/material';

import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';

export default function Variables() {
  const t = useTranslations('VariablesPage');
  const variables = useVariablesStore((state) => state.variables);
  const setVariables = useVariablesStore((state) => state.setVariables);
  const { user } = useFirebaseAuth();
  const key = useMemo(() => user?.uid || 'variables', [user?.uid]);

  useEffect(() => {
    const storage = localStorage.getItem(key) || '';
    if (!storage) return;
    const obj = JSON.parse(storage);
    setVariables(obj);
  }, []);

  const setLocalStorage = (rows: tRows) => {
    localStorage.setItem(key, JSON.stringify(rows));
  };

  return (
    <Container maxWidth="xl">
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {t('variables')}
      </Typography>
      <VariablesTable
        rows={variables}
        setRows={setVariables}
        setLocalStorage={setLocalStorage}
      ></VariablesTable>
    </Container>
  );
}
