import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { ROUTES } from '@/constants/routes';

interface NotificationCounts {
  new_orders: number;
  pending_marketplace_orders: number;
  pending_payouts: number;
  total: number;
}

interface NotificationItem {
  id: string;
  type: 'order' | 'marketplace_order' | 'payout';
  title: string;
  message: string;
  count: number;
  route: string;
  created_at?: string;
}

const AdminNotificationDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notification counts
  const { data: countsData, isLoading } = useQuery<NotificationCounts>({
    queryKey: ['admin-notification-counts'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/notifications/counts');
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const counts = countsData || {
    new_orders: 0,
    pending_marketplace_orders: 0,
    pending_payouts: 0,
    total: 0,
  };

  // Build notification items
  const notifications = ([
    {
      id: 'orders',
      type: 'order',
      title: 'New Orders',
      message: `${counts.new_orders} new order${counts.new_orders !== 1 ? 's' : ''} need${counts.new_orders !== 1 ? '' : 's'} confirmation`,
      count: counts.new_orders,
      route: ROUTES.ADMIN_ORDERS,
    },
    {
      id: 'marketplace',
      type: 'marketplace_order',
      title: 'Marketplace Orders',
      message: `${counts.pending_marketplace_orders} pending marketplace order${counts.pending_marketplace_orders !== 1 ? 's' : ''}`,
      count: counts.pending_marketplace_orders,
      route: `${ROUTES.ADMIN_MARKETPLACE}?tab=orders`,
    },
    {
      id: 'payouts',
      type: 'payout',
      title: 'Payout Requests',
      message: `${counts.pending_payouts} pending payout request${counts.pending_payouts !== 1 ? 's' : ''}`,
      count: counts.pending_payouts,
      route: `${ROUTES.ADMIN_AFFILIATES}?tab=payouts`,
    },
  ] as NotificationItem[]).filter((item) => item.count > 0); // Only show notifications with counts > 0

  const handleNotificationClick = (route: string) => {
    navigate(route);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button
          variant="outline"
          size="icon"
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Bell className="h-4 w-4 text-foreground" />
          {counts.total > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {counts.total > 99 ? '99+' : counts.total}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {counts.total > 0 && (
            <span className="text-xs text-muted-foreground">
              {counts.total} new
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 hover:bg-foreground/5! p-3 cursor-pointer bg-blue-50 dark:bg-blue-950/20 border-l-2 border-blue-500"
                onClick={() => handleNotificationClick(notification.route)}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                </div>
                {/* {notification.count > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {notification.count} item{notification.count !== 1 ? 's' : ''}
                  </span>
                )} */}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminNotificationDropdown;

