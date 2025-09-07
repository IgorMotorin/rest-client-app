import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function OnboardingPage() {
  const t = useTranslations('OnboardingPage');

  return (
    <main className="min-h-screen text-text-color flex items-center justify-center px-4">
      <section className="w-full max-w-xl">
        <div className="bg-surface border border-border rounded-2xl shadow-sm p-8 sm:p-10 flex flex-col items-center text-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold">{t('welcome')}</h1>
          <p className="text-sm sm:text-base opacity-80">
            {t('welcomeSubtitle')}
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 rounded-lg border border-border hover:border-primary transition-colors"
            >
              {t('signIn')}
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity"
            >
              {t('signUp')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
