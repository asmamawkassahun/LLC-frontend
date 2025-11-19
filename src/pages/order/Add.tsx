import { useState } from 'react';
import ProgressSidebar from '@/components/order/ProgressSidebar';
import ProgressBar from '@/components/order/ProgressBar';
import Step1CompanyName from '@/components/order/Step1CompanyName';
import Step2StateSelection from '@/components/order/Step2StateSelection';
import Step3Owners from '@/components/order/Step3Owners';
import Step4Address from '@/components/order/Step4Address';
import Step5OrderSummary from '@/components/order/Step5OrderSummary';
import ChatIcon from '@/components/order/ChatIcon';

const steps = [
    { number: 1, label: 'The company' },
    { number: 2, label: 'State' },
    { number: 3, label: 'Owners' },
    { number: 4, label: 'Address' },
    { number: 5, label: 'Order summary' },
];

const AddOrderPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        companyName: '',
        type: 'LLC',
        category: '',
        state: '',
        owners: [] as Array<{ id: string; fullName: string; ownershipPercentage: number; isCompany: boolean }>,
        address: {
            streetAddress: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'United States',
            hasSSNOrITIN: null as boolean | null,
            ssnOrITIN: '',
        },
    });

    const handleFormDataChange = (data: Partial<typeof formData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        // Handle order submission
        console.log('Order submitted:', formData);
        // You can add navigation to a success page or show a success message here
    };

    const handleEditStep = (step: number) => {
        setCurrentStep(step);
    };

    return (
        <div className="min-h-screen max-w-7xl mx-auto flex flex-col md:flex-row gap-2 bg-background px-4 md:px-6">
            {/* Mobile Progress Bar */}
            <div className="md:hidden pt-4">
                <ProgressBar
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    stepLabel={currentStep === 1 ? 'About company' : steps.find(s => s.number === currentStep)?.label || 'Step'}
                />
            </div>

            {/* Main Content */}
            <div className="md:flex-3 lg:flex-2  lg:px-12 pt-6 md:pt-8 sm:border border-border rounded-lg overflow-y-auto">
                {currentStep === 1 && (
                    <Step1CompanyName
                        onNext={handleNext}
                        formData={{
                            companyName: formData.companyName,
                            type: formData.type,
                            category: formData.category,
                        }}
                        onFormDataChange={handleFormDataChange}
                    />
                )}
                {currentStep === 2 && (
                    <Step2StateSelection
                        onNext={handleNext}
                        onBack={handleBack}
                        selectedState={formData.state}
                        onStateChange={(state) => handleFormDataChange({ state })}
                        companyName={formData.companyName || 'your'}
                    />
                )}
                {currentStep === 3 && (
                    <Step3Owners
                        onNext={handleNext}
                        onBack={handleBack}
                        companyName={formData.companyName || 'your company'}
                        owners={formData.owners}
                        onOwnersChange={(owners) => handleFormDataChange({ owners })}
                    />
                )}
                {currentStep === 4 && (
                    <Step4Address
                        onNext={handleNext}
                        onBack={handleBack}
                        companyName={formData.companyName || 'your company'}
                        address={formData.address}
                        onAddressChange={(address) => handleFormDataChange({ address })}
                        selectedState={formData.state}
                    />
                )}
                {currentStep === 5 && (
                    <Step5OrderSummary
                        onBack={handleBack}
                        onSubmit={handleSubmit}
                        formData={formData}
                        onEditStep={handleEditStep}
                    />
                )}
            </div>

            {/* Progress Sidebar - Hidden on mobile */}
            <div className="hidden md:block border border-border rounded-lg">
                <ProgressSidebar currentStep={currentStep} steps={steps} />
            </div>

            {/* Chat Icon */}
            {/* <ChatIcon /> */}
        </div>
    );
};

export default AddOrderPage;
