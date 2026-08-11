import { Award, ShieldCheck, Crown } from 'lucide-react';

const WhyInUs = () => {
    const benefits = [
        {
            icon: Award,
            title: "Trust",
            description: "Forming a company in the US is viewed as more trustworthy by financial service providers, like Stripe, PayPal and banks, due to the nation's established business infrastructure and stringent regulatory environment."
        },
        {
            icon: ShieldCheck,
            title: "Protection",
            description: "A US-based company provides a legal separation between a business and its owners, known as limited liability protection. In the event of lawsuits or debts, the personal assets of the owners are generally protected."
        },
        {
            icon: Crown,
            title: "Prestige",
            description: "A US company can lend prestige and credibility to a business. The US is often seen as a leader in innovation and entrepreneurship, and having a US-based company can enhance the reputation of a business both domestically and internationally."
        }
    ];

    return (
        <div className="bg-background py-12 md:py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Title */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
                        Why Incorporate In <span className="text-accent">The US</span>
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                        A US entity opens doors to world-class banking, payment processing, and credibility — for founders everywhere.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className=" max-w-7xl mx-auto bg-gold-500/10 rounded-lg  p-4 md:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <div
                                key={index}
                                className="bg-card rounded-lg shadow-md p-4 md:p-6 lg:p-8 hover:shadow-lg transition-shadow"
                            >
                                {/* Icon */}
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-gold-500/10 rounded-lg flex items-center justify-center">
                                        <Icon className="w-8 h-8 text-gold-600" />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className=" md:text-lg lg:text-xl font-medium text-foreground mb-4">
                                    {benefit.title}
                                </h3>

                                {/* Description */}
                                <p className="text-base md:text-sm lg:text-lg text-muted-foreground leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default WhyInUs;
