import DashboardNavbar from "@/components/layout/DashboardNavbar";
import { Outlet } from "react-router-dom";


const DashboardLayout = () => {
    return (
        <div>
            <DashboardNavbar />
            <div className="pt-20 md:pt-24">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;