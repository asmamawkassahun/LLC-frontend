import { HiMail, HiPhone, HiBookOpen, HiInformationCircle, HiChat } from 'react-icons/hi';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FooterSection = () => {
    return (
        <div className="bg-blue-700  text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left Section - Textual Content */}
                    <div className="flex-2 space-y-8 lg:space-y-12">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-10">
                            {/* Top Left - Company Branding and Contact */}
                            <div className="space-y-6">
                                {/* Logo */}
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-primary-foreground rounded flex items-center justify-center">
                                        <span className="text-blue-900 font-bold text-xl">P</span>
                                    </div>
                                    <span className="text-2xl font-semibold text-primary-foreground">privatily</span>
                                </div>

                                {/* Tagline */}
                                <p className="text-base text-primary-foreground/90">
                                    Powering entrepreneurs up!
                                </p>
                                {/* Contact Information */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <HiMail className="w-5 h-5 text-primary-foreground shrink-0" />
                                        <a href="mailto:Support@privatily.com" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                                            Support@privatily.com
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <HiPhone className="w-5 h-5 text-primary-foreground shrink-0" />
                                        <a href="tel:+15074104666" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                                            +1 (507) 410-4666
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <HiBookOpen className="w-5 h-5 text-primary-foreground shrink-0" />
                                        <a href="#" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                                            Helpdesk articles
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <HiInformationCircle className="w-5 h-5 text-primary-foreground shrink-0" />
                                        <Link to="/faq" className="text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                                            FAQ
                                        </Link>
                                    </div>
                                </div>


                            </div>

                            {/* Middle Left - Navigation/Information Links */}

                            {/* Column 1 */}
                            <div className="space-y-3">
                                <Link to="/about" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                                    About us
                                </Link>
                                <Link to="/contact" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                                    Contact us
                                </Link>
                                <Link to="/pricing" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                                    Pricing
                                </Link>
                                <a href="#" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                                    KYC & AML policy
                                </a>
                                <a href="#" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                                    Service accessibility
                                </a>
                            </div>

                            {/* Column 2 */}
                            <div className="space-y-3">
                                <a href="#" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                                    Privacy policy
                                </a>
                                <a href="#" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                                    Refund policy
                                </a>
                                <a href="#" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                                    Terms and conditions
                                </a>
                                <a href="#" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                                    Legal disclaimer
                                </a>
                                <a href="#" className="block text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                                    Copyrights
                                </a>
                            </div>
                        </div>
                        {/* Social Media Icons */}
                        <div className="flex items-center gap-3">
                            <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors">
                                <FaFacebook className="w-5 h-5 text-primary-foreground" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors">
                                <FaTwitter className="w-5 h-5 text-primary-foreground" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors">
                                <FaInstagram className="w-5 h-5 text-primary-foreground" />
                            </a>
                        </div>

                        {/* Bottom Left - Copyright and Disclaimer */}
                        <div className="space-y-4 pt-4 ">
                            <p className="text-sm text-primary-foreground/90">
                                © 2019-2025 All rights reserved.
                            </p>
                            <p className="text-xs md:text-sm text-primary-foreground/80 leading-relaxed">
                                Privatily is not a law firm nor can provide legal advice. We specialize in providing tech-based business services and insightful guidance for general understanding. The information on our website, as well as that shared via emails, WhatsApp, Slack, SMS, Zoom, social media, and other communication platforms, is for informational purposes only and should not be taken as legal advice. By using our services and accessing our website, you agree to our Terms of Service, Privacy Policy, and Data Processing Addendum.
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Visual Content */}
                    <div className="flex-1 w-full h-96 relative">
                        <div className="relative">
                            {/* Main Image - Man with Tablet */}
                            <div className="relative z-10">
                                <img
                                    src="https://privatily.com/wp-content/uploads/2023/08/image-2-min.png"
                                    alt="Man with tablet"
                                    className="w-full h-auto rounded-lg object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FooterSection;