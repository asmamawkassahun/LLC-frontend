import { useState } from 'react';
import { Button } from "@/components/ui";
import { HiChevronLeft, HiChevronRight, HiChevronDown } from 'react-icons/hi';
import { getUniqueCountries } from '@/constants/countries';

interface BankFormData {
    currency: string;
    accountType: string;
    fullAccountName: string;
    achRoutingNumber: string;
    accountNumber: string;
    accountTypeDetail: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

interface AddBankAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: BankFormData) => void;
}

const AddBankAccountModal = ({ isOpen, onClose, onSave }: AddBankAccountModalProps) => {
    const [modalStep, setModalStep] = useState(1);
    const [bankFormData, setBankFormData] = useState<BankFormData>({
        currency: 'USD',
        accountType: 'Personal',
        fullAccountName: '',
        achRoutingNumber: '',
        accountNumber: '',
        accountTypeDetail: 'Checking',
        address: '',
        city: '',
        postalCode: '',
        country: 'Ethiopia',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const allCountries = getUniqueCountries();

    const handleCloseModal = () => {
        setModalStep(1);
        setBankFormData({
            currency: 'USD',
            accountType: 'Personal',
            fullAccountName: '',
            achRoutingNumber: '',
            accountNumber: '',
            accountTypeDetail: 'Checking',
            address: '',
            city: '',
            postalCode: '',
            country: 'Ethiopia',
        });
        setErrors({});
        onClose();
    };

    const handleNextStep = () => {
        if (modalStep === 1) {
            setModalStep(2);
        }
    };

    const handlePreviousStep = () => {
        if (modalStep === 2) {
            setModalStep(1);
        }
    };

    const handleBankFormChange = (field: string, value: string) => {
        setBankFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!bankFormData.fullAccountName.trim()) {
            newErrors.fullAccountName = 'Full account name is required';
        }

        if (!bankFormData.achRoutingNumber.trim()) {
            newErrors.achRoutingNumber = 'ACH routing number is required';
        } else if (bankFormData.achRoutingNumber.length < 8) {
            newErrors.achRoutingNumber = 'The bank ach routing number field must be at least 8 characters.';
        }

        if (!bankFormData.accountNumber.trim()) {
            newErrors.accountNumber = 'Account number is required';
        }

        if (!bankFormData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!bankFormData.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!bankFormData.postalCode.trim()) {
            newErrors.postalCode = 'Postal code is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            if (onSave) {
                onSave(bankFormData);
            }
            handleCloseModal();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10 max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 shrink-0">
                    <h2 className="text-lg font-semibold text-foreground">Add your bank account</h2>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-6 overflow-y-auto flex-1">
                    {modalStep === 1 ? (
                        // Step 1: Currency and Account Type
                        <div className="space-y-6">
                            {/* Bank account currency */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Bank account currency
                                </label>
                                <div className="relative">
                                    <select
                                        value={bankFormData.currency}
                                        onChange={(e) => handleBankFormChange('currency', e.target.value)}
                                        className="w-full px-4 py-2 pr-10 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background appearance-none cursor-pointer"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <HiChevronDown className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>

                            {/* Bank account type */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Bank account type
                                </label>
                                <div className="relative">
                                    <select
                                        value={bankFormData.accountType}
                                        onChange={(e) => handleBankFormChange('accountType', e.target.value)}
                                        className="w-full px-4 py-2 pr-10 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background appearance-none cursor-pointer"
                                    >
                                        <option value="Personal">Personal</option>
                                        <option value="Business">Business</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <HiChevronDown className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Step 2: Full Account Details
                        <div className="space-y-4">
                            {/* Full account name */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Full account name
                                </label>
                                <input
                                    type="text"
                                    value={bankFormData.fullAccountName}
                                    onChange={(e) => handleBankFormChange('fullAccountName', e.target.value)}
                                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background"
                                />
                            </div>

                            {/* ACH routing number */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    ACH routing number
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={bankFormData.achRoutingNumber}
                                        onChange={(e) => handleBankFormChange('achRoutingNumber', e.target.value.replace(/\D/g, ''))}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background ${
                                            errors.achRoutingNumber ? 'border-red-500' : 'border-input'
                                        }`}
                                    />
                                    {errors.achRoutingNumber && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">!</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {errors.achRoutingNumber && (
                                    <p className="text-sm text-red-500 mt-1">{errors.achRoutingNumber}</p>
                                )}
                            </div>

                            {/* Account number */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Account number
                                </label>
                                <input
                                    type="text"
                                    value={bankFormData.accountNumber}
                                    onChange={(e) => handleBankFormChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background ${
                                        errors.accountNumber ? 'border-red-500' : 'border-input'
                                    }`}
                                />
                                {errors.accountNumber && (
                                    <p className="text-sm text-red-500 mt-1">{errors.accountNumber}</p>
                                )}
                            </div>

                            {/* Account type */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Account type
                                </label>
                                <div className="relative">
                                    <select
                                        value={bankFormData.accountTypeDetail}
                                        onChange={(e) => handleBankFormChange('accountTypeDetail', e.target.value)}
                                        className="w-full px-4 py-2 pr-10 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background appearance-none cursor-pointer"
                                    >
                                        <option value="Checking">Checking</option>
                                        <option value="Saving">Saving</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <HiChevronDown className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={bankFormData.address}
                                    onChange={(e) => handleBankFormChange('address', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background ${
                                        errors.address ? 'border-red-500' : 'border-input'
                                    }`}
                                />
                                {errors.address && (
                                    <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                                )}
                            </div>

                            {/* City */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={bankFormData.city}
                                    onChange={(e) => handleBankFormChange('city', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background ${
                                        errors.city ? 'border-red-500' : 'border-input'
                                    }`}
                                />
                                {errors.city && (
                                    <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                                )}
                            </div>

                            {/* Postal code */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Postal code
                                </label>
                                <input
                                    type="text"
                                    value={bankFormData.postalCode}
                                    onChange={(e) => handleBankFormChange('postalCode', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background ${
                                        errors.postalCode ? 'border-red-500' : 'border-input'
                                    }`}
                                />
                                {errors.postalCode && (
                                    <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>
                                )}
                            </div>

                            {/* Country */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Country
                                </label>
                                <div className="relative">
                                    <select
                                        value={bankFormData.country}
                                        onChange={(e) => handleBankFormChange('country', e.target.value)}
                                        className="w-full px-4 py-2 pr-10 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background appearance-none cursor-pointer"
                                    >
                                        {allCountries.map((country) => (
                                            <option key={country.name} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <HiChevronDown className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end shrink-0">
                    {modalStep === 1 ? (
                        <>
                            <button
                                onClick={handleCloseModal}
                                className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 cursor-pointer"
                            >
                                Close
                            </button>
                            <Button
                                onClick={handleNextStep}
                                className="bg-purple hover:bg-purple-dark text-white px-6 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
                            >
                                Next <HiChevronRight className="w-4 h-4" />
                            </Button>
                        </>
                    ) : (
                        <div className='flex gap-4'>
                            <Button
                                onClick={handlePreviousStep}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-sm flex items-center gap-2 cursor-pointer"
                            >
                                <HiChevronLeft className="w-4 h-4" /> Previous
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="bg-purple hover:bg-purple-dark text-white px-4 py-2 rounded-sm flex items-center gap-2 cursor-pointer"
                            >
                                Save <HiChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddBankAccountModal;

