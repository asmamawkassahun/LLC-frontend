import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AffiliatesList from '@/components/admin/AffiliatesList';
import PayoutRequestsList from '@/components/admin/PayoutRequestsList';

const AdminAffiliatesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as 'affiliates' | 'payouts' | null;
  const [activeTab, setActiveTab] = useState<'affiliates' | 'payouts'>(tabParam || 'affiliates');

  // Update tab when URL parameter changes
  useEffect(() => {
    if (tabParam && (tabParam === 'affiliates' || tabParam === 'payouts')) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'affiliates' | 'payouts') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Affiliates</h1>
        <p className="text-muted-foreground">Manage affiliates and payout requests</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-foreground/5 rounded-md p-1">
        <div className="flex gap-4 items-center justify-between w-full">
          <button
            onClick={() => handleTabChange('affiliates')}
            className={`px-4 py-2 font-medium transition-colors cursor-pointer w-full ${
              activeTab === 'affiliates'
                ? 'bg-background text-primary rounded-md'
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Affiliates
          </button>
          <button
            onClick={() => handleTabChange('payouts')}
            className={`px-4 py-2 font-medium transition-colors cursor-pointer w-full ${
              activeTab === 'payouts'
                ? 'bg-background text-primary rounded-md'
                : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Payout Requests
          </button>
        </div>
      </div>

      {/* Affiliates Tab */}
      {activeTab === 'affiliates' && <AffiliatesList />}

      {/* Payout Requests Tab */}
      {activeTab === 'payouts' && <PayoutRequestsList />}
    </div>
  );
};

export default AdminAffiliatesPage;

