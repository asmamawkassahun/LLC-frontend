import { useState } from 'react';
import MarketplaceServices from '@/components/admin/MarketplaceServices';
import MarketplaceOrders from '@/components/admin/MarketplaceOrders';

const AdminMarketplacePage = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'orders'>('services');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex bg-foreground/5 rounded-md p-1">
        <div className="flex gap-4 items-center justify-between w-full">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 font-medium transition-colors cursor-pointer w-full ${
              activeTab === 'services'
                ? 'bg-background text-primary rounded-md'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Marketplace Services
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-medium transition-colors cursor-pointer w-full ${
              activeTab === 'orders'
                ? 'bg-background text-primary rounded-md'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Marketplace Orders
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
