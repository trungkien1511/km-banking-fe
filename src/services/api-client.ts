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

// Response interceptor — handle global errors like 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear authenticated state on 401 from API
      useAuthStore.getState().logout();
      
      // Optionally redirect or handle logout logic here
      // For single page apps with routers, you can trigger a redirect
    }
    return Promise.reject(error);
  }
);
