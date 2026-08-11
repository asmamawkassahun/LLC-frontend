import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiPlus, HiLink, HiShare, HiCurrencyDollar } from 'react-icons/hi';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import ReferralsDetail from './ReferralsDetail';
import { PiCaretDoubleRightBold } from 'react-icons/pi';
import referralService from '@/services/referralService';
import { toast } from 'sonner';

interface StepCard {
    number: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

const Referrals = () => {
    const [showDetail, setShowDetail] = useState(false);
    const queryClient = useQueryClient();

    // Check if user is already an affiliate
    const { data: dashboardData, isLoading: isLoadingAffiliate, error: dashboardError } = useQuery({
        queryKey: ['referrals-dashboard'],
        queryFn: () => referralService.getDashboard(),
        retry: false,
    });

    useEffect(() => {
        // 404 means user is not an affiliate - that's fine
        if (dashboardError) {
            const status = (dashboardError as { response?: { status?: number } })?.response?.status;
            if (status !== 404) {
                console.error('Error checking affiliate status:', dashboardError);
            }
        }
    }, [dashboardError]);

    const registerMutation = useMutation({
        mutationFn: () => referralService.register(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['referrals-dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['referrals-stats'] });
            queryClient.invalidateQueries({ queryKey: ['referrals-link'] });
            setShowDetail(true);
            toast.success('Successfully joined the affiliate program!');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to join affiliate program';
            toast.error(message);
        },
    });

    useEffect(() => {
        // If user is already an affiliate, show detail view
        if (dashboardData?.affiliate) {
            setShowDetail(true);
        }
    }, [dashboardData]);

    const handleJoin = () => {
        registerMutation.mutate();
    };

    const steps: StepCard[] = [
        {
            number: '001',
            icon: HiPlus,
            title: 'Join us',
            description: 'First thing first, start by joining our affiliate program.'
        },
        {
            number: '002',
            icon: HiLink,
            title: 'Copy link',
            description: "You'll be able to copy your personalized affiliate link."
        },
        {
            number: '003',
            icon: HiShare,
            title: 'Share it',
            description: 'With your friends, family, or followers if you have them.'
        },
        {
            number: '004',
            icon: HiCurrencyDollar,
            title: 'Earn money',
            description: "For every purchase of a service, you'll earn a commission."
        }
    ];

    if (isLoadingAffiliate) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (showDetail || dashboardData?.affiliate) {
        return (
            <div>
                <ReferralsDetail />
            </div>
        );
    }

    return (
        <div className="relative bg-white w-full max-w-7xl mx-auto px-2  py-6 md:py-0">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-purple-100/20 rounded-full blur-3xl"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto  border border-border rounded-lg px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 lg:pb-20 pt-4 md:pt-8 lg:pt-12 mb-6 shadow-sm">
                {/* Top Icon */}
                <div className="flex justify-center mb-8">
                    <img 
                        src="https://app.privatily.com/assets/img/header-icons/affiliate.png" 
                        alt="Affiliate Program" 
                        className="w-32 h-32  object-contain"
                    />
                </div>

                {/* Title and Description */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl l font-bold text-foreground mb-4">
                        Welcome to our Affiliate Program!
                    </h1>
                    <p className="text-sm text-foreground max-w-4xl px-8 mx-auto leading-relaxed">
                        At Privatily, we believe in empowering entrepreneurs like you, and now you have the chance to not only benefit from our services but also earn by sharing them with others. Our affiliate program is designed to help you grow alongside us.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="max-w-sm mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 md:mb-16">
                    <div 
                        onClick={handleJoin}
                        className="relative w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-medium rounded-md shadow-md transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>{registerMutation.isPending ? 'Joining...' : "Join and let's grow together!"}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleJoin();
                            }}
                            disabled={registerMutation.isPending}
                            className="absolute right-1 top- bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md shadow-md transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                            <PiCaretDoubleRightBold className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Four Step Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {steps.map((step, index) => {
                        const IconComponent = step.icon;
                        return (
                            <div
                                key={index}
                                className="relative rounded-lg p-6 md:p-8 shadow-xl overflow-hidden group hover:scale-105 transition-transform duration-300"
                                style={{
                                    background: `
                                        linear-gradient(135deg, rgba(88, 28, 135, 0.95) 0%, rgba(30, 58, 138, 0.95) 100%),
                                        repeating-linear-gradient(
                                            45deg,
                                            transparent,
                                            transparent 10px,
                                            rgba(255, 255, 255, 0.03) 10px,
                                            rgba(255, 255, 255, 0.03) 20px
                                        )
                                    `
                                }}
                            >
                                {/* Number Badge */}
                                <div className="absolute top-4 left-4 text-white/30 text-xs font-mono font-bold">
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className="flex justify-center mb-4 mt-2">
                                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-white mb-3 text-center">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-white/90 text-sm md:text-base text-center leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chat Icon */}
            <div className="fixed bottom-6 right-6 z-50">
                <button className="w-14 h-14 bg-purple hover:bg-purple-dark rounded-full flex items-center justify-center shadow-lg transition-colors">
                    <HiChatBubbleLeftRight className="w-6 h-6 text-white" />
                </button>
            </div>
        </div>
    );
};

export default Referrals;
