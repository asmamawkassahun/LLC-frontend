import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PaymentPage from "./Payment";
import PremiumCard from '@/components/sections/payment/PremiumCard';
import PaymentSummaryCard from './PaymentSummaryCard';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
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
    payment_status?: string;
}

const PaymentSummary = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [promoCode, setPromoCode] = useState('');
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    // const [isLoading, setIsLoading] = useState(true);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [promoDiscount, setPromoDiscount] = useState<{
        originalPrice: number;
        discountAmount: number;
        totalAmount: number;
        promoCode: string;
    } | null>(null);
    
    // Get plan from location state (passed during navigation)
    const selectedPlan = (location.state as LocationState)?.plan || null;

    // Fetch order data
        const fetchOrder = async () => {
            if (!id) return;
            try {
                // setIsLoading(true);
                const response = await apiClient.get(`/orders/${id}`);
                const order = response.data.data || response.data;
                console.log('Order data: ', order);
                
                // Get base_price from order (now calculated in OrderResource)
                // Get state_fee from state relationship or calculate from subtotal
                const basePrice = Number(order.base_price) || 0;
                let stateFee = 0;
                
                if (order.state?.formation_fee) {
                    stateFee = Number(order.state.formation_fee) || 0;
                } else if (order.subtotal && order.base_price) {
                    // Calculate state_fee from: subtotal = base_price + state_fee - discount_amount
                    const subtotal = Number(order.subtotal) || 0;
                    const discountAmount = Number(order.discount_amount) || 0;
                    stateFee = subtotal + discountAmount - basePrice;
                }
                
                const orderDataObj = {
                    id: order.id,
                    total_amount: Number(order.total_amount) || 0,
                    order_number: order.order_number || '',
                    state_fee: stateFee,
                    base_price: basePrice,
                payment_status: order.payment_status || 'unpaid',
                };
                setOrderData(orderDataObj);
                
            // Only show discount if payment is not completed (unpaid or pending)
            // Hide discount after payment completes (success or failure)
            const paymentStatus = (order.payment_status || 'unpaid').toLowerCase();
            const isPaymentPending = paymentStatus === 'unpaid' || paymentStatus === 'pending';
            
            // If order already has a promo code applied and payment is pending, show the discount
            if (order.discount_amount && order.discount_amount > 0 && isPaymentPending) {
                    const originalTotal = orderDataObj.base_price + orderDataObj.state_fee;
                    setPromoDiscount({
                        originalPrice: originalTotal,
                        discountAmount: order.discount_amount,
                        totalAmount: order.total_amount,
                        promoCode: order.promo_code?.code || 'Applied',
                });
            } else {
                // Clear discount if payment is completed
                setPromoDiscount(null);
                }
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                // setIsLoading(false);
            }
        };

    useEffect(() => {
        fetchOrder();
        
        // Check if returning from payment - check URL params for tx_ref
        const urlParams = new URLSearchParams(window.location.search);
        const txRef = urlParams.get('tx_ref');
        if (txRef) {
            // User returned from payment, refetch order to get updated payment status
            setTimeout(() => {
                fetchOrder();
            }, 1000);
        }
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

    // Mutation to apply promo code
    const applyPromoCodeMutation = useMutation({
        mutationFn: async (code: string) => {
            if (!orderData?.id) {
                throw new Error('Order ID is required');
            }
            const response = await apiClient.post(`/orders/${orderData.id}/apply-promo-code`, {
                code: code,
            });
            return response.data;
        },
        onSuccess: (data) => {
            // Update order data with new totals
            if (orderData) {
                const originalTotal = orderData.base_price + orderData.state_fee;
                const discountAmount = originalTotal - data.totals.total_amount;
                
                // Check payment status - only show discount if payment is pending
                const paymentStatus = (orderData.payment_status || 'unpaid').toLowerCase();
                const isPaymentPending = paymentStatus === 'unpaid' || paymentStatus === 'pending';
                
                setOrderData({
                    ...orderData,
                    total_amount: data.totals.total_amount,
                });
                
                // Only set discount if payment is still pending
                if (isPaymentPending) {
                setPromoDiscount({
                    originalPrice: originalTotal,
                    discountAmount: discountAmount,
                    totalAmount: data.totals.total_amount,
                    promoCode: promoCode,
                });
                } else {
                    setPromoDiscount(null);
                }
                
                toast.success('Promo code applied successfully!');
            }
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to apply promo code';
            toast.error(errorMessage);
        },
    });

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) {
            toast.error('Please enter a promo code');
            return;
        }
        
        if (!orderData?.id) {
            toast.error('Order information is not available');
            return;
        }
        
        await applyPromoCodeMutation.mutateAsync(promoCode.trim());
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
                        isLoading={isProcessingPayment || applyPromoCodeMutation.isPending}
                        promoDiscount={promoDiscount}
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentSummary;
