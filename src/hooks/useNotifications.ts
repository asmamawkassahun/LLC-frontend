import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import echo from '@/lib/echo';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/authService';

export const useNotifications = (userId: number | null) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId || !authService.isAuthenticated()) {
            return;
        }

        // Update Echo auth token when it changes
        const updateEchoAuth = () => {
            const token = authService.getAccessToken();
            if (token && echo.connector && echo.connector.pusher && echo.connector.pusher.config) {
                const config = echo.connector.pusher.config as any;
                if (!config.auth) {
                    config.auth = {};
                }
                if (!config.auth.headers) {
                    config.auth.headers = {};
                }
                config.auth.headers = {
                    ...config.auth.headers,
                    Authorization: `Bearer ${token}`,
                };
            }
        };

        updateEchoAuth();

        // Subscribe to user's private channel
        const channel = echo.private(`user.${userId}`);

        // Listen for file upload notifications
        channel.listen('.file.uploaded', (data: any) => {
            const notification = data.notification;
            
            // Show toast notification
            toast.info(notification.title, {
                description: notification.message,
                action: {
                    label: 'View Inbox',
                    onClick: () => navigate('/dashboard/inbox'),
                },
                duration: 5000,
            });

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['user-marketplace-orders'] });
        });

        // Cleanup on unmount
        return () => {
            channel.stopListening('.file.uploaded');
            echo.leave(`user.${userId}`);
        };
    }, [userId, queryClient, navigate]);
};

