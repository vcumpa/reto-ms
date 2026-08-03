import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

export interface LoaderProps {
  label?: string;
  className?: string;
}

export function Loader({ label = 'Cargando…', className }: LoaderProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12 text-slate-400',
        className,
      )}
    >
      <Loader2 className="size-6 animate-spin" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  );
}
