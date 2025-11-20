import { GoQuestion } from "react-icons/go";
import { Button } from "../ui";
import { IoMdNotifications } from "react-icons/io";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface DashboardNavbarProps {
    onMenuClick: () => void;
}

const DashboardNavbar = ({ onMenuClick }: DashboardNavbarProps) => {
    return (
        <div className="pr-4 sm:pr-12 py-4 fixed top-0 left-0 lg:left-66 right-0 z-50 bg-background">
            <div className="flex items-center justify-between">
                {/* Left side - Hamburger menu and logo */}
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