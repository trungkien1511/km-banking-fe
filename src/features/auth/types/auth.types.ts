export interface AuthUser {
  id: string;
  username: string;
  fullName: string;
  role: 'CUSTOMER' | 'ADMIN' | 'STAFF';
}

export interface LoginRequest {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, accessToken: string) => void;
  logout: () => void;
}
