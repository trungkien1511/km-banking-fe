import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
} from "@/features/auth/types/auth.types";

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      "/api/v1/auth/login",
      data,
    );
    return response.data;
  },

  refresh: async (
    data: RefreshTokenRequest,
  ): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      "/api/v1/auth/refresh",
      data,
    );
    return response.data;
  },
};
