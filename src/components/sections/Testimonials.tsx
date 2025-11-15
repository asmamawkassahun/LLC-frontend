const TestimonialsSection = () => {
    const testimonials = [
        {
            quote: "Their speed and prices are unmatched! Starting my business in the U.S. with Privatily was very easy. Their team took care of everything, and I really can't thank them enough.",
            name: "Yusuf",
            country: "Pakistan",
            flag: "🇵🇰"
        },
        {
            quote: "Privatily provides excellent customer service. They are always responsive to concerns and keep you updated throughout the process. I was recommended to them by a friend and I highly recommend them to others.",
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

    return (
        <div className="bg-background py-12 md:py-16 lg:py-20 relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 via-blue-200/30 to-orange-200/30 blur-3xl -z-10"></div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Heading */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl lg:text-5xl font-semibold text-foreground mb-2">
                        Trusted by entrepreneurs
                    </h2>
                    <h3 className="text-2xl md:text-5xl lg:text-5xl font-semibold text-foreground">
                        from 150+ countries
                    </h3>
                </div>

                {/* Testimonial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-card rounded-lg shadow-md p-6 md:p-8 hover:shadow-lg transition-shadow"
                        >
                            {/* Quote */}
                            <p className="text-lg font-medium text-foreground mb-6 leading-relaxed">
                                "{testimonial.quote}"
                            </p>

                            {/* Name and Country */}
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{testimonial.name}</span>
                                <span className="text-muted-foreground">From {testimonial.country}</span>
                                <span className="text-2xl">{testimonial.flag}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonialsSection;