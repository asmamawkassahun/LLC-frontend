import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import ContactHeroSection from "@/components/sections/ContactHeroSection";
import ContactInfoSection from "@/components/sections/ContactInfoSection";
import FooterSection from "@/components/sections/Footer";
import HelpSection from "@/components/sections/HelpSection";

const Contact = () => {
    const contentBlockRef = useRef<HTMLDivElement>(null);

    // Animate content block from bottom to top on mount
    useEffect(() => {
        if (!contentBlockRef.current) return;

        gsap.set(contentBlockRef.current, {
            y: 80,
            opacity: 0
        });

        gsap.to(contentBlockRef.current, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out'
        });
    }, []);

    return (
        <div className="mx-auto">
                <ContactHeroSection />
            <div ref={contentBlockRef}>
                <ContactInfoSection />
                <HelpSection
                    heading="Need Help Fast?"
                    description="Browse our articles on frequently asked questions and easily find the answers you're looking for."
                    buttonText="Visit Helpdesk"
                    variant="gradient"
                />
            </div>
            <FooterSection />
        </div>
    );
}

export default Contact;