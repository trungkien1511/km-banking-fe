import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth-store';
import type { LoginRequest, LoginResponse, ApiResponse } from '@/features/auth/types/auth.types';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<ApiResponse<LoginResponse>, Error, LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { user, accessToken } = response.data;
      
      // Save authenticated state in Zustand (in-memory only, no localStorage)
      setAuth(user, accessToken);
      
      console.log('[Login success] Authenticated as:', user.username);
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('[Login error]', error);
    },
  });
};
