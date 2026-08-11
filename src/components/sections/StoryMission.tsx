const StoryMission = () => {
    return (
        <div className="bg-background py-12 md:py-16 lg:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Our Story Section */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-32 lg:gap-44 mb-16 md:mb-20 lg:mb-24">
                    {/* Left Side - Heading */}
                    <div className="shrink-0 lg:w-1/3">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
                            Our Story
                        </h1>
                    </div>

                    {/* Right Side - Content */}
                    <div className="flex-1 space-y-6">
                        <h2 className="text-lg md:text-2xl font-medium text-foreground">
                            Helping Online Entrepreneurs since 2019
                        </h2>
                        <div className="space-y-4 text-sm md:text-base text-foreground/70 lading-relaxed">
                            <p>
                                Incorporia was born in 2019 with a simple yet powerful mission: to help online business owners overcome the challenges of accepting online payments and expanding their businesses internationally. We recognized that many entrepreneurs were struggling with complex legal and financial processes that were preventing them from focusing on what they do best—building and growing their businesses.
                            </p>
                            <p>
                                Initially, we focused on UK company formation, helping entrepreneurs establish their presence in one of the world's most business-friendly environments. As we grew and learned from our clients' needs, we expanded our services to include US company formation in 2021, recognizing the unique opportunities and advantages that come with having a US-based company.
                            </p>
                            <p>
                                Today, we've streamlined the entire process, making it easier than ever for entrepreneurs to work with leading financial service providers like Stripe, Mercury, Brex, Juni, Wise, and Tide. By handling the complex legal and financial setup, we allow our clients to focus on innovation, growth, and building the businesses they're passionate about.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Our Mission Section */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-24 lg:gap-44">
                    {/* Left Side - Heading */}
                    <div className="shrink-0 lg:w-1/3">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
                            Our Mission
                        </h1>
                    </div>

                    {/* Right Side - Content */}
                    <div className="flex-1 space-y-6">
                        <h2 className="text-lg md:text-2xl font-medium text-foreground">
                            Powering entrepreneurs up!
                        </h2>
                        <div className="text-sm md:text-base text-foreground/70 lading-relaxed">
                            <p>
                                Incorporia's mission is to be the global partner for aspiring business owners, streamlining the path to company formation in the USA & the UK. We deliver a comprehensive suite of services, from LLC and LTD registrations to full business incorporation, designed for modern entrepreneurial needs. Our goal is to empower clients to quickly and confidently establish and grow their businesses worldwide.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoryMission;
