import type { ReactNode } from 'react';
import { type ApplicationStatus, STATUS_LABELS } from '../lib/supabase';

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl font-bold text-neutral-900 sm:text-4xl text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-neutral-600 text-balance">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const styles: Record<ApplicationStatus, string> = {
    submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    under_review: 'bg-warning-100 text-warning-700 border-warning-500/30',
    approved: 'bg-success-100 text-success-700 border-success-500/30',
    completed: 'bg-primary-100 text-primary-700 border-primary-200',
    declined: 'bg-error-100 text-error-700 border-error-500/30',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600 ${className}`}
    />
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
      {icon && <div className="mb-4 text-neutral-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-neutral-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="bg-gradient-to-b from-primary-50 to-white pt-24 pb-12">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-neutral-600 text-balance">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
      {message}
    </div>
  );
}

export function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-success-500/30 bg-success-50 px-4 py-3 text-sm text-success-700">
      {message}
    </div>
  );
}
