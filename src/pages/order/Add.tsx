import { useState, useEffect, useRef, useMemo } from 'react';
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
import Step5Services from '@/components/order/Step5Services';
import Step6OrderSummary from '@/components/order/Step6OrderSummary';
import apiClient from '@/utils/api-helpers/apiClient';

const steps = [
    { number: 1, label: 'The company' },
    { number: 2, label: 'State' },
    { number: 3, label: 'Owners' },
    { number: 4, label: 'Address' },
    { number: 5, label: 'Services' },
    { number: 6, label: 'Order summary' },
];

interface LocationState {
    countryName?: string;
    pricingPlan?: string;
    basePrice?: number;
    yearlyPrice?: number;
}

interface ApiOrderResponse {
    data: {
        id: number;
        order_number: string;
        country?: {
            id: number;
            name: string;
        };
        pricing_plan?: {
            id: number;
            name: string;
            base_price: number;
            yearly_price: number;
        };
        company?: {
            id: number;
            name: string;
            type: string;
            category?: string[];
            owners?: Array<{
                id: number;
                full_name: string;
                ownership_percentage: number;
                is_company: boolean;
                address?: {
                    street_address?: string;
                    streetAddress?: string;
                    city: string;
                    state: string;
                    zip_code?: string;
                    zipCode?: string;
                    country: string;
                } | null;
            }>;
            addresses?: Array<{
                id: number;
                use_registered_agent?: boolean;
                registered_agent_address_id?: number | null;
                street_address: string;
                city: string;
                state: string;
                zip_code: string;
                country: string;
            }>;
            service?: {
                ein?: string | null;
                itin?: string | null;
                website?: string | null;
                domain_hosting?: string | null;
                business_email?: string | null;
            } | null;
        };
        state?: {
            id: number;
            name: string;
            formation_fee: number;
        };
        metadata?: {
            category?: string[];
        };
    };
}

const AddOrderPage = () => {
    const { plan, orderId } = useParams<{ plan?: string; orderId?: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const stepContainerRef = useRef<HTMLDivElement>(null);
    const isAnimatingRef = useRef<boolean>(false);
    const [lastSaved, setLastSaved] = useState<Date>(new Date());
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoadingOrder, setIsLoadingOrder] = useState(false);
    const [orderCountryName, setOrderCountryName] = useState<string>('');

    // Get country name, pricing plan, and pricing data from location state or derive from plan
    const locationState = location.state as LocationState | null;
    const countryName = locationState?.countryName || (plan?.includes('_us') ? 'United States' : plan?.includes('_uk') ? 'United Kingdom' : '');
    const pricingPlan = locationState?.pricingPlan || plan || '';
    const basePrice = locationState?.basePrice || 0;
    const yearlyPrice = locationState?.yearlyPrice || 0;

    // Check if plan is for UK (skip step 2 for UK plans)
    // Will be calculated after formData is declared using useMemo

    // Detect edit mode
    useEffect(() => {
        if (orderId) {
            setIsEditMode(true);
        }
    }, [orderId]);

    // Fetch order data if in edit mode
    useEffect(() => {
        const fetchOrderData = async () => {
            if (!orderId) return;

            try {
                setIsLoadingOrder(true);
                const response = await apiClient.get<ApiOrderResponse>(`/orders/${orderId}`);
                const order = response.data.data || response.data;

                if (!order) {
                    console.error('Order not found');
                    return;
                }

                // Store country name from order for UK plan detection
                if (order.country?.name) {
                    setOrderCountryName(order.country.name);
                }

                // Map API response to formData structure
                const mappedFormData = {
                    plan: order.country && order.pricing_plan ? [{
                        countryName: order.country.name,
                        pricingPlan: order.pricing_plan.name,
                        basePrice: order.pricing_plan.base_price,
                        yearlyPrice: order.pricing_plan.yearly_price,
                    }] : [],
                    companyName: order.company?.name || '',
                    type: order.company?.type || 'LLC',
                    category: order.company?.category || [],
                    state: {
                        name: order.state?.name || '',
                        cost: order.state?.formation_fee || 0,
                    },
            owners: order.company?.owners?.map((owner, index) => {
                // Handle address - it comes as an object/array from the backend
                // Always provide an address object, even if empty, for consistency
                let address = {
                    streetAddress: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: 'Ethiopia',
                };
                
                if (owner.address) {
                    // Address can be an object with either snake_case or camelCase keys
                    const addr = owner.address as any;
                    address = {
                        streetAddress: addr.street_address || addr.streetAddress || '',
                        city: addr.city || '',
                        state: addr.state || '',
                        zipCode: addr.zip_code || addr.zipCode || '',
                        country: addr.country || 'Ethiopia',
                    };
                }
                
                return {
                    id: owner.id?.toString() || `temp-${index}`,
                    fullName: owner.full_name,
                    ownershipPercentage: typeof owner.ownership_percentage === 'string' 
                        ? parseFloat(owner.ownership_percentage) 
                        : Number(owner.ownership_percentage) || 0,
                    isCompany: owner.is_company,
                    address: address,
                };
            }) || [],
                    address: {
                        streetAddress: order.company?.addresses?.[0]?.street_address || '',
                        city: order.company?.addresses?.[0]?.city || '',
                        state: order.company?.addresses?.[0]?.state || '',
                        zipCode: order.company?.addresses?.[0]?.zip_code || '',
                        country: order.company?.addresses?.[0]?.country || 'United States',
                    },
                    useRegisteredAgent: order.company?.addresses?.[0]?.use_registered_agent || false,
                    registeredAgentAddressId: order.company?.addresses?.[0]?.registered_agent_address_id || null,
                    services: {
                        // Prefill services: if the service field is not null, set to true
                        ein: order.company?.service?.ein !== null && order.company?.service?.ein !== undefined,
                        itin: order.company?.service?.itin !== null && order.company?.service?.itin !== undefined,
                        website: order.company?.service?.website !== null && order.company?.service?.website !== undefined,
                        domainHosting: order.company?.service?.domain_hosting !== null && order.company?.service?.domain_hosting !== undefined,
                        businessEmail: order.company?.service?.business_email !== null && order.company?.service?.business_email !== undefined,
                    },
                };

                setFormData(mappedFormData);
            } catch (error) {
                console.error('Error fetching order data:', error);
            } finally {
                setIsLoadingOrder(false);
            }
        };

        fetchOrderData();
    }, [orderId]);

    // Initialize plan in formData from URL params and location state (only if not in edit mode)
    useEffect(() => {
        if (!isEditMode && countryName && pricingPlan) {
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
    }, [countryName, pricingPlan, basePrice, yearlyPrice, isEditMode]);

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

        owners: [] as Array<{ 
            id: string; 
            fullName: string; 
            ownershipPercentage: number; 
            isCompany: boolean;
            address?: {
                streetAddress: string;
                city: string;
                state: string;
                zipCode: string;
                country: string;
            };
        }>,
        address: {
            streetAddress: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'United States',
        },
        useRegisteredAgent: false,
        registeredAgentAddressId: null as number | null,
        services: {
            ein: false,
            itin: false,
            website: false,
            domainHosting: false,
            businessEmail: false,
        },
    });

    const handleFormDataChange = (data: Partial<typeof formData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    // Check if plan is for UK (skip step 2 for UK plans)
    // In edit mode, check the country from the fetched order data or formData
    // In create mode, check the URL plan parameter
    const isUKPlan = useMemo(() => {
        if (isEditMode) {
            return orderCountryName === 'United Kingdom' || formData.plan[0]?.countryName === 'United Kingdom';
        }
        return plan?.includes('_uk') || false;
    }, [isEditMode, orderCountryName, formData.plan, plan]);

    // Check if plan is Premium (skip step 5 for Premium plans)
    const isPremiumPlan = useMemo(() => {
        const currentPlan = formData.plan && formData.plan.length > 0 
            ? formData.plan[0].pricingPlan 
            : plan || '';
        return currentPlan && (currentPlan.startsWith('Premium') || currentPlan.startsWith('premium'));
    }, [formData.plan, plan]);

    // Set all services to true if Premium plan
    useEffect(() => {
        if (isPremiumPlan) {
            setFormData((prev) => ({
                ...prev,
                services: {
                    ein: true,
                    itin: true,
                    website: true,
                    domainHosting: true,
                    businessEmail: true,
                }
            }));
        }
    }, [isPremiumPlan]);

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
            // Skip step 5 for Premium plans
            if (isPremiumPlan && nextStep === 5) {
                nextStep = 6;
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
            // Skip step 5 for Premium plans
            if (isPremiumPlan && prevStep === 5) {
                prevStep = 4;
            }
            animateStepTransition(prevStep, 'back', currentStep);
        }
    };


    const handleSubmit = async () => {
        try {
            // Prepare owners data
            const ownersData = formData.owners.map(owner => {
                return {
                    full_name: owner.fullName,
                    ownership_percentage: owner.ownershipPercentage,
                    is_company: owner.isCompany,
                    address: owner.address ? {
                        street_address: owner.address.streetAddress,
                        city: owner.address.city,
                        state: owner.address.state,
                        zip_code: owner.address.zipCode,
                        country: owner.address.country,
                    } : null,
                };
            });

            // Prepare the order data
            const orderData = {
                type: 'company_formation',
                plan: formData.plan,
                state: formData.state,
                company_name: formData.companyName,
                company_type: formData.type,
                category: formData.category || [],
                owners: ownersData,
                addresses: [{
                    type: 'registered',
                    use_registered_agent: formData.useRegisteredAgent || false,
                    registered_agent_address_id: formData.registeredAgentAddressId || null,
                    street_address: formData.address.streetAddress,
                    city: formData.address.city,
                    state: formData.address.state,
                    zip_code: formData.address.zipCode,
                    country: formData.address.country,
                }],
                services: formData.services,
            };

            let order;
            if (isEditMode && orderId) {
                // Update existing order
                const response = await apiClient.put(`/orders/${orderId}`, orderData);
                order = response.data.data || response.data;
            } else {
                // Create new order
                const response = await apiClient.post('/orders', orderData);
                order = response.data.data || response.data;
            }

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
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} order:`, error);
            // TODO: Show error message to user
            alert(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} order. Please try again.`);
        }
    };

    const handleEditStep = (step: number) => {
        if (!isAnimatingRef.current) {
            // Skip step 2 for UK plans - if trying to edit step 2, go to step 1 instead
            if (isUKPlan && step === 2) {
                return; // Don't allow editing step 2 for UK plans
            }
            // Skip step 5 for Premium plans - don't allow editing step 5
            if (isPremiumPlan && step === 5) {
                return; // Don't allow editing step 5 for Premium plans
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
            address.country.trim() !== ''
        );
    };

    const isStep5Valid = () => {
        // Step 5 (Services) validation - can be optional, so always return true for now
        return true;
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
                // Skip validation for step 5 if Premium plan
                return isPremiumPlan ? true : isStep5Valid();
            case 6:
                return true; // Step 6 (Order summary) doesn't need validation
            default:
                return false;
        }
    };


    // Filter steps to exclude step 2 for UK plans and step 5 for Premium plans
    const filteredSteps = steps.filter(step => {
        if (isUKPlan && step.number === 2) return false;
        if (isPremiumPlan && step.number === 5) return false;
        return true;
    });

    // Renumber steps sequentially for display
    const displaySteps = filteredSteps.map((step, index) => ({
        ...step,
        number: index + 1
    }));

    // Map current step to display step number
    const getDisplayStepNumber = (actualStep: number): number => {
        const stepIndex = filteredSteps.findIndex(step => step.number === actualStep);
        return stepIndex !== -1 ? stepIndex + 1 : actualStep;
    };

    const displayCurrentStep = getDisplayStepNumber(currentStep);

    // Show loading state while fetching order data
    if (isLoadingOrder) {
        return (
            <div className="h-[calc(100vh-96px)] w-full max-w-[1920px] mx-auto flex items-center justify-center">
                <div className="text-muted-foreground">Loading order data...</div>
            </div>
        );
    }

    console.log('Here is the formData: ', formData);
    return (
        <div className="h-[calc(100vh-96px)] w-full max-w-[1920px] mx-auto flex flex-col md:flex-row gap-2 bg-background px-2 mb-6 overflow-hidden">
            {/* Mobile Progress Bar */}
            <div className="md:hidden pt-4">
                <ProgressBar
                    currentStep={displayCurrentStep}
                    totalSteps={displaySteps.length}
                    stepLabel={displaySteps.find(s => s.number === displayCurrentStep)?.label || 'Step'}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row gap-2 min-w-0 overflow-y-scroll">
                <div
                    ref={stepContainerRef}
                    className="flex-1 md:flex-2 lg:flex-3 min-w-0 sm:border border-border rounded-lg flex flex-col h-full"
                >
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto relative pt-4 sm:pt-6 md:pt-8 min-w-0">
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
                                        useRegisteredAgent={formData.useRegisteredAgent}
                                        onRegisteredAgentChange={(useRegisteredAgent, registeredAgentAddressId) => 
                                            handleFormDataChange({ 
                                                useRegisteredAgent, 
                                                registeredAgentAddressId 
                                            })
                                        }
                                    />
                                </div>
                            )}
                            {(currentStep === 5 || animatingStep === 5) && !isPremiumPlan && (
                                <div data-step="5" className="relative">
                                    <Step5Services
                                        services={formData.services}
                                        onServicesChange={(services) => handleFormDataChange({ services })}
                                    />
                                </div>
                            )}
                            {(currentStep === 6 || animatingStep === 6) && (
                                <div data-step="6" className="relative">
                                    <Step6OrderSummary
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
                                {/* <HiCheck className="w-5 h-5" />
                                <span className='text-xs lg:text-sm'>Saved {getTimeAgo(lastSaved)}</span> */}
                            </div>

                            {/* Right: Navigation Buttons */}
                            <div className="flex gap-3 sm:gap-8 items-center">
                                {/* Download Summary Button - Only for Step 6 */}
                                {currentStep === 6 && (
                                    <Button
                                        variant="outline"
                                        onClick={async () => {
                                            try {
                                                let response;
                                                
                                                if (orderId) {
                                                    // If order exists, download from saved order
                                                    response = await apiClient.get(`/orders/${orderId}/download-summary`, {
                                                        responseType: 'blob',
                                                        headers: {
                                                            'Accept': 'application/pdf',
                                                        },
                                                    });
                                                } else {
                                                    // If order doesn't exist yet, generate PDF from form data
                                                    // Prepare form data in the format expected by the backend
                                                    const pdfFormData = {
                                                        plan: formData.plan,
                                                        companyName: formData.companyName,
                                                        type: formData.type,
                                                        category: formData.category,
                                                        state: formData.state,
                                                        owners: formData.owners.map(owner => ({
                                                            fullName: owner.fullName,
                                                            ownershipPercentage: owner.ownershipPercentage,
                                                            isCompany: owner.isCompany,
                                                            address: owner.address ? {
                                                                streetAddress: owner.address.streetAddress,
                                                                city: owner.address.city,
                                                                state: owner.address.state,
                                                                zipCode: owner.address.zipCode,
                                                                country: owner.address.country,
                                                            } : null,
                                                        })),
                                                        address: {
                                                            streetAddress: formData.address.streetAddress,
                                                            city: formData.address.city,
                                                            state: formData.address.state,
                                                            zipCode: formData.address.zipCode,
                                                            country: formData.address.country,
                                                        },
                                                    };
                                                    
                                                    response = await apiClient.post('/orders/generate-pdf-from-form-data', pdfFormData, {
                                                        responseType: 'blob',
                                                        headers: {
                                                            'Accept': 'application/pdf',
                                                        },
                                                    });
                                                }

                                                // Create a blob URL and trigger download
                                                const blob = new Blob([response.data], { type: 'application/pdf' });
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = orderId ? `order-summary-${orderId}.pdf` : 'order-summary-preview.pdf';
                                                document.body.appendChild(a);
                                                a.click();
                                                window.URL.revokeObjectURL(url);
                                                document.body.removeChild(a);
                                            } catch (error: any) {
                                                console.error('Error downloading order summary:', error);
                                                let errorMessage = 'Failed to download order summary. Please try again.';
                                                
                                                // Handle error response (when responseType is 'blob', errors are also blobs)
                                                if (error.response?.data instanceof Blob) {
                                                    try {
                                                        const text = await error.response.data.text();
                                                        const errorData = JSON.parse(text);
                                                        errorMessage = errorData.message || errorMessage;
                                                    } catch (parseError) {
                                                        // If parsing fails, use default message
                                                    }
                                                } else if (error.response?.data?.message) {
                                                    errorMessage = error.response.data.message;
                                                } else if (error.message) {
                                                    errorMessage = error.message;
                                                }
                                                
                                                alert(errorMessage);
                                            }
                                        }}
                                        className="px-6 py-2 text-sm font-medium hover:bg-transparent hover:text-foreground cursor-pointer shadow-sm hover:shadow-md border-border"
                                        title="Download order summary as PDF"
                                    >
                                        <HiDownload className="w-4 h-4 mr-2" />
                                        Download Summary
                                    </Button>
                                )}

                                {/* Back Button - Show for steps 2-6 */}
                                {currentStep > 1 && (
                                    <button
                                        onClick={handleBack}
                                        className="text-sm text-foreground hover:text-purple transition-colors cursor-pointer"
                                    >
                                        Back
                                    </button>
                                )}

                                {/* Next/Save & Confirm Button */}
                                {currentStep === 6 ? (
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
                <div className="hidden md:block border border-border rounded-lg overflow-y-auto">
                    <ProgressSidebar currentStep={displayCurrentStep} steps={displaySteps} />
                </div>
            </div>



            {/* Chat Icon */}
            {/* <ChatIcon /> */}
        </div>
    );
};

export default AddOrderPage;
