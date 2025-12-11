import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import maintenanceService from '@/services/maintenanceService';
import MaintenancePage from '@/pages/Maintenance';
import adminAuthService from '@/services/adminAuthService';

interface MaintenanceCheckProps {
  children: React.ReactNode;
}

const MaintenanceCheck = ({ children }: MaintenanceCheckProps) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdminLoginPage = location.pathname === '/admin/login';
  const isAdminAuthenticated = adminAuthService.isAuthenticated();
  const [maintenanceDetected, setMaintenanceDetected] = useState(
    sessionStorage.getItem('maintenance_mode') === 'true'
  );

  // Listen for maintenance mode detection from API interceptor
  useEffect(() => {
    const handleMaintenanceDetected = () => {
      setMaintenanceDetected(true);
      sessionStorage.setItem('maintenance_mode', 'true');
    };

    window.addEventListener('maintenance-mode-detected', handleMaintenanceDetected);
    return () => {
      window.removeEventListener('maintenance-mode-detected', handleMaintenanceDetected);
    };
  }, []);

  // Always allow access to admin routes if admin is authenticated
  // Also allow access to admin login page during maintenance
  if (isAdminRoute && (isAdminAuthenticated || isAdminLoginPage)) {
    return <>{children}</>;
  }

  // Check maintenance status for all other routes
  const { data: maintenanceStatus, isLoading } = useQuery({
    queryKey: ['maintenance-status'],
    queryFn: async () => {
      try {
        return await maintenanceService.getStatus();
      } catch (error: any) {
        // If API returns 503 or fails, assume maintenance is on
        if (error?.response?.status === 503) {
          setMaintenanceDetected(true);
          sessionStorage.setItem('maintenance_mode', 'true');
          return { enabled: true };
        }
        // For other errors, check sessionStorage
        if (sessionStorage.getItem('maintenance_mode') === 'true') {
          return { enabled: true };
        }
        return { enabled: false };
      }
    },
    refetchInterval: 30000, // Check every 30 seconds
    retry: false, // Don't retry if it fails
  });

  // Update maintenance detected state when status changes
  useEffect(() => {
    if (maintenanceStatus?.enabled) {
      setMaintenanceDetected(true);
      sessionStorage.setItem('maintenance_mode', 'true');
    } else if (maintenanceStatus?.enabled === false) {
      setMaintenanceDetected(false);
      sessionStorage.removeItem('maintenance_mode');
    }
  }, [maintenanceStatus]);

  // Show maintenance page if detected or if status says enabled
  if (maintenanceDetected || maintenanceStatus?.enabled) {
    return <MaintenancePage />;
  }

  // Show loading state briefly (only if we don't have maintenance detected)
  if (isLoading && !maintenanceDetected) {
    return null;
  }

  // Allow access when maintenance is disabled
  return <>{children}</>;
};

export default MaintenanceCheck;

