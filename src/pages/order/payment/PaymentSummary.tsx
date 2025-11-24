import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PaymentPage from "./Payment";
import PremiumCard from '@/components/sections/payment/PremiumCard';
import PaymentSummaryCard from './PaymentSummaryCard';
import { useState } from 'react';

interface LocationState {
    plan?: string;
}

const PaymentSummary = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [promoCode, setPromoCode] = useState('');
    
    // Get plan from location state (passed during navigation)
    const selectedPlan = (location.state as LocationState)?.plan || null;

    // Check if plan is Premium
    const isPremium = Boolean(selectedPlan && (selectedPlan.startsWith('Premium') || selectedPlan.startsWith('premium')));

    // These values would typically come from props or API
    const packageName = isPremium ? 'Premium Package' : 'Basic Package';
    const packagePrice = isPremium ? 397 : 229;
    const StateName = 'State fees';
    const StateFee = 50;
    const totalDue = packagePrice + StateFee;

    const handleCheckout = () => {
        // Handle checkout action
        console.log('Checkout for order:', id);
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
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentSummary;
