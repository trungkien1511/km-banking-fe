import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/auth-store';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor — attach access token from Zustand state
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — handle global errors and format messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status >= 500) {
        errorMessage = 'System is temporarily unavailable. Please try again later.';
      } else {
        errorMessage = data?.message || data?.error || 'Invalid request.';
      }

      if (status === 401) {
        // Clear authenticated state on 401 from API
        useAuthStore.getState().logout();
      }
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your internet connection and try again.';
    }

    // Attach formatted message for UI components to use
    (error as any).formattedMessage = errorMessage;
    
    return Promise.reject(error);
  }
);
