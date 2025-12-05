import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import DashboardHeader from "./DashboardHeader";
import OrdersTable, { type Order } from './OrdersTable';
import apiClient from '@/utils/api-helpers/apiClient';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HiExclamationTriangle } from 'react-icons/hi2';

interface ApiOrder {
    id: number;
    order_number: string;
    type: string;
    status: string;
    status_label?: string;
    payment_status: string;
    payment_status_label?: string;
    subtotal: number;
    tax_amount: number;
    total_amount: number;
    company?: {
        id: number;
        name: string;
        is_primary?: boolean;
        updated_at: string;
    };
    pricing_plan?: {
        id: number;
        name: string;
    };
    country?: {
        id: number;
        name: string;
    };
    state?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}


const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(10);
    const [processingPayment, setProcessingPayment] = useState<string | null>(null); // Track which order is processing
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

        const fetchOrders = async () => {
            try {
            setLoading(true);
            const response = await apiClient.get('/orders', {
                params: {
                    per_page: pageSize,
                },
            });

            
            // The API now returns: { data: [...], current_page: 1, ... }
            const ordersData: ApiOrder[] = response.data.data || [];
            
            console.log("New Orders response: ", ordersData);
            // Map API response to Order interface
            const mappedOrders: Order[] = ordersData.map((apiOrder) => ({
                id: apiOrder.id.toString(),
                item: apiOrder.company?.name || 'N/A',
                orderNumber: apiOrder.order_number,
                planType: apiOrder.pricing_plan?.name || 'N/A',
                price: Number(apiOrder.total_amount) || 0, // Ensure it's always a number
                status: apiOrder.payment_status_label || apiOrder.payment_status || '',
                updatedAt: formatDate(apiOrder.updated_at || ''),
                isPrimary: apiOrder.company?.is_primary || false,
                paymentStatus: apiOrder.payment_status || 'unpaid',
            }));
            
            setOrders(mappedOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
            }
        };

    useEffect(() => {
        fetchOrders();
    }, [pageSize]);

    const formatDate = (dateString: string): string => {

        console.log("Date string: ", dateString);
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMinutes = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMs / 3600000);
        const diffInDays = Math.floor(diffInMs / 86400000);

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    };

    const handlePay = async (orderId: string) => {
        try {
            setProcessingPayment(orderId);
            
            // Initialize Chapa payment (same as checkout button)
            const response = await apiClient.post('/payments/chapa/initialize', {
                order_id: parseInt(orderId),
            });

            const { checkout_url } = response.data;

            if (checkout_url) {
                // Redirect to Chapa checkout page
                window.location.href = checkout_url;
            } else {
                throw new Error('No checkout URL received from payment gateway');
            }
        } catch (error: any) {
            console.error('Chapa payment initialization error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to initialize payment. Please try again.';
            toast.error(errorMessage);
            setProcessingPayment(null);
        }
    };

    const handleUpdateOrder = (orderId: string) => {
        console.log('Update order:', orderId);
        // Navigate to order edit page
        navigate(`/orders/${orderId}`);
    };

    const handleDownloadSummary = async (orderId: string) => {
        try {
            const response = await apiClient.get(`/orders/${orderId}/download-summary`, {
                responseType: 'blob', // Important: tell axios to expect binary data
                headers: {
                    'Accept': 'application/pdf',
                },
            });

            // Check if response is successful (status 200-299)
            if (response.status >= 200 && response.status < 300) {
                // Check content type to ensure it's a PDF
                const contentType = response.headers['content-type'] || '';
                if (!contentType.includes('application/pdf')) {
                    // Might be an error JSON, try to parse it
                    const text = await response.data.text();
                    try {
                        const errorData = JSON.parse(text);
                        throw new Error(errorData.message || 'Failed to download order summary');
                    } catch (parseError) {
                        throw new Error('Invalid response from server');
                    }
                }

                // Create a blob URL and trigger download
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `order-summary-${orderId}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                toast.success('Order summary downloaded successfully');
            } else {
                throw new Error('Failed to download order summary');
            }
        } catch (error: any) {
            console.error('Error downloading order summary:', error);
            let errorMessage = 'Failed to download order summary. Please try again.';
            
            // Handle error response (when responseType is 'blob', errors are also blobs)
            if (error.response?.data instanceof Blob) {
                try {
                    const text = await error.response.data.text();
                    const errorData = JSON.parse(text);
                    errorMessage = errorData.message || errorMessage;
                } catch (parseError) {
                    // If parsing fails, use default message
                }
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
        }
    };

    const handleSetAsPrimary = async (orderId: string) => {
        try {
            // Get the order details to find company ID
            const response = await apiClient.get(`/orders/${orderId}`);
            const orderData = response.data.data || response.data;
            
            if (!orderData.company?.id) {
                console.error('Company not found for this order');
                return;
            }

            // Call API to set company as primary
            await apiClient.post(`/companies/${orderData.company.id}/set-primary`);

            // Refetch orders to get updated data
            await fetchOrders();
        } catch (error) {
            console.error('Error setting company as primary:', error);
            // Optionally show error message to user
        }
    };

    const handleDelete = (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
            toast.error('Order not found');
            return;
        }
        
        // Prevent deletion of paid orders
        if (order.paymentStatus === 'paid' || order.paymentStatus === 'Paid') {
            toast.error('Cannot delete paid orders. Please cancel the order instead.');
            return;
        }
        
        // Set the order to delete and open dialog
        setOrderToDelete(order);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!orderToDelete) return;
        
        try {
            setIsDeleting(true);
            await apiClient.delete(`/orders/${orderToDelete.id}`);
            toast.success('Order deleted successfully');
            setDeleteDialogOpen(false);
            setOrderToDelete(null);
            await fetchOrders(); // Refetch to update the list
        } catch (error: any) {
            console.error('Error deleting order:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete order. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleNewOrder = () => {
        navigate(ROUTES.ORDER_COUNTRY_SELECTION);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto space-y-6 py-6 px-8">
                <DashboardHeader
                    imageUrl="https://app.privatily.com/assets/img/header-icons/icone-mybisiness.png"
                    title="Orders list"
                    description="Manage your orders"
                />
                <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">Loading orders...</div>
                </div>
            </div>
        );
    }


    console.log("Orders data passed to the orders table: ", orders);
    return (
        <div className="max-w-7xl mx-auto space-y-6 py-6 px-2">
            <DashboardHeader
                imageUrl="https://app.privatily.com/assets/img/header-icons/icone-mybisiness.png"
                title="Orders list"
                description="Manage your orders"
            />
            <div style={{ boxShadow: '0 6px 10px -8px rgba(0,0,0,0.15)', borderRadius: '8px' }}>
                <OrdersTable
                    data={orders}
                    onPay={handlePay}
                    onUpdate={handleUpdateOrder}
                    onDownload={handleDownloadSummary}
                    onSetPrimary={handleSetAsPrimary}
                    onDelete={handleDelete}
                    onNewOrder={handleNewOrder}
                    onPageSizeChange={handlePageSizeChange}
                    pageSize={pageSize}
                    processingPaymentId={processingPayment} // Pass processing state
                />
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                <HiExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <AlertDialogTitle className="text-xl">
                                Delete Order?
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-left space-y-3 pt-2">
                            <p className="text-base">
                                Are you sure you want to delete this order? This action cannot be undone.
                            </p>
                            {orderToDelete && (
                                <div className="bg-muted/50 rounded-lg p-4 space-y-2 border border-border">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-muted-foreground">Order Number:</span>
                                        <span className="text-sm font-semibold text-foreground">{orderToDelete.orderNumber}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-muted-foreground">Item:</span>
                                        <span className="text-sm font-semibold text-foreground">{orderToDelete.item}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-muted-foreground">Amount:</span>
                                        <span className="text-sm font-semibold text-foreground">
                                            ${(Number(orderToDelete.price) || 0).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-muted-foreground">Plan:</span>
                                        <span className="text-sm font-semibold text-foreground">{orderToDelete.planType}</span>
                                    </div>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
                        >
                            {isDeleting ? (
                                <>
                                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                    Deleting...
                                </>
                            ) : (
                                'Delete Order'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Orders;
