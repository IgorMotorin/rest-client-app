'use client';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

export default function LangButton() {
  const locale = useLocale();
  const router = useRouter();
  const toggleLocale = locale === 'en' ? 'ru' : 'en';
  const handleLocaleChange = () => {
    router.push('/', { locale: toggleLocale });
  };
  return <button onClick={handleLocaleChange}>{toggleLocale}</button>;
}
