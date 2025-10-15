import React, { useEffect, useMemo, useState } from 'react';
import { FormControl, TextField } from '@mui/material';
import { useRestStore } from '@/store/restStore';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useVariablesStore } from '@/store/variablesStore';
import { useFirebaseAuth } from '@/services/auth/useFirebaseAuth';
import { replaceVariables, textToBase64 } from '@/accessory/function';
import { toast, Toaster } from 'sonner';

const InputField = () => {
  const t = useTranslations('Rest');
  const locale = useLocale();
  const url = useRestStore((state) => state.url);
  const setUrl = useRestStore((state) => state.setUrl);
  const path = usePathname();
  const router = useRouter();
  const variables = useVariablesStore((state) => state.variables);
  const setVariables = useVariablesStore((state) => state.setVariables);
  const { user } = useFirebaseAuth();
  const key = useMemo(() => user?.uid || 'variables', [user?.uid]);
  const [error, setError] = useState<string>('');
  const [onVariables, setOnVariables] = useState(false);
  const [urlAfterVariables, setUrlAfterVariables] = useState('');

  const handleVariable = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setUrl(value);
  };

  useEffect(() => {
    const [vars, onVars] = replaceVariables(url, variables);
    if (typeof vars === 'string') setUrlAfterVariables(vars);
    if (typeof onVars === 'boolean') setOnVariables(onVars);
    setError(onVars && url === vars ? 'URL: ' : '');
    if (onVars && url === vars) {
      toast.error('Variable not found');
    }

    const base64Url =
      typeof vars === 'string'
        ? '/' + locale + textToBase64(vars, path, 2)
        : '';

    window.history.replaceState(null, '', `${base64Url}`);
  }, [locale, path, router, url, variables]);

  useEffect(() => {
    const storage = localStorage.getItem(key) || '';
    if (!storage) return;
    const obj = JSON.parse(storage);
    setVariables(obj);
  }, []);

  return (
    <FormControl className={'flex-4'}>
      <TextField
        autoFocus={true}
        className={'flex-4'}
        id="outlined-basic"
        label={onVariables ? error + urlAfterVariables : t('url')}
        variant="outlined"
        size="small"
        value={url}
        onChange={handleVariable}
        color={error ? 'error' : 'primary'}
      />
      <Toaster></Toaster>
    </FormControl>
  );
};

export default InputField;
