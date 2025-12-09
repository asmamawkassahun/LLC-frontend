import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import adminAuthService from '@/services/adminAuthService';
import { ROUTES } from '@/constants/routes';
import { LogOut, User, Settings } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { useState, useEffect } from 'react';
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

const AdminNavbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
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
                    setMaintenanceMode(checked);
                    toast.success(`Maintenance mode ${checked ? 'enabled' : 'disabled'}`);
                  }}
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
    </>
  );
};

export default AdminNavbar;

