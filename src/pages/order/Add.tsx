import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { HiCheck, HiDownload } from 'react-icons/hi';
import { MdNavigateNext } from "react-icons/md";
import ProgressSidebar from '@/components/order/ProgressSidebar';
import ProgressBar from '@/components/order/ProgressBar';
import Step1CompanyName from '@/components/order/Step1CompanyName';
import Step2StateSelection from '@/components/order/Step2StateSelection';
import Step3Owners from '@/components/order/Step3Owners';
import Step4Address from '@/components/order/Step4Address';
import Step5OrderSummary from '@/components/order/Step5OrderSummary';
import apiClient from '@/utils/api-helpers/apiClient';

const steps = [
    { number: 1, label: 'The company' },
    { number: 2, label: 'State' },
    { number: 3, label: 'Owners' },
    { number: 4, label: 'Address' },
    { number: 5, label: 'Order summary' },
];

interface LocationState {
    countryName?: string;
    pricingPlan?: string;
    basePrice?: number;
    yearlyPrice?: number;
}

const AddOrderPage = () => {
    const { plan } = useParams<{ plan?: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const stepContainerRef = useRef<HTMLDivElement>(null);
    const isAnimatingRef = useRef<boolean>(false);
    const [lastSaved, setLastSaved] = useState<Date>(new Date());

    // Get country name, pricing plan, and pricing data from location state or derive from plan
    const locationState = location.state as LocationState | null;
    const countryName = locationState?.countryName || (plan?.includes('_us') ? 'United States' : plan?.includes('_uk') ? 'United Kingdom' : '');
    const pricingPlan = locationState?.pricingPlan || plan || '';
    const basePrice = locationState?.basePrice || 0;
    const yearlyPrice = locationState?.yearlyPrice || 0;

    // Check if plan is for UK (skip step 2 for UK plans)
    const isUKPlan = plan?.includes('_uk') || false;

    // Initialize plan in formData from URL params and location state
    useEffect(() => {
        if (countryName && pricingPlan) {
            setFormData((prev) => ({ 
                ...prev, 
                plan: [{ 
                    countryName, 
                    pricingPlan,
                    basePrice,
                    yearlyPrice
                }] 
            }));
        }
    }, [countryName, pricingPlan, basePrice, yearlyPrice]);

    // Initial animation on mount
    useEffect(() => {
        if (stepContainerRef.current) {
            const initialStepElement = stepContainerRef.current.querySelector('[data-step="1"]') as HTMLElement;
            if (initialStepElement) {
                gsap.set(initialStepElement, { y: 50 });
                gsap.to(initialStepElement, {
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        }
    }, []);

    // Update last saved time periodically
    useEffect(() => {
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


    const [currentStep, setCurrentStep] = useState(1);
    const [animatingStep, setAnimatingStep] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        plan: [] as Array<{ countryName: string; pricingPlan: string; basePrice: number; yearlyPrice: number }>,
        companyName: '',
        type: 'LLC',
        category: [] as string[],

        state: { name: '', cost: 0 },

        owners: [] as Array<{ id: string; fullName: string; ownershipPercentage: number; isCompany: boolean }>,
        address: {
            streetAddress: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'United States',
            hasSSNOrITIN: false,
            ssnOrITIN: '',
        },
    });

    const handleFormDataChange = (data: Partial<typeof formData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const animateStepTransition = (newStep: number, direction: 'next' | 'back', currentStepValue: number) => {
        if (isAnimatingRef.current || !stepContainerRef.current) return;

        isAnimatingRef.current = true;
        const container = stepContainerRef.current;

        // Set animating step (old step) and current step (new step) so both render
        setAnimatingStep(currentStepValue);
        setCurrentStep(newStep);

        // Wait for React to render new step
        setTimeout(() => {
            const oldStepElement = container.querySelector(`[data-step="${currentStepValue}"]`) as HTMLElement;
            const newStepElement = container.querySelector(`[data-step="${newStep}"]`) as HTMLElement;

            if (!oldStepElement || !newStepElement) {
                isAnimatingRef.current = false;
                setAnimatingStep(null);
                return;
            }

            // Set initial position for new step (below viewport)
            gsap.set(newStepElement, {
                y: direction === 'next' ? window.innerHeight : -window.innerHeight,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                width: '100%'
            });

            // Ensure old step is positioned relatively
            gsap.set(oldStepElement, {
                position: 'relative'
            });

            // Animate both steps simultaneously
            const tl = gsap.timeline({
                onComplete: () => {
                    // Clean up
                    setAnimatingStep(null);
                    gsap.set(oldStepElement, { clearProps: 'all' });
                    gsap.set(newStepElement, { clearProps: 'all' });
                    // Scroll to top of container
                    container.scrollTo({ top: 0, behavior: 'smooth' });
                    isAnimatingRef.current = false;
                }
            });

            // Animate old step out and new step in simultaneously
            tl.to(oldStepElement, {
                y: direction === 'next' ? -window.innerHeight : window.innerHeight,
                duration: 0.6,
                ease: 'power2.inOut'
            }, 0)
                .to(newStepElement, {
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.inOut'
                }, 0);
        }, 10);
    };

    const handleNext = () => {
        if (currentStep < steps.length && !isAnimatingRef.current) {
            let nextStep = currentStep + 1;
            // Skip step 2 for UK plans
            if (isUKPlan && nextStep === 2) {
                nextStep = 3;
            }
            animateStepTransition(nextStep, 'next', currentStep);
        }
    };

    const handleBack = () => {
        if (currentStep > 1 && !isAnimatingRef.current) {
            let prevStep = currentStep - 1;
            // Skip step 2 for UK plans
            if (isUKPlan && prevStep === 2) {
                prevStep = 1;
            }
            animateStepTransition(prevStep, 'back', currentStep);
        }
    };


    const handleSubmit = async () => {
        try {
            // Prepare the order data
            const orderData = {
                type: 'company_formation',
                plan: formData.plan,
                state: formData.state,
                company_name: formData.companyName,
                company_type: formData.type,
                owners: formData.owners.map(owner => ({
                    full_name: owner.fullName,
                    ownership_percentage: owner.ownershipPercentage,
                    is_company: owner.isCompany,
                })),
                addresses: [{
                    type: 'registered',
                    street_address: formData.address.streetAddress,
                    city: formData.address.city,
                    state: formData.address.state,
                    zip_code: formData.address.zipCode,
                    country: formData.address.country,
                }],
            };

            // Make API call to create order
            const response = await apiClient.post('/orders', orderData);
            const order = response.data.data || response.data;

            // Get pricing plan from formData.plan array
            const currentPlan = formData.plan && formData.plan.length > 0 
                ? formData.plan[0].pricingPlan 
                : plan || '';

            // Check if the plan is Premium - if so, go directly to payment summary
            // Otherwise, go to upgrade page (for Basic plans)
            if (currentPlan && (currentPlan.startsWith('Premium') || currentPlan.startsWith('premium'))) {
                // Pass plan via location state
                navigate(`/order/payment/${order.id}`, { state: { plan: currentPlan } });
            } else {
                // Navigate to upgrade page first with order ID (for Basic plans)
                navigate(`/order/upgrade/${order.id}`);
            }
        } catch (error: any) {
            console.error('Error creating order:', error);
            // TODO: Show error message to user
            alert(error.response?.data?.message || 'Failed to create order. Please try again.');
        }
    };

    const handleEditStep = (step: number) => {
        if (!isAnimatingRef.current) {
            // Skip step 2 for UK plans - if trying to edit step 2, go to step 1 instead
            if (isUKPlan && step === 2) {
                return; // Don't allow editing step 2 for UK plans
            }
            const direction = step > currentStep ? 'next' : 'back';
            animateStepTransition(step, direction, currentStep);
        }
    };

    // Validation functions for each step
    const isStep1Valid = () => {
        return !!(formData.companyName && formData.type && formData.category.length > 0);
    };

    const isStep2Valid = () => {
        // Valid if state is selected (either predefined state or "other" state name)
        // "other" alone is not valid - user must select an actual state
        return !!(formData.state.name && formData.state.name.trim() !== '' && formData.state.name !== 'other');
    };

    const isStep3Valid = () => {
        if (formData.owners.length === 0) return false;
        const allOwnersHaveNames = formData.owners.every(owner => owner.fullName.trim() !== '');
        const totalPercentage = formData.owners.reduce((sum, owner) => sum + owner.ownershipPercentage, 0);
        return allOwnersHaveNames && totalPercentage === 100;
    };

    const isStep4Valid = () => {
        const address = formData.address;
        return !!(
            address.streetAddress.trim() !== '' &&
            address.city.trim() !== '' &&
            address.state.trim() !== '' &&
            address.zipCode.trim() !== '' &&
            address.country.trim() !== '' &&
            (address.hasSSNOrITIN === false || address.ssnOrITIN.trim() !== '')
        );
    };

    const isCurrentStepValid = () => {
        switch (currentStep) {
            case 1:
                return isStep1Valid();
            case 2:
                // Skip validation for step 2 if UK plan
                return isUKPlan ? true : isStep2Valid();
            case 3:
                return isStep3Valid();
            case 4:
                return isStep4Valid();
            case 5:
                return true; // Step 5 doesn't need validation
            default:
                return false;
        }
    };


    // Filter steps to exclude step 2 for UK plans
    const displaySteps = isUKPlan ? steps.filter(step => step.number !== 2) : steps;

    console.log('Here is the formData: ', formData);
    return (
        <div className="h-[calc(100vh-96px)] w-full max-w-[1920px] mx-auto flex flex-col md:flex-row gap-2 bg-background px-2 sm:px-4 md:px-6 mb-6 overflow-hidden">
            {/* Mobile Progress Bar */}
            <div className="md:hidden pt-4">
                <ProgressBar
                    currentStep={currentStep}
                    totalSteps={displaySteps.length}
                    stepLabel={currentStep === 1 ? 'About company' : displaySteps.find(s => s.number === currentStep)?.label || steps.find(s => s.number === currentStep)?.label || 'Step'}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row gap-2 min-w-0">
                <div
                    ref={stepContainerRef}
                    className="flex-1 md:flex-2 lg:flex-3 min-w-0 sm:border border-border rounded-lg flex flex-col h-full"
                >
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto relative  sm:px-6 md:px-8 lg:px-12 pt-4 sm:pt-6 md:pt-8 min-w-0">
                        <div className="relative">
                            {/* Render steps - show current and animating step during transition */}
                            {(currentStep === 1 || animatingStep === 1) && (
                                <div data-step="1" className="relative">
                                    <Step1CompanyName
                                        formData={{
                                            companyName: formData.companyName,
                                            type: formData.type,
                                            category: formData.category,
                                        }}
                                        onFormDataChange={handleFormDataChange}
                                    />
                                </div>
                            )}
                            {(currentStep === 2 || animatingStep === 2) && !isUKPlan && (
                                <div data-step="2" className="relative">
                                    <Step2StateSelection
                                        selectedState={formData.state.name}
                                        onStateChange={(stateName, stateCost) => handleFormDataChange({ state: { name: stateName, cost: stateCost } })}
                                        companyName={formData.companyName || 'your'}
                                    />
                                </div>
                            )}
                            {(currentStep === 3 || animatingStep === 3) && (
                                <div data-step="3" className="relative">
                                    <Step3Owners
                                        companyName={formData.companyName || 'your company'}
                                        owners={formData.owners}
                                        onOwnersChange={(owners) => handleFormDataChange({ owners })}
                                    />
                                </div>
                            )}
                            {(currentStep === 4 || animatingStep === 4) && (
                                <div data-step="4" className="relative">
                                    <Step4Address
                                        companyName={formData.companyName || 'your company'}
                                        address={formData.address}
                                        onAddressChange={(address) => handleFormDataChange({ address })}
                                        selectedState={formData.state.name}
                                    />
                                </div>
                            )}
                            {(currentStep === 5 || animatingStep === 5) && (
                                <div data-step="5" className="relative">
                                    <Step5OrderSummary
                                        formData={formData}
                                        onEditStep={handleEditStep}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Global Footer - Sticky at bottom of container */}
                    <div className="sticky bottom-0 bg-background border-t border-border z-40 px-4 sm:px-6 py-3 sm:py-4 mt-auto shrink-0">
                        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                            {/* Left: Saved Status */}
                            <div className="flex items-center gap-2 text-sm text-green-600">
                                <HiCheck className="w-5 h-5" />
                                <span className='text-xs lg:text-sm'>Saved {getTimeAgo(lastSaved)}</span>
                            </div>

                            {/* Right: Navigation Buttons */}
                            <div className="flex gap-3 sm:gap-8 items-center">
                                {/* Download Summary Button - Only for Step 5 */}
                                {currentStep === 5 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            // TODO: Implement download summary functionality
                                            console.log('Download summary');
                                        }}
                                        className="px-6 py-2 text-sm font-medium hover:bg-transparent hover:text-foreground cursor-pointer shadow-sm hover:shadow-md border-border"
                                    >
                                        <HiDownload className="w-4 h-4 mr-2" />
                                        Download Summary
                                    </Button>
                                )}

                                {/* Back Button - Show for steps 2-5 */}
                                {currentStep > 1 && (
                                    <button
                                        onClick={handleBack}
                                        className="text-sm text-foreground hover:text-purple transition-colors cursor-pointer"
                                    >
                                        Back
                                    </button>
                                )}

                                {/* Next/Save & Confirm Button */}
                                {currentStep === 5 ? (
                                    <Button
                                        onClick={handleSubmit}
                                        className="bg-purple hover:bg-purple-dark text-white px-6 py-2 text-sm font-medium cursor-pointer"
                                    >
                                        <HiCheck className="w-4 h-4 mr-2" />
                                        Save & Confirm
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleNext}
                                        disabled={!isCurrentStepValid()}
                                        className="bg-purple hover:bg-purple-dark text-white px-6 py-2 text-sm font-medium disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                                    >
                                        Next
                                        <MdNavigateNext className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Sidebar - Hidden on mobile */}
                <div className="hidden md:block border border-border rounded-lg overflow-y-hidden">
                    <ProgressSidebar currentStep={currentStep} steps={displaySteps} />
                </div>
            </div>



            {/* Chat Icon */}
            {/* <ChatIcon /> */}
        </div>
    );
};

export default AddOrderPage;
