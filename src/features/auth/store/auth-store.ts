import { create } from 'zustand';
import type { AuthState, AuthUser } from '../types/auth.types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setAuth: (user: AuthUser, accessToken: string) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
    }),
  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),
}));
