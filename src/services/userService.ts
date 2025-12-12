import apiClient from '@/utils/api-helpers/apiClient';

export interface UserProfile {
  id?: number;
  user_id: number;
  first_name: string;
  last_name: string;
  date_of_birth?: string | null;
  email: string | null;
  phone?: string | null;
  Country: string | null;
  password: string | null;
  old_password: string | null;
  confirm_password: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  [key: string]: any; // For other user fields
}

export interface UpdateUserRequest {
  phone?: string;
  country?: string;
  [key: string]: any;
}

const userService = {
  /**
   * Get current authenticated user
   * 
   * Backend endpoint: GET /api/v1/user
   * 
   * Laravel route example:
   * Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
   * 
   * Expected response:
   * {
   *   "id": 1,
   *   "name": "John Doe",
   *   "email": "john@example.com",
   *   "phone": "+1234567890" or null,
   *   "country": "United States" or null
   * }
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/user');
    return response.data;
  },

  /**
   * Update current authenticated user
   * 
   * Backend endpoint: PUT /api/v1/user
   * 
   * Laravel route example:
   * Route::put('/user', [AuthController::class, 'update'])->middleware('auth:sanctum');
   */
  async updateUser(data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<User>('/user', data);
    return response.data;
  },

  async updatePhone(phone: string): Promise<User> {
    return this.updateUser({ phone });
  },

  async changePassword(data: { 
    current_password: string; 
    password: string; 
    password_confirmation: string;
  }): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>('/user/change-password', data);
    return response.data;
  },

  async sendCurrentEmailVerificationCode(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/user/send-current-email-code');
    return response.data;
  },

  async verifyCurrentEmailCode(code: string): Promise<{ message: string; verified: boolean }> {
    const response = await apiClient.post<{ message: string; verified: boolean }>('/user/verify-current-email-code', { code });
    return response.data;
  },

  async updateEmail(newEmail: string): Promise<{ message: string; email: string }> {
    const response = await apiClient.put<{ message: string; email: string }>('/user/update-email', { new_email: newEmail });
    return response.data;
  },

  async sendNewEmailVerificationCode(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/user/send-new-email-code', { email });
    return response.data;
  },

  async verifyNewEmailCode(code: string): Promise<{ message: string; user: User }> {
    const response = await apiClient.post<{ message: string; user: User }>('/user/verify-new-email-code', { code });
    return response.data;
  },
};

export default userService;

