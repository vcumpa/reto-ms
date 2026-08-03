import { AlertTriangle, RotateCw } from 'lucide-react';
import { cn } from '@/utils';
import { Button } from './Button';
import { Card } from './Card';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'No se pudo cargar la información',
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <Card className={cn('flex flex-col items-center gap-3 p-10 text-center', className)}>
      <div className="flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300">
        <AlertTriangle className="size-6" aria-hidden />
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
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RotateCw className="size-3.5" aria-hidden />
          Reintentar
        </Button>
      )}
    </Card>
  );
}
