import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { HiX } from 'react-icons/hi';

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-background border-b border-border fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 pt-6">
          <div className="flex items-center justify-between h-16">
            <Link 
              to={ROUTES.HOME} 
              className="text-xl font-bold text-primary cursor-pointer"
              onClick={closeMenu}
            >
              Privatily
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8">
              <Link
                to={ROUTES.HOME}
                className={`${isActive(ROUTES.HOME)
                    ? 'text-accent'
                    : 'text-foreground hover:text-accent'
                  } transition-colors font-medium cursor-pointer`}
              >
                Home
              </Link>
              <Link
                to={ROUTES.ABOUT}
                className={`${isActive(ROUTES.ABOUT)
                    ? 'text-accent'
                    : 'text-foreground hover:text-accent'
                  } transition-colors font-medium cursor-pointer`}
              >
                About
              </Link>
              <Link
                to={ROUTES.PRICING}
                className={`${isActive(ROUTES.PRICING)
                    ? 'text-accent'
                    : 'text-foreground hover:text-accent'
                  } transition-colors font-medium cursor-pointer`}
              >
                Pricing
              </Link>
              <Link
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
            <div className='hidden md:flex gap-6 items-center'>
              <button className='cursor-pointer font-medium hover:text-accent transition-colors'>
                Sign in
              </button>
              <Button className='px-6 py-6 font-medium text-base cursor-pointer'>
                Start My Business
              </Button>
            </div>

            {/* Mobile: Start My Business Button and Hamburger (hidden when menu is open) */}
            {!isMenuOpen && (
              <div className='md:hidden flex items-center gap-4'>
                <Button 
                  className='px-4 py-2 font-medium text-sm cursor-pointer'
                  onClick={closeMenu}
                >
                  Start My Business
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
              <div className='md:hidden'>
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
        className={`fixed inset-0 bg-background z-40 transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
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
                className={`text-left text-lg font-medium transition-colors cursor-pointer ${
                  isActive(ROUTES.HOME)
                    ? 'text-accent'
                    : 'text-foreground hover:text-accent'
                }`}
              >
                Home
              </Link>
              <Link
                to={ROUTES.PRICING}
                onClick={closeMenu}
                className={`text-left text-lg font-medium transition-colors cursor-pointer ${
                  isActive(ROUTES.PRICING)
                    ? 'text-accent'
                    : 'text-foreground hover:text-accent'
                }`}
              >
                Pricing
              </Link>
              <Link
                to={ROUTES.ABOUT}
                onClick={closeMenu}
                className={`text-left text-lg font-medium transition-colors cursor-pointer ${
                  isActive(ROUTES.ABOUT)
                    ? 'text-accent'
                    : 'text-foreground hover:text-accent'
                }`}
              >
                About
              </Link>
              <Link
                to={ROUTES.CONTACT}
                onClick={closeMenu}
                className={`text-left text-lg font-medium transition-colors cursor-pointer ${
                  isActive(ROUTES.CONTACT)
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
            <button 
              className='cursor-pointer font-medium hover:text-accent transition-colors text-lg'
              onClick={closeMenu}
            >
              Sign In
            </button>
            <Button 
              className='w-full max-w-xs px-6 py-6 font-medium text-base cursor-pointer'
              onClick={closeMenu}
            >
              Start My Business
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;