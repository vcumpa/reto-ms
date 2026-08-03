import { Inbox, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/utils';
import { Card } from './Card';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('flex flex-col items-center gap-3 p-10 text-center', className)}>
      <div className="dark:bg-surface-800 flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:text-slate-500">
        <Icon className="size-6" aria-hidden />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        {description && (
          <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {action}
    </Card>
  );
}
