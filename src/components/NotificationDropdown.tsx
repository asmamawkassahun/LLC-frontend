import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { IoMdNotifications } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import apiClient from '@/utils/api-helpers/apiClient';
import { ROUTES } from '@/constants/routes';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    data: Record<string, any>;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

const NotificationDropdown = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    // Fetch notifications
    const { data: notificationsData, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const response = await apiClient.get('/notifications');
            // Backend returns paginated response with data property
            return response.data.data || [];
        },
        refetchInterval: 30000, // Refetch every 30 seconds
    });

    const notifications: Notification[] = Array.isArray(notificationsData) 
        ? notificationsData 
        : [];
    const unreadCount = notifications.filter((n) => !n.is_read).length;

    // Mark notification as read mutation
    const markAsReadMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiClient.post(`/notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    // Mark all as read mutation
    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            await apiClient.post('/notifications/read-all');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const handleNotificationClick = (notification: Notification) => {
        // Mark as read if not already read
        if (!notification.is_read) {
            markAsReadMutation.mutate(notification.id);
        }

        // Navigate based on notification type
        if (notification.type === 'marketplace_file_uploaded') {
            navigate(ROUTES.INBOX);
        } else if (notification.data?.order_id) {
            navigate(`/orders/${notification.data.order_id}`);
        }

        setIsOpen(false);
    };

    const formatNotificationTime = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch {
            return 'Recently';
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild className='cursor-pointer'>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors border border-foreground/25"
                >
                    <IoMdNotifications className="text-foreground/25" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                markAllAsReadMutation.mutate();
                            }}
                            disabled={markAllAsReadMutation.isPending}
                        >
                            Mark all as read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isLoading ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        Loading notifications...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        No notifications
                    </div>
                ) : (
                    <>
                        {notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`flex flex-col items-start gap-1 hover:bg-foreground/5! p-3 cursor-pointer ${
                                    !notification.is_read
                                        ? 'bg-blue-50 dark:bg-blue-950/20 border-l-2 border-blue-500'
                                        : ''
                                }`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex items-start justify-between w-full gap-2">
                                    <div className="flex-1">
                                        <p
                                            className={`text-sm font-semibold ${
                                                !notification.is_read
                                                    ? 'text-foreground'
                                                    : 'text-muted-foreground'
                                            }`}
                                        >
                                            {notification.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {notification.message}
                                        </p>
                                    </div>
                                    {!notification.is_read && (
                                        <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {formatNotificationTime(notification.created_at)}
                                </span>
                            </DropdownMenuItem>
                        ))}
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationDropdown;

