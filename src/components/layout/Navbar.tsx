import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={ROUTES.HOME} className="text-xl font-bold text-primary">
            Privatily
          </Link>
          <div className="flex gap-6">
            <Link
              to={ROUTES.HOME}
              className={`${
                isActive(ROUTES.HOME)
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              } transition-colors`}
            >
              Home
            </Link>
            <Link
              to={ROUTES.ABOUT}
              className={`${
                isActive(ROUTES.ABOUT)
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              } transition-colors`}
            >
              About
            </Link>
            <Link
              to={ROUTES.PRICING}
              className={`${
                isActive(ROUTES.PRICING)
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              } transition-colors`}
            >
              Pricing
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className={`${
                isActive(ROUTES.CONTACT)
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              } transition-colors`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;