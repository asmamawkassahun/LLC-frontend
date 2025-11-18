import { Outlet } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

const MainLayout = () => {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="pt-20 md:pt-24">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;

