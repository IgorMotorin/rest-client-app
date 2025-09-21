import SignUpButton from '@/components/authButtons/SignUpButton';
import { useTranslations } from 'next-intl';
import SignInButton from '@/components/authButtons/SignInButton';

export default function OnboardingPage() {
  const t = useTranslations('OnboardingPage');

  return (
    <main className="py-20 text-text-color flex items-center justify-center px-4">
      <section className="w-full max-w-xl">
        <div className="bg-surface border border-border rounded-2xl shadow-sm p-8 sm:p-10 flex flex-col items-center text-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold">{t('welcome')}</h1>
          <p className="text-sm sm:text-base opacity-80">
            {t('welcomeSubtitle')}
          </p>

          <div className="flex items-center justify-center gap-3">
            <SignInButton />
            <SignUpButton />
          </div>
        </div>
      </section>
    </main>
  );
}
