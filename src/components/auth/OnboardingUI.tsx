import React from 'react';

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex flex-col items-center max-h-[calc(100vh-112px)] overflow-auto w-full max-w-[420px] sm:max-w-[460px] gap-2.5 px-5 py-6 sm:px-8 sm:py-8 rounded-xl border border-border bg-surface text-center shadow-md">
      {children}
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
    <label className="flex w-full flex-col gap-1.5">
      {label ? (
        <span className="text-xs font-medium text-text-color/90">{label}</span>
      ) : null}
      {children}
      <div className="min-h-[1rem]">
        <p
          className={error ? 'text-xs text-error' : 'text-xs opacity-0'}
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
      className="w-full rounded-md border border-border bg-background px-3 py-2 sm:px-4 sm:py-2.5 text-sm text-text-color outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
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
      className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-primary bg-primary px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium text-on-primary transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin"
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
    <div className="flex items-center justify-center">
      <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
    </div>
  );
}
