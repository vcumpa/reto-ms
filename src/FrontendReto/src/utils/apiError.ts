import { isAxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types';

/**
 * Extrae un mensaje legible de un error de Axios/API real.
 *
 * Distingue tres casos que de otro modo se ven idénticos para el usuario:
 * - El backend respondió con un error de negocio real (400/401/409 con
 *   { mensaje }) → se muestra tal cual.
 * - No llegó ninguna respuesta (backend apagado, red caída, o el proxy de
 *   Vite sin destino al que reenviar) → axios deja error.response en
 *   undefined; se avisa explícitamente que no hay conexión.
 * - Llegó una respuesta, pero sin el cuerpo { mensaje } esperado — típico
 *   de una excepción no controlada (500) en el backend, por ejemplo si
 *   Postgres/RabbitMQ/SeaweedFS no están disponibles → se agrega el código
 *   HTTP real al mensaje para poder diagnosticarlo sin adivinar.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Ocurrió un error inesperado.',
): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Verifica que el backend (ApiGateway/AuthService) esté corriendo.';
    }
    const backendMessage = error.response.data?.mensaje;
    if (backendMessage) return backendMessage;
    return `${fallback} (código ${error.response.status})`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
