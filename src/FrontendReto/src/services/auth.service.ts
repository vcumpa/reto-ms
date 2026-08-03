import { apiClient, ENDPOINTS } from '@/api';
import type { LoginRequest, LoginResponse } from '@/types';

/** POST /api/auth/login real — ver AuthController.cs / LoginRequest.cs / LoginResponse.cs. */
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(ENDPOINTS.auth.login, payload);
  return data;
}
