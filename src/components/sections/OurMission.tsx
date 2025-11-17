import { HiOfficeBuilding, HiLockOpen, HiSparkles, HiTrendingUp } from 'react-icons/hi';

const OurMissionSection = () => {
    const serviceCards = [
        {
            icon: HiOfficeBuilding,
            title: "Form",
            subtitle: "your company",
            position: "top-left"
        },
        {
            icon: HiLockOpen,
            title: "Access",
            subtitle: "best financial services",
            position: "mid-left"
        },
        {
            icon: HiSparkles,
            title: "Build",
            subtitle: "your brand",
            position: "mid-right"
        },
        {
            icon: HiTrendingUp,
            title: "Grow",
            subtitle: "your business",
            position: "bottom-right"
        }
    ];

    return (
        <div className="bg-background py-12 md:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
                    {/* Right Section - Text (First on mobile, second on md and above) */}
                    <div className="flex-1 space-y-6 order-1 md:order-2">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-3xl lg:text-5xl font-semibold text-foreground">
                                Our Mission at <span className="text-accent">Privatily</span>
                            </h2>
                            <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
                                Privatily's mission is to be the global partner for aspiring business owners, streamlining the path to company formation in the USA & the UK. We deliver a comprehensive suite of services, from LLC and LTD registrations to full business incorporation, designed for modern entrepreneurial needs. Our goal is to empower clients to quickly and confidently establish and grow their businesses worldwide.
                            </p>
                        </div>
                    </div>

                    {/* Left Section - Visual (Second on mobile, first on md and above) */}
                    <div className="flex-1 w-full lg:w-auto relative order-2 md:order-1">
                        <div className="relative">
                            {/* Purple Abstract Shape Background */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[var(--color-purple)] rounded-full blur-3xl opacity-20 -z-10"></div>
                            
                            {/* Main Image Container */}
                            <div className="relative z-10">
                                <img
                                    src="https://privatily.com/wp-content/uploads/2023/08/image-3-min-e1691414079436.png"
                                    alt="Privatily team member"
                                    className="w-full h-auto relative z-10"
                                />

                                {/* Floating Service Cards */}
                                {serviceCards.map((card, index) => {
                                    const Icon = card.icon;
                                    const positionClasses = {
                                        "top-left": "absolute top-[3%] left-[12%] md:top-[3%] md:left-[12%]",
                                        "mid-left": "absolute top-[28%] left-[3%] md:top-[28%] md:left-[3%]",
                                        "mid-right": "absolute top-[52%] right-[2%] md:top-[52%] md:right-[2%]",
                                        "bottom-right": "absolute bottom-[8%] right-[8%] md:bottom-[8%] md:right-[8%]"
                                    };

                                    return (
                                        <div
                                            key={index}
                                            className={`${positionClasses[card.position as keyof typeof positionClasses]} z-20`}
                                        >
                                            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-md shadow-lg px-2 md:px-3 min-w-[110px] md:min-w-[130px] border border-purple-200/50">
                                                <div className="flex items-center gap-1">
                                                    <Icon className="w-5 h-5 lg:w-8 lg:h-8 text-purple shrink-0" />
                                                    <div className="text-start">
                                                        <div className="font-bold text-foreground text-xs lg:text-sm">{card.title}</div>
                                                        <div className="text-[8px] lg:text-xs text-muted-foreground font-normal">{card.subtitle}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurMissionSection;