export const ROUTES = {
    HOME: '/',
    ABOUT: '/about-us',
    PRICING: '/pricing',
    CONTACT: '/contact',
  } as const;
  
  export type Route = typeof ROUTES[keyof typeof ROUTES];