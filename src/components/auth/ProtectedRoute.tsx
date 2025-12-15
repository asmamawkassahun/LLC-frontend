import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import authService from '@/services/authService';
import { useQuery } from '@tanstack/react-query';
import userService from '@/services/userService';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();
    const isAuthenticated = authService.isAuthenticated();
    const isSuspendedPage = location.pathname === ROUTES.SUSPENDED;

    // Fetch user data to check if account is suspended
    const { data: userData, isLoading } = useQuery({
        queryKey: ['current-user'],
        queryFn: () => userService.getCurrentUser(),
        enabled: isAuthenticated,
        retry: false,
    });

    if (!isAuthenticated) {
        // Redirect to login page, saving the attempted location
        // so we can redirect back after login
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    // If user is on suspended page, allow access regardless of status
    if (isSuspendedPage) {
        return <>{children}</>;
    }

    // Check if user account is suspended (only if not on suspended page)
    if (!isLoading && userData && userData.is_active === false) {
        // Redirect to suspended page if account is not active
        return <Navigate to={ROUTES.SUSPENDED} replace />;
    }

    // Show loading state while checking user status
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;

