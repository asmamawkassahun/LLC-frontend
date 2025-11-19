import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import StepHeader from './StepHeader';
import { Button } from '@/components/ui/button';
import { HiCheck, HiPencilAlt, HiDownload } from 'react-icons/hi';

interface OrderSummaryData {
    companyName: string;
    type: string;
    category: string;
    state: string;
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
    onBack: () => void;
    onSubmit: () => void;
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

const stateFees: Record<string, string> = {
    'new-mexico': '$0.00',
    'wyoming': '$50.00',
    'delaware': '$100.00',
    'other': '$0.00',
};

const stateNames: Record<string, string> = {
    'new-mexico': 'New Mexico',
    'wyoming': 'Wyoming',
    'delaware': 'Delaware',
    'other': 'Other',
};

const Step5OrderSummary = ({ onBack, onSubmit, formData, onEditStep }: Step5OrderSummaryProps) => {
    const navigate = useNavigate();
    const [lastSaved, setLastSaved] = useState<Date>(new Date());
    const categoryLabel = categories.find(cat => cat.id === formData.category)?.label || formData.category;
    const stateFee = stateFees[formData.state] || '$0.00';
    const stateName = stateNames[formData.state] || formData.state;

    useEffect(() => {
        // Update last saved time periodically
        const interval = setInterval(() => {
            setLastSaved(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const getTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes === 1) return '1 minute ago';
        return `${diffInMinutes} minutes ago`;
    };

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

    const handleDownload = () => {
        // Create a summary text
        const summary = `
Order Summary
=============

Company: ${formData.companyName}
Category: ${categoryLabel}
State: ${stateName}
State Fees: ${stateFee}

Owners:
${formData.owners.map(owner => `  - ${owner.fullName}: ${owner.ownershipPercentage}%`).join('\n')}

Address: ${formatAddress()}
        `.trim();

        // Create a blob and download
        const blob = new Blob([summary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'order-summary.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleSubmit = () => {
        console.log('Submitting order:', formData);
        onSubmit();
        // Navigate to payment page
        navigate(ROUTES.ORDER_PAYMENT);
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
                            <div>
                                <span className="text-sm text-muted-foreground">Category: </span>
                                <span className="inline-block px-3 py-1 bg-accent/15 text-blue-900 border border-accent text-xs font-medium rounded-sm">
                                    {categoryLabel || 'N/A'}
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(1)}
                            className="mt-4 w-full border-purple/30 text-purple hover:bg-purple/10"
                        >
                            <HiPencilAlt className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </div>

                    {/* State Card */}
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
                            className="mt-4 w-full border-purple/30 text-purple hover:bg-purple/10"
                        >
                            <HiPencilAlt className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </div>

                    {/* Owners Card */}
                    <div className="border border-border rounded-lg p-6 bg-background flex flex-col">
                        <h3 className="text-base font-bold text-purple mb-4">Owners</h3>
                        <div className="flex-1 space-y-3">
                            {formData.owners.length > 0 ? (
                                formData.owners.map((owner) => (
                                    <div key={owner.id} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-semibold text-foreground">
                                            {owner.ownershipPercentage}% - {owner.fullName}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <span className="text-sm text-muted-foreground">No owners added</span>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(3)}
                            className="mt-4 w-full border-purple/30 text-purple hover:bg-purple/10"
                        >
                            <HiPencilAlt className="w-4 h-4 mr-2" />
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
                            className="mt-4 w-full border-purple/30 text-purple hover:bg-purple/10"
                        >
                            <HiPencilAlt className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border">
                    {/* Left: Saved Status */}
                    <div className="flex items-center gap-2 text-sm text-green-600">
                        <HiCheck className="w-5 h-5" />
                        <span className='text-xs lg:text-sm'>Saved {getTimeAgo(lastSaved)}</span>
                    </div>


                    {/* Right: Navigation Buttons */}
                    <div className="flex gap-3">
                        {/* Middle: Download Button */}
                        <Button
                            variant="outline"
                            onClick={handleDownload}
                            className="border-purple/30 text-purple text-xs lg:text-sm hover:bg-purple/10"
                        >
                            <HiDownload className="w-4 h-4  lg:mr-2" />
                            <span className='hidden lg:block'>Download Summary</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onBack}
                            className="px-2 lg:px-6 text-xs lg:text-sm"
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="bg-purple hover:bg-purple-dark text-white px-2 lg:px-6 text-xs lg:text-sm"
                        >
                            <HiCheck className="w-4 h-4  lg:mr-2" />
                            Save & Confirm
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step5OrderSummary;
