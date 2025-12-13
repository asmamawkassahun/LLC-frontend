import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/formatters';
import { toast } from 'sonner';
import { Plus, MoreVertical, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminPromoCodesPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promoCodeToDelete, setPromoCodeToDelete] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    min_purchase_amount: '',
    max_discount_amount: '',
    usage_limit: '',
    valid_from: '',
    valid_until: '',
    is_active: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-promo-codes'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/promo-codes');
      return response.data;
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.post(`/admin/promo-codes/${id}/toggle-status`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promo-codes'] });
      toast.success('Promo code status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update promo code status');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/admin/promo-codes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promo-codes'] });
      toast.success('Promo code deleted successfully');
      setDeleteDialogOpen(false);
      setPromoCodeToDelete(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete promo code';
      toast.error(errorMessage);
      setDeleteDialogOpen(false);
      setPromoCodeToDelete(null);
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (editingPromoCode && isDialogOpen) {
      setFormData({
        code: editingPromoCode.code || '',
        type: editingPromoCode.type || 'percentage',
        value: editingPromoCode.value?.toString() || '',
        min_purchase_amount: editingPromoCode.min_purchase_amount?.toString() || '',
        max_discount_amount: editingPromoCode.max_discount_amount?.toString() || '',
        usage_limit: editingPromoCode.usage_limit?.toString() || '',
        valid_from: editingPromoCode.valid_from ? new Date(editingPromoCode.valid_from).toISOString().slice(0, 16) : '',
        valid_until: editingPromoCode.valid_until ? new Date(editingPromoCode.valid_until).toISOString().slice(0, 16) : '',
        is_active: editingPromoCode.is_active ?? true,
      });
    } else if (!editingPromoCode && isDialogOpen) {
      // Reset form for new promo code
      const now = new Date();
      const oneYearLater = new Date(now);
      oneYearLater.setFullYear(now.getFullYear() + 1);
      
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        min_purchase_amount: '',
        max_discount_amount: '',
        usage_limit: '',
        valid_from: now.toISOString().slice(0, 16),
        valid_until: oneYearLater.toISOString().slice(0, 16),
        is_active: true,
      });
    }
  }, [editingPromoCode, isDialogOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = {
        code: formData.code,
        type: formData.type,
        value: parseFloat(formData.value),
        is_active: formData.is_active,
      };

      if (formData.min_purchase_amount) {
        payload.min_purchase_amount = parseFloat(formData.min_purchase_amount);
      }
      if (formData.max_discount_amount) {
        payload.max_discount_amount = parseFloat(formData.max_discount_amount);
      }
      if (formData.usage_limit) {
        payload.usage_limit = parseInt(formData.usage_limit);
      }
      if (formData.valid_from) {
        payload.valid_from = new Date(formData.valid_from).toISOString();
      }
      if (formData.valid_until) {
        payload.valid_until = new Date(formData.valid_until).toISOString();
      }

      if (editingPromoCode) {
        await adminApiClient.put(`/admin/promo-codes/${editingPromoCode.id}`, payload);
        toast.success('Promo code updated successfully');
      } else {
        await adminApiClient.post('/admin/promo-codes', payload);
        toast.success('Promo code created successfully');
      }

      queryClient.invalidateQueries({ queryKey: ['admin-promo-codes'] });
      handleCloseDialog();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to save promo code';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPromoCode(null);
    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(now.getFullYear() + 1);
    
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      min_purchase_amount: '',
      max_discount_amount: '',
      usage_limit: '',
      valid_from: now.toISOString().slice(0, 16),
      valid_until: oneYearLater.toISOString().slice(0, 16),
      is_active: true,
    });
  };

  const handleDeleteClick = (promoCode: any) => {
    setPromoCodeToDelete(promoCode);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (promoCodeToDelete) {
      deleteMutation.mutate(promoCodeToDelete.id);
    }
  };

  const handleEditClick = (promoCode: any) => {
    setEditingPromoCode(promoCode);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Promo Codes</h1>
          <p className="text-muted-foreground">Manage promo codes</p>
        </div>
        <Button className='cursor-pointer' onClick={() => { setEditingPromoCode(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:block">Add Promo Code</span>
        </Button>
      </div>

      {/* Add/Edit Promo Code Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPromoCode ? 'Edit Promo Code' : 'Add New Promo Code'}</DialogTitle>
            <DialogDescription>
              {editingPromoCode ? 'Update promo code information' : 'Create a new promo code for discounts'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="WELCOME10"
                required
                maxLength={50}
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Value */}
            <div className="space-y-2">
              <Label htmlFor="value">Value *</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder={formData.type === 'percentage' ? '10.00' : '50.00'}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.type === 'percentage' ? 'Percentage discount (e.g., 10 for 10%)' : 'Fixed discount amount'}
              </p>
            </div>

            {/* Min Purchase Amount */}
            <div className="space-y-2">
              <Label htmlFor="min_purchase_amount">Minimum Purchase Amount</Label>
              <Input
                id="min_purchase_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.min_purchase_amount}
                onChange={(e) => setFormData({ ...formData, min_purchase_amount: e.target.value })}
                placeholder="0.00 (optional)"
              />
            </div>

            {/* Max Discount Amount */}
            <div className="space-y-2">
              <Label htmlFor="max_discount_amount">Maximum Discount Amount</Label>
              <Input
                id="max_discount_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.max_discount_amount}
                onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                placeholder="0.00 (optional)"
              />
              <p className="text-xs text-muted-foreground">
                Maximum discount that can be applied (useful for percentage discounts)
              </p>
            </div>

            {/* Usage Limit */}
            <div className="space-y-2">
              <Label htmlFor="usage_limit">Usage Limit</Label>
              <Input
                id="usage_limit"
                type="number"
                min="1"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                placeholder="Leave empty for unlimited"
              />
            </div>

            {/* Valid From */}
            <div className="space-y-2">
              <Label htmlFor="valid_from">Valid From *</Label>
              <Input
                id="valid_from"
                type="datetime-local"
                value={formData.valid_from}
                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                required
              />
            </div>

            {/* Valid Until */}
            <div className="space-y-2">
              <Label htmlFor="valid_until">Valid Until *</Label>
              <Input
                id="valid_until"
                type="datetime-local"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                required
              />
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
                {isSubmitting ? 'Saving...' : editingPromoCode ? 'Update Promo Code' : 'Create Promo Code'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>All Promo Codes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table className='min-w-[660px]!'>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((promo: any) => {
                  const isExpired = promo.valid_until ? new Date(promo.valid_until) < new Date() : false;
                  const getStatusInfo = () => {
                    if (isExpired) {
                      return { text: 'Expired', className: 'bg-red-100 text-red-800' };
                    }
                    return promo.is_active 
                      ? { text: 'Active', className: 'bg-green-100 text-green-800' }
                      : { text: 'Inactive', className: 'bg-gray-100 text-gray-800' };
                  };
                  const statusInfo = getStatusInfo();

                  return (
                  <TableRow key={promo.id}>
                    <TableCell className="font-medium">{promo.code}</TableCell>
                    <TableCell className="capitalize">{promo.type}</TableCell>
                    <TableCell>
                      {promo.type === 'percentage' ? `${promo.value}%` : `$${promo.value}`}
                    </TableCell>
                    <TableCell>{promo.used_count} / {promo.usage_limit || '∞'}</TableCell>
                    <TableCell>{promo.valid_until ? formatDate(promo.valid_until) : 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${statusInfo.className}`}>
                        {statusInfo.text}
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
                            onClick={() => handleEditClick(promo)}
                          >
                            <Edit className="mr-2 h-4 w-4 hover:text-white" />
                            Edit
                          </DropdownMenuItem>
                          {!isExpired && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => toggleStatusMutation.mutate(promo.id)}
                              >
                                {promo.is_active ? (
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
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(promo)}
                            className="text-destructive focus:text-destructive hover:text-white! "
                          >
                            <Trash2 className="mr-2 h-4 w-4 hover:text-white" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  );
                })}
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
              This action cannot be undone. This will permanently delete the promo code{' '}
              <span className="font-semibold">{promoCodeToDelete?.code}</span>.
              {promoCodeToDelete?.used_count > 0 && (
                <span className="block mt-2 text-destructive">
                  Warning: This promo code has been used {promoCodeToDelete.used_count} time(s) and may not be deletable.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPromoCodeToDelete(null)}>
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

export default AdminPromoCodesPage;

