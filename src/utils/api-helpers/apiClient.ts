import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base URL
// Note: Using VITE_API_BASE_URL (Vite requires VITE_ prefix for env variables)
// If you have BASE_URL in .env, change it to VITE_API_BASE_URL
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and maintenance mode
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 503 (Service Unavailable), it's likely maintenance mode
    // Don't redirect for maintenance status endpoint or admin routes
    if (error.response?.status === 503) {
      const url = originalRequest?.url || '';
      const isMaintenanceStatus = url.includes('/maintenance/status');
      const isAdminRoute = url.includes('/admin/');
      
      // If it's not the maintenance status endpoint or admin route, set a flag
      if (!isMaintenanceStatus && !isAdminRoute) {
        // Set a flag in sessionStorage to indicate maintenance mode
        sessionStorage.setItem('maintenance_mode', 'true');
        // Trigger a custom event that MaintenanceCheck can listen to
        window.dispatchEvent(new CustomEvent('maintenance-mode-detected'));
      }
    }

    // If 401 and not already retrying, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const baseURL = import.meta.env.VITE_API_BASE_URL || import.meta.env.BASE_URL || 'http://localhost:8000/api/v1';
          const response = await axios.post(
            `${baseURL}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;