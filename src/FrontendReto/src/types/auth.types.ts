export type UserRole = 'Admin' | 'Reader';

/** Body real de POST /api/auth/login (AuthController.cs — LoginRequest). */
export interface LoginRequest {
  usuario: string;
  password: string;
}

/** Respuesta real de POST /api/auth/login (LoginResponse.cs). */
export interface LoginResponse {
  token: string;
  usuario: string;
  tokenType: string;
  expiration: string;
}

/** Claims decodificados del JWT (NameIdentifier, Email, Role — ver LoginService.cs). */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}
