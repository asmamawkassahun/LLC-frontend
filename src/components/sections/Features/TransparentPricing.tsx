import { useState } from 'react';
import { HiCheck, HiArrowRight } from 'react-icons/hi';
import { BsLightning } from 'react-icons/bs';
import { Button } from '@/components/ui/button';

const TransparentPricing = () => {
    const [selectedCountry, setSelectedCountry] = useState<'US' | 'UK'>('US');

    // Pricing data for US and UK
    const pricingData = {
        US: {
            basic: {
                price: "$229",
                yearly: "99$/yr",
                features: [
                    "US Company Formation",
                    "US Address with Mail forwarding",
                    "Registered agent service",
                    "US business Stripe account consultation",
                    "EIN letter",
                    "Incorporation documents",
                    "Introduction to a professional accountant",
                    "Email support only"
                ]
            },
            premium: {
                price: "$397",
                yearly: "99$/yr",
                features: [
                    { text: "Everything in Basic, plus:", icon: "arrow" },
                    { text: "Order priority", icon: "lightning" },
                    { text: "FREE Tax consultation", icon: "check" },
                    { text: "Chat and phone support", icon: "check" },
                    { text: "FREE US Phone number", icon: "check" },
                    { text: "Dedicated account manager", icon: "check" },
                    { text: "FREE Business website", icon: "check" },
                    { text: "FREE business email inbox", icon: "check" },
                    { text: "FREE .com domain", icon: "check" },
                    { text: "Business bank consultation", icon: "check" },
                    { text: "3 Business logos", icon: "check" },
                    { text: "Bonuses", icon: "check" }
                ]
            }
        },
        UK: {
            basic: {
                price: "$197",
                yearly: "59$/yr",
                features: [
                    "Your private company in the UK",
                    "Registered office address",
                    "UK Business Stripe account consultation",
                    "Certificate of incorporation",
                    "Company documents",
                    "Email support only"
                ]
            },
            premium: {
                price: "$297",
                yearly: "59$/yr",
                features: [
                    { text: "Everything in Basic, plus:", icon: "arrow" },
                    { text: "Order priority", icon: "lightning" },
                    { text: "Chat and phone support", icon: "check" },
                    { text: "FREE UK Phone number", icon: "check" },
                    { text: "Dedicated account manager", icon: "check" },
                    { text: "FREE Business website", icon: "check" },
                    { text: "FREE business email inbox", icon: "check" },
                    { text: "FREE .com domain", icon: "check" },
                    { text: "Business bank consultation", icon: "check" },
                    { text: "3 Business logos", icon: "check" },
                    { text: "Bonuses", icon: "check" }
                ]
            }
        }
    };

    const currentPricing = pricingData[selectedCountry];

    return (
        <div className="bg-background py-12 md:py-16 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Transparent Pricing Header */}
                <div className="text-center mb-12">
                    <h1 className="text-xl md:text-5xl lg:text-5xl font-bold text-foreground mb-6">
                        Transparent <span className="text-accent">Pricing</span>
                    </h1>
                    <div className="space-y-4">
                        <p className="text-lg text-foreground">
                            Where do you want to Incorporate?
                        </p>
                        <div className="flex justify-center gap-2 max-w-72 mx-auto bg-primary/5 rounded-full p-3">
                            <button
                                onClick={() => setSelectedCountry('US')}
                                className={`flex items-center gap-2 p-4 rounded-full text-base font-medium transition-colors ${selectedCountry === 'US'
                                    ? 'bg-card text-foreground '
                                    : 'bg-muted text-foreground  '
                                    }`}
                            >
                                <span className="">🇺🇸</span>
                                <span className="text-base">In the US</span>
                            </button>
                            <button
                                onClick={() => setSelectedCountry('UK')}
                                className={`flex items-center gap-2 p-3 rounded-full font-medium transition-colors ${selectedCountry === 'UK'
                                    ? ' bg-card text-foreground'
                                    : 'bg-muted text-foreground'
                                    }`}
                            >
                                <span className="">🇬🇧</span>
                                <span>In the UK</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-16 max-w-6xl mx-auto">
                    {/* Basic Plan Card */}
                    <div className="bg-card border border-border rounded-lg px-4 md:px-6 pt-6 md:pt-8">
                        <h2 className="text-xl font-semibold text-foreground mb-4">Basic</h2>
                        <div className="mb-4">
                            <span className="text-3xl font-semibold text-foreground">{currentPricing.basic.price}</span>
                            <span className="text-lg text-muted-foreground ml-2">and then {currentPricing.basic.yearly}</span>
                        </div>
                        <p className="text-lg text-muted-foreground mb-6">If you're operating with a low budget.</p>
                        <Button className="w-full bg-primary mb-6 text-primary-foreground hover:bg-primary/90 py-6 text-lg font-medium">
                            Go Basic
                        </Button>

                        <ul className="space-y-4 mb-8">
                            {currentPricing.basic.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <HiCheck className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                    <span className="text-lg text-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>


                    </div>

                    {/* Premium Plan Card */}
                    <div className="bg-blue-700 rounded-lg px-4 md:px-6 pt-6 md:pt-8 relative">
                        <div className="absolute top-4 right-4 bg-primary-foreground text-accent px-3 py-1 rounded-full text-base font-medium">
                            Priority Processing
                        </div>
                        <h2 className="text-xl font-semibold text-primary-foreground mb-4">Premium</h2>
                        <div className="mb-4">
                            <span className="text-3xl font-semibold text-primary-foreground">{currentPricing.premium.price}</span>
                            <span className="text-lg text-primary-foreground/80 ml-2">and then {currentPricing.premium.yearly}</span>
                        </div>
                        <p className="text-lg text-primary-foreground/90 mb-6">Enhanced, fast, and exclusive service.</p>
                        <Button className="w-full bg-orange-dark mb-6 hover:bg-orange text-primary-foreground py-6 text-lg font-medium">
                            Go Premium
                        </Button>

                        <ul className="space-y-4 mb-8">
                            {currentPricing.premium.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    {feature.icon === 'arrow' && (
                                        <HiArrowRight className="w-5 h-5 font-light text-primary-foreground shrink-0 mt-0.5" />
                                    )}
                                    {feature.icon === 'lightning' && (
                                        <BsLightning className="w-5 h-5 text-primary-foreground shrink-0 mt-0.5" />
                                    )}
                                    {feature.icon === 'check' && (
                                        <HiCheck className="w-5 h-5 text-primary-foreground shrink-0 mt-0.5" />
                                    )}
                                    <span className="text-lg text-primary-foreground">{feature.text}</span>
                                </li>
                            ))}
                        </ul>


                    </div>
                </div>

                {/* Dubai & Hong Kong Section */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-5xl font-semibold text-foreground mb-4">
                            Dubai & Hong Kong Company Setup (Exclusive)
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Now open for selected clients. Join the waitlist — you could be next.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Hong Kong Card */}
                        <div className="flex justify-between bg-card hover:border-accent hover:shadow-lg transition-all duration-300 border border-border rounded-lg p-6 md:p-8 shadow-sm">
                            <div>
                                <div className='flex items-center gap-2'>
                                    <div className="text-3xl bg-accent-foreground rounded-full p-2 mb-4">🇭🇰</div>
                                    <h3 className="text-xl font-semibold text-foreground mb-3">Hong Kong</h3>
                                </div>
                                <p className="text-muted-foreground text-lg">
                                    Gateway to Asia with world-class financial infrastructure
                                </p>
                            </div>
                            <div className=" bg-blue-700  text-primary-foreground w-42 h-10 text-center justify-center py-2 rounded-sm text-lg font-medium">
                                Join Waitlist
                            </div>
                        </div>

                        {/* Dubai Card */}
                        <div className="flex justify-between bg-card hover:border-accent hover:shadow-lg transition-all duration-300 border border-border rounded-lg p-6 md:p-8 shadow-sm">
                            <div>
                                <div className='flex items-center gap-2'>
                                    <div className="text-3xl bg-accent-foreground rounded-full p-2 mb-4">🇦🇪</div>
                                    <h3 className="text-lg font-semibold text-foreground mb-3">Dubai, UAE</h3>
                                </div>
                                <p className="text-muted-foreground text-lg">
                                    Most millionaires & future millionaires launch their businesses here
                                </p>
                            </div>
                            <div className=" bg-blue-700  text-primary-foreground w-42 h-10 text-center justify-center py-2 rounded-sm text-lg font-medium">
                                Join Waitlist
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bonuses Section */}
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
                    <div className="flex-1">
                        <h2 className="text-3xl md:text-5xl font-semibold text-foreground mb-4">
                            <span className="text-accent">Bonuses</span> for Premium clients only
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            As a Premium client, we'll assist you in setting up all the financial services available to you. You'll have a dedicated account manager and our exceptional support team, ready to assist you via chat, email, and phone.
                        </p>
                    </div>
                    <div className="flex-1 w-full lg:w-auto">
                        <img
                            src="https://privatily.com/wp-content/uploads/2023/08/img-Bonuses-3-3-min.png"
                            alt="Bonuses graphic"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransparentPricing;