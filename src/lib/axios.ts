import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized Error Formatting & Auth Handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message;

      // Auto logout/redirect on 401 unauthorized (unless on login page)
      if (status === 401 && typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login')) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = '/login?session_expired=true';
        }
      }

      const friendlyMessage = serverMessage || `Request failed with status code ${status}`;
      return Promise.reject(new Error(friendlyMessage));
    } else if (error.request) {
      return Promise.reject(new Error('Network error. Please check your internet connection.'));
    } else {
      return Promise.reject(new Error(error.message || 'An unexpected error occurred.'));
    }
  }
);

export default apiClient;
