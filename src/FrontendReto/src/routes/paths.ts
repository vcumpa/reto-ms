export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  upload: '/subir-excel',
  history: '/historial',
  historyDetail: '/historial/:id',
  notifications: '/notificaciones',
  profile: '/perfil',
} as const;

/** Construye la ruta concreta de detalle a partir de un id real. */
export function buildHistoryDetailPath(id: number | string): string {
  return `/historial/${id}`;
}
