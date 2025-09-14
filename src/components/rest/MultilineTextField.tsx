import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useRestStore } from '@/store/restStore';
import DataTable from '@/components/rest/DataTable';
import { useEffect, useState } from 'react';

export default function MultilineTextFields() {
  const body = useRestStore((state) => state.body);
  const setBody = useRestStore((state) => state.setBody);
  const bodyTable = useRestStore((state) => state.bodyTable);
  const setBodyTable = useRestStore((state) => state.setBodyTable);
  const handleRadioGroup = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setBody({ ...body, select: value });
  };
  const [err, setError] = useState('');

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
