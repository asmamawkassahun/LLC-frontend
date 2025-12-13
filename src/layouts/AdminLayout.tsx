import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

const AdminLayout = () => {
  // Calculate initial state based on screen size
  // Only expand on large screens (>= 1024px), collapse on small and medium
  const getInitialOpenState = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024; // lg breakpoint
    }
    return false; // Default to collapsed if SSR
  };

  const [isOpen, setIsOpen] = useState(getInitialOpenState);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      // Only expand on large screens (>= 1024px)
      // Collapse on small (< 768px) and medium (768px - 1023px) screens
      const isLargeScreen = width >= 1090;
      setIsOpen(isLargeScreen);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <SidebarProvider open={isOpen} onOpenChange={setIsOpen}>
      <AdminSidebar />
      <SidebarInset>
        <AdminNavbar />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-10">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;

