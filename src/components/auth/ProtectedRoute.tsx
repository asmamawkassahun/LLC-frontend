import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import authService from '@/services/authService';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();
    console.log('location: ', location);
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        // Redirect to login page, saving the attempted location
        // so we can redirect back after login
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;

