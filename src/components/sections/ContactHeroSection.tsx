import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const ContactHeroSection = () => {
    const headingBlockRef = useRef<HTMLDivElement>(null);
    const languageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const languages = [
        { flag: "🇬🇧", name: "English" },
        { flag: "🇪🇸", name: "Spanish" },
        { flag: "🇫🇷", name: "French" },
        { flag: "🇹🇷", name: "Turkish" },
        { flag: "🇮🇱", name: "Hebrew" },
        { flag: "🇲🇦", name: "Arabic" }
    ];

    // Animate each div from bottom to top on mount
    useEffect(() => {
        const elementsToAnimate: (HTMLDivElement | null)[] = [
            headingBlockRef.current,
            ...languageRefs.current
        ].filter(Boolean) as HTMLDivElement[];

        if (elementsToAnimate.length === 0) return;

        // Set initial state for all elements
        gsap.set(elementsToAnimate, {
            y: 80,
            opacity: 0
        });

        // Animate each element with staggered delay
        elementsToAnimate.forEach((element, index) => {
            gsap.to(element, {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out',
                delay: index * 0.15 // Stagger delay of 0.15s between each element
            });
        });
    }, []);

    return (
        <div className="bg-background py-12 md:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div ref={headingBlockRef}>
                        {/* Heading */}
                    <h1 className="text-2xl md:text-[2rem] lg:text-4xl font-bold text-foreground mb-4 md:mb-6">
                        Get in Touch
                    </h1>
                    
                    {/* Description */}
                    <p className="text-sm sm:text-base  text-muted-foreground mb-8 md:mb-12 max-w-xl mx-auto leading-relaxed">
                        We are fluent in 6 languages and are working towards offering support in additional languages as well to get even closer to you!
                    </p>
                    </div>
                    
                    {/* Language Flags */}
                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-24">
                        {languages.map((language, index) => (
                            <div 
                                key={index} 
                                ref={(el) => {
                                    languageRefs.current[index] = el;
                                }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className="text-3xl md:text-4xl lg:text-5xl">
                                    {language.flag}
                                </div>
                                <span className="text-lg md:text-2xl font-medium text-foreground">
                                    {language.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactHeroSection;