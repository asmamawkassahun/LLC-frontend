import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Plus, X, MoreVertical, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const RegisteredAgentAddresses = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country_id: '',
    is_active: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-registered-agent-addresses'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/registered-agent-addresses');
      return response.data;
    },
  });

  const { data: countriesData } = useQuery({
    queryKey: ['admin-countries'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/countries');
      return response.data;
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (editingAddress && isDialogOpen) {
      setFormData({
        address: editingAddress.address || '',
        city: editingAddress.city || '',
        state: editingAddress.state || '',
        postal_code: editingAddress.postal_code || '',
        country_id: editingAddress.country_id?.toString() || '',
        is_active: editingAddress.is_active ?? true,
      });
    } else if (!editingAddress && isDialogOpen) {
      // Reset form for new address
      setFormData({
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country_id: '',
        is_active: true,
      });
    }
  }, [editingAddress, isDialogOpen]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAddress(null);
    setFormData({
      address: '',
      city: '',
      state: '',
      postal_code: '',
      country_id: '',
      is_active: true,
    });
  };

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.post(`/admin/registered-agent-addresses/${id}/toggle-status`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-registered-agent-addresses'] });
      toast.success('Address status updated');
    },
  });

  const createAddressMutation = useMutation({
    mutationFn: async (data: any) => {
      await adminApiClient.post('/admin/registered-agent-addresses', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-registered-agent-addresses'] });
      toast.success('Registered agent address created successfully');
      handleCloseDialog();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create address';
      toast.error(errorMessage);
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await adminApiClient.put(`/admin/registered-agent-addresses/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-registered-agent-addresses'] });
      toast.success('Registered agent address updated successfully');
      handleCloseDialog();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update address';
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/admin/registered-agent-addresses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-registered-agent-addresses'] });
      toast.success('Address deleted successfully');
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete address';
      toast.error(errorMessage);
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    },
  });

  const handleDeleteClick = (address: any) => {
    setAddressToDelete(address);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (addressToDelete) {
      deleteMutation.mutate(addressToDelete.id);
    }
  };

  const handleEditClick = (address: any) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country_id: parseInt(formData.country_id),
        is_active: formData.is_active,
      };

      if (editingAddress) {
        updateAddressMutation.mutate({ id: editingAddress.id, data: payload });
      } else {
        createAddressMutation.mutate(payload);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || (editingAddress ? 'Failed to update address' : 'Failed to create address');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold"><span className='hidden sm:inline'>Registered Agent</span> Addresses</h1>
          <p className="text-muted-foreground">Manage registered agent addresses</p>
        </div>
        <div>
          <Button className="cursor-pointer" onClick={() => { setEditingAddress(null); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:block">Add Address</span>
          </Button>
        </div>
      </div>

      {/* Add/Edit Address Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Registered Agent Address' : 'Add New Registered Agent Address'}</DialogTitle>
            <DialogDescription>
              {editingAddress ? 'Update registered agent address information' : 'Create a new registered agent address.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street Address"
                required
                maxLength={255}
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
                required
                maxLength={255}
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="State"
                required
                maxLength={255}
              />
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code *</Label>
              <Input
                id="postal_code"
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                placeholder="Postal Code"
                required
                maxLength={255}
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country_id">Country *</Label>
              <Select
                value={formData.country_id}
                onValueChange={(value) => setFormData({ ...formData, country_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countriesData?.map((country: any) => (
                    <SelectItem key={country.id} value={country.id.toString()}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Is Active */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" className="cursor-pointer" onClick={handleCloseDialog} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingAddress ? 'Update Address' : 'Create Address'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>All Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table className='min-w-[560px]!'>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Postal Code</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((address: any) => (
                  <TableRow key={address.id}>
                    <TableCell className="font-medium">{address.address}</TableCell>
                    <TableCell>{address.city}</TableCell>
                    <TableCell>{address.state}</TableCell>
                    <TableCell>{address.postal_code}</TableCell>
                    <TableCell>{address.country?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${address.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {address.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-12 bg-accent hover:bg-accent/90 border-none cursor-pointer">
                            <MoreVertical className="h-4 w-4 text-white" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditClick(address)}
                          >
                            <Edit className="mr-2 h-4 w-4 hover:text-white" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => toggleStatusMutation.mutate(address.id)}
                          >
                            {address.is_active ? (
                              <>
                                <XCircle className="mr-2 h-4 w-4 hover:text-white" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4 hover:text-white" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(address)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4 hover:text-white" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Address Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the registered agent address{' '}
              <span className="font-semibold">{addressToDelete?.address}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAddressToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RegisteredAgentAddresses;

