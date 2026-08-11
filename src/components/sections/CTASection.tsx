import { FaAngleRight } from "react-icons/fa";
import { Headset, CheckCircle2 } from "lucide-react";
import { Button } from "../ui";

const CTASection = () => {
    return (
        <div className="max-w-7xl mx-auto bg-background pb-12 md:pb-16 lg:pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-18">
                    {/* Left Section - Support Visual */}
                    <div className="flex-1 w-full md:w-auto relative order-2 sm:order-1">
                        <div className="relative rounded-2xl overflow-hidden p-4 md:p-6">
                            {/* Visual Card */}
                            <div className="relative z-10">
                                <div className="bg-navy-900 rounded-xl p-8 md:p-10 relative overflow-hidden">
                                    {/* Glow */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gold-500/15 rounded-full blur-3xl"></div>

                                    {/* Headset */}
                                    <div className="relative z-10 flex justify-center mb-8">
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gold-500/10 border border-gold-500/40 flex items-center justify-center">
                                            <Headset className="w-10 h-10 md:w-12 md:h-12 text-gold-400" />
                                        </div>
                                    </div>

                                    {/* Chat Bubbles */}
                                    <div className="relative z-10 space-y-4 max-w-xs mx-auto">
                                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center text-white text-xs font-bold">
                                                    K
                                                </div>
                                                <span className="text-xs text-gold-300 font-medium">
                                                    Incorporia Support
                                                </span>
                                            </div>
                                            <p className="text-sm text-white/90">
                                                Hi! How can we help you form your company today?
                                            </p>
                                        </div>
                                        <div className="flex justify-end">
                                            <div className="bg-gold-500/15 border border-gold-500/30 rounded-lg px-4 py-2">
                                                <p className="text-sm text-gold-200">
                                                    I have a question about LLC formation
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-gold-400" />
                                            <p className="text-xs text-white/70">
                                                Avg. response time: under 1 hour
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Text and Buttons */}
                    <div className="flex-1 space-y-24 order-1 sm:order-2">
                        {/* Text Content */}
                        <div className="space-y-4 max-w-md">
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
                                Do you have any questions?
                            </h1>
                            <p className="text-base lg:text-lg text-muted-foreground">
                                Our team will be happy to assist.
                            </p>
                        </div>

                        {/* Buttons and Contact Info */}
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                            <Button className="group bg-primary text-primary-foreground px-6 h-[56px] min-w-[160px] font-medium rounded-lg transition-all duration-300 hover:bg-accent hover:text-accent-foreground flex items-center justify-center">
                                <span className="text-base group-hover:text-sm transition-all duration-300 whitespace-nowrap">Contact Us</span>
                                <FaAngleRight className="w-5 h-5 ml-2 shrink-0" />
                            </Button>
                            <span className="text-base text-foreground hover:text-accent smooth-text cursor-pointer">
                                Or call +1 (507) 410-4666
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CTASection;
