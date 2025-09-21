import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useRestStore } from '@/store/restStore';
import DataTable from '@/components/rest/DataTable';
import { useEffect, useState } from 'react';
import {
  preSelectHeaders,
  replaceVariables,
  textToBase64,
  Vars,
} from '@/accessory/function';
import { usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { useVariablesStore } from '@/store/variablesStore';

export default function MultilineTextFields() {
  const body = useRestStore((state) => state.body);
  const setBody = useRestStore((state) => state.setBody);
  const bodyTable = useRestStore((state) => state.bodyTable);
  const setBodyTable = useRestStore((state) => state.setBodyTable);

  const headers = useRestStore((state) => state.headers);
  const setHeaders = useRestStore((state) => state.setHeaders);

  const handleRadioGroup = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setBody({ ...body, select: value });
    const arr = [...headers];
    arr[0] = preSelectHeaders(value);
    setHeaders(arr);
  };
  const [err, setError] = useState('');

  const path = usePathname();
  const locale = useLocale();

  const variables = useVariablesStore((state) => state.variables);

  const selectValueTextField = () => {
    if (body.select === 'text') return body.text;
    if (body.select === 'json') {
      return body.json;
    }
    return '';
  };

  const handleTextField = (e: { target: { value: string } }) => {
    const value = e.target.value;
    if (body.select === 'text') {
      setBody({ ...body, text: value });
    }
    if (body.select === 'json') {
      setBody({ ...body, json: value });
    }
  };

  useEffect(() => {
    const selectText = (select: string) => {
      if (select === 'none') return '';
      if (select === 'text') return body.text;
      if (select === 'json') return body.json;
      if (select === 'form') {
        const obj: Vars = {};
        bodyTable.forEach((item) => {
          if (!item.select) return;
          obj[item.key] = item.value;
        });
        if (Object.entries(obj).length === 0) return '';

        return JSON.stringify(obj);
      }
      return '';
    };

    const textQuery = selectText(body.select);
    const [vars, onVars] = replaceVariables(textQuery, variables);

    setError(onVars && textQuery === vars ? 'Variable not found: ' : err);

    const base64Url =
      typeof vars === 'string'
        ? '/' + locale + textToBase64(vars, path, 3)
        : '';

    window.history.replaceState(null, '', `${base64Url}`);
  }, [
    locale,
    path,
    bodyTable,
    variables,
    body.select,
    body.text,
    body.json,
    err,
  ]);

  useEffect(() => {
    const checkError = () => {
      try {
        JSON.parse(body.json);
        setError('');
      } catch (err) {
        if (typeof err === 'string') {
          setError(err);
        } else if (err instanceof Error) {
          setError(err.message);
        }
      }
    };

    checkError();
  }, [body.json]);

  return (
    <>
      <Box>
        <RadioGroup
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={body.select}
          onChange={handleRadioGroup}
        >
          <FormControlLabel
            value="none"
            control={<Radio size="small" />}
            label="None"
          />
          <FormControlLabel
            value="text"
            control={<Radio size="small" />}
            label="Text"
          />
          <FormControlLabel
            value="json"
            control={<Radio size="small" />}
            label="JSON"
          />
          <FormControlLabel
            value="form"
            control={<Radio size="small" />}
            label="x-www-form-urlencoded"
          />
        </RadioGroup>
      </Box>
      {body.select === 'form' ? (
        <DataTable rows={bodyTable} setRows={setBodyTable} />
      ) : (
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '99%' } }}
          noValidate
          autoComplete="off"
        >
          <TextField
            disabled={body.select === 'none'}
            id="outlined-multiline-static"
            label={body.select.toUpperCase() + ' ' + err}
            multiline
            // rows={4}
            color={err ? 'error' : 'primary'}
            minRows={4}
            value={selectValueTextField()}
            onChange={handleTextField}
          />
        </Box>
      )}
    </>
  );
}
