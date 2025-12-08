export interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  total_users: number;
  total_company_owners: number;
  total_companies: number;
  pending_orders: number;
  paid_orders: number;
  active_users: number;
  pending_companies: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  orders: number;
}

