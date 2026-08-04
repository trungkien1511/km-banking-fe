import { create } from "zustand";
import type { AuthState, AuthUser } from "../types/auth.types";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) =>
    set({ user, accessToken, refreshToken, isAuthenticated: true }),

  setAccessToken: (accessToken: string) => set({ accessToken }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    }),
}));
