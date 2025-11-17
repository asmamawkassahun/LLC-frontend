import { Button } from "../ui";

const HelpSection = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
            <div className="relative rounded-2xl overflow-hidden">
                {/* Gradient Background - Blue to Purple */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-[var(--color-purple)]"></div>
                
                {/* Abstract Circular Orbs - Layered Effect */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Light Blue Orb - Top Left */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl"></div>
                    {/* Light Purple Orb - Top Right */}
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-purple-300/30 rounded-full blur-3xl"></div>
                    {/* Medium Blue Orb - Bottom Left */}
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>
                    {/* Medium Purple Orb - Bottom Right */}
                    <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-purple-400/25 rounded-full blur-3xl"></div>
                    {/* Small Blue Orb - Center Left */}
                    <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-300/20 rounded-full blur-xl"></div>
                    {/* Small Purple Orb - Center Right */}
                    <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-purple-300/25 rounded-full blur-2xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20 text-center">
                    {/* Heading */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                        Need Help Fast?
                    </h1>
                    
                    {/* Description */}
                    <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                        Browse our articles on frequently asked questions and easily find the answers you're looking for.
                    </p>
                    
                    {/* Button */}
                    <Button className="bg-white hover:bg-foreground text-purple hover:text-white transition-colors duration-300 font-medium px-8 py-6 text-base md:text-lg rounded-lg ">
                        Visit Helpdesk
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default HelpSection;