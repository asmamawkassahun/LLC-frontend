import { HiMail, HiPhone } from 'react-icons/hi';
import { FaInstagram, FaTwitter } from "react-icons/fa";
import ContactForm from "./ContactForm";

const ContactInfoSection = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-24 py-16 lg:py-20">
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start justify-between">
                {/* Left Section - Contact Form */}
                <div className="flex-1 w-full lg:max-w-lg order-2 md:order-1">
                    {/* <div className="bg-card rounded-lg shadow-md p-6 md:p-8"> */}
                    {/* <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
                            Send us a message
                        </h2> */}
                    {/* </div> */}
                    <ContactForm />
                </div>

                {/* Right Section - Contact Information */}
                <div className="flex-1 w-full lg:w-auto relative order-1 md:order-2">
                    <div className="relative rounded-lg overflow-hidden">
                        {/* Gradient Background - Dark Blue to Purple */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-[var(--color-purple)]"></div>

                        {/* Abstract Circular Orbs - Positioned as per image */}
                        <div className="absolute inset-0 overflow-hidden">
                            {/* Large Blue Orb - Bottom Right */}
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/25 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
                            {/* Medium Purple Orb - Above and left of large orb */}
                            <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-400/30 rounded-full blur-2xl"></div>
                            {/* Small Blue Orb - Top Left */}
                            <div className="absolute top-8 left-8 w-40 h-40 bg-blue-300/30 rounded-full blur-xl"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-8 md:p-10 lg:p-12">
                            {/* Title */}
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
                                Contact Information
                            </h1>

                            {/* Descriptive Text */}
                            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-8 md:mb-10 leading-relaxed">
                                We are easily reachable through email, phone, and WhatsApp, striving to provide convenient and seamless communication options tailored to your needs.
                            </p>

                            {/* Contact Methods */}
                            <div className="space-y-4 md:space-y-5">
                                {/* Email */}
                                <div className="flex items-center gap-3">
                                    <HiMail className="w-6 h-6 text-white shrink-0" />
                                    <a href="mailto:support@privatily.com" className="text-white hover:text-white/80 transition-colors text-base md:text-lg">
                                        support@privatily.com
                                    </a>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center gap-3">
                                    <HiPhone className="w-6 h-6 text-white shrink-0" />
                                    <a href="tel:+15074104666" className="text-white hover:text-white/80 transition-colors text-base md:text-lg">
                                        +1 (507) 410-4666
                                    </a>
                                </div>

                                {/* Instagram */}
                                <div className="flex items-center gap-3">
                                    <FaInstagram className="w-6 h-6 text-white shrink-0" />
                                    <a href="#" className="text-white hover:text-white/80 transition-colors text-base md:text-lg">
                                        @privatily
                                    </a>
                                </div>

                                {/* Twitter */}
                                <div className="flex items-center gap-3">
                                    <FaTwitter className="w-6 h-6 text-white shrink-0" />
                                    <a href="#" className="text-white hover:text-white/80 transition-colors text-base md:text-lg">
                                        @privatily
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactInfoSection;