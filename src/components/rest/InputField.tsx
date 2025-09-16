import React, { useEffect } from 'react';
import { FormControl, TextField } from '@mui/material';
import { useRestStore } from '@/store/restStore';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

const InputField = () => {
  const t = useTranslations('Rest');
  const locale = useLocale();
  const url = useRestStore((state) => state.url);
  const setUrl = useRestStore((state) => state.setUrl);
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(url);
    const binaryString = String.fromCharCode(...uint8Array);

    const arr = path.split('/');
    if (arr.length > 2) {
      arr[2] = btoa(binaryString);
    } else {
      arr.push(btoa(binaryString));
    }
    const tmp = '/' + locale + arr.join('/');

    //router.replace(`${tmp}`);
    window.history.replaceState(null, '', `${tmp}`);
  }, [locale, path, router, url]);

  return (
    <FormControl className={'flex-4'}>
      <TextField
        autoFocus={true}
        className={'flex-4'}
        id="outlined-basic"
        label={t('url')}
        variant="outlined"
        size="small"
        value={url}
        onChange={(event) => {
          const value = event.target.value;
          setUrl(value);
        }}
      />
    </FormControl>
  );
};

export default InputField;
