import { motion } from 'framer-motion';
import type { CargaEstadoStorage } from '@/types';
import { ESTADO_ORDER, getEstadoVisual } from '@/utils';

export interface StatusDistributionChartProps {
  data: Record<CargaEstadoStorage, number>;
  total: number;
}

/**
 * Barra horizontal por estado (no una librería de gráficos completa):
 * es un solo gráfico simple, y el stack ya pedía evitar componentes
 * pesados — Framer Motion (ya es dependencia) anima el llenado.
 */
export function StatusDistributionChart({ data, total }: StatusDistributionChartProps) {
  return (
    <div className="flex flex-col gap-3">
      {ESTADO_ORDER.map((estado) => {
        const count = data[estado];
        const visual = getEstadoVisual(estado);
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={estado} className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-sm text-slate-600 dark:text-slate-300">
              {visual.label}
            </span>
            <div className="dark:bg-surface-800 h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className={`h-full rounded-full ${visual.dotClassName}`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-sm font-medium text-slate-900 dark:text-slate-100">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
