import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import authService from '@/services/authService';

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
    const isAuthenticated = authService.isAuthenticated();

    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return <>{children}</>;
};

export default PublicRoute;

