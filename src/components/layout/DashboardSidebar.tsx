import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { HiX } from 'react-icons/hi';
import authService from '@/services/authService';
import CompanySelector from '@/components/company/CompanySelector';

interface DashboardSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
            // Navigate to login page after logout
            navigate(ROUTES.LOGIN);
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails, clear tokens and redirect
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate(ROUTES.LOGIN);
        }
    };

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

    const handleStartNewCompany = () => {
        onClose(); // Close sidebar on mobile
        navigate(ROUTES.ORDER_COUNTRY_SELECTION);
    };

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

                            // Handle logout separately
                            if (item.path === ROUTES.LOGOUT) {
                                return (
                                    <li key={item.label}>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                // Close sidebar on mobile/tablet when clicking logout
                                                if (window.innerWidth < 1024) {
                                                    onClose();
                                                }
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-4.5 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 text-left cursor-pointer"
                                        >
                                            {item.imageUrl ? (
                                                <img 
                                                    src={item.imageUrl} 
                                                    alt={item.label} 
                                                    className="w-5 h-5 shrink-0 opacity-60"
                                                />
                                            ) : (
                                                <div className="w-5 h-5 shrink-0 text-gray-600" />
                                            )}
                                            <span className="flex-1 text-sm font-bold">{item.label}</span>
                                        </button>
                                    </li>
                                );
                            }

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
                <div className="lg:hidden px-4 pb-4 border-t border-border pt-4">
                    <CompanySelector 
                        variant="sidebar" 
                        onStartNewCompany={handleStartNewCompany}
                    />
                </div>
            </div>
        </>
    );
};

export default DashboardSidebar;
