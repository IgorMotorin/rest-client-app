import HomeNavigation from '@/app/[locale]/(protected)/HomeNavigation';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center mx-4 gap-4">
      <h1 className="text-3xl font-bold">{t('sampleTitle')}</h1>
      <p className="text-md text-center">{t('sampleSubtitle')}</p>
      <HomeNavigation />
    </main>
  );
}
