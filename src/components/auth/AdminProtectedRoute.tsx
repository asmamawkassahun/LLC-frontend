import { Navigate, useLocation } from 'react-router-dom';
import adminAuthService from '@/services/adminAuthService';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = adminAuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;

