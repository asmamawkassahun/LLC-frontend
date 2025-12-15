import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Building2,
  CreditCard,
  DollarSign,
  Ticket,
  Store,
  UsersRound,
  MessageSquare,
  Settings,
  FileText,
  MapPin,
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: ROUTES.ADMIN_DASHBOARD,
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          title: 'Orders',
          url: ROUTES.ADMIN_ORDERS,
          icon: ShoppingCart,
        },
        {
          title: 'Users',
          url: ROUTES.ADMIN_USERS,
          icon: Users,
        },
        {
          title: 'Companies',
          url: ROUTES.ADMIN_COMPANIES,
          icon: Building2,
        },
        {
          title: 'Payments',
          url: ROUTES.ADMIN_PAYMENTS,
          icon: CreditCard,
        },
      ],
    },
    {
      title: 'Configuration',
      items: [
        {
          title: 'Pricing Plans',
          url: ROUTES.ADMIN_PRICING_PLANS,
          icon: DollarSign,
        },
        {
          title: 'Promo Codes',
          url: ROUTES.ADMIN_PROMO_CODES,
          icon: Ticket,
        },
        {
          title: 'Marketplace',
          url: ROUTES.ADMIN_MARKETPLACE,
          icon: Store,
        },
        {
          title: 'Affiliates',
          url: ROUTES.ADMIN_AFFILIATES,
          icon: UsersRound,
        },
        {
          title: 'Registered Agent Addresses',
          url: ROUTES.ADMIN_REGISTERED_AGENT_ADDRESSES,
          icon: MapPin,
        },
      ],
    },
    {
      title: 'Support & System',
      items: [
        {
          title: 'Support Tickets',
          url: ROUTES.ADMIN_SUPPORT,
          icon: MessageSquare,
        },
      ],
    },
  ];

  const isActive = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + '/');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <div className="relative w-32 shrink-0">
            <img src="https://app.privatily.com/assets/img/logo.png" alt="privatily" />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                        <Link to={item.url}>
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;

