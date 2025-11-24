import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardHeader from "../DashboardHeader";
import { Button } from '@/components/ui/button';
import MarketplaceOrder from '@/components/modal/MarketplaceOrder';
import { services, type ServiceCard } from '@/data/marketplaceServices';

const Marketplace = () => {
    const navigate = useNavigate();
    const { serviceCode } = useParams<{ serviceCode?: string }>();
    const [selectedService, setSelectedService] = useState<ServiceCard | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mapping service titles to URL parameters
    const serviceUrlMap: Record<string, string> = {
        'ITIN': 'ITIN',
        'Logo Design': 'LD',
        'EIN': 'EIN',
        'UK Proof of Address': 'UKLA'
    };

    // Reverse mapping: URL code to service title
    const urlToServiceMap: Record<string, string> = {
        'ITIN': 'ITIN',
        'LD': 'Logo Design',
        'EIN': 'EIN',
        'UKLA': 'UK Proof of Address'
    };

    // Auto-open modal if serviceCode is in URL
    useEffect(() => {
        if (serviceCode && urlToServiceMap[serviceCode]) {
            const serviceTitle = urlToServiceMap[serviceCode];
            const service = services.find(s => s.title === serviceTitle);
            if (service && !isModalOpen) {
                setSelectedService(service);
                setIsModalOpen(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serviceCode]);

    const handleOrder = (service: ServiceCard) => {
        setSelectedService(service);
        setIsModalOpen(true);
        
        // Update URL with service path parameter
        const urlParam = serviceUrlMap[service.title];
        if (urlParam) {
            navigate(`/marketplace/${urlParam}`, { replace: true });
        }
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

    const handleReadMore = (e: React.MouseEvent<HTMLAnchorElement>, serviceTitle: string) => {
        e.preventDefault();
        const service = services.find(s => s.title === serviceTitle);
        if (service) {
            handleOrder(service);
        }
    };

    return (
        <>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-1">
                <DashboardHeader
                    imageUrl="https://app.privatily.com/assets/img/header-icons/MARKETPLACE.svg"
                    title="Marketplace"
                    description=""
                />

                {/* Service Cards Grid - 3 cards in top row, 1 card in bottom left */}
                <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service, index) => {
                        // Split description to extract "Read more" link
                        const parts = service.description.split(' Read more');
                        const mainDescription = parts[0];
                        const hasReadMore = parts.length > 1;

                        // 4th card should only span 1 column (left aligned)
                        const isFourthCard = index === 3;

                        return (
                            <div
                                key={index}
                                className={`bg-muted rounded-xl border border-border py-4 px-6 flex flex-col ${isFourthCard ? 'md:col-span-1' : ''}`}
                            >
                                {/* Title */}
                                <h3 className="text-xl font-bold text-foreground mb-4">
                                    {service.title}
                                </h3>

                                {/* Description */}
                                <p className=" text-sm text-foreground/70 mb-4 flex-1 leading-relaxed">
                                    {mainDescription}
                                    {hasReadMore && (
                                        <>
                                            {' '}
                                            <a
                                                href="#"
                                                onClick={(e) => handleReadMore(e, service.title)}
                                                className="text-blue-600 hover:text-blue-700 underline cursor-pointer"
                                            >
                                                Read more
                                            </a>
                                        </>
                                    )}
                                </p>

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
