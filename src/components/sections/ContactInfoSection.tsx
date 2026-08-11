import { HiMail, HiPhone } from 'react-icons/hi';
import { FaInstagram, FaTwitter } from "react-icons/fa";
import ContactForm from "./ContactForm";

const ContactInfoSection = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-24 py-16 lg:py-20">
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start justify-between">
                {/* Left Section - Contact Form */}
                <div className="flex-1 w-full lg:max-w-lg order-2 md:order-1">
                    <ContactForm />
                </div>

                {/* Right Section - Contact Information */}
                <div className="flex-1 w-full lg:w-auto relative order-1 md:order-2">
                    <div className="relative rounded-lg overflow-hidden">
                        {/* Gradient Background - Navy to Gold */}
                        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-[var(--color-purple)]"></div>

                        {/* Abstract Circular Orbs */}
                        <div className="absolute inset-0 overflow-hidden">
                            {/* Large Navy Orb - Bottom Right */}
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
                            {/* Medium Gold Orb - Above and left of large orb */}
                            <div className="absolute bottom-20 right-20 w-64 h-64 bg-gold-500/15 rounded-full blur-2xl"></div>
                            {/* Small Navy Orb - Top Left */}
                            <div className="absolute top-8 left-8 w-40 h-40 bg-gold-300/10 rounded-full blur-xl"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-8 md:p-10 lg:p-12">
                            {/* Title */}
                            <h1 className="text-xl md:text-2xl font-sebold text-white mb-4 md:mb-6">
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
                                    <HiMail className="w-6 h-6 text-gold-300 shrink-0" />
                                    <a href="mailto:support@incorporia.com" className="text-white hover:text-gold-300 transition-colors text-base md:text-lg">
                                        support@incorporia.com
                                    </a>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center gap-3">
                                    <HiPhone className="w-6 h-6 text-gold-300 shrink-0" />
                                    <a href="tel:+15074104666" className="text-white hover:text-gold-300 transition-colors text-base md:text-lg">
                                        +1 (507) 410-4666
                                    </a>
                                </div>

                                {/* Instagram */}
                                <div className="flex items-center gap-3">
                                    <FaInstagram className="w-6 h-6 text-gold-300 shrink-0" />
                                    <a href="#" className="text-white hover:text-gold-300 transition-colors text-base md:text-lg">
                                        @incorporia
                                    </a>
                                </div>

                                {/* Twitter */}
                                <div className="flex items-center gap-3">
                                    <FaTwitter className="w-6 h-6 text-gold-300 shrink-0" />
                                    <a href="#" className="text-white hover:text-gold-300 transition-colors text-base md:text-lg">
                                        @incorporia
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
