import apiClient from '@/utils/api-helpers/apiClient';

export interface Affiliate {
  id: number;
  user_id: number;
  referral_code: string;
  commission_rate: number;
  total_earnings: number;
  paid_earnings: number;
  pending_earnings: number;
  status: string;
  joined_at: string;
}

export interface ReferralStats {
  users_referred: number;
  paid_users: number;
  referral_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
}

export interface ReferralLink {
  referral_link: string;
  referral_code: string;
}

export interface BankAccount {
  id: number;
  affiliate_id: number;
  account_holder_name: string;
  account_number: string;
  bank_name: string;
  swift_code?: string;
  iban?: string;
  routing_number?: string;
  country?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payout {
  id: number;
  affiliate_id: number;
  bank_account_id?: number;
  amount: number;
  status: string;
  notes?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
  bank_account?: BankAccount;
}

export interface CreateBankAccountRequest {
  account_holder_name: string;
  account_number: string;
  bank_name: string;
  swift_code?: string;
  iban?: string;
  routing_number?: string;
  country?: string;
  is_primary?: boolean;
}

export interface RequestPayoutRequest {
  amount: number;
  bank_account_id?: number;
  notes?: string;
}

const referralService = {
  async register(): Promise<Affiliate> {
    const response = await apiClient.post<Affiliate>('/referrals/register');
    return response.data;
  },

  async getDashboard() {
    const response = await apiClient.get('/referrals/dashboard');
    return response.data;
  },

  async getCommissions(page = 1, perPage = 15) {
    const response = await apiClient.get('/referrals/commissions', {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  async getStats(): Promise<ReferralStats> {
    const response = await apiClient.get<ReferralStats>('/referrals/stats');
    return response.data;
  },

  async getReferralLink(): Promise<ReferralLink> {
    const response = await apiClient.get<ReferralLink>('/referrals/link');
    return response.data;
  },

  async getBankAccounts(): Promise<BankAccount[]> {
    const response = await apiClient.get<BankAccount[]>('/referrals/bank-accounts');
    return response.data;
  },

  async createBankAccount(data: CreateBankAccountRequest): Promise<BankAccount> {
    const response = await apiClient.post<BankAccount>('/referrals/bank-accounts', data);
    return response.data;
  },

  async updateBankAccount(id: number, data: Partial<CreateBankAccountRequest>): Promise<BankAccount> {
    const response = await apiClient.put<BankAccount>(`/referrals/bank-accounts/${id}`, data);
    return response.data;
  },

  async deleteBankAccount(id: number): Promise<void> {
    await apiClient.delete(`/referrals/bank-accounts/${id}`);
  },

  async getPayouts(page = 1, perPage = 15) {
    const response = await apiClient.get('/referrals/payouts', {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  async requestPayout(data: RequestPayoutRequest): Promise<Payout> {
    const response = await apiClient.post<Payout>('/referrals/payouts/request', data);
    return response.data;
  },
};

export default referralService;

