export interface AuthUser {
  id: string;
  username: string;
  phoneNumber?: string;
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
  tokenType: 'Bearer';
  expiresIn: number;
  user: AuthUser;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code?: string;
  data: T;
  errors?: {
    field: string;
    message: string;
  }[];
  timestamp?: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (user: AuthUser, accessToken: string) => void;

  logout: () => void;
}