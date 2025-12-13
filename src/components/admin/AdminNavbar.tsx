import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import adminAuthService from '@/services/adminAuthService';
import { ROUTES } from '@/constants/routes';
import { LogOut, User, Settings, MessageSquare } from 'lucide-react';
import AdminNotificationDropdown from './AdminNotificationDropdown';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { useState, useEffect } from 'react';
import AdminHelpDialog from '@/components/help/AdminHelpDialog';
import adminSupportService from '@/services/adminSupportService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import maintenanceService from '@/services/maintenanceService';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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

  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Fetch maintenance status on mount
  const { data: maintenanceStatus } = useQuery({
    queryKey: ['maintenance-status'],
    queryFn: async () => {
      try {
        return await maintenanceService.getAdminStatus();
      } catch (error) {
        return { enabled: false };
      }
    },
    enabled: adminAuthService.isAuthenticated(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch tickets for unread count badge
  const { data: ticketsData } = useQuery({
    queryKey: ['admin-support-tickets'],
    queryFn: async () => {
      try {
        const response = await adminSupportService.getTickets(1, 50);
        return response;
      } catch (error) {
        return { data: [], total: 0 };
      }
    },
    enabled: adminAuthService.isAuthenticated(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Calculate total unread messages across all tickets
  const getTotalUnreadCount = (): number => {
    if (!ticketsData?.data || !Array.isArray(ticketsData.data)) return 0;
    
    let totalUnread = 0;
    ticketsData.data.forEach((ticket) => {
      if (!ticket.messages || !Array.isArray(ticket.messages)) return;
      
      const lastViewed = localStorage.getItem(`admin_ticket_viewed_${ticket.id}`);
      if (!lastViewed) {
        // If never viewed, count all user messages (not from admin/staff)
        totalUnread += ticket.messages.filter(msg => !msg.staff_id && !msg.is_internal).length;
      } else {
        const lastViewedDate = new Date(lastViewed);
        // Count messages created after last view that are from users
        totalUnread += ticket.messages.filter(msg => {
          const msgDate = new Date(msg.created_at);
          return msgDate > lastViewedDate && !msg.staff_id && !msg.is_internal;
        }).length;
      }
    });
    
    return totalUnread;
  };

  const totalUnreadCount = getTotalUnreadCount();

  // Update local state when maintenance status changes
  useEffect(() => {
    if (maintenanceStatus !== undefined) {
      setMaintenanceMode(maintenanceStatus.enabled);
    }
  }, [maintenanceStatus]);

  const toggleMaintenanceMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      if (enabled) {
        return await maintenanceService.enable();
      } else {
        return await maintenanceService.disable();
      }
    },
    onSuccess: (data) => {
      setMaintenanceMode(data.enabled);
      queryClient.invalidateQueries({ queryKey: ['maintenance-status'] });
      toast.success(data.message || `Maintenance mode ${data.enabled ? 'enabled' : 'disabled'}`);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to toggle maintenance mode';
      toast.error(errorMessage);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name?: string; email?: string; password?: string }) => {
      await adminApiClient.put('/admin/profile', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-me'] });
      toast.success('Profile updated successfully');
      setIsProfileDialogOpen(false);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    },
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

  const handleViewProfile = () => {
    setIsProfileDialogOpen(true);
  };

  // Update form data when dialog opens and adminData is available
  useEffect(() => {
    if (isProfileDialogOpen) {
      if (adminData) {
        setFormData({
          name: adminData.name || '',
          email: adminData.email || '',
          password: '',
          confirmPassword: '',
        });
      } else {
        // Reset form if adminData is not available
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      }
    }
  }, [isProfileDialogOpen, adminData]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = {};
      
      if (formData.name && formData.name !== adminData?.name) {
        payload.name = formData.name;
      }
      
      if (formData.email && formData.email !== adminData?.email) {
        payload.email = formData.email;
      }

      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setIsSubmitting(false);
          return;
        }
        if (formData.password.length < 8) {
          toast.error('Password must be at least 8 characters');
          setIsSubmitting(false);
          return;
        }
        payload.password = formData.password;
      }

      if (Object.keys(payload).length === 0) {
        toast.error('No changes to save');
        setIsSubmitting(false);
        return;
      }

      updateProfileMutation.mutate(payload);
    } catch (error: any) {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center justify-end gap-4">
          <AdminNotificationDropdown />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsHelpDialogOpen(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white border-none relative cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Support Requests
            {totalUnreadCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </span>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {adminData?.name ? getInitials(adminData.name) : 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
            {adminData?.name || 'Admin'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {adminData?.email || ''}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div 
                className="flex items-center justify-between px-2 py-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="text-sm">Maintenance Mode</span>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={(checked) => {
                    toggleMaintenanceMutation.mutate(checked);
                  }}
                  disabled={toggleMaintenanceMutation.isPending}
                />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleViewProfile} className="cursor-pointer">
                <User className="mr-2 h-4 w-4 hover:text-white" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive hover:text-white!">
                <LogOut className="mr-2 h-4 w-4 hover:text-white!" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Profile Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Profile</DialogTitle>
            <DialogDescription>
              Update your profile information. Leave password fields empty to keep the current password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Leave empty to keep current password"
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 8 characters. Leave empty to keep current password.
              </p>
            </div>

            {formData.password && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  minLength={8}
                />
              </div>
            )}

            <DialogFooter>
        <Button
                type="button"
                variant="outline"
                onClick={() => setIsProfileDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Profile'}
        </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <AdminHelpDialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen} />
    </>
  );
};

export default AdminNavbar;

