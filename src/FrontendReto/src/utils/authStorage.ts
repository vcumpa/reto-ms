const TOKEN_KEY = 'carga_masiva_token';

/** Nombre del evento global disparado por el interceptor de Axios ante un 401. */
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

// localStorage puede fallar (modo privado, cuotas) — todas las funciones
// degradan silenciosamente en vez de romper la app.

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* la sesión no persiste entre recargas; no es un error fatal */
  }
}

export function clearStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* noop */
  }
}
