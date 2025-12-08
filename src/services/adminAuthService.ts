import adminApiClient from '@/utils/api-helpers/adminApiClient';
import type { AdminLoginRequest, AdminLoginResponse, Admin } from '@/types/Admin';

const adminAuthService = {
  async login(data: AdminLoginRequest): Promise<AdminLoginResponse> {
    const response = await adminApiClient.post<AdminLoginResponse>('/admin/login', data);
    const { access_token, refresh_token } = response.data;
    
    // Store admin tokens separately from user tokens
    localStorage.setItem('admin_access_token', access_token);
    localStorage.setItem('admin_refresh_token', refresh_token);
    
    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('admin_refresh_token');
    if (refreshToken) {
      try {
        await adminApiClient.post('/admin/logout', { refresh_token: refreshToken });
      } catch (error) {
        console.error('Admin logout error:', error);
      }
    }
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
  },

  async me(): Promise<Admin> {
    const response = await adminApiClient.get<{ data: Admin }>('/admin/me');
    return response.data.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('admin_access_token');
  },

  getAccessToken(): string | null {
    return localStorage.getItem('admin_access_token');
  },
};

export default adminAuthService;

