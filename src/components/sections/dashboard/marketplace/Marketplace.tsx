import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/utils/api-helpers/apiClient';
import DashboardHeader from "../DashboardHeader";
import { Button } from '@/components/ui/button';
import MarketplaceOrder from '@/components/modal/MarketplaceOrder';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/formatters';
import type { DescriptionItem } from '@/data/marketplaceServices';

interface ServiceCard {
    id: number;
    title: string;
    description: string;
    price: string;
    fullDescription: DescriptionItem[];
    requirements: string[];
    priceNumber: number;
}

interface MarketplaceService {
    id: number;
    name: string;
    description: string;
    price: number;
    requirements: string[] | null;
    is_active: boolean;
}

const Marketplace = () => {
    const navigate = useNavigate();
    const { serviceCode } = useParams<{ serviceCode?: string }>();
    const [selectedService, setSelectedService] = useState<ServiceCard | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedServices, setExpandedServices] = useState<Set<number>>(new Set());

    // Fetch marketplace services from API
    const { data: servicesData, isLoading } = useQuery({
        queryKey: ['marketplace-services'],
        queryFn: async () => {
            const response = await apiClient.get<MarketplaceService[]>('/marketplace/services');
            return response.data;
        },
    });

    // Convert API data to ServiceCard format
    const services: ServiceCard[] = servicesData?.map((service) => {
        // Split description to extract "Read more" link
        const parts = service.description.split(' Read more');
        const mainDescription = parts[0];
        
        // Convert description to DescriptionItem format
        const fullDescription: DescriptionItem[] = [
            { type: 'paragraph', text: service.description }
        ];

        return {
            id: service.id,
            title: service.name,
            description: mainDescription,
            price: formatCurrency(service.price),
            priceNumber: service.price,
            fullDescription,
            requirements: service.requirements || [],
        };
    }) || [];

    // Mapping service IDs to URL parameters (using service name as fallback)
    const getServiceUrlParam = (service: ServiceCard): string => {
        const nameMap: Record<string, string> = {
            'ITIN': 'ITIN',
            'Logo Design': 'LD',
            'EIN': 'EIN',
            'UK Proof of Address': 'UKLA'
        };
        return nameMap[service.title] || service.id.toString();
    };

    // Reverse mapping: URL code to service
    const urlToServiceMap: Record<string, string | number> = {
        'ITIN': 'ITIN',
        'LD': 'Logo Design',
        'EIN': 'EIN',
        'UKLA': 'UK Proof of Address'
    };

    // Auto-open modal if serviceCode is in URL
    useEffect(() => {
        if (serviceCode && services.length > 0) {
            const urlValue = urlToServiceMap[serviceCode];
            let service: ServiceCard | undefined;
            
            if (typeof urlValue === 'string') {
                // Find by title
                service = services.find(s => s.title === urlValue);
            } else {
                // Find by ID
                service = services.find(s => s.id === urlValue);
            }
            
            if (service && !isModalOpen) {
                setSelectedService(service);
                setIsModalOpen(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serviceCode, services]);

    const handleOrder = (service: ServiceCard) => {
        setSelectedService(service);
        setIsModalOpen(true);
        
        // Update URL with service path parameter
        const urlParam = getServiceUrlParam(service);
        navigate(`/marketplace/${urlParam}`, { replace: true });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Navigate back to marketplace without service code
        navigate('/marketplace', { replace: true });
        // Small delay before clearing selected service to allow animation to complete
        setTimeout(() => {
            setSelectedService(null);
        }, 500);
    };

    const handleReadMore = (e: React.MouseEvent<HTMLElement>, serviceId: number) => {
        e.preventDefault();
        e.stopPropagation();
        setExpandedServices(prev => {
            const newSet = new Set(prev);
            if (newSet.has(serviceId)) {
                newSet.delete(serviceId);
            } else {
                newSet.add(serviceId);
            }
            return newSet;
        });
    };

    return (
        <>
            <div className="w-full max-w-7xl mx-auto px-2 py-6 md:py-1">
                <DashboardHeader
                    imageUrl="https://app.privatily.com/assets/img/header-icons/MARKETPLACE.svg"
                    title="Marketplace"
                    description=""
                />

                {/* Loading State */}
                {isLoading && (
                    <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-muted rounded-xl border border-border py-4 px-6">
                                <Skeleton className="h-6 w-32 mb-4" />
                                <Skeleton className="h-20 w-full mb-4" />
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-10 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Service Cards Grid - 3 cards in top row, 1 card in bottom left */}
                {!isLoading && services.length > 0 && (
                    <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {services.map((service, index) => {
                        // Check if description should be expandable (if it's long enough)
                        const originalService = servicesData?.find(s => s.id === service.id);
                        const fullDescription = originalService?.description || service.description;
                        const isExpanded = expandedServices.has(service.id);
                        const needsExpansion = fullDescription.length > 150; // Approximate threshold for 6 lines

                        // 4th card should only span 1 column (left aligned)
                        const isFourthCard = index === 3;

                        return (
                            <div
                                key={service.id}
                                className={`bg-muted rounded-xl border border-border py-4 px-6 flex flex-col ${isFourthCard ? 'md:col-span-1' : ''}`}
                            >
                                {/* Title */}
                                <h3 className="text-xl font-bold text-foreground mb-4">
                                    {service.title}
                                </h3>

                                {/* Description */}
                                <div className="mb-4 flex-1">
                                    <p 
                                        className={`text-sm text-foreground/70 leading-relaxed ${
                                            !isExpanded && needsExpansion 
                                                ? 'line-clamp-5' 
                                                : ''
                                        }`}
                                    >
                                        {fullDescription}
                                    </p>
                                    {needsExpansion && (
                                        <button
                                            onClick={(e) => handleReadMore(e, service.id)}
                                            className="text-blue-600 hover:text-blue-700 underline cursor-pointer text-sm mt-1"
                                        >
                                            {isExpanded ? 'Read less' : 'Read more'}
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    {/* Price */}
                                    <p className="text-base text-foreground mb-4">
                                        {service.price}
                                    </p>

                                    {/* Order Button */}
                                    <Button
                                        onClick={() => handleOrder(service)}
                                        className=" bg-purple hover:bg-purple-dark text-white rounded-sm px-6 py-3 text-base font-medium cursor-pointer"
                                    >
                                        Order
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && services.length === 0 && (
                    <div className="mt-8 md:mt-12 text-center py-12">
                        <p className="text-muted-foreground">No marketplace services available at the moment.</p>
                    </div>
                )}

                {/* Floating Chat Button */}
                {/* <div className="fixed bottom-6 right-6 z-50">
                    <button className="w-14 h-14 bg-purple hover:bg-purple-dark rounded-full flex items-center justify-center shadow-lg transition-colors">
                        <HiChat className="w-6 h-6 text-white" />
                    </button>
                </div> */}
            </div>

            {/* Marketplace Order Modal */}
            {selectedService && (
                <MarketplaceOrder
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    serviceId={selectedService.id}
                    serviceTitle={selectedService.title}
                    description={selectedService.fullDescription}
                    requirements={selectedService.requirements}
                    price={selectedService.priceNumber}
                />
            )}
        </>
    );
};

export default Marketplace;
