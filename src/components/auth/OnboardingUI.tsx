import React from 'react';
import { Link } from '@/i18n/navigation';

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex max-w-[525px] flex-col items-center gap-4 overflow-hidden rounded-2xl border border-border bg-surface px-8 py-12 text-center shadow-lg md:px-14">
      {children}
    </div>
  );
}

export function Logo() {
  return (
    <div className="text-center">
      <Link href={'/'} className="mx-auto inline-block">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 260 70"
          className="mx-auto block h-14 w-auto"
        >
          <defs>
            <filter
              id="logo-shadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="2"
                floodColor="rgba(0,0,0,0.25)"
              />
            </filter>
          </defs>
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="32"
            fontWeight="550"
            fill="var(--primary)"
            filter="url(#logo-shadow)"
          >
            REST Client
          </text>
        </svg>
      </Link>
    </div>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex w-full flex-col gap-2">
      {label ? (
        <span className="text-sm font-medium text-text-color/90">{label}</span>
      ) : null}
      {children}
      <div className="min-h-[1.25rem]">
        <p
          className={error ? 'text-sm text-error' : 'text-sm opacity-0'}
          aria-live="polite"
        >
          {error || ''}
        </p>
      </div>
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        'w-full rounded-md border border-border bg-background px-5 py-3 text-base text-text-color outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30'
      }
    />
  );
}

export function SubmitButton({
  loading,
  children,
}: {
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary bg-primary px-5 py-3 text-base font-medium text-on-primary transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
    >
      {loading ? (
        <svg
          className="h-5 w-5 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
