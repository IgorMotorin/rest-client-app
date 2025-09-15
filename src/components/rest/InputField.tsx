import React from 'react';
import { FormControl, TextField } from '@mui/material';
import { useRestStore } from '@/store/restStore';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';

const InputField = () => {
  const t = useTranslations('Rest');
  const url = useRestStore((state) => state.url);
  const setUrl = useRestStore((state) => state.setUrl);
  const setBase64 = useRestStore((state) => state.setBase64);
  const path = usePathname();

  const setPathname = (pathname: string) => {
    const arr = path.split('/');
    if (arr.length > 2) {
      arr[2] = btoa(pathname);
    } else {
      arr.push(btoa(pathname));
    }
    return arr.join('/');
  };

  return (
    <FormControl className={'flex-4'}>
      <TextField
        className={'flex-4'}
        id="outlined-basic"
        label={t('url')}
        variant="outlined"
        size="small"
        value={url}
        onChange={(event) => {
          const value = event.target.value;
          setUrl(value);
          setBase64(setPathname(value));
        }}
      />
    </FormControl>
  );
};

export default InputField;
