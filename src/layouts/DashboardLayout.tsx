import { useState } from 'react';
import DashboardNavbar from "@/components/layout/DashboardNavbar";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Outlet } from "react-router-dom";


const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex bg-white">
            {/* Sidebar */}
            <DashboardSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />
            
            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 w-full">
                <DashboardNavbar 
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                />
            <div className=" pt-20 md:pt-16">
                <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;