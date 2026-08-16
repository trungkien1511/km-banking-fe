import { startTransition } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type { ApiResponse } from "@/types/api.types";
import type {
  LoginRequest,
  LoginResponse,
} from "@/features/auth/types/auth.types";

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<ApiResponse<LoginResponse>, Error, LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);
      // bundle-preload: warm the dashboard chunk while the login spinner shows
      void import("@/features/dashboard/pages/DashboardPage");
      // rendering-usetransition-loading: keep submit pending state responsive
      startTransition(() => navigate("/dashboard"));
    },
  });
};
