/** Rutas reales expuestas por el ApiGateway (YARP) hacia AuthService y ControlService. */
export const ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
  },
  control: {
    // cargar: '/api/control/cargar',
    cargas: '/api/cargas',
    detalle: (idCarga: number | string) => `/api/detalle/${idCarga}`,
    auditoria: (idCarga: number | string) => `/api/cargas/${idCarga}/auditoria`,
    historial: (idCarga: number | string) => `/api/cargas/${idCarga}/historial`,
  },
} as const;
