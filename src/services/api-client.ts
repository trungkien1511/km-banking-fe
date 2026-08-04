import axios, { type AxiosError } from "axios";
import { useAuthStore } from "@/features/auth/store/auth-store";

export interface ApiError extends Error {
  formattedMessage: string;
}

export const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processPendingQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/auth/refresh",
          { refreshToken },
          { headers: { "Content-Type": "application/json" } },
        );

        const {
          accessToken,
          refreshToken: newRefreshToken,
          user,
        } = response.data.data;
        useAuthStore.getState().setAuth(user, accessToken, newRefreshToken);

        processPendingQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processPendingQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    let errorMessage = "An unexpected error occurred. Please try again.";
    if (error.response) {
      const { status, data } = error.response;
      if (status >= 500) {
        errorMessage =
          "System is temporarily unavailable. Please try again later.";
      } else {
        errorMessage = data?.message || data?.error || "Invalid request.";
      }
    } else if (error.code === "ERR_NETWORK") {
      errorMessage =
        "Network error. Please check your internet connection and try again.";
    }

    (error as AxiosError & ApiError).formattedMessage = errorMessage;
    return Promise.reject(error);
  },
);
