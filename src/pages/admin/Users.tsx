import { useQuery, useQueryClient } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/formatters';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Edit, MoreVertical, Trash2, UserMinus, UserPlus, Eye, EyeOff } from 'lucide-react';
import { getUniqueCountries } from '@/constants/countries';
import AddUserModal from './AddUserModal';

const AdminUsersPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    countryCode: '+1',
    password: '',
    passwordConfirmation: '',
  });
  const [originalPassword, setOriginalPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ['admin-users', search, page, perPage],
    queryFn: async () => {
      const params: any = { per_page: perPage, page };
      if (search) {
        params.search = search;
      }
      const response = await adminApiClient.get('/admin/users', { params });
      return response.data;
    },
  });

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['admin-user', selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return null;
      const response = await adminApiClient.get(`/admin/users/${selectedUserId}`);
      return response.data;
    },
    enabled: !!selectedUserId && isEditModalOpen,
  });

  const handleEdit = (userId: string) => {
    setSelectedUserId(userId);
    setIsEditModalOpen(true);
  };

  // Parse user data and populate form when user data is loaded
  useEffect(() => {
    if (userData && isEditModalOpen) {
      // Parse name into first and last name
      const nameParts = (userData.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Parse phone number - extract country code from phone number first (most reliable)
      let countryCode = '+1'; // Default
      let phoneNumber = '';
      const countries = getUniqueCountries();

      if (userData.phone) {
        // Phone number starts with +, try to extract country code
        if (userData.phone.startsWith('+')) {
          // Try to match known country codes (1-4 digits) from longest to shortest
          // This ensures we match "+251" before trying "+2" or "+25"
          let matched = false;
          for (let length = 4; length >= 1; length--) {
            const potentialCode = userData.phone.substring(0, 1 + length); // + and digits
            const countryMatch = countries.find(c => c.code === potentialCode);
            if (countryMatch) {
              countryCode = potentialCode;
              phoneNumber = userData.phone.substring(1 + length); // Everything after country code
              matched = true;
              break;
            }
          }

          // If no match found in country list, fallback to regex (extract first 1-4 digits)
          if (!matched) {
            const phoneMatch = userData.phone.match(/^(\+\d{1,4})(.*)$/);
            if (phoneMatch) {
              countryCode = phoneMatch[1];
              phoneNumber = phoneMatch[2];
            } else {
              phoneNumber = userData.phone.substring(1); // Remove the +
            }
          }
        } else {
          // Phone doesn't start with +, use as-is
          phoneNumber = userData.phone;
          // Try to find country code from country field as fallback
          if (userData.country) {
            const countryMatch = countries.find(
              (c) => c.name.toLowerCase() === userData.country.toLowerCase()
            );
            if (countryMatch) {
              countryCode = countryMatch.code;
            }
          }
        }
      } else {
        // No phone number, try to get country code from country field
        if (userData.country) {
          const countryMatch = countries.find(
            (c) => c.name.toLowerCase() === userData.country.toLowerCase()
          );
          if (countryMatch) {
            countryCode = countryMatch.code;
          }
        }
      }

      // Get the actual password from the API (decrypted by backend for admin)
      const actualPassword = userData.password || '';

      setFormData({
        firstName,
        lastName,
        email: userData.email || '',
        phoneNumber,
        countryCode,
        password: actualPassword,
        passwordConfirmation: '',
      });
      setOriginalPassword(actualPassword);
    }
  }, [userData, isEditModalOpen]);

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUserId(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      countryCode: '+1',
      password: '',
      passwordConfirmation: '',
    });
    setOriginalPassword('');
    setShowPassword(false);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Check if password has been changed
      const trimmedPassword = formData.password?.trim() || '';
      const isPasswordChanged = trimmedPassword !== '' && trimmedPassword !== originalPassword;

      // Validate password if it's been changed
      if (isPasswordChanged) {
        if (trimmedPassword.length < 8) {
          toast.error('Password must be at least 8 characters');
          setIsSubmitting(false);
          return;
        }
      }

      // Get country name from country code
      const countries = getUniqueCountries();
      const selectedCountry = countries.find(c => c.code === formData.countryCode);
      const countryName = selectedCountry ? selectedCountry.name : null;

      // Prepare update data
      const updateData: any = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email.trim(),
      };

      // Always include country if we have a country code
      if (countryName) {
        updateData.country = countryName;
      }

      // Include phone if provided
      if (formData.phoneNumber && formData.phoneNumber.trim() !== '') {
        updateData.phone = `${formData.countryCode}${formData.phoneNumber}`;
      } else {
        // Allow clearing phone number
        updateData.phone = null;
      }

      // Only include password if it's been changed
      if (isPasswordChanged) {
        updateData.password = trimmedPassword;
      }

      await adminApiClient.put(`/admin/users/${selectedUserId}`, updateData);

      // Invalidate and refetch the specific user query to get fresh data with updated password
      await queryClient.invalidateQueries({ queryKey: ['admin-user', selectedUserId] });
      await queryClient.refetchQueries({ queryKey: ['admin-user', selectedUserId] });

      toast.success('User updated successfully');
      handleCloseModal();
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      await adminApiClient.delete(`/admin/users/${userId}`);
      toast.success('User deleted');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeactivate = async (userId: string) => {
    try {
      await adminApiClient.post(`/admin/users/${userId}/deactivate`);
      toast.success('User deactivated');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to deactivate user');
    }
  };

  const handleActivate = async (userId: string) => {
    try {
      await adminApiClient.put(`/admin/users/${userId}`, { is_active: true });
      toast.success('User activated');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to activate user');
    }
  };

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when search changes
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value));
    setPage(1); // Reset to first page when per_page changes
  };

  const currentPage = data?.current_page || 1;
  const lastPage = data?.last_page || 1;
  const total = data?.total || 0;
  const from = total > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const to = Math.min(currentPage * perPage, total);

  const countries = getUniqueCountries();
  const selectedCountry = countries.find(c => c.code === formData.countryCode) || countries[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage all users</p>
      </div>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Leave password fields empty to keep the current password.
            </DialogDescription>
          </DialogHeader>
          {isLoadingUser ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {/* Phone Number with Country Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <div className="flex gap-2">
                  <Select
                    key={`country-select-${selectedUserId}-${formData.countryCode}`}
                    value={formData.countryCode}
                    onValueChange={(value) => setFormData({ ...formData, countryCode: value })}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue>
                        <span className="flex items-center gap-2">
                          <span>{selectedCountry.flag}</span>
                          <span>{selectedCountry.code}</span>
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {countries.map((country) => (
                        <SelectItem key={`${country.code}-${country.name}`} value={country.code}>
                          <span className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                            <span className="text-muted-foreground">{country.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    placeholder="201-555-0123"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium"> Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formData.password === originalPassword
                    ? 'Current password is displayed. Change it to update.'
                    : 'Password will be updated when you save'}
                </p>
              </div>

              {/* Password Confirmation (Only show if password is provided) */}
              {/* {formData.password && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={formData.passwordConfirmation}
                      onChange={(e) => setFormData({ ...formData, passwordConfirmation: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )} */}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update User'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Add User Modal */}
      <AddUserModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={refetch}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <Button onClick={handleAddUser}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
          <div className="flex  items-center gap-2">
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-[300px]"
              />
            </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">Error loading users</p>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <>
              <Table className='min-w-[760px]!'>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 bg-accent hover:bg-accent/90 border-none cursor-pointer">
                              <MoreVertical className="h-4 w-4 text-white" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEdit(user.id)}
                            >
                              <Edit className="mr-2 h-4 w-4 hover:text-white" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.is_active ? (
                              <DropdownMenuItem
                                onClick={() => handleDeactivate(user.id)}
                                variant="destructive"
                              >
                                <UserMinus className="mr-2 h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleActivate(user.id)}
                              >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(user.id)}
                              variant="destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground hidden sm:block">
                  Showing {from} to {to} of {total} users
                </div>
                <div className="flex items-center gap-2">
                  <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                      <SelectItem value="100">100 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    <span className="hidden sm:block">Previous</span>
                  </Button>
                  <div className="text-sm text-muted-foreground hidden sm:block">
                    Page {currentPage} of {lastPage}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
                    disabled={currentPage === lastPage || isLoading}
                  >
                    <span className="hidden sm:block">Next</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;

