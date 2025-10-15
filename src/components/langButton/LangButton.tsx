'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@mui/material';

export default function LangButton() {
  const locale = useLocale();
  const router = useRouter();
  const pathName = usePathname();
  const toggleLocale = locale === 'en' ? 'ru' : 'en';

  const handleLocaleChange = () => {
    router.push(pathName, { locale: toggleLocale });
  };
  return (
    <Button variant="contained" size="medium" onClick={handleLocaleChange}>
      {toggleLocale}
    </Button>
  );
}
