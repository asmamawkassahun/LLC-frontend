import { useState, useEffect } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import { Users } from 'lucide-react';
import StepHeader from './StepHeader';
import Tooltip from './Tooltip';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { CiCircleMinus } from "react-icons/ci";
import userService from '@/services/userService';
import { COUNTRIES } from '../../constants/countries';

interface OwnerAddress {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface Owner {
    id: string;
    fullName: string;
    ownershipPercentage: number;
    isCompany: boolean;
    address?: OwnerAddress;
}

interface Step3OwnersProps {
    companyName: string;
    owners: Owner[];
    onOwnersChange: (owners: Owner[]) => void;
}

// Helper function to normalize owner address
const normalizeOwnerAddress = (owner: Owner): Owner => {
    return {
        ...owner,
        address: owner.address ? {
            streetAddress: owner.address.streetAddress || '',
            city: owner.address.city || '',
            state: owner.address.state || '',
            zipCode: owner.address.zipCode || '',
            country: owner.address.country || 'Ethiopia',
        } : {
            streetAddress: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Ethiopia',
        },
    };
};

const Step3Owners = ({ companyName, owners, onOwnersChange }: Step3OwnersProps) => {
    // Normalize owners to ensure all have address objects
    const normalizedOwners = owners.length > 0 
        ? owners.map(normalizeOwnerAddress)
        : [{
            id: '1', 
            fullName: '', 
            ownershipPercentage: 100, 
            isCompany: false,
            address: {
                streetAddress: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'Ethiopia'
            }
        }];

    const [localOwners, setLocalOwners] = useState<Owner[]>(normalizedOwners);

    useEffect(() => {
        if (owners.length > 0) {
            // Normalize owners to ensure addresses are properly structured
            const normalized = owners.map(normalizeOwnerAddress);
            setLocalOwners(normalized);
        }
    }, [owners]);

    // Fetch current user and prefill first owner's name if empty
    useEffect(() => {
        const fetchUserAndPrefill = async () => {
            try {
                const user = await userService.getCurrentUser();
                if (user.name) {
                    setLocalOwners(prevOwners => {
                        // Only prefill if first owner exists and has empty name
                        if (prevOwners.length > 0 && !prevOwners[0].fullName.trim()) {
                            const updatedOwners = prevOwners.map((owner, index) =>
                                index === 0 ? { ...owner, fullName: user.name } : owner
                            );
                            onOwnersChange(updatedOwners);
                            return updatedOwners;
                        }
                        return prevOwners;
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserAndPrefill();
    }, []); // Only run once on mount

    const handleOwnerChange = (id: string, field: keyof Owner, value: string | number | boolean | OwnerAddress) => {
        const updatedOwners = localOwners.map(owner =>
            owner.id === id ? { ...owner, [field]: value } : owner
        );
        setLocalOwners(updatedOwners);
        onOwnersChange(updatedOwners);
    };

    const handleAddressChange = (id: string, field: keyof OwnerAddress, value: string) => {
        const updatedOwners = localOwners.map(owner => {
            if (owner.id === id) {
                return {
                    ...owner,
                    address: {
                        ...(owner.address || {
                            streetAddress: '',
                            city: '',
                            state: '',
                            zipCode: '',
                            country: 'Ethiopia'
                        }),
                        [field]: value
                    }
                };
            }
            return owner;
        });
        setLocalOwners(updatedOwners);
        onOwnersChange(updatedOwners);
    };

    const handleAddOwner = () => {
        const newOwner: Owner = {
            id: Date.now().toString(),
            fullName: '',
            ownershipPercentage: 0,
            isCompany: false,
            address: {
                streetAddress: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'Ethiopia'
            }
        };
        const updatedOwners = [...localOwners, newOwner];
        setLocalOwners(updatedOwners);
        onOwnersChange(updatedOwners);
    };

    const handleRemoveOwner = (id: string) => {
        if (localOwners.length > 1) {
            const updatedOwners = localOwners.filter(owner => owner.id !== id);
            setLocalOwners(updatedOwners);
            onOwnersChange(updatedOwners);
        }
    };

    // Calculate total percentage with proper number conversion and floating point tolerance
    const totalPercentage = localOwners.reduce((sum, owner) => {
        const percentage = typeof owner.ownershipPercentage === 'string' 
            ? parseFloat(owner.ownershipPercentage) 
            : Number(owner.ownershipPercentage);
        return sum + (isNaN(percentage) ? 0 : percentage);
    }, 0);

    // Use a small tolerance for floating point comparison (0.01)
    const isTotalValid = Math.abs(totalPercentage - 100) < 0.01;

    return (
        <div className="max-w-4xl mx-auto px-4! md:px-0 pb-6 md:pb-8 space-y-24">
            <div className=' flex flex-col gap-24'>
                <StepHeader
                    icon={<Users className="w-12 h-12 md:w-16 md:h-16 text-accent" />}
                    title={`Owners of ${companyName}`}
                    subtitle="Please provide the names of all company owners along with their respective ownership percentages and their addresses."
                />

                <div className="space-y-6">
                    {localOwners.map((owner, index) => (
                        <div key={owner.id} className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Full Name */}
                                <div className="flex-1 md:flex-2">
                                    <label className="text-xs lg:text-sm font-medium text-foreground mb-2 block">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={owner.fullName}
                                        onChange={(e) => handleOwnerChange(owner.id, 'fullName', e.target.value)}
                                        placeholder="eg. Marko Advi"
                                        className="w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background"
                                    />
                                </div>

                                {/* Ownership Percentage */}
                                <div className="flex-1">
                                    <label className="text-xs lg:text-sm font-medium text-foreground mb-2 block">
                                        Ownership percentage <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={owner.ownershipPercentage}
                                            onChange={(e) => {
                                                const value = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                                                handleOwnerChange(owner.id, 'ownershipPercentage', value);
                                            }}
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            className="w-full pl-1 pr-8 py-1  border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background"
                                        />
                                        <div className="absolute right-[0.5px] top-1/2 border border-border rounded-r-sm h-full w-8 bg-accent-foreground -translate-y-1/2 flex items-center gap-0.5 text-center">
                                            
                                            <span className="text-muted-foreground text-sm ml-2 text-center">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Fields */}
                            <div className="space-y-4">
                                <label className="text-xs lg:text-sm font-medium text-foreground mb-2 block">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                
                                {/* Street Address */}
                                <div>
                                    <input
                                        type="text"
                                        value={owner.address?.streetAddress || ''}
                                        onChange={(e) => handleAddressChange(owner.id, 'streetAddress', e.target.value)}
                                        placeholder="eg. 123 Main Street"
                                        className="w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background"
                                    />
                                </div>

                                {/* City and State */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={owner.address?.city || ''}
                                            onChange={(e) => handleAddressChange(owner.id, 'city', e.target.value)}
                                            placeholder="City"
                                            className="w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={owner.address?.state || ''}
                                            onChange={(e) => handleAddressChange(owner.id, 'state', e.target.value)}
                                            placeholder="State / Province"
                                            className="w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background"
                                        />
                                    </div>
                                </div>

                                {/* ZIP Code and Country */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={owner.address?.zipCode || ''}
                                            onChange={(e) => handleAddressChange(owner.id, 'zipCode', e.target.value)}
                                            placeholder="Postal Code"
                                            className="w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background"
                                        />
                                    </div>
                                    <div className="flex-1 relative">
                                        <select
                                            value={owner.address?.country || 'United States'}
                                            onChange={(e) => handleAddressChange(owner.id, 'country', e.target.value)}
                                            className="w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background appearance-none cursor-pointer pr-10"
                                        >
                                            {COUNTRIES.map((country) => (
                                                <option key={country.name} value={country.name}>
                                                    {country.flag} {country.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='flex items-center justify-start gap-4'>
                                
                                {/* Checkbox and Remove Button */}
                                <div className="flex gap-2 items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={owner.isCompany}
                                            onChange={(e) => handleOwnerChange(owner.id, 'isCompany', e.target.checked)}
                                            className="w-4 h-4 text-purple border-gray-300 rounded focus:ring-purple cursor-pointer"
                                        />
                                        <span className="text-xs sm:text-sm text-foreground">This owner is a company</span>
                                    </label>
                                    {localOwners.length > 1 && index !== 0 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveOwner(owner.id)}
                                            className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                                        >
                                            <CiCircleMinus className="w-5 h-5" />
                                            Delete this owner
                                        </button>
                                    )}
                                </div>
                                {/* Add Another Owner Button - Only show for the first owner */}
                                {index === 0 && (
                                    <button
                                        type="button"
                                        onClick={handleAddOwner}
                                        className="flex items-center gap-2 text-primary transition-colors text-xs sm:text-sm "
                                    >
                                        <IoIosAddCircleOutline className="w-5 h-5" />
                                        Add another owner
                                    </button>
                                )}
                            </div>
                            {index < localOwners.length - 1 && (
                                <div className="border-t border-border my-4" />
                            )}
                        </div>
                    ))}



                    {/* Total Percentage Validation */}
                    {!isTotalValid && (
                        <div className="text-sm text-red-500">
                            Total ownership percentage must equal 100%. Current total: {totalPercentage.toFixed(2)}%
                        </div>
                    )}

                    {/* PEP Disclaimer */}
                    <div className="pt-4">
                        <p className="text-xs text-muted-foreground">
                            By clicking Next, you confirm that NONE of the company owners is a  Politically Exposed Person (PEP){' '}
                            <Tooltip
                                content="A Politically Exposed Person (PEP) is an individual who is or has been entrusted with a prominent public function. Due to their position and influence, they are considered higher-risk customers."
                                width="w-80"
                            >
                                <span className="inline-flex items-center gap-1 text-muted-foreground cursor-help underline">
                                   
                                    <HiInformationCircle className="w-4 h-4" />
                                </span>
                            </Tooltip>
                            .
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Step3Owners;

