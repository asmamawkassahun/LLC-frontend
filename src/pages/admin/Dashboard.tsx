import { useQuery } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import StatsCard from '@/components/admin/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShoppingCart,
  DollarSign,
  Users,
  Building2,
  Clock,
  CheckCircle,
  UserCheck,
  FileText,
} from 'lucide-react';
import type { DashboardStats } from '@/types/AdminDashboard';
import { formatCurrency } from '@/lib/formatters';

const AdminDashboardPage = () => {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/dashboard/stats');
      return response.data;
    },
  });

  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/dashboard/recent-orders');
      return response.data.data || [];
    },
  });

  console.log("Recent Orders: ", recentOrders);

  const { data: recentUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-recent-users'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/dashboard/recent-users');
      return response.data.data || [];
    },
  });

  if (statsLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Orders"
          value={stats?.total_orders || 0}
          icon={ShoppingCart}
          description="All time orders"
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats?.total_revenue || 0)}
          icon={DollarSign}
          description="From paid orders"
        />
        <StatsCard
          title="Total Users"
          value={stats?.total_users || 0}
          icon={Users}
          description={`${stats?.active_users || 0} active`}
        />
        <StatsCard
          title="Total Companies"
          value={stats?.total_companies || 0}
          icon={Building2}
          description={`${stats?.pending_companies || 0} pending`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Orders"
          value={stats?.pending_orders || 0}
          icon={Clock}
        />
        <StatsCard
          title="Paid Orders"
          value={stats?.paid_orders || 0}
          icon={CheckCircle}
        />
        <StatsCard
          title="Company Owners"
          value={stats?.total_company_owners || 0}
          icon={UserCheck}
        />
        <StatsCard
          title="Pending Companies"
          value={stats?.pending_companies || 0}
          icon={FileText}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-2">
                {recentOrders.slice(0, 5).map((order: any) => (
                  <div key={order.id} className="p-2 border rounded space-y-2">
                    <div className='flex items-center justify-between'>
                      <p className="font-medium">{order.order_number}</p>
                      <span className="text-sm text-muted-foreground">
                        {order.payment_status_label || order.payment_status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.user?.name || 'N/A'} - {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent orders</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentUsers && recentUsers.length > 0 ? (
              <div className="space-y-2">
                {recentUsers.slice(0, 5).map((user: any) => (
                  <div key={user.id} className="p-2 border rounded space-y-2">
                    <div className='flex items-center justify-between'>
                      <p className="font-medium">{user.name}</p>
                      <span className={`text-xs px-2 py-1 rounded ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent users</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

