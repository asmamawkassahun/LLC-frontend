import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Link 
          to={ROUTES.HOME} 
          className="bg-button text-button-foreground px-6 py-3 rounded-lg hover:bg-button-hover transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;