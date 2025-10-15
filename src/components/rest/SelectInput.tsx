'use client';
import React from 'react';
import { methods } from '@/accessory/constants';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { useRestStore } from '@/store/restStore';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';

const SelectInput = () => {
  const t = useTranslations('Rest');

  const method = useRestStore((state) => state.method);
  const setMethod = useRestStore((state) => state.setMethod);

  const path = usePathname();
  const locale = useLocale();

  const setPathname = (pathname: string) => {
    const arr = path.split('/');
    arr[1] = pathname;
    const tmp = '/' + locale + arr.join('/');
    // router.push(`${tmp}`);
    window.history.replaceState(null, '', `${tmp}`);
  };

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
        onChange={(event) => {
          const tmp = event.target.value;
          setMethod(tmp);
          setPathname(tmp);
        }}
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
