import { PiCheckLight } from 'react-icons/pi';
import { Crown } from 'lucide-react';

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

                        {/* Right Column - Premium Visual */}
                        <div className="hidden lg:flex justify-center lg:justify-end">
                            <div className="w-full max-w-md lg:max-w-lg rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 p-12 flex flex-col items-center justify-center gap-5 text-center">
                                <div className="w-20 h-20 rounded-full bg-gold-500 flex items-center justify-center">
                                    <Crown className="w-10 h-10 text-navy-900" />
                                </div>
                                <span className="inline-block px-4 py-1.5 bg-gold-500 text-navy-900 text-xs font-bold uppercase tracking-wider rounded-full">
                                    Premium
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumCard;
