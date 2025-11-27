import StepHeader from './StepHeader';
import { Button } from '@/components/ui/button';
import OwnersChart from './OwnersChart';
import { FaPencil } from 'react-icons/fa6';

interface OrderSummaryData {
    plan?: Array<{ countryName: string; pricingPlan: string; basePrice: number; yearlyPrice: number }>;
    companyName: string;
    type: string;
    category: string[];
    state: { name: string; cost: number };
    owners: Array<{ id: string; fullName: string; ownershipPercentage: number; isCompany: boolean }>;
    address: {
        streetAddress: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        hasSSNOrITIN: boolean | null;
        ssnOrITIN: string;
    };
}

interface Step5OrderSummaryProps {
    onBack?: () => void;
    onSubmit?: () => void;
    formData: OrderSummaryData;
    onEditStep?: (step: number) => void;
}

const categories = [
    { id: 'tech', label: 'Tech' },
    { id: 'retail', label: 'Retail' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'consulting', label: 'Consulting' },
    { id: 'education', label: 'Education' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'manufacturing', label: 'Manufacturing' },
    { id: 'finance', label: 'Finance' },
    { id: 'real-estate', label: 'Real Estate' },
    { id: 'logistics', label: 'Logistics' },
    { id: 'food', label: 'Food' },
    { id: 'wellness', label: 'Wellness' },
    { id: 'hospitality', label: 'Hospitality' },
    { id: 'construction', label: 'Construction' },
    { id: 'legal', label: 'Legal' },
    { id: 'other', label: 'Other' },
] as const;

const stateNames: Record<string, string> = {
    'new-mexico': 'New Mexico',
    'wyoming': 'Wyoming',
    'delaware': 'Delaware',
    'other': 'Other',
};

// Helper function to get state name
const getStateName = (stateId: string): string => {
    // If it's a predefined state, return the mapped name
    if (stateNames[stateId]) {
        return stateNames[stateId];
    }
    // Otherwise, it's an "other" state - return the state name directly
    return stateId;
};

const Step5OrderSummary = ({ formData, onEditStep }: Step5OrderSummaryProps) => {
    const categoryLabels = formData.category
        .map(catId => categories.find(cat => cat.id === catId)?.label || catId)
        .filter(Boolean);

    // Get state name and fee from formData.state object
    const stateName = formData.state.name ? getStateName(formData.state.name) : 'N/A';
    const stateFee = formData.state.name ? (formData.state.cost > 0 ? `$${formData.state.cost}.00` : '$0.00') : '$0.00';

    // Check if plan is for UK (hide state card for UK plans)
    const isUKPlan = formData.plan && formData.plan.length > 0 
        ? formData.plan[0].pricingPlan?.includes('_uk') || false 
        : false;

    const formatAddress = (): string => {
        const parts = [
            formData.address.streetAddress,
            formData.address.city,
            formData.address.state,
            formData.address.zipCode,
            formData.address.country,
        ].filter(Boolean);

        return parts.length > 0 ? parts.join(', ') : 'N/A';
    };

    const handleEdit = (step: number) => {
        if (onEditStep) {
            onEditStep(step);
        }
    };


    return (
        <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pb-6 md:pb-8">
            <div className="flex flex-col gap-8">
                {/* Header */}
                <StepHeader
                    icon="https://app.privatily.com/assets/img/header-icones/order-summary.png"
                    title="Order summary"
                    subtitle="Double-check your details and move forward!"
                />

                {/* Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* The company Card */}
                    <div className="border border-border rounded-lg p-6 bg-background flex flex-col">
                        <h3 className="text-base font-bold text-purple mb-4">The company</h3>
                        <div className="flex-1 space-y-3">
                            <div>
                                <span className="text-sm text-muted-foreground">Company Name: </span>
                                <span className="text-sm font-semibold text-foreground">{formData.companyName || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Category: </span>
                                {categoryLabels.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {categoryLabels.map((label, index) => (
                                            <span
                                                key={index}
                                                className="inline-block px-3 py-1 bg-accent/15 text-blue-900 border border-accent text-xs font-medium rounded-sm"
                                            >
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-sm font-semibold text-foreground">N/A</span>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(1)}
                            className="mt-4 w-full border hover:bg-transparent hover:text-purple border-border text-purple shadow-xs hover:shadow-md cursor-pointer"
                        >
                            <FaPencil className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </div>

                    {/* State Card - Hidden for UK plans */}
                    {!isUKPlan && (
                        <div className="border border-border rounded-lg p-6 bg-background flex flex-col">
                            <h3 className="text-base font-bold text-purple mb-4">State</h3>
                            <div className="flex-1 space-y-3">
                                <div>
                                    <span className="text-sm text-muted-foreground">Selection: </span>
                                    <span className="text-sm font-semibold text-foreground">{stateName}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">One-time state fees: </span>
                                    <span className="text-sm font-semibold text-foreground">{stateFee}</span>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(2)}
                                className="mt-4 w-full border hover:bg-transparent hover:text-purple border-border text-purple shadow-xs hover:shadow-md cursor-pointer"
                            >
                                <FaPencil className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                        </div>
                    )}

                    {/* Owners Card */}
                    <div className="border border-border rounded-lg p-6 bg-background flex flex-col">
                        <h3 className="text-base font-bold text-purple mb-4">Owners</h3>
                        <div className="flex-1 flex items-center justify-center min-h-[200px]">
                            <OwnersChart owners={formData.owners} />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(3)}
                            className="mt-4 w-full border hover:bg-transparent hover:text-purple border-border text-purple shadow-xs hover:shadow-md cursor-pointer"
                        >
                            <FaPencil className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </div>

                    {/* Address Card */}
                    <div className="border border-border rounded-lg p-6 bg-background flex flex-col">
                        <h3 className="text-base font-bold text-purple mb-4">Address</h3>
                        <div className="flex-1">
                            <p className="text-sm text-foreground">{formatAddress()}</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(4)}
                            className="mt-4 w-full border hover:bg-transparent hover:text-purple border-border text-purple shadow-xs hover:shadow-md cursor-pointer"
                        >
                            <FaPencil className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step5OrderSummary;
