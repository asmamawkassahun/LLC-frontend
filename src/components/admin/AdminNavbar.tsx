import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import adminAuthService from '@/services/adminAuthService';
import { ROUTES } from '@/constants/routes';
import { LogOut } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const { data: adminData } = useQuery({
    queryKey: ['admin-me'],
    queryFn: async () => {
      try {
        return await adminAuthService.me();
      } catch (error) {
        return null;
      }
    },
    enabled: adminAuthService.isAuthenticated(),
  });

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();
      navigate(ROUTES.ADMIN_LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
      navigate(ROUTES.ADMIN_LOGIN);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {adminData?.name || 'Admin'}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="h-9 w-9"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default AdminNavbar;

