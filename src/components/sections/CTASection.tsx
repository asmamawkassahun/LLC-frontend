import { FaAngleRight } from "react-icons/fa";
import { Button } from "../ui";

const CTASection = () => {
    return (
        <div className="max-w-7xl mx-auto bg-background pb-12 md:pb-16 lg:pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-18">
                    {/* Left Section - Image with Purple Background */}
                    <div className="flex-1 w-full md:w-auto relative order-2 sm:order-1">
                        <div className="relative rounded-2xl overflow-hidden  p-4 md:p-6">
                            {/* Abstract Black Curved Lines - Top Right Corner */}
                            {/* <div className="absolute top-0 right-0 w-40 h-40 opacity-30">
                                <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="none">
                                    <path
                                        d="M 0 0 Q 100 50 200 0 L 200 200 Q 100 150 0 200 Z"
                                        fill="rgba(0, 0, 0, 0.4)"
                                    />
                                    <path
                                        d="M 40 40 Q 120 80 200 40 L 200 160 Q 120 120 40 160 Z"
                                        fill="rgba(0, 0, 0, 0.3)"
                                    />
                                </svg>
                            </div> */}

                            {/* Main Image */}
                            <div className="relative z-10">
                                <img
                                    src="https://privatily.com/wp-content/uploads/2023/08/image-contact-min.png"
                                    alt="Customer service representative"
                                    className="w-full h-auto rounded-xl object-cover"
                                />
                            </div>
                        </div>
            </div>

                    {/* Right Section - Text and Buttons */}
                    <div className="flex-1 space-y-6 order-1 sm:order-2">
                        {/* Text Content */}
                        <div className="space-y-4 max-w-md">
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
                        Do you have any questions?
                    </h1>
                            <p className="text-base md:text-lg text-muted-foreground">
                        Our team will be happy to assist.
                    </p>
                </div>

                        {/* Buttons and Contact Info */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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