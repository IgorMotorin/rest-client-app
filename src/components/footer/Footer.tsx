import React from 'react';
import { useTranslations } from 'next-intl';

type Author = { name: string; url: string };

const authors: Author[] = [
  { name: 'IgorMotorin', url: 'https://github.com/IgorMotorin' },
  { name: 'IFMA25', url: 'https://github.com/IFMA25' },
  { name: 'jvallejoromero', url: 'https://github.com/jvallejoromero' },
];

export default function Footer() {
  const t = useTranslations('Footer');

  const Authors = ({ className }: { className?: string }) => {
    return (
      <div
        className={`flex flex-wrap items-center gap-1.5 text-sm md:justify-start justify-center ${className}`}
      >
        {authors.map((author) => (
          <a
            key={author.name}
            href={author.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border bg-background px-3 py-1 transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            @{author.name}
          </a>
        ))}
      </div>
    );
  };

  const Copyright = ({ className }: { className?: string }) => {
    return (
      <div className={`text-sm opacity-80 text-center ${className}`}>
        © {new Date().getFullYear()} • {t('allRightsReserved')}
      </div>
    );
  };

  const CourseInfo = ({ className }: { className?: string }) => {
    return (
      <a
        href="https://rs.school/courses/reactjs"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 transition hover:-translate-y-0.5 hover:shadow-sm md:justify-self-end justify-self-center ${className}`}
      >
        <img
          src="https://raw.githubusercontent.com/rolling-scopes-school/tasks/refs/heads/master/react/assets/rss-logo.svg"
          alt={t('courseAlt')}
          className="h-8 w-8 rounded-md"
        />
        <span className="text-sm font-medium">{t('courseName')}</span>
      </a>
    );
  };

  return (
    <footer className="mt-2 w-full border-t border-border bg-surface text-on-surface">
      <div className="mx-auto max-w-6xl grid grid-cols-1 gap-4 py-8 md:grid-cols-[1fr_auto_1fr] md:items-center px-4">
        <Authors className="order-2 md:order-1" />
        <Copyright className="order-3 md:order-2" />
        <CourseInfo className="order-1 md:order-3" />
      </div>
    </footer>
  );
}
