import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { HiX } from 'react-icons/hi';
import { gsap } from 'gsap';

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Refs for navbar items (in order: logo → home → about → pricing → contact → sign in → start my business)
  const logoRef = useRef<HTMLAnchorElement>(null);
  const homeRef = useRef<HTMLAnchorElement>(null);
  const aboutRef = useRef<HTMLAnchorElement>(null);
  const pricingRef = useRef<HTMLAnchorElement>(null);
  const contactRef = useRef<HTMLAnchorElement>(null);
  const signInRef = useRef<HTMLAnchorElement>(null);
  const startBusinessRef = useRef<HTMLAnchorElement>(null);

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Animation function for navbar items
  const animateNavbarItems = () => {
    const items = [
      logoRef.current,
      homeRef.current,
      aboutRef.current,
      pricingRef.current,
      contactRef.current,
      signInRef.current,
      startBusinessRef.current,
    ].filter(Boolean) as HTMLElement[];

    if (items.length === 0) return;

    // Set initial state (hidden above)
    gsap.set(items, { y: -50, opacity: 0 });

    // Animate items sequentially from left to right
    const tl = gsap.timeline();
    items.forEach((item, index) => {
      tl.to(item, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      }, index * 0.1); // Stagger by 0.1s between each item
    });
  };

  // Animate on mount and route change
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      animateNavbarItems();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Animate when navbar becomes visible (after scroll)
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        animateNavbarItems();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollDifference = currentScrollY - lastScrollY.current;
      const isBottom = windowHeight + currentScrollY >= documentHeight - 10; // 10px threshold
      const isAtTop = currentScrollY <= 0;

      if (isAtTop) {
        // At top: always show navbar
        setIsVisible(true);
      } else if (isBottom) {
        // At bottom: always show navbar smoothly from top
        setIsVisible(true);
      } else if (scrollDifference < 0) {
        // Scrolling up: show navbar
        setIsVisible(true);
      } else if (scrollDifference > 0) {
        // Scrolling down: hide navbar (goes off to top slowly)
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`bg-background  fixed top-0 left-0 right-0 z-50 will-change-transform transition-transform duration-500 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 pt-6">
          <div className="flex items-center justify-between h-16">
            <Link
              ref={logoRef}
              to={ROUTES.HOME}
              className="text-xl font-bold text-primary cursor-pointer"
              onClick={closeMenu}
            >
              Privatily
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-8">
              <Link
                ref={homeRef}
                to={ROUTES.HOME}
                className={`${isActive(ROUTES.HOME)
                  ? 'text-accent'
                  : 'text-foreground hover:text-accent'
                  } transition-colors font-medium cursor-pointer`}
              >
                Home
              </Link>
              <Link
                ref={aboutRef}
                to={ROUTES.ABOUT}
                className={`${isActive(ROUTES.ABOUT)
                  ? 'text-accent'
                  : 'text-foreground hover:text-accent'
                  } transition-colors font-medium cursor-pointer`}
              >
                About
              </Link>
              <Link
                ref={pricingRef}
                to={ROUTES.PRICING}
                className={`${isActive(ROUTES.PRICING)
                  ? 'text-accent'
                  : 'text-foreground hover:text-accent'
                  } transition-colors font-medium cursor-pointer`}
              >
                Pricing
              </Link>
              <Link
                ref={contactRef}
                to={ROUTES.CONTACT}
                className={`${isActive(ROUTES.CONTACT)
                  ? 'text-accent font-semibold'
                  : 'text-foreground hover:text-accent'
                  } transition-colors font-medium cursor-pointer`}
              >
                Contact us
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className='hidden lg:flex gap-6 items-center'>
              <Link 
                ref={signInRef}
                to={ROUTES.LOGIN}
                className='cursor-pointer font-medium hover:text-accent transition-colors'
              >
                Sign in
              </Link>
              <Button 
                asChild
                className='px-6 py-6 font-medium text-base cursor-pointer'
              >
                <Link ref={startBusinessRef} to={ROUTES.REGISTER}>
                  Start My Business
                </Link>
              </Button>
            </div>

            {/* Mobile: Start My Business Button and Hamburger (hidden when menu is open) */}
            {!isMenuOpen && (
              <div className='lg:hidden flex items-center gap-4'>
                <Button
                  asChild
                  className='px-4 py-2 font-medium text-sm cursor-pointer'
                >
                  <Link to={ROUTES.REGISTER} onClick={closeMenu}>
                    Start My Business
                  </Link>
                </Button>
                <button
                  onClick={toggleMenu}
                  className="text-foreground hover:text-accent transition-colors p-2 cursor-pointer"
                  aria-label="Toggle menu"
                >
                  <HiOutlineMenuAlt1 className="w-6 h-6 transition-all duration-300" />
                </button>
              </div>
            )}

            {/* Mobile: X icon when menu is open */}
            {isMenuOpen && (
              <div className='lg:hidden'>
                <button
                  onClick={toggleMenu}
                  className="text-foreground hover:text-accent transition-colors p-2 cursor-pointer"
                  aria-label="Close menu"
                >
                  <HiX className="w-6 h-6 transition-all duration-300" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-background z-40 transition-transform duration-300 ease-in-out lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        style={{ paddingTop: '64px' }}
      >
        <div className="h-full flex flex-col">

          {/* Mobile Navigation Links */}
          <div className="flex-1 px-4 py-8">
            <nav className="flex flex-col gap-6">
              <Link
                to={ROUTES.HOME}
                onClick={closeMenu}
                className={`text-left text-lg font-medium transition-colors cursor-pointer ${isActive(ROUTES.HOME)
                    ? 'text-accent'
                    : 'text-foreground hover:text-accent'
                  }`}
              >
                Home
              </Link>
              <Link
                to={ROUTES.PRICING}
                onClick={closeMenu}
                className={`text-left text-lg font-medium transition-colors cursor-pointer ${isActive(ROUTES.PRICING)
                    ? 'text-accent'
                    : 'text-foreground hover:text-accent'
                  }`}
              >
                Pricing
              </Link>
              <Link
                to={ROUTES.ABOUT}
                onClick={closeMenu}
                className={`text-left text-lg font-medium transition-colors cursor-pointer ${isActive(ROUTES.ABOUT)
                    ? 'text-accent'
                    : 'text-foreground hover:text-accent'
                  }`}
              >
                About
              </Link>
              <Link
                to={ROUTES.CONTACT}
                onClick={closeMenu}
                className={`text-left text-lg font-medium transition-colors cursor-pointer ${isActive(ROUTES.CONTACT)
                    ? 'text-accent'
                    : 'text-foreground hover:text-accent'
                  }`}
              >
                Contact us
              </Link>
            </nav>
          </div>

          {/* Mobile Actions at Bottom */}
          <div className="px-4 py-8  flex flex-col items-center gap-4">
            <Link
              to={ROUTES.LOGIN}
              className='cursor-pointer font-medium w-full hover:text-accent transition-colors text-lg'
              onClick={closeMenu}
            >
              Sign In
            </Link>
            <Button
              asChild
              className='w-full max-w-full px-6 py-6 font-medium text-base cursor-pointer'
            >
              <Link to={ROUTES.REGISTER} onClick={closeMenu}>
                Start My Business
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;