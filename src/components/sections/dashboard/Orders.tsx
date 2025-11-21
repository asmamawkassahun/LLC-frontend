import { useState, useEffect } from 'react';
import DashboardHeader from "./DashboardHeader";
import OrdersTable, { type Order } from './OrdersTable';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import axios from 'axios';

interface OrdersData {
    orders: Order[];
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get<OrdersData>('/data/orders.json');
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

    const handlePay = (orderId: string) => {
        console.log('Pay for order:', orderId);
        // Navigate to payment page
    };

    const handleUpdateOrder = (orderId: string) => {
        console.log('Update order:', orderId);
    };

    const handleDownloadSummary = (orderId: string) => {
        console.log('Download summary for order:', orderId);
    };

    const handleSetAsPrimary = (orderId: string) => {
        setOrders(prevOrders =>
            prevOrders.map(order => ({
                ...order,
                isPrimary: order.id === orderId
            }))
        );
    };

    const handleDelete = (orderId: string) => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    };

    const handleNewOrder = () => {
        console.log('Create new order');
        // Navigate to new order page
    };

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
