import { Wrench } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <Wrench className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
          System Under Maintenance
        </h1>
        
        <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
          System is under maintenance. We will be back soon.
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;

