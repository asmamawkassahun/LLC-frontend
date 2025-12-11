import { useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import apiClient from '@/utils/api-helpers/apiClient';
import authService from '@/services/authService';

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.get('/auth/me');
                setUserId(response.data.id);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setUserId(null);
            }
        };

        if (authService.isAuthenticated()) {
            fetchUser();
        } else {
            setUserId(null);
        }
    }, []);

    useNotifications(userId);

    return <>{children}</>;
};

export default NotificationProvider;

