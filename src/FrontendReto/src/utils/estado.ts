import type { CargaEstadoStorage } from '@/types';

export interface EstadoVisual {
  label: string;
  dotClassName: string;
  badgeClassName: string;
}

/** Los 7 estados reales del backend (CargaEstadoExtensions.ToStorageValue), en orden del flujo. */
export const ESTADO_ORDER: CargaEstadoStorage[] = [
  'PENDIENTE',
  'EN_PROCESO',
  'CARGADO',
  'FINALIZADO',
  'NOTIFICADO',
  'RECHAZADO',
  'BLOQUEADO',
];

const ESTADO_VISUAL_MAP: Record<CargaEstadoStorage, EstadoVisual> = {
  PENDIENTE: {
    label: 'Pendiente',
    dotClassName: 'bg-status-pendiente',
    badgeClassName: 'bg-status-pendiente/10 text-status-pendiente',
  },
  EN_PROCESO: {
    label: 'En proceso',
    dotClassName: 'bg-status-enproceso',
    badgeClassName: 'bg-status-enproceso/10 text-status-enproceso',
  },
  CARGADO: {
    label: 'Cargado',
    dotClassName: 'bg-status-cargado',
    badgeClassName: 'bg-status-cargado/10 text-status-cargado',
  },
  FINALIZADO: {
    label: 'Finalizado',
    dotClassName: 'bg-status-finalizado',
    badgeClassName: 'bg-status-finalizado/10 text-status-finalizado',
  },
  NOTIFICADO: {
    label: 'Notificado',
    dotClassName: 'bg-status-notificado',
    badgeClassName: 'bg-status-notificado/10 text-status-notificado',
  },
  RECHAZADO: {
    label: 'Rechazado',
    dotClassName: 'bg-status-rechazado',
    badgeClassName: 'bg-status-rechazado/10 text-status-rechazado',
  },
  BLOQUEADO: {
    label: 'Bloqueado',
    dotClassName: 'bg-status-bloqueado',
    badgeClassName: 'bg-status-bloqueado/10 text-status-bloqueado',
  },
};

const FALLBACK_VISUAL: EstadoVisual = {
  label: 'Desconocido',
  dotClassName: 'bg-slate-400',
  badgeClassName: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

/** true si el estado ya no cambiará más (útil para detener el polling en la Fase 8). */
export function isEstadoTerminal(estado: string): boolean {
  return (
    estado === 'FINALIZADO' ||
    estado === 'NOTIFICADO' ||
    estado === 'RECHAZADO' ||
    estado === 'BLOQUEADO'
  );
}

// function normalizeEstadoValue(estado: string): CargaEstadoStorage | null {
//   const normalized = estado
//     .trim()
//     .toUpperCase()
//     .replace(/\r|\n/g, '')
//     .replace(/\s+/g, '_')
//     .replace(/-+/g, '_');

//   if (ESTADO_ORDER.includes(normalized as CargaEstadoStorage)) {
//     return normalized as CargaEstadoStorage;
//   }

//   return null;
// }

export function normalizeEstadoValue(estado: string): CargaEstadoStorage | null {
  const normalized = estado
    .trim()
    .toUpperCase()
    .replace(/\r|\n/g, '')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_');

  if (ESTADO_ORDER.includes(normalized as CargaEstadoStorage)) {
    return normalized as CargaEstadoStorage;
  }

  return null;
}

export function getEstadoVisual(estado: string): EstadoVisual {
  const normalized = normalizeEstadoValue(estado);
  if (normalized) {
    return ESTADO_VISUAL_MAP[normalized];
  }
  return FALLBACK_VISUAL;
}
