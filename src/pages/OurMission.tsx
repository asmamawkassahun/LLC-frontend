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
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Left Section - Visual */}
                    <div className="flex-1 w-full lg:w-auto relative">
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
                                        "top-left": "absolute top-[3%] left-[12%]",
                                        "mid-left": "absolute top-[28%] left-[3%]",
                                        "mid-right": "absolute top-[52%] right-[2%]",
                                        "bottom-right": "absolute bottom-[8%] right-[8%]"
                                    };

                                    return (
                                        <div
                                            key={index}
                                            className={`${positionClasses[card.position as keyof typeof positionClasses]} hidden md:block z-20`}
                                        >
                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-3 md:p-2 min-w-[130px] md:min-w-[150px] border border-purple-200/50">
                                                <div className="flex items-center gap-2">
                                                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-[var(--color-purple)]" />
                                                    <div className="text-center">
                                                        <div className="font-bold text-foreground text-xs md:text-sm">{card.title}</div>
                                                        <div className="text-[10px] md:text-xs text-muted-foreground font-normal">{card.subtitle}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Text */}
                    <div className="flex-1 space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl lg:text-5xl font-semibold text-foreground">
                                Our Mission at <span className="text-accent">Privatily</span>
                            </h2>
                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                Privatily's mission is to be the global partner for aspiring business owners, streamlining the path to company formation in the USA & the UK. We deliver a comprehensive suite of services, from LLC and LTD registrations to full business incorporation, designed for modern entrepreneurial needs. Our goal is to empower clients to quickly and confidently establish and grow their businesses worldwide.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurMissionSection;