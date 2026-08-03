import type { CargaArchivo, CargaEstadoStorage } from '@/types';
import { ESTADO_ORDER, normalizeEstadoValue } from './estado';

export interface CargaStats {
  total: number;
  porEstado: Record<CargaEstadoStorage, number>;
}

function emptyCounts(): Record<CargaEstadoStorage, number> {
  return ESTADO_ORDER.reduce(
    (acc, estado) => {
      acc[estado] = 0;
      return acc;
    },
    {} as Record<CargaEstadoStorage, number>,
  );
}

/** Agrega la lista real de cargas en conteos por estado — sin llamar al backend de nuevo. */
export function computeCargaStats(cargas: CargaArchivo[]): CargaStats {
  const porEstado = emptyCounts();
  for (const carga of cargas) {
    const normalized = normalizeEstadoValue(carga.estado);
    if (normalized) {
      porEstado[normalized] += 1;
    }
  }
  return { total: cargas.length, porEstado };
}
