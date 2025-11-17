import { useQuery } from '@tanstack/react-query';
import { fetchHeroData } from '@/lib/api/hero';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Hero = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['hero'],
        queryFn: fetchHeroData,
    });

    // Refs for animation
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const ratingRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // Hardcoded values
    const title = "Form your company from anywhere";
    const description = "Join the thousands of entrepreneurs using our platform to incorporate their companies and unlock premium payment & banking options.";
    const stars = 5;
    const imageUrl = "https://privatily.com/wp-content/uploads/2024/11/Privatily-Product-Preview-2.jpg";
    const imageAlt = "Kimem Technology Product Preview";

    // Animation on mount
    useEffect(() => {
        if (!titleRef.current || !descriptionRef.current || !imageRef.current) return;

        const itemsToAnimate = [titleRef.current, descriptionRef.current, imageRef.current];
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
            }, '-=0.6'); // Start 0.2s after title starts
        }
        
        // Description - slower animation (duration 1.2s)
        tl.to(descriptionRef.current, {
            y: 0,
            opacity: 1,
            duration: 1.2, // Slower duration for description
            ease: 'power3.out',
        }, ratingRef.current ? '-=0.5' : '-=0.6'); // Start after rating or title
        
        // Image - duration 0.8s, starts after 0.2s from description
        tl.to(imageRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
        }, '-=0.6'); // Start 0.2s after description starts
    }, [isLoading]);

    return (
        <div className=" py-12 md:py-16 lg:py-20">
            <div className="space-y-8 md:space-y-12">
                {/* Text Content */}
                <div className="space-y-6 max-w-176 mx-auto text-center">
                    <div className="space-y-4">
                        <h1 
                            ref={titleRef}
                            className="text-4xl md:text-5xl lg:text-[4.22rem] font-semibold text-foreground leading-tight"
                        >
                            {title}
                        </h1>
                        <p 
                            ref={descriptionRef}
                            className="text-sm sm:text-lg px-4 sm:px-0 text-foreground/80 leading-relaxed"
                        >
                            {description}
                        </p>
                    </div>

                    {/* Rating */}
                    {!isLoading && (
                        <div 
                            ref={ratingRef}
                            className="flex flex-row items-center gap-2 sm:gap-4 px-4 sm:px-0 justify-center"
                        >
                            <div className="flex items-center gap-1 border-r-2 border-border pr-4 py-2">
                                {Array.from({ length: stars }).map((_, index) => (
                                    <span key={index} className="text-yellow-400 text-[0.67rem] sm:text-sm ">
                                        ⭐
                                    </span>
                                ))}
                            </div>
                            <p className="text-[0.67rem] sm:text-sm text-foreground">
                                Rated {data?.rating?.value || 4.2}+ stars <span className="text-muted-foreground">by</span> entrepreneurs worldwide
                            </p>
                        </div>
                    )}
                </div>

                {/* Hero Image */}
                <div className="w-full">
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt={imageAlt}
                        className="w-full h-auto  shadow-lg object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero;