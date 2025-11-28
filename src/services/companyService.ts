import apiClient from '@/utils/api-helpers/apiClient';

export interface Company {
  id: number;
  name: string;
  type?: string;
  type_label?: string;
  status?: string;
  status_label?: string;
  country?: {
    id: number;
    name: string;
    code?: string;
  };
  state?: {
    id: number;
    name: string;
  };
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CompaniesResponse {
  data: Company[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

const companyService = {
  /**
   * Get all companies for the current user
   * 
   * Backend endpoint: GET /api/v1/companies
   */
  async getCompanies(): Promise<Company[]> {
    const response = await apiClient.get<CompaniesResponse>('/companies');
    // Handle both paginated and non-paginated responses
    if (response.data.data) {
      return response.data.data;
    }
    return response.data as unknown as Company[];
  },

  /**
   * Get a single company by ID
   * 
   * Backend endpoint: GET /api/v1/companies/{id}
   */
  async getCompany(id: number): Promise<Company> {
    const response = await apiClient.get<{ data: Company }>(`/companies/${id}`);
    return response.data.data || response.data;
  },

  /**
   * Set a company as primary
   * 
   * Backend endpoint: POST /api/v1/companies/{id}/set-primary
   */
  async setAsPrimary(id: number): Promise<Company> {
    const response = await apiClient.post<{ data: Company }>(`/companies/${id}/set-primary`);
    return response.data.data || response.data;
  },
};

export default companyService;

