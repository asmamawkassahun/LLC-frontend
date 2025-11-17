
import {  HiShieldCheck } from 'react-icons/hi';
import { TfiCrown, TfiMedall } from 'react-icons/tfi';

const WhyInUs = () => {
    const benefits = [
        {
            icon: TfiMedall,
            title: "Trust",
            description: "Forming a company in the US is viewed as more trustworthy by financial service providers, like Stripe, PayPal and banks due to the nation's established business infrastructure and stringent regulatory environment."
        },
        {
            icon: HiShieldCheck,
            title: "Protection",
            description: "A US-based company provides a legal separation between a business and its owners, known as limited liability protection. This means that in the event of lawsuits or debts, personal assets of the owners are generally protected."
        },
        {
            icon: TfiCrown,
            title: "Prestige",
            description: "A US company can lend prestige and credibility to a business. The US is often seen as a leader in innovation and entrepreneurship, and having a US-based company can enhance the reputation of a business both domestically and internationally."
        }
    ];

    return (
        <div className="bg-background py-12 md:py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Title */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl font-bold text-foreground">
                        Why Incorporate In <span className="text-accent">The US</span>
                    </h2>
                </div>

                {/* Cards Grid */}
                <div className=" max-w-7xl mx-auto bg-accent/10 rounded-lg  p-4 md:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <div 
                                key={index}
                                className="bg-card rounded-lg shadow-md p-6 md:p-8 hover:shadow-lg transition-shadow"
                            >
                                {/* Icon */}
                                <div className="mb-6">
                                    <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center">
                                        <Icon className="w-8 h-8 hover:text-accent" />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-semibold text-foreground mb-4">
                                    {benefit.title}
                                </h3>

                                {/* Description */}
                                <p className="text-lg text-muted-foreground leading-relaxed">
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