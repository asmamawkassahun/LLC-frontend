import { HiClock, HiGlobeAlt, HiPhone, HiCurrencyDollar } from 'react-icons/hi';

const Benefits = () => {
    const benefits = [
        {
            icon: HiClock,
            title: "Quick delivery",
            description: "Efficient processes ensure fast company formation in the US & the UK."
        },
        {
            icon: HiGlobeAlt,
            title: "We accept all countries",
            description: "Entrepreneurs worldwide can access our services, regardless of location, promoting global business growth."
        },
        {
            icon: HiPhone,
            title: "Expert Support",
            description: "Our dedicated experts provide top-notch support, addressing concerns and ensuring a seamless experience throughout the process."
        },
        {
            icon: HiCurrencyDollar,
            title: "Competitive prices",
            description: "High-quality services at affordable rates, providing exceptional value without compromising on results."
        }
    ];

    return (
        <div className="bg-background py-12 md:py-16 lg:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground mb-2 md:mb-4">
                        The Privatily Advantage
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground">
                        4 Key Benefits of Choosing Us
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <div key={index} className="flex flex-col items-center text-center">
                                {/* Icon Badge */}
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 md:mb-6">
                                    <div className='w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/15 flex items-center justify-center'>
                                        <Icon className="w-10 h-10 md:w-6 md:h-6 text-accent" />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4">
                                    {benefit.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Benefits;