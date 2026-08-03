import { jwtDecode } from 'jwt-decode';
import type { AuthUser, UserRole } from '@/types';

/**
 * IMPORTANTE: aunque LoginService.cs firma los claims con las constantes
 * System.Security.Claims.ClaimTypes.* (URIs largas de WS-Identity),
 * JwtSecurityTokenHandler las traduce automáticamente a los nombres CORTOS
 * de JWT al escribir el token (DefaultOutboundClaimTypeMap de .NET) a menos
 * que se desactive explícitamente esa traducción — y este backend no lo hace.
 *
 * Verificado decodificando un JWT real emitido por este backend
 * (docs/walkthrough.md): el payload trae "nameid", "email", "role" — no las
 * URIs largas. Se dejan las URIs largas como fallback por si el backend
 * cambia esa configuración más adelante.
 */
const CLAIM_NAME_IDENTIFIER_LONG =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const CLAIM_ROLE_LONG = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const CLAIM_EMAIL_LONG =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';

interface RawJwtPayload {
  nameid?: string;
  role?: string;
  email?: string;
  Email?: string;
  [CLAIM_NAME_IDENTIFIER_LONG]?: string;
  [CLAIM_ROLE_LONG]?: string;
  [CLAIM_EMAIL_LONG]?: string;
  exp?: number;
}

/** Decodifica el JWT real del backend a un AuthUser tipado. Null si el token es inválido o incompleto. */
export function decodeAuthUser(token: string): AuthUser | null {
  try {
    const payload = jwtDecode<RawJwtPayload>(token);
    const id = payload.nameid ?? payload[CLAIM_NAME_IDENTIFIER_LONG];
    const role = payload.role ?? payload[CLAIM_ROLE_LONG];
    const email = payload.Email ?? payload.email ?? payload[CLAIM_EMAIL_LONG];
    if (!id || !email || !role) return null;
    return { id, email, role: role as UserRole };
  } catch {
    return null;
  }
}

/** true si el token no se puede decodificar o ya venció (claim "exp"). */
export function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<RawJwtPayload>(token);
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}
