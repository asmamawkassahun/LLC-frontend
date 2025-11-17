const ContactHeroSection = () => {
    const languages = [
        { flag: "🇬🇧", name: "English" },
        { flag: "🇪🇸", name: "Spanish" },
        { flag: "🇫🇷", name: "French" },
        { flag: "🇹🇷", name: "Turkish" },
        { flag: "🇮🇱", name: "Hebrew" },
        { flag: "🇲🇦", name: "Arabic" }
    ];

    return (
        <div className="bg-background py-12 md:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div>
                        {/* Heading */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
                        Get in Touch
                    </h1>
                    
                    {/* Description */}
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 md:mb-12 max-w-xl mx-auto leading-relaxed">
                        We are fluent in 6 languages and are working towards offering support in additional languages as well to get even closer to you!
                    </p>
                    </div>
                    
                    {/* Language Flags */}
                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-24">
                        {languages.map((language, index) => (
                            <div key={index} className="flex flex-col items-center gap-2">
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