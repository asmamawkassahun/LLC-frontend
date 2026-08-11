import { HiOfficeBuilding, HiLockOpen, HiSparkles, HiTrendingUp } from 'react-icons/hi';
import { ShieldCheck } from 'lucide-react';

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
                                Our Mission at <span className="text-accent">Incorporia</span>
                            </h2>
                            <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
                                Incorporia's mission is to be the global partner for aspiring business owners, streamlining the path to company formation in the USA & the UK. We deliver a comprehensive suite of services, from LLC and LTD registrations to full business incorporation, designed for modern entrepreneurial needs. Our goal is to empower clients to quickly and confidently establish and grow their businesses worldwide.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl bg-gold-500/10 border border-gold-500/20 p-4 max-w-md">
                            <ShieldCheck className="w-6 h-6 text-gold-600 shrink-0" />
                            <p className="text-sm text-foreground">
                                From registration to banking — we stay with you at every step.
                            </p>
                        </div>
                    </div>

                    {/* Left Section - Visual (Second on mobile, first on md and above) */}
                    <div className="flex-1 w-full lg:w-auto relative order-2 md:order-1 overflow-hidden">
                        <div className="relative overflow-hidden">
                            {/* Navy Abstract Shape Background */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-navy-900 rounded-full blur-3xl opacity-25 -z-10"></div>

                            {/* Main Visual Container */}
                            <div className="relative z-10">
                                <div className="rounded-2xl bg-navy-900 shadow-2xl overflow-hidden">
                                    {/* Top bar */}
                                    <div className="flex items-center gap-2 px-4 py-3 bg-navy-950 border-b border-white/10">
                                        <span className="w-2.5 h-2.5 rounded-full bg-red-400/80"></span>
                                        <span className="w-2.5 h-2.5 rounded-full bg-gold-400/90"></span>
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></span>
                                        <span className="ml-3 text-white/50 text-xs">incorporia.com</span>
                                    </div>
                                    <div className="p-8 md:p-10 flex flex-col items-center justify-center">
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gold-500/15 border border-gold-500/40 flex items-center justify-center">
                                            <HiTrendingUp className="w-10 h-10 md:w-12 md:h-12 text-gold-400" />
                                        </div>
                                        <p className="text-white text-xl md:text-2xl font-bold mt-6 text-center">
                                            From idea to international
                                        </p>
                                        <p className="text-white/60 text-sm mt-2 text-center max-w-xs">
                                            Formation, compliance, and banking — guided every step of the way.
                                        </p>
                                        <div className="mt-6 flex items-center gap-3">
                                            <span className="bg-gold-500 text-navy-950 text-xs font-bold px-3 py-1.5 rounded-full">LLC</span>
                                            <span className="bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full">LTD</span>
                                            <span className="bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full">EIN</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Service Cards */}
                                {serviceCards.map((card, index) => {
                                    const Icon = card.icon;
                                    const positionClasses = {
                                        "top-left": "absolute top-[3%] left-[8%] md:top-[3%] md:left-[8%]",
                                        "mid-left": "absolute top-[30%] left-[1%] md:top-[30%] md:left-[1%]",
                                        "mid-right": "absolute top-[52%] right-[1%] md:top-[52%] md:right-[1%]",
                                        "bottom-right": "absolute bottom-[6%] right-[6%] md:bottom-[6%] md:right-[6%]"
                                    };

                                    return (
                                        <div
                                            key={index}
                                            className={`${positionClasses[card.position as keyof typeof positionClasses]} z-20`}
                                        >
                                            <div className="bg-white rounded-md shadow-lg px-2 md:px-3 min-w-[110px] md:min-w-[130px] border border-gold-200/60">
                                                <div className="flex items-center gap-1">
                                                    <Icon className="w-5 h-5 lg:w-8 lg:h-8 text-gold-600 shrink-0" />
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
