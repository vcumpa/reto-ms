import { cn, getEstadoVisual } from '@/utils';

export interface StatusBadgeProps {
  estado: string;
  className?: string;
}

export function StatusBadge({ estado, className }: StatusBadgeProps) {
  const visual = getEstadoVisual(estado);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        visual.badgeClassName,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', visual.dotClassName)} aria-hidden />
      {visual.label}
    </span>
  );
}
