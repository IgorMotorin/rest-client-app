'use client';
import { usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

export default function HomeNavigation() {
  const t = useTranslations('HomeNavigation');
  const tabs = [
    { name: 'rest', path: '/get' },
    { name: 'history', path: '/history' },
    { name: 'variables', path: '/variables' },
  ];

  const locale = useLocale();
  const pathName = usePathname();

  return (
    <nav className="flex gap-2 mb-4">
      {tabs.map((tab) => {
        const isActive = pathName.endsWith(tab.path);
        return (
          <Link
            key={tab.name}
            href={`/${locale}/${tab.path}`}
            className={`px-4 py-2 rounded-t-md font-medium transition-colors ${
              isActive
                ? 'text-primary underline'
                : 'text-primary hover:underline'
            }`}
          >
            {t(tab.name)}
          </Link>
        );
      })}
    </nav>
  );
}
