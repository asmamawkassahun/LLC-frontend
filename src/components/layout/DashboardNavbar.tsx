import { useState, useRef, useEffect } from 'react';
import { GoQuestion } from "react-icons/go";
import { HiX, HiChevronDown } from "react-icons/hi";
import { Button } from "../ui";
import { IoMdNotifications } from "react-icons/io";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface DashboardNavbarProps {
    onMenuClick: () => void;
}

interface Company {
    id: string;
    name: string;
    country: 'US' | 'UK';
}

const DashboardNavbar = ({ onMenuClick }: DashboardNavbarProps) => {
    const navigate = useNavigate();
    const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Mock companies data - replace with actual data from API/state management
    const companies: Company[] = [
        { id: '1', name: 'DREAM LIMITED', country: 'UK' },
        { id: '2', name: 'Cvc LLC', country: 'US' },
        { id: '3', name: 'Wee LLC', country: 'US' },
        { id: '4', name: '32 LLC', country: 'US' },
        { id: '5', name: 'Rerer LLC', country: 'US' },
    ];

    const [selectedCompany, setSelectedCompany] = useState<Company>(companies[0]);
    const otherCompanies = companies.filter(c => c.id !== selectedCompany.id);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCompanyDropdownOpen(false);
            }
        };

        if (isCompanyDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCompanyDropdownOpen]);

    const handleCompanySelect = (company: Company) => {
        setSelectedCompany(company);
        setIsCompanyDropdownOpen(false);
        // TODO: Update context/state with selected company
    };

    const handleStartNewCompany = () => {
        setIsCompanyDropdownOpen(false);
        navigate(ROUTES.ORDER_COUNTRY_SELECTION);
    };

    const getCountryFlag = (country: 'US' | 'UK') => {
        return country === 'US' ? '🇺🇸' : '🇬🇧';
    };

    // Only show company selector if there are companies
    const hasCompanies = companies.length > 0;

    return (
        <div className="pr-4 sm:pr-12 py-3 fixed top-0 left-0 lg:left-66 right-0 z-50 bg-background">
            <div className="flex items-center justify-between">
                {/* Left side - Hamburger menu, logo, and company selector */}
                <div className="flex items-center gap-4 md:pl-4 lg:pl-0">
                    {/* Hamburger Menu - visible on medium screens, hidden on large */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        <HiOutlineMenuAlt1 className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Logo - visible on medium screens when sidebar is closed */}
                    <Link to={ROUTES.DASHBOARD} className="lg:hidden flex items-center gap-2">
                        <div className="relative w-24 shrink-0">
                            <img src="https://app.privatily.com/assets/img/logo.png" alt="privatily" />
                        </div>
                    </Link>

                    {/* Company Selector - Only show on desktop if companies exist */}
                    {hasCompanies && (
                        <div className="hidden lg:block relative pl-6" ref={dropdownRef}>
                            <button
                                onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                                className="flex items-center gap-4 px-3 py-2 bg-background border border-border hover:shadow-md shadow-sm cursor-pointer rounded-sm transition-colors"
                            >
                                {/* <span className="text-lg">{getCountryFlag(selectedCompany.country)}</span> */}
                                <span className="text-sm font-medium text-foreground">{selectedCompany.name}</span>
                                <div className='flex items-center justify-center w-5 h-5 rounded-full bg-blue-700'>
                                    <HiChevronDown className={`w-4 h-4 text-background  transition-transform ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </button>

                            {/* Company Dropdown Modal */}
                            {isCompanyDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50">
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-4 border-b border-border">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{getCountryFlag(selectedCompany.country)}</span>
                                            <span className="text-sm font-semibold text-foreground">{selectedCompany.name}</span>
                                        </div>
                                        <button
                                            onClick={() => setIsCompanyDropdownOpen(false)}
                                            className="p-1 hover:bg-muted rounded transition-colors"
                                            aria-label="Close"
                                        >
                                            <HiX className="w-4 h-4 text-foreground" />
                                        </button>
                                    </div>

                                    {/* Company List */}
                                    <div className="max-h-64 overflow-y-auto">
                                        {otherCompanies.map((company) => (
                                            <button
                                                key={company.id}
                                                onClick={() => handleCompanySelect(company)}
                                                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-muted transition-colors text-left"
                                            >
                                                <span className="text-lg">{getCountryFlag(company.country)}</span>
                                                <span className="text-sm text-foreground">{company.name}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Start New Company Button */}
                                    <div className="p-4 border-t border-border">
                                        <Button
                                            onClick={handleStartNewCompany}
                                            className="w-full bg-purple hover:bg-purple-dark text-white font-medium py-2.5 rounded-sm"
                                        >
                                            Start a new company <span className="ml-1">&gt;</span>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right side - Get help and notifications */}
                <div className="flex gap-4 items-center">
                    <Button
                        variant="outline"
                        size="icon"
                        className="bg-blue-700 w-24 hover:bg-accent-dark text-white text-xs px-4 border-none rounded-full"
                    >
                        <GoQuestion className="w-6 h-6 " />
                        Get help
                    </Button>
                    <IoMdNotifications className="w-6 h-6 text-foreground/25" />
                </div>
            </div>
        </div>
    );
};

export default DashboardNavbar;
