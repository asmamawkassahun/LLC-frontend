export const ROUTES = {
    HOME: '/',
    ABOUT: '/about-us',
    PRICING: '/pricing',
    CONTACT: '/contact',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    ORDER_ADD: '/order/add',
    ORDER_PAYMENT: '/order/payment',
    ORDER_PAYMENT_WITH_ID: '/order/payment/:id',
    ORDER_UPGRADE_WITH_ID: '/order/upgrade/:id',
    MARKETPLACE: '/marketplace',
    AFFILIATE_PROGRAM: '/referrals',
    SETTINGS: '/settings',
    ORDERS: '/orders',
    LOGOUT: '/logout',
  } as const;
  
  export type Route = typeof ROUTES[keyof typeof ROUTES];