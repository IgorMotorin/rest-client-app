import { useTranslations } from 'next-intl';

export default function HistoryPage() {
  const t = useTranslations();

  return (
    <main>
      <h1>{t('HistoryRequests.title')}</h1>
    </main>
  );
}
