import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import {
    HiX,
    HiChevronDown
} from 'react-icons/hi';
import { Button } from '../ui';

interface DashboardSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Company {
    id: string;
    name: string;
    country: 'US' | 'UK';
}

const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
    const location = useLocation();
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
        onClose(); // Close sidebar on mobile
        navigate(ROUTES.ORDER_COUNTRY_SELECTION);
    };

    const getCountryFlag = (country: 'US' | 'UK') => {
        return country === 'US' ? '🇺🇸' : '🇬🇧';
    };

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

    const navigationItems = [
        {
            imageUrl: 'https://app.privatily.com/assets/img/menu/home.svg',
            label: 'Dashboard',
            path: ROUTES.DASHBOARD
        },
        {
            imageUrl: 'https://app.privatily.com/assets/img/header-icons/PRODUCTS.svg',
            label: 'Marketplace',
            path: ROUTES.MARKETPLACE,
            badge: 'NEW'
        },
        {
            imageUrl: 'https://app.privatily.com/assets/img/menu/business.svg',
            label: 'Orders',
            path: ROUTES.ORDERS
        },
        {
            imageUrl: 'https://app.privatily.com/assets/img/menu/refer-a-friend.svg',
            label: 'Affiliate Program',
            path: ROUTES.AFFILIATE_PROGRAM
        },
        {
            imageUrl: 'https://app.privatily.com/assets/img/menu/settings.svg',
            label: 'Settings',
            path: ROUTES.SETTINGS
        },
        {
            imageUrl: 'https://app.privatily.com/assets/img/menu/logout.svg',
            label: 'Log Out',
            path: ROUTES.LOGOUT
        },
    ];

    // Only show company selector if there are companies
    const hasCompanies = companies.length > 0;

    return (
        <>
            <div className={`
                fixed left-0 top-0 h-full w-66 bg-muted flex flex-col z-50
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 z-70 lg:z-40
            `}>
                {/* Close Button for mobile/tablet */}
                <div className="relative flex flex-col items-center justify-between px-6 py-4  lg:hidden">

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-right absolute top-2 right-2"
                        aria-label="Close sidebar"
                    >
                        <HiX className="w-5 h-5 text-gray-600" />
                    </button>
                    <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2 pt-12">
                        <div className="relative w-32 shrink-0">
                            <img src="https://app.privatily.com/assets/img/logo.png" alt="privatily" />
                        </div>
                    </Link>
                </div>

                {/* Logo - Desktop */}
                <div className="hidden lg:flex pr-6 pt-12 items-center justify-center  pb-6">
                    <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2">
                        <div className="relative w-32 shrink-0">
                            <img src="https://app.privatily.com/assets/img/logo.png" alt="privatily" />
                        </div>
                    </Link>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-4 py-5">
                    <ul className="space-y-1">
                        {navigationItems.map((item) => {
                            // Dashboard is active by default if no other route is active
                            const active = item.path === ROUTES.DASHBOARD 
                                ? (location.pathname === ROUTES.DASHBOARD || !navigationItems.some(navItem => navItem.path !== ROUTES.DASHBOARD && isActive(navItem.path)))
                                : isActive(item.path);

                            return (
                                <li key={item.label}>
                                    <Link
                                        to={item.path}
                                        onClick={() => {
                                            // Close sidebar on mobile/tablet when clicking a link
                                            if (window.innerWidth < 1024) {
                                                onClose();
                                            }
                                        }}
                                        className={`
                                            flex items-center gap-3 px-4 py-4.5 rounded-lg transition-colors
                                            ${active
                                                ? 'text-gray-900 font-medium bg-gray-50 shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        {item.imageUrl ? (
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.label} 
                                                className={`w-5 h-5 shrink-0 ${active ? 'opacity-100' : 'opacity-60'}`}
                                            />
                                        ) : (
                                            <div className={`w-5 h-5 shrink-0 ${active ? 'text-gray-900' : 'text-gray-600'}`} />
                                        )}
                                        <span className="flex-1 text-sm font-bold">{item.label}</span>
                                        {item.badge && (
                                            <span className="px-2 py-0.5 text-xs font-semibold text-purple-700 border border-purple-700 bg-purple-100 rounded">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Company Selector - Bottom of Sidebar (Mobile only) */}
                {hasCompanies && (
                    <div className="lg:hidden px-4 pb-4 border-t border-border pt-4">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-background hover:bg-gray-50 rounded-lg transition-colors border border-border"
                            >
                                <div className="flex items-center gap-2">
                                    {/* <span className="text-lg">{getCountryFlag(selectedCompany.country)}</span> */}
                                    <span className="text-sm font-medium text-foreground">{selectedCompany.name}</span>
                                </div>
                                <div className='flex items-center justify-center w-5 h-5 rounded-full bg-blue-700'>
                                    <HiChevronDown className={`w-4 h-4 text-background  transition-transform ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </button>

                            {/* Company Dropdown Modal */}
                            {isCompanyDropdownOpen && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
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
                                    <div className="overflow-y-auto flex-1">
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
                    </div>
                )}
            </div>
        </>
    );
};

export default DashboardSidebar;
