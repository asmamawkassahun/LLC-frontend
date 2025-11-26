export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
    country?: string;
  }
  
  export interface RegisterResponse {
    message?: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
    access_token: string;
    refresh_token: string;
    token_type?: string;
  }