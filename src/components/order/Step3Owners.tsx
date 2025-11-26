import { useState, useEffect } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import StepHeader from './StepHeader';
import Tooltip from './Tooltip';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { CiCircleMinus } from "react-icons/ci";
import userService from '@/services/userService';
interface Owner {
    id: string;
    fullName: string;
    ownershipPercentage: number;
    isCompany: boolean;
}

interface Step3OwnersProps {
    companyName: string;
    owners: Owner[];
    onOwnersChange: (owners: Owner[]) => void;
}

const Step3Owners = ({ companyName, owners, onOwnersChange }: Step3OwnersProps) => {
    const [localOwners, setLocalOwners] = useState<Owner[]>(owners.length > 0 ? owners : [
        { id: '1', fullName: '', ownershipPercentage: 100, isCompany: false }
    ]);

    useEffect(() => {
        if (owners.length > 0) {
            setLocalOwners(owners);
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

    const handleOwnerChange = (id: string, field: keyof Owner, value: string | number | boolean) => {
        const updatedOwners = localOwners.map(owner =>
            owner.id === id ? { ...owner, [field]: value } : owner
        );
        setLocalOwners(updatedOwners);
        onOwnersChange(updatedOwners);
    };

    const handleAddOwner = () => {
        const newOwner: Owner = {
            id: Date.now().toString(),
            fullName: '',
            ownershipPercentage: 0,
            isCompany: false
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

    const totalPercentage = localOwners.reduce((sum, owner) => sum + owner.ownershipPercentage, 0);

    return (
        <div className="max-w-4xl mx-auto px-4! md:px-0 pb-6 md:pb-8 space-y-24">
            <div className=' flex flex-col gap-24'>
                <StepHeader
                    icon="https://app.privatily.com/assets/img/header-icones/owners.png"
                    title={`Owners of ${companyName}`}
                    subtitle="Please provide the names of all company owners along with their respective ownership percentages."
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
                                                const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                                                handleOwnerChange(owner.id, 'ownershipPercentage', value);
                                            }}
                                            min="0"
                                            max="100"
                                            className="w-full pl-1 pr-8 py-1  border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background"
                                        />
                                        <div className="absolute right-[0.5px] top-1/2 border border-border rounded-r-sm h-full w-8 bg-accent-foreground -translate-y-1/2 flex items-center gap-0.5 text-center">
                                            
                                            <span className="text-muted-foreground text-sm ml-2 text-center">%</span>
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
                    {totalPercentage !== 100 && (
                        <div className="text-sm text-red-500">
                            Total ownership percentage must equal 100%. Current total: {totalPercentage}%
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

