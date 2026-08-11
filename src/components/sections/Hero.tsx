import { useQuery } from '@tanstack/react-query';
import { fetchHeroData } from '@/lib/api/hero';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Star, ShieldCheck, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const Hero = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['hero'],
        queryFn: fetchHeroData,
    });

    // Refs for animation
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const ratingRef = useRef<HTMLDivElement>(null);
    const visualRef = useRef<HTMLDivElement>(null);

    // Hardcoded values
    const description = "Join thousands of entrepreneurs using Incorporia to incorporate their companies and unlock premium payment & banking options.";

    // Animation on mount
    useEffect(() => {
        if (!titleRef.current || !descriptionRef.current || !visualRef.current) return;

        const itemsToAnimate = [titleRef.current, descriptionRef.current, visualRef.current];
        if (ratingRef.current) {
            itemsToAnimate.splice(1, 0, ratingRef.current); // Insert rating between title and description
        }

        // Set initial state (hidden below)
        gsap.set(itemsToAnimate, {
            y: 80,
            opacity: 0
        });

        // Animate items sequentially from bottom to top
        const tl = gsap.timeline();

        // Title - duration 0.8s
        tl.to(titleRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
        });

        // Rating - duration 0.8s, starts after 0.2s (if available)
        if (ratingRef.current) {
            tl.to(ratingRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
            }, '-=0.6');
        }

        // Description - slower animation (duration 1.2s)
        tl.to(descriptionRef.current, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out',
        }, ratingRef.current ? '-=0.5' : '-=0.6');

        // Visual - duration 0.8s, starts after 0.2s from description
        tl.to(visualRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
        }, '-=0.6');
    }, [isLoading]);

    return (
        <div className="py-12 md:py-16 lg:py-20 overflow-hidden">
            <div className="space-y-10 md:space-y-14">
                {/* Text Content */}
                <div className="space-y-6 max-w-176 mx-auto text-center">
                    {/* Eyebrow */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-gold-300/60 bg-gold-50 px-4 py-1.5 text-sm font-medium text-gold-700">
                        <Building2 className="w-4 h-4" />
                        US & UK company formation
                    </div>

                    <div className="space-y-4">
                        <h1
                            ref={titleRef}
                            className="text-4xl md:text-5xl lg:text-[4.22rem] font-bold text-foreground leading-tight"
                        >
                            Form your company <span className="text-accent">from anywhere</span>
                        </h1>
                        <p
                            ref={descriptionRef}
                            className="text-sm sm:text-lg px-4 sm:px-0 text-foreground/80 leading-relaxed max-w-2xl mx-auto"
                        >
                            {description}
                        </p>
                    </div>

                    {/* CTA + Rating */}
                    <div className="space-y-5">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild className="px-8 py-6 text-base font-semibold cursor-pointer">
                                <Link to={ROUTES.REGISTER}>Start My Business</Link>
                            </Button>
                            <Button asChild variant="outline" className="px-8 py-6 text-base font-medium cursor-pointer border-2">
                                <Link to={ROUTES.PRICING}>View Pricing</Link>
                            </Button>
                        </div>

                        {!isLoading && (
                            <div
                                ref={ratingRef}
                                className="flex flex-row items-center gap-2 sm:gap-4 px-4 sm:px-0 justify-center"
                            >
                                <div className="flex items-center gap-1 border-r-2 border-border pr-4 py-2">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <Star key={index} className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500 fill-gold-500" />
                                    ))}
                                </div>
                                <p className="text-[0.67rem] sm:text-sm text-foreground">
                                    Rated {data?.rating?.value || 4.2}+ stars <span className="text-muted-foreground">by</span> entrepreneurs worldwide
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hero Visual - Dashboard Mockup */}
                <div ref={visualRef} className="w-full max-w-4xl mx-auto relative px-4">
                    <div className="relative">
                        {/* Glow behind */}
                        <div className="absolute -inset-6 bg-gradient-to-tr from-navy-900/10 via-gold-400/15 to-navy-900/10 rounded-3xl blur-2xl -z-10"></div>

                        <div className="rounded-2xl bg-navy-900 shadow-2xl border border-navy-800 overflow-hidden">
                            {/* Window bar */}
                            <div className="flex items-center gap-2 px-5 py-3.5 bg-navy-950 border-b border-white/10">
                                <span className="w-3 h-3 rounded-full bg-red-400/80"></span>
                                <span className="w-3 h-3 rounded-full bg-gold-400/90"></span>
                                <span className="w-3 h-3 rounded-full bg-emerald-400/80"></span>
                                <div className="ml-4 flex-1 max-w-xs h-6 rounded-md bg-white/10 flex items-center px-3 text-[0.65rem] text-white/60">
                                    app.incorporia.com/dashboard
                                </div>
                            </div>

                            {/* Body */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6 md:p-8">
                                {/* Left column */}
                                <div className="md:col-span-3 space-y-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white/60 text-xs">Total balance</p>
                                            <p className="text-white text-3xl md:text-4xl font-bold mt-1">$128,420<span className="text-gold-400">.00</span></p>
                                        </div>
                                        <div className="rounded-lg bg-gold-500 px-3 py-1.5 text-navy-950 text-xs font-bold">
                                            ACTIVE
                                        </div>
                                    </div>

                                    {/* Bar chart */}
                                    <div className="flex items-end gap-2 h-36">
                                        {[38, 55, 42, 68, 50, 82, 64, 92, 74, 100].map((h, i) => (
                                            <div
                                                key={i}
                                                style={{ height: `${h}%` }}
                                                className={`flex-1 rounded-t-md ${i === 9 ? 'bg-gold-400' : 'bg-white/25'}`}
                                            ></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right column - status cards */}
                                <div className="md:col-span-2 space-y-4">
                                    <div className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-gold-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white text-sm font-semibold">LLC Formation</p>
                                            <p className="text-white/60 text-xs">Completed</p>
                                        </div>
                                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
                                            <Star className="w-5 h-5 text-gold-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white text-sm font-semibold">EIN Acquired</p>
                                            <p className="text-white/60 text-xs">Ready for banking</p>
                                        </div>
                                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-gold-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white text-sm font-semibold">Stripe Ready</p>
                                            <p className="text-white/60 text-xs">Payments live</p>
                                        </div>
                                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating chip */}
                        <div className="hidden md:flex absolute -top-5 -right-4 lg:-right-8 items-center gap-2 bg-white rounded-xl shadow-xl border border-border px-4 py-3">
                            <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-gold-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-foreground">Formed in hours</p>
                                <p className="text-[0.65rem] text-muted-foreground">not weeks</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
