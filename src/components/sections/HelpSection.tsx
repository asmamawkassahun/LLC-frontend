import { Button } from "../ui";

interface HelpSectionProps {
    heading?: string;
    description?: string;
    buttonText?: string;
    onButtonClick?: () => void;
    variant?: "gradient" | "solid-blue";
}

const HelpSection = ({ 
    heading = "Need Help Fast?",
    description = "Browse our articles on frequently asked questions and easily find the answers you're looking for.",
    buttonText = "Visit Helpdesk",
    onButtonClick,
    variant = "gradient"
}: HelpSectionProps) => {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 ">
            <div className="relative rounded-2xl overflow-hidden py-4">
                {/* Background based on variant */}
                {variant === "gradient" ? (
                    <>
                        {/* Gradient Background - Navy to Gold */}
                        <div className="absolute inset-0 bg-linear-to-r from-navy-900 via-navy-800 to-[var(--color-purple)]"></div>
                        
                        {/* Abstract Circular Orbs - Layered Effect */}
                        <div className="absolute inset-0 overflow-hidden">
                            {/* Light Gold Orb - Top Left */}
                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-gold-400/20 rounded-full blur-3xl z-30"></div>
                            {/* Light Navy Orb - Top Right */}
                            <div className="absolute -top-16 -right-16 w-56 h-56 bg-gold-500/15 rounded-full blur-3xl z-30"></div>
                            {/* Medium Gold Orb - Bottom Left */}
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-400/15 rounded-full blur-2xl z-30"></div>
                            {/* Medium Navy Orb - Bottom Right */}
                            <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl z-30"></div>
                            {/* Small Gold Orb - Center Left */}
                            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gold-400/10 rounded-full blur-xl z-30"></div>
                            {/* Small Navy Orb - Center Right */}
                            <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-gold-500/10 rounded-full blur-2xl z-30"></div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Solid Dark Navy Background */}
                        <div className="absolute inset-0 bg-navy-800"></div>
                        
                        {/* Subtle Dots Pattern - Lower Half */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div 
                                className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20"
                                style={{
                                    backgroundImage: `radial-gradient(circle, rgba(201, 162, 74, 0.5) 1px, transparent 1px)`,
                                    backgroundSize: '20px 20px'
                                }}
                            ></div>
                        </div>
                    </>
                )}

                {/* Content */}
                <div className="relative z-10 px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20 text-center">
                    {/* Heading */}
                    <h1 className="text-2xl md:text-[2rem] lg:text-4xl font-bold text-white mb-4 md:mb-6">
                        {heading}
                    </h1>
                    
                    {/* Description */}
                    <p className="text-sm md:text-base lg:text-lg text-white/90 mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed">
                        {description}
                    </p>
                    
                    {/* Button */}
                    <Button 
                        onClick={onButtonClick}
                        className={variant === "gradient" 
                            ? "bg-white hover:bg-foreground text-gold-600 hover:text-white transition-colors duration-300 font-medium px-8 py-6 text-base md:text-lg rounded-lg"
                            : "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300 font-medium px-8 py-6 text-base md:text-lg rounded-lg"
                        }
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default HelpSection;
