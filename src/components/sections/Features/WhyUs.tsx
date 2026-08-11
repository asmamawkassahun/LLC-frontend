import { useQuery } from '@tanstack/react-query';
import { fetchStatsData } from '@/lib/api/stats';
import { Medal, BadgeDollarSign, Zap, CheckCircle2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const WhyUs = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: fetchStatsData,
    });

    // Refs for animations
    const headingRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const benefitsRef = useRef<HTMLDivElement>(null);
    const statsRefs = useRef<(HTMLDivElement | null)[]>([]);

    const benefits = [
        {
            icon: Medal,
            text: "Expert guidance since 2019"
        },
        {
            icon: BadgeDollarSign,
            text: "Affordable, no hidden fees"
        },
        {
            icon: Zap,
            text: "Fast, hassle-free setup"
        }
    ];

    // Animation for left content (bottom to top)
    useEffect(() => {
        if (!headingRef.current || !descriptionRef.current || !benefitsRef.current) return;

        const leftContentItems = [headingRef.current, descriptionRef.current, benefitsRef.current];

        // Set initial state (hidden below)
        gsap.set(leftContentItems, { y: 80, opacity: 0 });

        // Animate items sequentially from bottom to top
        const tl = gsap.timeline();
        leftContentItems.forEach((item, index) => {
            tl.to(item, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
            }, index * 0.2);
        });
    }, []);

    // Number counting animation for stats
    useEffect(() => {
        if (isLoading || !data) return;

        statsRefs.current.forEach((statRef, index) => {
            if (!statRef) return;

            const stat = data.stats[index];
            if (!stat) return;

            const targetValue = parseInt(stat.value.replace(/\D/g, '')); // Extract number from string
            if (isNaN(targetValue)) return;

            // Create an object to animate
            const counter = { value: 0 };

            // Set initial value to 0
            statRef.textContent = '0+';

            // Animate counting
            gsap.to(counter, {
                value: targetValue,
                duration: 2,
                ease: 'power2.out',
                onUpdate: function() {
                    if (statRef) {
                        statRef.textContent = Math.round(counter.value) + '+';
                    }
                }
            });
        });
    }, [isLoading, data]);

    return (
        <div className="bg-background pb-12 md:pb-16 lg:pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-18">
                {/* Stats Section */}
                {!isLoading && data && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-28 max-w-3xl mx-auto">
                        {data.stats.map((stat, index) => (
                            <div key={index} className="flex flex-col text-center gap-1.5">
                                <div
                                    ref={(el) => {
                                        if (el) statsRefs.current[index] = el;
                                    }}
                                    className="text-4xl md:text-5xl lg:text-[2.8rem] font-bold text-primary mb-2 leading"
                                >
                                    0+
                                </div>
                                <div className="text-sm md:text-base text-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Why Incorporia Section */}
                <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
                    {/* Left Content */}
                    <div className="flex-1 space-y-6 lg:space-y-8">
                        <div className="space-y-4">
                            <h2
                                ref={headingRef}
                                className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground"
                            >
                                Why <span className="text-accent">Incorporia</span>?
                            </h2>
                            <p
                                ref={descriptionRef}
                                className="text-[0.9rem] md:text-[0.93rem] lg:text-[1.085rem] text-muted-foreground leading-relaxed"
                            >
                                We know how to take the complexity out of forming your company because we've been in your shoes. Incorporia was built to remove the friction entrepreneurs face when going global — confusing paperwork, slow providers, and limited access to financial services. Since 2019, we've been committed to unmatched expertise, honest pricing, and the fastest turnaround time in the industry.
                            </p>
                        </div>

                        {/* Benefits List */}
                        <div
                            ref={benefitsRef}
                            className="space-y-4"
                        >
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="shrink-0 bg-gold-500/10 p-3 rounded-full">
                                            <Icon className="w-4 h-4 lg:w-6 md:h-6 text-gold-600" />
                                        </div>
                                        <p className="text-sm font-semibold md:text-base text-foreground">
                                            {benefit.text}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Visual - Service checklist card */}
                    <div className="flex-1 w-full lg:w-auto">
                        <div className="relative rounded-2xl bg-navy-900 p-8 md:p-10 shadow-xl overflow-hidden">
                            <div className="absolute -top-16 -right-16 w-48 h-48 bg-gold-500/20 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-navy-600/30 rounded-full blur-3xl"></div>

                            <div className="relative z-10 space-y-6">
                                <div>
                                    <p className="text-gold-400 text-sm font-semibold uppercase tracking-wider">End-to-end handling</p>
                                    <h3 className="text-white text-2xl font-bold mt-2">
                                        Your entire company setup, handled for you
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        'LLC or LTD formation in the US & UK',
                                        'Registered agent & business address',
                                        'EIN application & tax guidance',
                                        'Banking & payment provider access'
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                                            <p className="text-white/85 text-sm md:text-base">{item}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-2 flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-4">
                                    <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-navy-950 font-bold">
                                        1
                                    </div>
                                    <p className="text-white text-sm">
                                        One dedicated team, one clear process, <span className="text-gold-400 font-semibold">zero guesswork.</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyUs;
