import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CountryInput from "@/components/sections/dashboard/CountryInput";
import CompanyDashboard from "@/components/sections/dashboard/CompanyDashboard";
import TransparentPricing from "@/components/sections/Features/TransparentPricing";
import apiClient from "@/utils/api-helpers/apiClient";
import { Loader2 } from "lucide-react";

type DashboardView = 'loading' | 'new-user' | 'unpaid-order' | 'paid-order' | 'country-selection';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [view, setView] = useState<DashboardView>('loading');
    const [countrySelected, setCountrySelected] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<'US' | 'UK'>('US');

    useEffect(() => {
        const determineDashboardView = async () => {
            try {
                // Check if user just registered (stored in localStorage)
                const justRegistered = localStorage.getItem('just_registered') === 'true';
                
                if (justRegistered) {
                    // Clear the flag
                    localStorage.removeItem('just_registered');
                    setView('new-user');
                    return;
                }

                // Check for primary company order
                try {
                    const response = await apiClient.get('/orders/primary-company');
                    const order = response.data.data;
                    
                    if (order) {
                        // Check payment status
                        const paymentStatus = order.payment_status?.toLowerCase();
                        
                        if (paymentStatus === 'unpaid' || paymentStatus === 'pending') {
                            // Redirect to payment page
                            setView('unpaid-order');
                            navigate(`/order/payment/${order.id}`, { replace: true });
                            return;
                        } else if (paymentStatus === 'paid') {
                            // Show company dashboard
                            setView('paid-order');
                            return;
                        }
                    }
                } catch (error: any) {
                    // 404 means no primary order found
                    if (error.response?.status !== 404) {
                        console.error('Error fetching primary company order:', error);
                    }
                }

                // No primary order or payment status doesn't match - show country input
                setView('new-user');
            } catch (error) {
                console.error('Error determining dashboard view:', error);
                setView('new-user');
            }
        };

        determineDashboardView();
    }, [navigate]);

    const handleCountrySelect = (country: 'US' | 'UK') => {
        setSelectedCountry(country);
        setCountrySelected(true);
        setView('country-selection');
    };

    // Show loading state
    if (view === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple" />
            </div>
        );
    }

    // If redirecting to payment, show loading
    if (view === 'unpaid-order') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple" />
            </div>
        );
    }

    // Show company dashboard for paid orders
    if (view === 'paid-order') {
        return <CompanyDashboard />;
    }

    // Show country input for new users or users without primary orders
    return (
        <div>
            {!countrySelected ? (
                <CountryInput onCountrySelect={handleCountrySelect} />
            ) : (
                <TransparentPricing variant="dashboard" defaultCountry={selectedCountry} />
            )}
        </div>
    );
};

export default DashboardPage;