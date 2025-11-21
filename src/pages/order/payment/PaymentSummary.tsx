import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PaymentPage from "./Payment";
import PremiumCard from '@/components/sections/payment/PremiumCard';
import { Button } from '@/components/ui/button';
import { MdNavigateNext } from 'react-icons/md';
import { BiSolidRightTopArrowCircle } from "react-icons/bi";
import { useState } from 'react';
import FinanceSecurity from '@/assets/icons/finance-security';

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
    const isPremium = selectedPlan && (selectedPlan.startsWith('Premium') || selectedPlan.startsWith('premium'));

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
        // Navigate back to upgrade page
        if (id) {
            navigate(`/order/upgrade/${id}`);
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
                    <div className="lg:col-span-1">
                        <div className=" sm:border border-border rounded-lg py-4 px-2 sm:px-4 sm:p-6 bg-background lg:sticky lg:top-4">
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-2">Summary</h2>

                            {/* Package Details */}
                            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                <div className='flex items-center justify-between'>
                                    <p className="text-base font-light text-foreground">{packageName}</p>
                                    <p className="text-base font-semibold text-foreground">${packagePrice}</p>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <p className="text-base font-light text-foreground">{StateName}</p>
                                    <p className="text-base font-semibold text-foreground">${StateFee}</p>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="mb-4 sm:mb-6 border-b border-border pb-4">
                                <div className="flex gap-2 relative">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Promo code"
                                        className="relative text-sm md:text-xs lg:text-sm w-full flex-1 px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background"
                                    />
                                    <Button
                                        onClick={handleApplyPromo}
                                        variant="outline"
                                        className="absolute right-0 mt-0.5 md:mt-0 lg:mt-0.5 text-sm md:text-xs lg:text-sm font-medium shadow-none border-none bg-transparent hover:bg-transparent text-muted-foreground hover:text-muted-foreground cursor-pointer"
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>

                            {/* Total Due */}
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <p className="text-base font-medium text-foreground">Total due today</p>
                                <p className="text-xl font-bold text-purple">${totalDue}</p>
                            </div>

                            {/* Checkout Button */}
                            <Button
                                onClick={handleCheckout}
                                className="w-full bg-purple hover:bg-purple-dark text-white px-6 py-3 text-base font-medium mb-3 sm:mb-4 cursor-pointer"
                            >
                                Checkout
                                <MdNavigateNext className="w-5 h-5 ml-2" />
                            </Button>

                            {/* Upgrade Button - Visible on mobile, hidden on desktop (since upgrade card is shown) - Hidden for Premium plans */}
                            {!isPremium && (
                                <Button
                                    onClick={handleUpgrade}
                                    variant="outline"
                                    className="w-full md:hidden bg-muted hover:bg-muted/80 text-foreground px-6 py-3 text-sm font-medium my-6 cursor-pointer border-border"
                                >
                                    <BiSolidRightTopArrowCircle className="w-5 h-5 mr-2 text-purple" />
                                    Upgrade now with $40 savings
                                </Button>
                            )}

                            {/* Payment Logos */}
                            <div className="flex items-center gap-4 mb-4 sm:mb-6 justify-center">
                                <img src="https://app.privatily.com/assets/img/visa-master.webp" alt="Payment methods" className='w-24 h-8' />
                            </div>

                            {/* Refund Guarantee - Mobile layout */}
                            <div className="flex md:flex-col lg:flex-row items-start md:items-center lg:items-start gap-3 sm:gap-1 lg:gap-1 pt-38 sm:pt-24 rounded-sm">
                                <div className="w-16 sm:w-20 rounded-full flex items-center justify-center shrink-0">
                                    <FinanceSecurity />
                                </div>
                                <div>
                                    <p className="text-sm sm:text- md:text-sm lg:text-base font-bold text-foreground mb-1">100% Refund Guarantee</p>
                                    <p className="text-xs sm:text-[12.5px] text-foreground">
                                        We offer a straightforward refund with no questions asked if we're unable to successfully form your company.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSummary;
