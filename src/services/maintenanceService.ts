import apiClient from '@/utils/api-helpers/apiClient';
import adminApiClient from '@/utils/api-helpers/adminApiClient';

export interface MaintenanceStatus {
  enabled: boolean;
}

const maintenanceService = {
  // Public endpoint to check maintenance status
  async getStatus(): Promise<MaintenanceStatus> {
    const response = await apiClient.get<MaintenanceStatus>('/maintenance/status');
    return response.data;
  },

  // Admin endpoints
  async getAdminStatus(): Promise<MaintenanceStatus> {
    const response = await adminApiClient.get<MaintenanceStatus>('/admin/maintenance/status');
    return response.data;
  },

  async enable(): Promise<{ message: string; enabled: boolean }> {
    const response = await adminApiClient.post<{ message: string; enabled: boolean }>('/admin/maintenance/enable');
    return response.data;
  },

  async disable(): Promise<{ message: string; enabled: boolean }> {
    const response = await adminApiClient.post<{ message: string; enabled: boolean }>('/admin/maintenance/disable');
    return response.data;
  },
};

export default maintenanceService;

