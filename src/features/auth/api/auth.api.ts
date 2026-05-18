import { apiClient } from '@/services/api-client';
import type { LoginRequest, LoginResponse, ApiResponse } from '@/features/auth/types/auth.types';

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/login', data);
    return response.data;
  },
};
