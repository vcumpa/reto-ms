import { Check } from 'lucide-react';
import type { CargaEstadoStorage, CargaHistorialEntrada } from '@/types';
import { cn, formatDateTime, getEstadoVisual, normalizeEstadoValue } from '@/utils';

export interface ProcessTimelineProps {
  historial: CargaHistorialEntrada[];
  currentEstado?: string | null;
}

/**
 * Secuencia de estados que se muestra en la línea de tiempo, incluyendo el
 * desenlace alterno de Rechazado para que las cargas en ese estado también
 * aparezcan con claridad en el detalle.
 */
const FLOW_STATES: CargaEstadoStorage[] = [
  'PENDIENTE',
  'EN_PROCESO',
  'CARGADO',
  'FINALIZADO',
  'NOTIFICADO',
  'RECHAZADO',
];

export function ProcessTimeline({ historial, currentEstado }: ProcessTimelineProps) {
  const byEstado = new Map(historial.map((entrada) => [entrada.estado, entrada]));
  const normalizedCurrentEstado = normalizeEstadoValue(currentEstado ?? '');
  const currentIndex = normalizedCurrentEstado
    ? FLOW_STATES.indexOf(normalizedCurrentEstado)
    : -1;

  return (
    <ol className="relative flex flex-col gap-6 border-l border-slate-200 pl-6 dark:border-slate-800">
      {FLOW_STATES.map((estado, index) => {
        const entry = byEstado.get(estado);
        const reached = index <= currentIndex || Boolean(entry);
        const isCurrent = index === currentIndex;
        const visual = getEstadoVisual(estado);

        return (
          <li key={estado} className="relative">
            <span
              className={cn(
                'absolute -left-[1.6rem] flex size-5 items-center justify-center rounded-full border-2',
                reached
                  ? cn(visual.dotClassName, 'border-transparent')
                  : 'dark:bg-surface-900 border-slate-300 bg-white dark:border-slate-700',
                isCurrent && 'ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-600',
              )}
              aria-hidden
            >
              {reached && <Check className="size-3 text-white" />}
            </span>
            <p
              className={cn(
                'text-sm font-medium',
                reached ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400',
                isCurrent && 'text-brand-600 dark:text-brand-400',
              )}
            >
              {visual.label}
              {isCurrent && ' (actual)'}
            </p>
            {entry && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatDateTime(entry.fechaRegistro)} · {entry.usuario}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
