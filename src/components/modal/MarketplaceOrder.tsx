import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import apiClient from '@/utils/api-helpers/apiClient';
import PaymentSummaryCard from "@/pages/order/payment/PaymentSummaryCard";
import MarketplaceDescription from "../sections/dashboard/marketplace/MarketplaceDescription";

type DescriptionItem = 
    | { type: 'paragraph'; text: string }
    | { type: 'heading'; text: string }
    | { type: 'bullets'; items: string[] };

interface MarketplaceOrderProps {
    isOpen: boolean;
    onClose: () => void;
    serviceId: number;
    serviceTitle: string;
    description: DescriptionItem[];
    requirements: string[];
    price: number;
}

const MarketplaceOrder = ({ 
    isOpen, 
    onClose, 
    serviceId,
    serviceTitle, 
    description, 
    requirements, 
    price 
}: MarketplaceOrderProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [promoCode, setPromoCode] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
    const [totalAmount, setTotalAmount] = useState(price);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setPromoCode('');
            setDiscountAmount(0);
            setAppliedPromoCode(null);
            setTotalAmount(price);
        }
    }, [isOpen, price]);

    useEffect(() => {
        if (!modalRef.current || !backdropRef.current) return;

        if (isOpen) {
            setIsVisible(true);
            // Set initial state - modal off screen to the right
            gsap.set(modalRef.current, { x: '100%', opacity: 0 });
            gsap.set(backdropRef.current, { opacity: 0 });

            // Animate modal sliding in from right
            const tl = gsap.timeline();
            tl.to(backdropRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            })
            .to(modalRef.current, {
                x: '0%',
                opacity: 1,
                duration: 0.5,
                ease: 'power3.out'
            }, '-=0.2');
        } else if (isVisible) {
            // Animate modal sliding out to the right
            const tl = gsap.timeline();
            tl.to(modalRef.current, {
                x: '100%',
                opacity: 0,
                duration: 0.4,
                ease: 'power3.in'
            })
            .to(backdropRef.current, {
                opacity: 0,
                duration: 0.2,
                ease: 'power2.out'
            }, '-=0.2')
            .call(() => {
                setIsVisible(false);
            });
        }
    }, [isOpen, isVisible]);

    // Mutation to validate and calculate promo code discount
    const validatePromoCodeMutation = useMutation({
        mutationFn: async (code: string) => {
            // First, we need to validate the promo code and get its details
            // We'll calculate the discount on the backend when creating the order
            // For now, just store the promo code
            return { code };
        },
    });

    // Mutation to create marketplace order
    const createOrderMutation = useMutation({
        mutationFn: async (data: { service_id: number; promo_code?: string }) => {
            const response = await apiClient.post('/marketplace/order', data);
            return response.data;
        },
        onSuccess: (data) => {
            // Redirect to Chapa checkout URL
            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                toast.success('Marketplace order created successfully!');
                onClose();
            }
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to create marketplace order';
            toast.error(errorMessage);
        },
    });

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) {
            toast.error('Please enter a promo code');
            return;
        }

        // The promo code will be validated and discount calculated on the backend
        // For now, we'll just store it and show it will be applied at checkout
        setAppliedPromoCode(promoCode.trim());
        toast.success('Promo code will be applied at checkout');
    };

    const handleCheckout = async () => {
        try {
            await createOrderMutation.mutateAsync({
                service_id: serviceId,
                promo_code: appliedPromoCode || promoCode.trim() || undefined,
            });
        } catch (error) {
            // Error is already handled in the mutation
        }
    };

    if (!isVisible && !isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
            {/* Backdrop */}
            <div 
                ref={backdropRef}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            {/* Modal - Slides in from right */}
            <div 
                ref={modalRef}
                className="relative bg-[#F5F5F5] w-full max-w-6xl h-full z-10 shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full max-w-8xl mx-auto px-4 md:px-6 pt-10 pb-6 md:pb-8 h-full flex flex-col">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 h-full flex-1 min-h-0">
                        {/* Left Column - Description (2/3 width on desktop) - Scrollable */}
                        <div className="lg:col-span-2 overflow-y-auto pr-2">
                            <MarketplaceDescription 
                                title={serviceTitle}
                                description={description}
                                requirements={requirements}
                                onClose={onClose}
                            />
                        </div>

                        {/* Right Column - Summary Card (1/3 width) - Fixed */}
                        <div className="lg:col-span-1 lg:sticky lg:top-10 h-fit">
                            <PaymentSummaryCard
                                packageName="Price"
                                packagePrice={price}
                                stateName=""
                                stateFee={0}
                                totalDue={totalAmount}
                                promoCode={promoCode}
                                onPromoCodeChange={setPromoCode}
                                onApplyPromo={handleApplyPromo}
                                onCheckout={handleCheckout}
                                showUpgradeButton={false}
                                isLoading={createOrderMutation.isPending}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketplaceOrder;
