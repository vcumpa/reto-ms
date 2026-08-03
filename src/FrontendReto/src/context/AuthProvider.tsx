import { useEffect, useState, type ReactNode } from 'react';
import { login as loginService } from '@/services';
import {
  clearStoredToken,
  decodeAuthUser,
  getStoredToken,
  isTokenExpired,
  setStoredToken,
  AUTH_UNAUTHORIZED_EVENT,
} from '@/utils';
import type { AuthUser } from '@/types';
import { AuthContext, type AuthContextValue } from './AuthContext';

interface StoredSession {
  user: AuthUser | null;
  token: string | null;
}

/**
 * Lee y valida la sesión guardada en localStorage de forma síncrona —
 * se usa como inicializador perezoso de useState, así el primer render
 * ya conoce el estado real de la sesión (sin loaders ni condiciones de
 * carrera, y sin llamar setState dentro de un efecto de montaje).
 */
function readStoredSession(): StoredSession {
  const storedToken = getStoredToken();
  if (!storedToken) return { user: null, token: null };

  if (isTokenExpired(storedToken)) {
    clearStoredToken();
    return { user: null, token: null };
  }

  const decodedUser = decodeAuthUser(storedToken);
  if (!decodedUser) {
    clearStoredToken();
    return { user: null, token: null };
  }

  return { user: decodedUser, token: storedToken };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [{ user, token }, setSession] = useState<StoredSession>(readStoredSession);
  const [isLoading, setIsLoading] = useState(false);

  // El interceptor de Axios dispara este evento ante un 401.
  useEffect(() => {
    function handleUnauthorized() {
      setSession({ user: null, token: null });
    }
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const login: AuthContextValue['login'] = async (usuario, password) => {
    setIsLoading(true);
    try {
      const response = await loginService({ usuario, password });
      const decodedUser = decodeAuthUser(response.token);
      if (!decodedUser) {
        throw new Error('No se pudo procesar la sesión. Intenta nuevamente.');
      }
      setStoredToken(response.token);
      setSession({ user: decodedUser, token: response.token });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearStoredToken();
    setSession({ user: null, token: null });
  };

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
