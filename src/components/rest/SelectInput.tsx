import React from 'react';
import { methods } from '@/accessory/constants';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { useRestStore } from '@/store/restStore';
import { useTranslations } from 'next-intl';

const SelectInput = () => {
  const t = useTranslations('Rest');

  const method = useRestStore((state) => state.method);
  const setMethod = useRestStore((state) => state.setMethod);

  return (
    <FormControl className={'flex-1'}>
      <InputLabel className={'justify-center'} id="demo-simple-select-label">
        {t('select')}
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={method}
        label={t('select')}
        onChange={(event) => setMethod(event.target.value)}
        size="small"
      >
        {methods.map((method) => (
          <MenuItem key={method} value={method}>
            {method.toUpperCase()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
