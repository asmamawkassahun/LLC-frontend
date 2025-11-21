import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsLightning } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { PiCheckLight } from 'react-icons/pi';
import { VscArrowRight } from "react-icons/vsc";
import { HiChat } from 'react-icons/hi';

interface TransparentPricingProps {
    variant?: 'features' | 'dashboard';
}

const TransparentPricing = ({ variant = 'features' }: TransparentPricingProps) => {
    const [selectedCountry, setSelectedCountry] = useState<'US' | 'UK'>('US');
    const headingRef = useRef<HTMLHeadingElement>(null);
    const navigate = useNavigate();

    const handleGoBasic = () => {
        const plan = selectedCountry === 'US' ? 'Basic_us' : 'Basic_uk';
        navigate(`/order/add/${plan}`);
    };

    const handleGoPremium = () => {
        const plan = selectedCountry === 'US' ? 'Premium_us' : 'Premium_uk';
        navigate(`/order/add/${plan}`);
    };

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

    // Animate heading from bottom to top on mount (only for features variant)
    useEffect(() => {
        if (variant === 'features' && headingRef.current) {
            gsap.set(headingRef.current, {
                y: 80,
                opacity: 0
            });

            gsap.to(headingRef.current, {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out'
            });
        }
    }, [variant]);

    return (
        <div className="bg-background py-12 md:py-16 lg:py-20">
            <div className={variant === 'dashboard' ? 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8' : 'container mx-auto px-4 sm:px-6 lg:px-8'}>
                {/* Header Section - Conditional based on variant */}
                {variant === 'dashboard' ? (
                    <div className="text-center mb-8 md:mb-12">
                        {/* Icon */}
                        <div className="flex justify-center mb-4 md:mb-6">
                            <img
                                src="https://app.privatily.com/assets/img/header-icons/pricing.png"
                                alt="Pricing icon"
                                className="w-12 h-12 md:w-32 md:h-28"
                            />
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl  font-bold text-foreground mb-2">
                            Transparent Pricing
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base md:text-base text-foreground mb-6 md:mb-8">
                            Two Packages, One Goal: Premium business formation services.
                        </p>

                        {/* Country Selection Toggle */}
                        <div className="flex justify-center max-w-lg mx-auto">
                            <div className="inline-flex w-full bg-accent/10 rounded-full p-1">
                                <button
                                    onClick={() => setSelectedCountry('US')}
                                    className={`flex w-full items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium transition-all ${selectedCountry === 'US'
                                            ? 'bg-background text-foreground'
                                            : ' hover:text-foreground'
                                        }`}
                                >
                                    <span>In the US</span>
                                    <span className="text-lg">🇺🇸</span>
                                </button>
                                <button
                                    onClick={() => setSelectedCountry('UK')}
                                    className={`flex w-full items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium transition-all ${selectedCountry === 'UK'
                                            ? 'bg-background text-foreground'
                                            : ' hover:text-foreground'
                                        }`}
                                >
                                    <span>In the UK</span>
                                    <span className="text-lg">🇬🇧</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center mb-12">
                        <h1 ref={headingRef} className="text-xl md:text-5xl lg:text-5xl font-bold text-foreground mb-6">
                            Transparent <span className="text-accent">Pricing</span>
                        </h1>
                        <div className="space-y-4">
                            <p className="text-base text-foreground">
                                Where do you want to Incorporate?
                            </p>
                            <div className="flex justify-center gap-2 max-w-64 mx-auto bg-purple-900/15 rounded-full py-2">
                                <button
                                    onClick={() => setSelectedCountry('US')}
                                    className={`flex items-center gap-2  px-4 rounded-full text-base font-medium transition-colors ${selectedCountry === 'US'
                                        ? 'bg-card text-foreground '
                                        : ' text-foreground hover:bg-card cursor-pointer'
                                        }`}
                                >
                                    <span className="">🇺🇸</span>
                                    <span className="text-sm">In the US</span>
                                </button>
                                <button
                                    onClick={() => setSelectedCountry('UK')}
                                    className={`flex items-center gap-2 p-3 rounded-full font-medium transition-colors ${selectedCountry === 'UK'
                                        ? ' bg-card text-foreground'
                                        : ' text-foreground hover:bg-card cursor-pointer'
                                        }`}
                                >
                                    <span className="">🇬🇧</span>
                                    <span className="text-sm">In the UK</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Shared Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-16 max-w-6xl mx-auto">
                    {/* Basic Plan Card */}
                    <div className="bg-card border border-border rounded-lg px-4 md:px-6 pt-6 md:pt-8">
                        <h2 className="text-xl font-semibold text-foreground mb-4">Basic</h2>
                        <div className="mb-4">
                            <span className="text-3xl font-semibold text-foreground">{currentPricing.basic.price}</span>
                            <span className="text-lg text-muted-foreground ml-2">and then {currentPricing.basic.yearly}</span>
                        </div>
                        <p className="text-base md:text-base lg:text-lg text-muted-foreground mb-12">If you're operating with a low budget.</p>
                        <Button 
                            onClick={handleGoBasic}
                            className="w-full bg-primary mb-6 text-primary-foreground hover:bg-primary/90 py-6 text-lg font-medium"
                        >
                            Go Basic
                        </Button>

                        <ul className="space-y-4 mb-8">
                            {currentPricing.basic.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <PiCheckLight className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                    <span className="text-sm md:text-base lg:text-lg text-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Premium Plan Card */}
                    <div className="bg-blue-700 rounded-lg px-4 md:px-6 pt-6 md:pt-8 relative">
                        <div className="absolute top-4 right-4 bg-primary-foreground text-accent px-3 py-1 rounded-full text-xs font-medium">
                            Priority Processing
                        </div>
                        <h2 className="text-xl font-semibold text-primary-foreground mb-4">Premium</h2>
                        <div className="mb-4">
                            <span className="text-3xl font-semibold text-primary-foreground">{currentPricing.premium.price}</span>
                            <span className="text-lg text-primary-foreground/80 ml-2">and then {currentPricing.premium.yearly}</span>
                        </div>
                        <p className="text-base text-primary-foreground/90 mb-12">Enhanced, fast, and exclusive service.</p>
                        <Button 
                            onClick={handleGoPremium}
                            className="w-full bg-orange-dark mb-6 hover:bg-orange text-primary-foreground py-6 text-lg font-medium"
                        >
                            Go Premium
                        </Button>

                        <ul className="space-y-4 mb-8">
                            {currentPricing.premium.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    {feature.icon === 'arrow' && (
                                        <VscArrowRight className="w-5 h-5 font-light text-primary-foreground shrink-0 mt-0.5" />
                                    )}
                                    {feature.icon === 'lightning' && (
                                        <BsLightning className="w-5 h-5 text-primary-foreground shrink-0 mt-0.5" />
                                    )}
                                    {feature.icon === 'check' && (
                                        <PiCheckLight className="w-5 h-5 text-primary-foreground shrink-0 mt-0.5" />
                                    )}
                                    <span className="text-sm md:text-base lg:text-lg text-primary-foreground">{feature.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Dubai & Hong Kong Section - Only for features variant */}
                {variant === 'features' && (
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-[1.6rem] sm:text-3xl md:text-[2rem] md:text-5xl font-semibold text-foreground mb-4 leading-tight">
                            Dubai & Hong Kong Company Setup (Exclusive)
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                            Now open for selected clients. Join the waitlist — you could be next.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Hong Kong Card */}
                        <div className="flex flex-col gap-4 bg-card hover:border-accent hover:shadow-lg transition-all duration-300 border border-border rounded-lg p-6 md:p-4 lg:p-8 shadow-sm">
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center justify-center gap-2'>
                                    <div className="text-3xl bg-accent-foreground rounded-full p-2 mb-4">🇭🇰</div>
                                    <h3 className="text-xl font-semibold text-foreground mb-3">Hong Kong</h3>
                                </div>
                                <div className=" bg-blue-700  text-primary-foreground  h-8 text-center justify-center py-2 px-2 rounded-sm text-sm font-medium">
                                    Join Waitlist
                                </div>
                            </div>
                            <p className="text-muted-foreground text-lg md:text-base lg:text-lg text-center">
                                Gateway to Asia with world-class financial infrastructure
                            </p>
                        </div>

                        {/* Dubai Card */}
                        <div className="flex flex-col gap-4 bg-card hover:border-accent hover:shadow-lg transition-all duration-300 border border-border rounded-lg p-6 md:p-4 lg:p-8 shadow-sm">
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-2'>
                                    <div className="text-3xl bg-accent-foreground rounded-full p-2 mb-4">🇦🇪</div>
                                    <h3 className="text-xl font-semibold text-foreground mb-3">Dubai, UAE</h3>
                                </div>
                                <div className=" bg-blue-700  text-primary-foreground  h-8 text-center justify-center p-2 px-2 rounded-sm text-sm font-medium">
                                    Join Waitlist
                                </div>
                            </div>
                            <p className="text-muted-foreground text-lg md:text-base lg:text-lg text-center">
                                Most millionaires & future millionaires launch their businesses here
                            </p>
                        </div>
                    </div>
                </div>

                )}

                {/* Bonuses Section - Only for features variant */}
                {variant === 'features' && (
                <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
                    <div className="flex-1">
                        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-semibold text-foreground mb-4">
                            <span className="text-accent">Bonuses</span> for Premium clients only
                        </h2>
                        <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
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
                )}
            </div>

            {/* Fixed Chat Icon - Only for dashboard variant */}
            {variant === 'dashboard' && (
                <div className="fixed bottom-6 right-6 z-50">
                    <button className="w-12 h-12 md:w-14 md:h-14 bg-purple hover:bg-purple-dark rounded-full flex items-center justify-center shadow-lg transition-colors">
                        <HiChat className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TransparentPricing;