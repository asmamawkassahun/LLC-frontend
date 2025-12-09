import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, X, MoreVertical, CheckCircle2, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminPricingPlansPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formData, setFormData] = useState({
    type: 'Basic',
    country_id: '',
    base_price: '',
    yearly_price: '',
    description: [] as string[],
    is_active: true,
  });
  const [descriptionInput, setDescriptionInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-pricing-plans'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/pricing-plans');
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

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.post(`/admin/pricing-plans/${id}/toggle-status`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing-plans'] });
      toast.success('Plan status updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/admin/pricing-plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing-plans'] });
      toast.success('Plan deleted successfully');
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete plan';
      toast.error(errorMessage);
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    },
  });

  const handleDeleteClick = (plan: any) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (planToDelete) {
      deleteMutation.mutate(planToDelete.id);
    }
  };

  // Populate form when editing
  useEffect(() => {
    if (editingPlan && isDialogOpen) {
      // Extract type from name (e.g., "Basic_UK" -> "Basic")
      const type = editingPlan.name?.split('_')[0] || 'Basic';
      
      setFormData({
        type,
        country_id: editingPlan.country?.id?.toString() || '',
        base_price: editingPlan.base_price?.toString() || '',
        yearly_price: editingPlan.yearly_price?.toString() || '',
        description: Array.isArray(editingPlan.description) ? editingPlan.description : [],
        is_active: editingPlan.is_active ?? true,
      });
      setDescriptionInput('');
    } else if (!editingPlan && isDialogOpen) {
      // Reset form for new plan
      setFormData({
        type: 'Basic',
        country_id: '',
        base_price: '',
        yearly_price: '',
        description: [],
        is_active: true,
      });
      setDescriptionInput('');
    }
  }, [editingPlan, isDialogOpen]);

  const handleAddDescription = () => {
    if (descriptionInput.trim()) {
      setFormData({
        ...formData,
        description: [...formData.description, descriptionInput.trim()],
      });
      setDescriptionInput('');
    }
  };

  const handleRemoveDescription = (index: number) => {
    setFormData({
      ...formData,
      description: formData.description.filter((_, i) => i !== index),
    });
  };

  const handleDescriptionKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddDescription();
    }
  };

  const createOrUpdateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingPlan) {
        return await adminApiClient.put(`/admin/pricing-plans/${editingPlan.id}`, data);
      } else {
        return await adminApiClient.post('/admin/pricing-plans', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing-plans'] });
      toast.success(editingPlan ? 'Plan updated successfully' : 'Plan created successfully');
      setIsDialogOpen(false);
      setEditingPlan(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save plan');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.country_id || !formData.base_price) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      const submitData = {
        type: formData.type,
        country_id: parseInt(formData.country_id),
        base_price: parseFloat(formData.base_price),
        yearly_price: formData.yearly_price ? parseFloat(formData.yearly_price) : null,
        description: formData.description.length > 0 ? formData.description : null,
        is_active: formData.is_active,
      };

      await createOrUpdateMutation.mutateAsync(submitData);
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPlan(null);
    setFormData({
      type: 'Basic',
      country_id: '',
      base_price: '',
      yearly_price: '',
      description: [],
      is_active: true,
    });
    setDescriptionInput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pricing Plans</h1>
          <p className="text-muted-foreground">Manage pricing plans</p>
        </div>
        <Button className='cursor-pointer' onClick={() => { setEditingPlan(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Plan
        </Button>
      </div>

      {/* Add/Edit Plan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}</DialogTitle>
            <DialogDescription>
              {editingPlan ? 'Update pricing plan information' : 'Create a new pricing plan. Name will be auto-generated from type and country.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select value={formData.country_id} onValueChange={(value) => setFormData({ ...formData, country_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
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

            {/* Base Price */}
            <div className="space-y-2">
              <Label htmlFor="base_price">Base Price *</Label>
              <Input
                id="base_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.base_price}
                onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            {/* Yearly Price */}
            <div className="space-y-2">
              <Label htmlFor="yearly_price">Yearly Price</Label>
              <Input
                id="yearly_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.yearly_price}
                onChange={(e) => setFormData({ ...formData, yearly_price: e.target.value })}
                placeholder="0.00 (optional)"
              />
            </div>

            {/* Description Array Input */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                onKeyPress={handleDescriptionKeyPress}
                placeholder="Enter description item and press Enter"
              />
              <p className="text-xs text-muted-foreground">
                Press Enter to add each description item
              </p>
              
              {/* Display added descriptions */}
              {formData.description.length > 0 && (
                <div className="space-y-2 mt-2">
                  {formData.description.map((desc, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <span className="flex-1 text-sm">{desc}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDescription(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
              <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>All Pricing Plans</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Yearly Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((plan: any) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{formatCurrency(plan.base_price)}</TableCell>
                    <TableCell>{plan.yearly_price ? formatCurrency(plan.yearly_price) : 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        plan.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {plan.is_active ? 'Active' : 'Inactive'}
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
                            onClick={() => { setEditingPlan(plan); setIsDialogOpen(true); }}
                          >
                            <Edit className="mr-2 h-4 w-4 hover:text-white" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => toggleStatusMutation.mutate(plan.id)}
                          >
                            {plan.is_active ? (
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
                            onClick={() => handleDeleteClick(plan)}
                            className="text-destructive focus:text-destructive hover:text-white! "
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="mr-2 h-4 w-4 hover:text-white!" />
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the pricing plan{' '}
              <span className="font-semibold">{planToDelete?.name}</span>.
              {planToDelete?.orders?.length > 0 && (
                <span className="block mt-2 text-destructive">
                  Warning: This plan has associated orders and cannot be deleted.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPlanToDelete(null)}>
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
    </div>
  );
};

export default AdminPricingPlansPage;

