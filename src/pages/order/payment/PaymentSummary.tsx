import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PaymentPage from "./Payment";
import PremiumCard from '@/components/sections/payment/PremiumCard';
import PaymentSummaryCard from './PaymentSummaryCard';
import { useEffect, useState } from 'react';
import apiClient from '@/utils/api-helpers/apiClient';
import { toast } from 'sonner';

interface LocationState {
    plan?: string;
}

interface OrderData {
    id: number;
    total_amount: number;
    order_number: string;
    state_fee: number;
    base_price: number;
}

const PaymentSummary = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [promoCode, setPromoCode] = useState('');
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    // const [isLoading, setIsLoading] = useState(true);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    
    // Get plan from location state (passed during navigation)
    const selectedPlan = (location.state as LocationState)?.plan || null;

    // Fetch order data
    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return;
            try {
                // setIsLoading(true);
                const response = await apiClient.get(`/orders/${id}`);
                const order = response.data.data || response.data;
                console.log('Order data: ', order);
                setOrderData({
                    id: order.id,
                    total_amount: order.total_amount || 0,
                    order_number: order.order_number || '',
                    state_fee: Number(order.state.formation_fee) || 0,
                    base_price: Number(order.pricing_plan.base_price) || 0,
                });
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                // setIsLoading(false);
            }
        };

        fetchOrder();
    }, [id]);


    // Check if plan is Premium
    const isPremium = Boolean(selectedPlan && (selectedPlan.startsWith('Premium') || selectedPlan.startsWith('premium')));

    // These values would typically come from props or API
    const packageName = isPremium ? 'Premium Package' : 'Basic Package';
    // const packagePrice = isPremium ? 397 : 229;
    const packagePrice = orderData?.base_price || 0;
    const StateName = 'State fees';
    const StateFee = orderData?.state_fee || 0;
    const totalDue = orderData?.total_amount || 0;

    console.log('Package Price: ', packagePrice);
    console.log('State Fee: ', StateFee);
    console.log('Total Due: ', totalDue);

    const handleCheckout = async () => {
        if (!orderData?.id) {
            toast.error('Order information is not available');
            return;
        }

        setIsProcessingPayment(true);

        try {
            // Initialize Chapa payment
            const response = await apiClient.post('/payments/chapa/initialize', {
                order_id: orderData.id,
            });

            const { checkout_url } = response.data;

            console.log('Checkout URL: ', checkout_url);
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
            setIsProcessingPayment(false);
        }
    };

    const handleApplyPromo = () => {
        // Handle promo code application
    console.log('Applying promo code:', promoCode);
    };

    const handleUpgrade = () => {
        // Navigate to payment summary page with Premium plan
        if (id) {
            navigate(`/order/payment/${id}`, { state: { plan: 'Premium' } });
        }
    };

    return (
        <div className="w-full max-w-8xl mx-auto px-4 md:px-6 pb-6 md:pb-8">
            <div className="flex flex-col gap-2">
                {/* Header - Hidden on mobile, shown on desktop */}
                <div className='hidden sm:flex items-center justify-between mb-4'>
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-2xl sm:text-4xl font-bold'>Final step</h1>
                        <p className='text-base text-foreground'>Proceed with Payment to bring mine LLC to life</p>
                    </div>
                    <img src="https://app.privatily.com/assets/img/header-icons/icone-ayments-3.png" alt="" className='w-32 h-32' />
                </div>

                {/* Main Content - Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Upgrade to Premium Card or Premium Card (2/3 width) - Hidden on mobile */}
                    <div className="hidden md:block md:col-span-2 rounded-lg">
                        {isPremium ? (
                            <div className='border border-border rounded-xl'>

                                <PremiumCard />
                            </div>
                        ) : (
                            <PaymentPage type="summary" />
                        )}
                    </div>

                    {/* Right Column - Summary Card (1/3 width) */}
                    <PaymentSummaryCard
                        packageName={packageName}
                        packagePrice={packagePrice}
                        stateName={StateName}
                        stateFee={StateFee}
                        totalDue={totalDue}
                        promoCode={promoCode}
                        onPromoCodeChange={setPromoCode}
                        onApplyPromo={handleApplyPromo}
                        onCheckout={handleCheckout}
                        onUpgrade={handleUpgrade}
                        isPremium={isPremium}
                        showUpgradeButton={true}
                        isLoading={isProcessingPayment}
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentSummary;
