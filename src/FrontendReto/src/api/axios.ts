import axios from 'axios';
import { AUTH_UNAUTHORIZED_EVENT, clearStoredToken, getStoredToken } from '@/utils';

/**
 * Cliente HTTP centralizado. Ninguna llamada al backend debe salir
 * directo de un componente o página — siempre pasa por este cliente
 * a través de services/.
 *
 * baseURL vacío a propósito: en desarrollo, Vite reenvía "/auth" y
 * "/api" al ApiGateway (ver vite.config.ts) porque el Gateway no
 * envía cabeceras CORS. En build de producción, si VITE_API_BASE_URL
 * está definido, se usa como baseURL real.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.PROD ? (import.meta.env.VITE_API_BASE_URL ?? '') : '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// Adjunta el JWT a toda petición saliente.
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Ante un 401, limpia el token y avisa a AuthProvider vía un evento global
// (este módulo no puede depender de React Context directamente).
// Nota: ControlService todavía no valida el JWT (ver README), así que este
// interceptor hoy en día solo aplicaría a futuros endpoints protegidos.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearStoredToken();
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  },
);
