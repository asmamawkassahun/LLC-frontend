import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Mail, Phone, BookOpen, HelpCircle, MapPin } from 'lucide-react';
import Logo from '@/components/brand/Logo';

const FooterSection = () => {
    return (
        <footer className="bg-navy-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-16 lg:pt-20 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Logo inverted markClassName="h-9 w-9" />
                        <p className="text-base text-white/80 leading-relaxed">
                            Formation, compliance, and banking access — everything you need to launch a US or UK company, handled from anywhere in the world.
                        </p>
                        <div className="flex items-center gap-6">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold-500 hover:text-navy-900 flex items-center justify-center transition-colors" aria-label="Facebook">
                                <FaFacebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold-500 hover:text-navy-900 flex items-center justify-center transition-colors" aria-label="Twitter">
                                <FaTwitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold-500 hover:text-navy-900 flex items-center justify-center transition-colors" aria-label="Instagram">
                                <FaInstagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Contact Column */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">Contact</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gold-400 shrink-0" />
                                <a href="mailto:support@incorporia.com" className="text-white/80 hover:text-white transition-colors">
                                    support@incorporia.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gold-400 shrink-0" />
                                <a href="tel:+15074104666" className="text-white/80 hover:text-white transition-colors">
                                    +1 (507) 410-4666
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5 text-gold-400 shrink-0" />
                                <a href="#" className="text-white/80 hover:text-white transition-colors">
                                    Helpdesk articles
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <HelpCircle className="w-5 h-5 text-gold-400 shrink-0" />
                                <Link to="/faq" className="text-white/80 hover:text-white transition-colors">
                                    FAQ
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Company Column */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">Company</h3>
                        <div className="space-y-3">
                            <Link to="/about" className="block text-white/80 hover:text-white transition-colors">
                                About us
                            </Link>
                            <Link to="/contact" className="block text-white/80 hover:text-white transition-colors">
                                Contact us
                            </Link>
                            <Link to="/pricing" className="block text-white/80 hover:text-white transition-colors">
                                Pricing
                            </Link>
                            <a href="#" className="block text-white/80 hover:text-white transition-colors">
                                KYC & AML policy
                            </a>
                            <a href="#" className="block text-white/80 hover:text-white transition-colors">
                                Service accessibility
                            </a>
                        </div>
                    </div>

                    {/* Legal Column */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">Legal</h3>
                        <div className="space-y-3">
                            <a href="#" className="block text-white/80 hover:text-white transition-colors">
                                Privacy policy
                            </a>
                            <a href="#" className="block text-white/80 hover:text-white transition-colors">
                                Refund policy
                            </a>
                            <a href="#" className="block text-white/80 hover:text-white transition-colors">
                                Terms and conditions
                            </a>
                            <a href="#" className="block text-white/80 hover:text-white transition-colors">
                                Legal disclaimer
                            </a>
                            <a href="#" className="block text-white/80 hover:text-white transition-colors">
                                Copyrights
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-6 border-t border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <p className="text-sm font-medium text-white/80">
                            © 2019-2026 Incorporia LLC. All rights reserved.
                        </p>
                        <p className="text-sm text-white/60 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gold-400" /> Serving founders in 150+ countries
                        </p>
                    </div>
                    <p className="text-[0.8125rem] text-white/60 leading-relaxed">
                        Incorporia is not a law firm and cannot provide legal advice. We specialize in tech-based business services and insightful guidance for general understanding. The information on our website, as well as that shared via emails, WhatsApp, Slack, SMS, Zoom, social media, and other communication platforms, is for informational purposes only and should not be taken as legal advice. By using our services and accessing our website, you agree to our Terms of Service, Privacy Policy, and Data Processing Addendum.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default FooterSection;
