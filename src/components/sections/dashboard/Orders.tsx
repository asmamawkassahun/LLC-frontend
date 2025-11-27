import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import DashboardHeader from "./DashboardHeader";
import OrdersTable, { type Order } from './OrdersTable';
import apiClient from '@/utils/api-helpers/apiClient';

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
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/orders', {
                params: {
                    per_page: pageSize,
                },
            });

            console.log("Orders response: ", response.data);
            
            // The API now returns: { data: [...], current_page: 1, ... }
            const ordersData: ApiOrder[] = response.data.data || [];
            
            // Map API response to Order interface
            const mappedOrders: Order[] = ordersData.map((apiOrder) => ({
                id: apiOrder.id.toString(),
                item: apiOrder.company?.name || 'N/A',
                orderNumber: apiOrder.order_number,
                planType: apiOrder.pricing_plan?.name || 'N/A',
                price: apiOrder.total_amount,
                status: apiOrder.payment_status_label || apiOrder.payment_status || '',
                updatedAt: formatDate(apiOrder.updated_at),
                isPrimary: apiOrder.company?.is_primary || false,
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

    const handlePay = (orderId: string) => {
        console.log('Pay for order:', orderId);
        // Navigate to payment page
    };

    const handleUpdateOrder = (orderId: string) => {
        console.log('Update order:', orderId);
        // Navigate to order edit page
        navigate(`/orders/${orderId}`);
    };

    const handleDownloadSummary = (orderId: string) => {
        console.log('Download summary for order:', orderId);
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
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
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

    return (
        <div className="max-w-7xl mx-auto space-y-6 py-6 px-8">
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
                />
            </div>
            {/* <div className="fixed bottom-6 right-6 z-50">
                <button className="w-14 h-14 bg-purple hover:bg-purple-dark rounded-full flex items-center justify-center shadow-lg transition-colors">
                    <HiChatBubbleLeftRight className="w-6 h-6 text-white" />
                </button>
            </div> */}
        </div>
    );
};

export default Orders;
