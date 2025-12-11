import { Button } from '@/components/ui/button';
import { MdNavigateNext } from 'react-icons/md';
import { BiSolidRightTopArrowCircle } from "react-icons/bi";
import FinanceSecurity from '@/assets/icons/finance-security';
import { Loader2 } from 'lucide-react';

interface PaymentSummaryCardProps {
    packageName: string;
    packagePrice: number;
    stateName: string;
    stateFee: number;
    totalDue: number;
    promoCode: string;
    onPromoCodeChange: (value: string) => void;
    onApplyPromo: () => void;
    onCheckout: () => void;
    onUpgrade?: () => void;
    isPremium?: boolean;
    showUpgradeButton?: boolean;
    isLoading?: boolean;
    promoDiscount?: {
        originalPrice: number;
        discountAmount: number;
        totalAmount: number;
        promoCode: string;
    } | null;
}

const PaymentSummaryCard = ({
    packageName,
    packagePrice,
    stateName,
    stateFee,
    totalDue,
    promoCode,
    onPromoCodeChange,
    onApplyPromo,
    onCheckout,
    onUpgrade,
    isPremium = false,
    showUpgradeButton = true,
    isLoading = false,
    promoDiscount = null,
}: PaymentSummaryCardProps) => {
    // Calculate original total (package price + state fee)
    const originalTotal = Number(packagePrice) + Number(stateFee);
    // Use discounted total if promo is applied, otherwise use totalDue
    const displayTotal = promoDiscount ? Number(promoDiscount.totalAmount) : Number(totalDue);
    return (
        <div className="lg:col-span-1">
            <div className="sm:border border-border rounded-lg py-4 px-2 sm:px-4 sm:p-6 bg-background lg:sticky lg:top-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mb-2">Summary</h2>
                { !stateName && (<div className='pt-24'></div>)}

                {/* Package Details */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className='flex items-center justify-between'>
                        <p className="text-base font-light text-foreground">{packageName || 'Price'}</p>
                        <p className="text-base font-semibold text-foreground">${packagePrice}</p>
                    </div>
                    {stateFee > 0 && stateName && (
                        <div className='flex items-center justify-between'>
                            <p className="text-base font-light text-foreground">{stateName}</p>
                            <p className="text-base font-semibold text-foreground">${stateFee}</p>
                        </div>
                    )}
                </div>

                {/* Promo Code */}
                <div className="mb-4 sm:mb-6 border-b border-border pb-4">
                    <div className="flex gap-2 relative">
                        <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => onPromoCodeChange(e.target.value)}
                            placeholder="Promo code"
                            disabled={!!promoDiscount}
                            className="relative text-sm md:text-xs lg:text-sm w-full flex-1 px-4 py-2 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <Button
                            onClick={onApplyPromo}
                            variant="outline"
                            disabled={!!promoDiscount || isLoading}
                            className="absolute right-0 mt-0.5 md:mt-0 lg:mt-0.5 text-sm md:text-xs lg:text-sm font-medium shadow-none border-none bg-transparent hover:bg-transparent text-muted-foreground hover:text-muted-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Apply
                        </Button>
                    </div>
                    {promoDiscount && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                            <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
                                🎉 Congratulations! Promo code "{promoDiscount.promoCode}" applied successfully!
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-300">
                                You saved ${Number(promoDiscount.discountAmount || 0).toFixed(2)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Total Due */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <p className="text-base font-medium text-foreground">Total due today</p>
                    <div className="flex flex-col items-end">
                        {promoDiscount && (
                            <p className="text-sm text-muted-foreground line-through mb-1">
                                ${Number(originalTotal).toFixed(2)}
                            </p>
                        )}
                        <p className={`text-xl font-bold ${promoDiscount ? 'text-green-600 dark:text-green-400' : 'text-purple'}`}>
                            ${Number(displayTotal || 0).toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Checkout Button */}
                <Button
                    onClick={onCheckout}
                    disabled={isLoading}
                    className="w-full bg-purple hover:bg-purple-dark text-white px-6 py-3 text-base font-medium mb-3 sm:mb-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Processing...' : 'Checkout'}
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                    ) : (
                        <MdNavigateNext className="w-5 h-5 ml-2" />
                    )}
                </Button>

                {/* Upgrade Button - Visible on mobile, hidden on desktop (since upgrade card is shown) - Hidden for Premium plans */}
                {showUpgradeButton && !isPremium && onUpgrade && (
                    <Button
                        onClick={onUpgrade}
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
    );
};

export default PaymentSummaryCard;

