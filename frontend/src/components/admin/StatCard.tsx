import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  note?: string;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ title, value, note, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          {note ? <p className="mt-1 text-xs text-slate-500">{note}</p> : null}
        </div>
        {icon ? (
          <span className="rounded-lg bg-slate-100 p-2 text-slate-700">{icon}</span>
        ) : null}
      </div>
    </div>
  );
}
