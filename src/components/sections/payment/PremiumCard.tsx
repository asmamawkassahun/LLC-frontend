import { PiCheckLight } from 'react-icons/pi';

const PremiumCard = () => {
    const features = [
        'Order priority',
        'Email, Chat and phone support',
        'Free US phone number',
        'Dedicated account manager',
        'Professional company business website that\'s 100% accepted',
        'Wise Business account consultation',
        'Free .com domain',
        '3 custom logo crafted by our team of skilled Graphic Designers',
        'Bonuses'
    ];

    return (
        <div className="w-full bg-background py-8 md:py-12 lg:py-15 rounded-xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="max-w-7xl mx-auto">
                    {/* Title */}
                    <h1 className="text-xl text-center font-bold text-foreground mb-8 md:mb-10 lg:mb-12">
                        As a Premium client you'll get everything included with Basic package +
                    </h1>

                    {/* Content Grid - Text Left, Image Right */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Column - Features List */}
                        <div className="space-y-4 md:space-y-3.5">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <PiCheckLight className="w-5 h-5 md:w-6 md:h-6 text-foreground shrink-0 mt-0.5" />
                                    <span className="text-base text-foreground leading-relaxed">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Right Column - Image */}
                        <div className="hidden lg:flex justify-center lg:justify-end">
                            <img 
                                src="https://privatily.com/wp-content/uploads/2023/08/image-1-min-1.png" 
                                alt="Premium client benefits" 
                                className="w-full max-w-md lg:max-w-lg h-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumCard;
