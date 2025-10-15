import codegen from 'postman-code-generators';
import sdk from 'postman-collection';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import { toast, Toaster } from 'sonner';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useRestStore } from '@/store/restStore';
import { useTranslations } from 'next-intl';

export default function CodeGeneration() {
  const t = useTranslations('Rest');
  const [generateCode, setGenerateCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('curl');
  const [variant, setVariant] = useState<string>('cURL');
  const supportedLang = codegen.getLanguageList();
  const method = useRestStore((state) => state.method);
  const url = useRestStore((state) => state.url);
  const headers = useRestStore((state) => state.headers);
  const body = useRestStore((state) => state.body);
  const bodyTable = useRestStore((state) => state.bodyTable);
  const query = useRestStore((state) => state.query);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateCode);
      toast.info('Copied to clipboard!');
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  const handleGenerateCode = useCallback(() => {
    const header = headers.map((item) => ({
      key: item.key,
      value: item.value,
    }));

    const queryString: string[] = [];
    query.forEach((item) => {
      if (!item.select) return;
      queryString.push(item.key + '=' + item.value);
    });

    const params = queryString.length > 0 ? '?' + queryString.join('&') : '';

    const bodyReq = {
      mode: 'raw',
      raw: '',
    };
    if (body.select === 'form') {
      const tmp: {
        [key: string]: string;
      } = {};
      bodyTable.forEach((item) => {
        if (!item.select) return;
        tmp[item.key] = item.value;
      });
      bodyReq.raw = JSON.stringify(tmp);
    }
    if (body.select === 'json') {
      bodyReq.raw = body.json;
    }
    if (body.select === 'text') {
      bodyReq.raw = body.text;
    }

    const endpoint = {
      url: url + params,
      method: method,
      header: header,
      body: bodyReq,
    };

    const request = new sdk.Request(endpoint);

    const options = {
      indentCount: 3,
      indentType: 'Space',
      trimRequestBody: true,
      followRedirect: true,
    };

    codegen.convert(
      language,
      variant,
      request,
      options,
      function (error: string, code: string) {
        let isError = false;

        if (error) {
          toast.error(error, {
            richColors: false,
          });
          isError = true;
        }

        setGenerateCode(isError ? '' : code);
      }
    );
  }, [language, variant, method, url, headers, body, bodyTable, query]);

  useEffect(() => {
    handleGenerateCode();
  }, [handleGenerateCode]);

  return (
    <Box className={'mt-2'}>
      <FormControl className={'w-40 '}>
        <InputLabel className={'justify-center'} id="demo-simple-select-label2">
          {t('lang')}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label2"
          id="demo-simple-select2"
          value={language}
          label={t('lang')}
          onChange={(event) => {
            const tmp = event.target.value;
            setLanguage(tmp);
            const currentVariant = supportedLang.filter(
              (itm: { key: string }) => itm.key === tmp
            )[0].variants[0].key;
            setVariant(currentVariant);
          }}
          size="small"
        >
          {supportedLang.map((lang: { key: string; label: string }) => (
            <MenuItem key={lang.key} value={lang.key}>
              {lang.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={'w-40 '}>
        <InputLabel className={'justify-center'} id="demo-simple-select-label3">
          {t('variant')}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label3"
          id="demo-simple-select3"
          value={variant}
          label={t('variant')}
          onChange={(event) => {
            const tmp = event.target.value;
            setVariant(tmp);
          }}
          size="small"
        >
          {supportedLang
            .filter((itm: { key: string }) => itm.key === language)
            .map((lang: { variants: { key: string }[] }) => {
              return lang.variants.map((variant) => (
                <MenuItem key={variant.key} value={variant.key}>
                  {variant.key}
                </MenuItem>
              ));
            })}
        </Select>
      </FormControl>

      <Button variant="contained" onClick={handleCopy}>
        {t('copy')}
      </Button>
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '98%' } }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-multiline-static"
          label={t('generated')}
          multiline
          color={'primary'}
          minRows={4}
          value={generateCode}
        />
        <Toaster />
      </Box>
    </Box>
  );
}
