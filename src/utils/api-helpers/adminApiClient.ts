import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

// Get base URL - admin routes are at /api/admin (not /api/v1/admin)
const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  // Remove /v1 if present since admin routes are at /api/admin (not /api/v1/admin)
  return envURL.replace('/v1', '');
};

// Create axios instance for admin API calls with admin tokens
const adminApiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add admin access token
adminApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('admin_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
adminApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If 401, redirect to admin login
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
      window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  }
);

export default adminApiClient;

