import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Quote } from 'lucide-react';

const TestimonialsSection = () => {
    const testimonials = [
        {
            quote: "Their speed and prices are unmatched! Starting my business in the U.S. with Incorporia was very easy. Their team took care of everything, and I really can't thank them enough.",
            name: "Yusuf",
            country: "Pakistan",
            flag: "🇵🇰"
        },
        {
            quote: "Incorporia provides excellent customer service. They are always responsive to concerns and keep you updated throughout the process. I was recommended to them by a friend and I highly recommend them to others.",
            name: "Chinedu",
            country: "Nigeria",
            flag: "🇳🇬"
        },
        {
            quote: "I got an outstanding service for my US LLC formation. Their team was not only professional but also highly responsive throughout the entire process, making everything seamless and efficient.",
            name: "Jamal",
            country: "Morocco",
            flag: "🇲🇦"
        }
    ];

    // Refs for animations
    const h2Ref = useRef<HTMLHeadingElement>(null);
    const h3Ref = useRef<HTMLHeadingElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Animation for headings (bottom to top with wave effect - left arrives slightly faster)
    useEffect(() => {
        if (!h2Ref.current || !h3Ref.current) return;

        // Set initial state - start with only left side visible
        gsap.set([h2Ref.current, h3Ref.current], {
            y: 80,
            opacity: 0,
            clipPath: 'inset(0 100% 0 0)' // Only left side visible initially
        });

        // Animate h2 from bottom to top - left side arrives first, then reveals to right
        gsap.to(h2Ref.current, {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0 0% 0 0)', // Reveal to right while moving up
            duration: 1.2,
            ease: 'power3.out',
        });

        // Animate h3 from bottom to top - left side arrives first, then reveals to right (staggered)
        gsap.to(h3Ref.current, {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0 0% 0 0)', // Reveal to right while moving up
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.3,
        });
    }, []);

    // Animation for testimonial cards
    useEffect(() => {
        cardRefs.current.forEach((cardRef, index) => {
            if (!cardRef) return;

            if (index === 0) {
                // First card: from top to bottom
                gsap.set(cardRef, { y: -80, opacity: 0 });
                gsap.to(cardRef, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: 0.5,
                });
            } else {
                // Second and third cards: from bottom to top
                gsap.set(cardRef, { y: 80, opacity: 0 });
                gsap.to(cardRef, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    delay: 0.5 + (index * 0.2),
                });
            }
        });
    }, []);

    return (
        <div className="bg-background py-12 md:py-16 lg:py-20 relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy-100/60 via-gold-100/60 to-navy-100/60 blur-3xl -z-10"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Heading */}
                <div className="text-center w-full mb-12 md:mb-16">
                    <h2
                        ref={h2Ref}
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold md:font-semibold text-foreground mb-2"
                    >
                        Trusted by entrepreneurs
                    </h2>
                    <h3
                        ref={h3Ref}
                        className="text-2xl md:text-4xl lg:text-5xl font-bold md:font-semibold text-foreground"
                    >
                        from 150+ countries
                    </h3>
                </div>

                {/* Testimonial Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl md:max-w-md  lg:max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            ref={(el) => {
                                if (el) cardRefs.current[index] = el;
                            }}
                            className="bg-card rounded-lg shadow-md p-4 md:p-8 hover:shadow-lg transition-shadow max-w-84 md:max-w-md lg:max-w-6xl mx-auto border-t-4 border-gold-500"
                        >
                            <Quote className="w-8 h-8 text-gold-400 mb-4" />
                            {/* Quote */}
                            <p className="text-[0.9rem] md:text-base font-medium text-foreground mb-6 leading-relaxed">
                                {testimonial.quote}
                            </p>

                            {/* Name and Country */}
                            <div className="flex flex-col items-start gap-2">
                                <span className="font-semibold text-foreground">{testimonial.name}</span>
                                <div className='flex items-center gap-2'>
                                    <span className=" text-sm md:text-base text-muted-foreground">From {testimonial.country}</span>
                                    <span className=" text-base md:text-2xl">{testimonial.flag}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSection;
