import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/formatters';
import { toast } from 'sonner';
import { MoreVertical, Check, FileText, Trash2, Eye, Download, X } from 'lucide-react';
import { useState, useRef } from 'react';
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

const MarketplaceOrders = () => {
  const queryClient = useQueryClient();
  const [deleteOrderDialogOpen, setDeleteOrderDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<any>(null);
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

  const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['admin-marketplace-orders'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/marketplace/orders');
      return response.data;
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

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.delete(`/admin/marketplace/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-marketplace-orders'] });
      toast.success('Marketplace order deleted successfully');
      setDeleteOrderDialogOpen(false);
      setOrderToDelete(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete order';
      toast.error(errorMessage);
      setDeleteOrderDialogOpen(false);
      setOrderToDelete(null);
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
      setOrderFiles(response.data.data || []);
    } catch (error: any) {
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

  const handleDeleteOrderClick = (order: any) => {
    setOrderToDelete(order);
    setDeleteOrderDialogOpen(true);
  };

  const handleConfirmDeleteOrder = () => {
    if (orderToDelete) {
      deleteOrderMutation.mutate(orderToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold"><span className="hidden sm:inline">Marketplace</span> Orders</h1>
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
            <Table className='min-w-[860px]!'>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Company Status</TableHead>
                  <TableHead>Service Order Number</TableHead>
                  <TableHead>Amount</TableHead>
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
                      <TableCell className="font-medium">
                        {order.amount ? `$${Number(order.amount).toFixed(2)}` : 'N/A'}
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
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteOrderClick(order);
                              }}
                              className="text-destructive focus:text-destructive hover:text-white!"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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

      {/* Delete Order Confirmation Dialog */}
      <AlertDialog 
        open={deleteOrderDialogOpen}
        onOpenChange={(open) => {
          setDeleteOrderDialogOpen(open);
          if (!open) {
            setOrderToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the marketplace order{' '}
              <span className="font-semibold">
                {orderToDelete?.service_order_number || `#${orderToDelete?.id}`}
              </span>
              {' '}and all associated files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setDeleteOrderDialogOpen(false);
                setOrderToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteOrder}
              disabled={deleteOrderMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteOrderMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MarketplaceOrders;

