export interface Admin {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  admin: Admin;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

