import { useTranslations } from 'next-intl';

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center mx-4 gap-4">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="text-md text-center">{t('description')}</p>
    </main>
  );
}
