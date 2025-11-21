import DashboardHeader from "./DashboardHeader";
import { Button } from '@/components/ui/button';
import { HiChat } from 'react-icons/hi';

interface ServiceCard {
    title: string;
    description: string;
    price: string;
}

const Marketplace = () => {
    const services: ServiceCard[] = [
        {
            title: "ITIN",
            description: "ITIN allows access to more US banks, build credit history, and support your U.S. VISA. Read more",
            price: "$297 Total amount"
        },
        {
            title: "Logo Design",
            description: "Get 3 original, custom-made logos tailored to your business style and preferences — 100% unique. Read more",
            price: "$50 Total amount"
        },
        {
            title: "EIN",
            description: "Get your EIN in just 2-5 business days as a non-US resident. Read more",
            price: "$60 Total amount"
        },
        {
            title: "UK Proof of Address",
            description: "Obtain a UK proof of address accepted by Stripe and UK online banking services. Read more",
            price: "$129/y"
        }
    ];

    const handleOrder = (serviceTitle: string) => {
        console.log('Order:', serviceTitle);
        // TODO: Implement order functionality
    };

    const handleReadMore = (e: React.MouseEvent<HTMLAnchorElement>, serviceTitle: string) => {
        e.preventDefault();
        console.log('Read more about:', serviceTitle);
        // TODO: Implement read more functionality
    };

    return (
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
                            <p className="lg:text-base text-sm text-foreground mb-4 flex-1 leading-relaxed">
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
                                onClick={() => handleOrder(service.title)}
                                className=" bg-purple hover:bg-purple-dark text-white px-6 py-3 text-base font-medium cursor-pointer"
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
    );
};

export default Marketplace;
