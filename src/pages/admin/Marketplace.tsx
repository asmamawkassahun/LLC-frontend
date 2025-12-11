import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { toast } from 'sonner';
import { Plus, X, MoreVertical, Edit, Trash2, CheckCircle2, XCircle, Check, FileText, Eye, Download } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
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
import { Progress } from '@/components/ui/progress';

const AdminMarketplacePage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'services' | 'orders'>('services');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requirements: [] as string[],
    price: '',
    is_active: true,
  });
  const [requirementInput, setRequirementInput] = useState('');
  const [uploadingOrderId, setUploadingOrderId] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [fileManagementModalOpen, setFileManagementModalOpen] = useState(false);
  const [selectedOrderForFiles, setSelectedOrderForFiles] = useState<any>(null);
  const [orderFiles, setOrderFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviewList, setFilePreviewList] = useState<Array<{file: File, id: string}>>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-marketplace'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/marketplace/services');
      return response.data;
    },
    enabled: activeTab === 'services',
  });

  const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['admin-marketplace-orders'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/marketplace/orders');
      return response.data;
    },
    enabled: activeTab === 'orders',
  });

  // Populate form when editing
  useEffect(() => {
    if (editingService && isDialogOpen) {
      setFormData({
        name: editingService.name || '',
        description: editingService.description || '',
        requirements: Array.isArray(editingService.requirements) ? editingService.requirements : [],
        price: editingService.price?.toString() || '',
        is_active: editingService.is_active ?? true,
      });
      setRequirementInput('');
    } else if (!editingService && isDialogOpen) {
      // Reset form for new service
      setFormData({
        name: '',
        description: '',
        requirements: [],
        price: '',
        is_active: true,
      });
      setRequirementInput('');
    }
  }, [editingService, isDialogOpen]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      requirements: [],
      price: '',
      is_active: true,
    });
    setRequirementInput('');
  };

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.post(`/admin/marketplace/services/${id}/toggle-status`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace'] });
      toast.success('Service status updated');
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: async (data: any) => {
      await adminApiClient.post('/admin/marketplace/services', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace'] });
      toast.success('Marketplace service created successfully');
      handleCloseDialog();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create service';
      toast.error(errorMessage);
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await adminApiClient.put(`/admin/marketplace/services/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace'] });
      toast.success('Marketplace service updated successfully');
      handleCloseDialog();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update service';
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/admin/marketplace/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace'] });
      toast.success('Service deleted successfully');
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete service';
      toast.error(errorMessage);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    },
  });

  const acceptOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.post(`/admin/marketplace/orders/${id}/accept`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace-orders'] });
      toast.success('Marketplace order accepted successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to accept order';
      toast.error(errorMessage);
    },
  });

  const handleFileUpload = async (orderId: string, files: File[]) => {
    if (!files || files.length === 0) return;

    // Cancel any existing upload
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this upload
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setUploadingOrderId(orderId);
    setUploadProgress(0);
    setUploadingFileName(`${files.length} file(s)`);

    try {
      const formData = new FormData();
      // Use 'files' as the key - Laravel will handle it as an array when multiple files are appended
      files.forEach((file) => {
        formData.append('files[]', file);
      });

      // Debug: Log FormData contents
      console.log('Uploading files:', files.length);
      for (const [key, value] of formData.entries()) {
        console.log('FormData key:', key, 'value:', value instanceof File ? `${value.name} (${value.size} bytes)` : value);
      }

      const response = await adminApiClient.post(`/admin/marketplace/orders/${orderId}/upload`, formData, {
        // Don't set Content-Type header - axios will set it automatically with the correct boundary
        signal: abortController.signal,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });

      // Check if response indicates success
      console.log('Upload response:', response.data);
      
      if (response.status === 200 || response.status === 201) {
        const successMessage = response.data?.message || `${files.length} file(s) uploaded successfully`;
        toast.success(successMessage);
        
        // Clear selected files immediately
        setSelectedFiles([]);
        setFilePreviewList([]);
        
        // Reset file input
        if (fileInputRefs.current[orderId]) {
          fileInputRefs.current[orderId]!.value = '';
        }
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['admin-marketplace-orders'] });
        
        // Refresh files if modal is open - wait a bit to ensure backend has saved
        if (selectedOrderForFiles?.id === orderId) {
          // Small delay to ensure backend has processed
          setTimeout(() => {
            fetchOrderFiles(orderId);
          }, 300);
        }
      } else {
        throw new Error('Upload failed with unexpected status: ' + response.status);
      }
    } catch (error: any) {
      // Check if the request was canceled
      if (axios.isCancel(error) || error.name === 'CanceledError' || error.name === 'AbortError' || error.message?.includes('canceled')) {
        toast.info('Upload canceled');
      } else {
        // Log full error for debugging
        console.error('Upload error:', error);
        console.error('Error response:', error.response?.data);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to upload files';
        toast.error(errorMessage);
        
        // Don't clear files on error - let user retry
        // Only clear if it was a validation error
        if (error.response?.status === 422) {
          setSelectedFiles([]);
          setFilePreviewList([]);
        }
      }
    } finally {
      setUploadingOrderId(null);
      setUploadProgress(0);
      setUploadingFileName(null);
      abortControllerRef.current = null;
    }
  };

  const handleSaveFiles = () => {
    if (selectedOrderForFiles && selectedFiles.length > 0) {
      handleFileUpload(selectedOrderForFiles.id, selectedFiles);
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setUploadingOrderId(null);
    setUploadProgress(0);
    setUploadingFileName(null);
    
    // Reset file input
    if (selectedOrderForFiles) {
      const orderId = selectedOrderForFiles.id;
      if (fileInputRefs.current[orderId]) {
        fileInputRefs.current[orderId]!.value = '';
      }
    }
  };

  const handleFileSelect = (orderId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(file => ({
        file,
        id: `${Date.now()}_${Math.random()}`
      }));
      setFilePreviewList(prev => [...prev, ...newFiles]);
      setSelectedFiles(prev => [...prev, ...Array.from(files)]);
    }
    
    // Reset input
    if (fileInputRefs.current[orderId]) {
      fileInputRefs.current[orderId]!.value = '';
    }
  };

  const handleRemoveFileFromList = (fileId: string) => {
    setFilePreviewList(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        setSelectedFiles(prevFiles => prevFiles.filter(f => f !== fileToRemove.file));
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const fetchOrderFiles = async (orderId: string) => {
    try {
      setLoadingFiles(true);
      const response = await adminApiClient.get(`/admin/marketplace/orders/${orderId}/files`);
      console.log('Fetched files response:', response.data);
      setOrderFiles(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching files:', error);
      console.error('Error response:', error.response?.data);
      setOrderFiles([]);
      toast.error('Failed to fetch uploaded files');
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleOpenFileManagement = (order: any) => {
    setSelectedOrderForFiles(order);
    setFileManagementModalOpen(true);
    fetchOrderFiles(order.id);
  };

  const handleCloseFileManagement = () => {
    // Cancel any ongoing upload
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setFileManagementModalOpen(false);
    setSelectedOrderForFiles(null);
    setOrderFiles([]);
    setUploadProgress(0);
    setUploadingFileName(null);
    setUploadingOrderId(null);
    setSelectedFiles([]);
    setFilePreviewList([]);
  };

  const handleDeleteClick = (service: any) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      deleteMutation.mutate(serviceToDelete.id);
    }
  };

  const handleEditClick = (service: any) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()],
      }));
      setRequirementInput('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleRequirementKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRequirement();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        requirements: formData.requirements.length > 0 ? formData.requirements : null,
        price: parseFloat(formData.price),
        is_active: formData.is_active,
      };

      if (editingService) {
        updateServiceMutation.mutate({ id: editingService.id, data: payload });
      } else {
        createServiceMutation.mutate(payload);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || (editingService ? 'Failed to update service' : 'Failed to create service');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex  bg-foreground/5 rounded-md p-1">
        <div className="flex gap-4 items-center justify-between w-full">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 font-medium transition-colors cursor-pointer w-full ${activeTab === 'services'
                ? 'bg-background text-primary rounded-md'
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Marketplace Services
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-medium transition-colors cursor-pointer w-full ${activeTab === 'orders'
                ? 'bg-background text-primary rounded-md'
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Marketplace Orders
          </button>
        </div>

      </div>

      {/* Marketplace Services Tab */}
      {activeTab === 'services' && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Marketplace Services</h1>
              <p className="text-muted-foreground">Manage marketplace services</p>
            </div>
            <div>
              {/* {activeTab === 'services' && ( */}
              <Button className="cursor-pointer" onClick={() => { setEditingService(null); setIsDialogOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
              {/* )} */}
            </div>
          </div>

          {/* Add Service Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingService ? 'Edit Marketplace Service' : 'Add New Marketplace Service'}</DialogTitle>
                <DialogDescription>
                  {editingService ? 'Update marketplace service information' : 'Create a new marketplace service with name, description, requirements, and price.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Service Name"
                    required
                    maxLength={255}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter service description"
                    required
                    rows={4}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements</Label>
                  <Input
                    id="requirements"
                    type="text"
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    onKeyPress={handleRequirementKeyPress}
                    placeholder="Enter requirement and press Enter"
                  />
                  <p className="text-xs text-muted-foreground">
                    Press Enter to add each requirement
                  </p>

                  {/* Display added requirements */}
                  {formData.requirements.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {formData.requirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          <span className="flex-1 text-sm">{req}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRequirement(index)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
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
                  <Button type="button" variant="outline" className="cursor-pointer" onClick={handleCloseDialog} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Card>
            <CardHeader>
              <CardTitle>All Services</CardTitle>
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
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data?.map((service: any) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>{formatCurrency(service.price)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${service.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {service.is_active ? 'Active' : 'Inactive'}
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
                                onClick={() => handleEditClick(service)}
                              >
                                <Edit className="mr-2 h-4 w-4 hover:text-white" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => toggleStatusMutation.mutate(service.id)}
                              >
                                {service.is_active ? (
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
                                onClick={() => handleDeleteClick(service)}
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

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the marketplace service{' '}
                  <span className="font-semibold">{serviceToDelete?.name}</span>.
                  {serviceToDelete?.marketplaceOrders?.length > 0 && (
                    <span className="block mt-2 text-destructive">
                      Warning: This service has associated orders and cannot be deleted.
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setServiceToDelete(null)}>
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
      )}

      {/* Marketplace Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Marketplace Orders</h1>
              <p className="text-muted-foreground">Manage all marketplace orders</p>

            </div>
            
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Marketplace Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Company Status</TableHead>
                      <TableHead>Service Order Number</TableHead>
                      <TableHead>User Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Order Created Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersData?.data?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          No marketplace orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      ordersData?.data?.map((order: any) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.company?.name || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${order.company?.status === 'formed'
                                ? 'bg-green-100 text-green-800'
                                : order.company?.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                              {order.company?.status ? order.company.status.charAt(0).toUpperCase() + order.company.status.slice(1) : 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {order.service_order_number ? order.service_order_number : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {order.user?.name || order.user?.email || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${order.status === 'provided'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                              {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'N/A'}
                            </span>
                          </TableCell>
                          
                          <TableCell>
                            {order.created_at ? formatDate(order.created_at) : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <input
                              ref={(el) => {
                                fileInputRefs.current[order.id] = el;
                              }}
                              type="file"
                              id={`file-upload-${order.id}`}
                              className="hidden"
                              onChange={(e) => handleFileSelect(order.id, e)}
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              disabled={uploadingOrderId === order.id}
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-12 bg-accent hover:bg-accent/90 border-none cursor-pointer">
                                  <MoreVertical className="h-4 w-4 text-white" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {order.status === 'pending' && (
                                  <DropdownMenuItem
                                    onClick={() => acceptOrderMutation.mutate(order.id)}
                                    disabled={acceptOrderMutation.isPending}
                                  >
                                    <Check className="mr-2 h-4 w-4 hover:text-white" />
                                    Accept Order
                                  </DropdownMenuItem>
                                )}
                                {order.status === 'pending' && <DropdownMenuSeparator />}
                                <DropdownMenuItem
                                  onClick={() => handleOpenFileManagement(order)}
                                >
                                  <FileText className="mr-2 h-4 w-4 hover:text-white" />
                                  File Management
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4 hover:text-white" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* File Management Modal */}
          <Dialog open={fileManagementModalOpen} onOpenChange={handleCloseFileManagement}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>File Management</DialogTitle>
                <DialogDescription>
                  Upload and manage files for order: {selectedOrderForFiles?.service_order_number || 'N/A'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Upload Section */}
                <div className="space-y-2">
                  <Label htmlFor="file-upload-modal">Upload Files</Label>
                  <Input
                    ref={(el) => {
                      if (selectedOrderForFiles) {
                        fileInputRefs.current[selectedOrderForFiles.id] = el;
                      }
                    }}
                    type="file"
                    id="file-upload-modal"
                    multiple
                    onChange={(e) => {
                      if (selectedOrderForFiles) {
                        handleFileSelect(selectedOrderForFiles.id, e);
                      }
                    }}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    disabled={uploadingOrderId === selectedOrderForFiles?.id}
                  />
                  
                  {/* File Preview List */}
                  {filePreviewList.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {filePreviewList.map((fileItem) => (
                        <div key={fileItem.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{fileItem.file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(fileItem.file.size / 1024).toFixed(2)} KB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFileFromList(fileItem.id)}
                            className="cursor-pointer"
                            disabled={uploadingOrderId === selectedOrderForFiles?.id}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Upload Progress */}
                  {uploadingOrderId === selectedOrderForFiles?.id && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{uploadingFileName || 'Uploading...'}</p>
                          <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelUpload}
                          className="ml-2 cursor-pointer"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                  
                  {/* Save Button */}
                  {filePreviewList.length > 0 && uploadingOrderId !== selectedOrderForFiles?.id && (
                    <Button
                      onClick={handleSaveFiles}
                      className="w-full cursor-pointer"
                      disabled={uploadingOrderId === selectedOrderForFiles?.id}
                    >
                      Save {filePreviewList.length} File(s)
                    </Button>
                  )}
                </div>

                {/* Files List */}
                <div className="space-y-2">
                  <Label>Uploaded Files</Label>
                  {loadingFiles ? (
                    <div className="text-sm text-muted-foreground">Loading files...</div>
                  ) : orderFiles.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-md">
                      No files uploaded yet
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {orderFiles.map((file: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{file.file_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(file.file_url, '_blank')}
                              className="cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(file.file_url, '_blank')}
                              className="cursor-pointer"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseFileManagement} className="cursor-pointer">
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default AdminMarketplacePage;

