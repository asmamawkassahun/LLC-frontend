import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MarketplaceServices from '@/components/admin/MarketplaceServices';
import MarketplaceOrders from '@/components/admin/MarketplaceOrders';

const AdminMarketplacePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as 'services' | 'orders' | null;
  const [activeTab, setActiveTab] = useState<'services' | 'orders'>(tabParam || 'services');

  // Update tab when URL parameter changes
  useEffect(() => {
    if (tabParam && (tabParam === 'services' || tabParam === 'orders')) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'services' | 'orders') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex bg-foreground/5 rounded-md p-1">
        <div className="flex gap-4 items-center justify-between w-full">
          <button
            onClick={() => handleTabChange('services')}
            className={`px-4 py-2 font-medium transition-colors cursor-pointer w-full ${
              activeTab === 'services'
                ? 'bg-background text-primary rounded-md'
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            <span className="hidden sm:inline">Marketplace</span> Services
          </button>
          <button
            onClick={() => handleTabChange('orders')}
            className={`px-4 py-2 font-medium transition-colors cursor-pointer w-full ${
              activeTab === 'orders'
                ? 'bg-background text-primary rounded-md'
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            <span className="hidden sm:inline">Marketplace</span> Orders
          </button>
        </div>
      </div>

      {/* Marketplace Services Tab */}
      {activeTab === 'services' && <MarketplaceServices />}

      {/* Marketplace Orders Tab */}
      {activeTab === 'orders' && <MarketplaceOrders />}
    </div>
  );
};

export default AdminMarketplacePage;
