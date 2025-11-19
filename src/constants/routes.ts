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
  } as const;
  
  export type Route = typeof ROUTES[keyof typeof ROUTES];