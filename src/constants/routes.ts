export const ROUTES = {
    HOME: '/',
    ABOUT: '/about-us',
    PRICING: '/pricing',
    CONTACT: '/contact',
    LOGIN: '/login',
    REGISTER: '/register',
  } as const;
  
  export type Route = typeof ROUTES[keyof typeof ROUTES];