import { useState, useEffect } from 'react';
import StepHeader from './StepHeader';
import { COUNTRIES } from '../../constants/countries';
import apiClient from '@/utils/api-helpers/apiClient';

interface AddressData {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

// const COUNTRIES = [
//     'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
//     'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
//     'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
//     'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
//     'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
//     'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
//     'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
//     'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
//     'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
//     'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
//     'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
//     'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
//     'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
//     'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
//     'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
//     'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
//     'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
//     'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
//     'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
//     'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
// ];

interface Step4AddressProps {
    companyName: string;
    address: AddressData;
    onAddressChange: (address: AddressData) => void;
    selectedState?: string; // State selected in step 2
    useRegisteredAgent?: boolean;
    onRegisteredAgentChange?: (useRegisteredAgent: boolean, registeredAgentAddressId: number | null) => void;
}

const Step4Address = ({ address, onAddressChange, selectedState, useRegisteredAgent: propUseRegisteredAgent = false, onRegisteredAgentChange }: Step4AddressProps) => {
    const [localAddress, setLocalAddress] = useState<AddressData>(address || {
        streetAddress: '',
        city: '',
        state: selectedState || '',
        zipCode: '',
        country: 'United States',
    });

    const [useRegisteredAgent, setUseRegisteredAgent] = useState(propUseRegisteredAgent);
    const [_registeredAgentAddressId, setRegisteredAgentAddressId] = useState<number | null>(null);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);


    useEffect(() => {
        if (address) {
            setLocalAddress(address);
        } else if (selectedState) {
            setLocalAddress(prev => ({ ...prev, state: selectedState }));
        }
    }, [address, selectedState]);

    useEffect(() => {
        setUseRegisteredAgent(propUseRegisteredAgent);
    }, [propUseRegisteredAgent]);

    const handleChange = (field: keyof AddressData, value: string) => {
        const updated = { ...localAddress, [field]: value };
        setLocalAddress(updated);
        onAddressChange(updated);
    };

    const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setUseRegisteredAgent(checked);

        if (checked) {
            // Fetch the first active registered agent address
            setIsLoadingAddress(true);
            try {
                const response = await apiClient.get('/registered-agent-address');
                const agentAddress = response.data.data;

                if (agentAddress) {
                    // Store the registered agent address ID
                    setRegisteredAgentAddressId(agentAddress.id);
                    
                    const updatedAddress: AddressData = {
                        streetAddress: agentAddress.address || '',
                        city: agentAddress.city || '',
                        state: agentAddress.state || '',
                        zipCode: agentAddress.postal_code || '',
                        country: agentAddress.country || 'United States',
                    };
                    setLocalAddress(updatedAddress);
                    onAddressChange(updatedAddress);
                    
                    // Notify parent component
                    if (onRegisteredAgentChange) {
                        onRegisteredAgentChange(true, agentAddress.id);
                    }
                }
            } catch (error) {
                console.error('Error fetching registered agent address:', error);
                // Optionally show an error message to the user
            } finally {
                setIsLoadingAddress(false);
            }
        } else {
            // Reset to empty or previous values when unchecked
            setRegisteredAgentAddressId(null);
            const resetAddress: AddressData = {
                streetAddress: '',
                city: '',
                state:  '',
                zipCode: '',
                country: 'United States',
            };
            setLocalAddress(resetAddress);
            onAddressChange(resetAddress);
            
            // Notify parent component
            if (onRegisteredAgentChange) {
                onRegisteredAgentChange(false, null);
            }
        }
    };

    return (
        <div className="max-w-sm lg:max-w-2xl mx-auto px-4 md:px-0 pb-6 md:pb-8 space-y-24">
            <div className="flex flex-col gap-16">
                <StepHeader
                    icon="https://app.privatily.com/assets/img/header-icones/adresse.png"
                    title="Company Address"
                    subtitle="This is the home address of your company."
                />

                <div className="space-y-6">
                    {/* Street Address */}
                    <div>
                        <label className="text-xs lg:text-sm font-medium text-foreground mb-2 block">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={localAddress.streetAddress}
                            onChange={(e) => handleChange('streetAddress', e.target.value)}
                            placeholder="eg. 123 Main Street"
                            disabled={useRegisteredAgent}
                            className={`w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background ${useRegisteredAgent ? 'bg-muted opacity-60 cursor-not-allowed' : ''
                                }`}
                        />
                    </div>

                    {/* City and State */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="text-xs lg:text-sm font-medium text-foreground mb-2 block">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={localAddress.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                placeholder="eg. New York"
                                disabled={useRegisteredAgent}
                                className={`w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background ${useRegisteredAgent ? 'bg-muted opacity-60 cursor-not-allowed' : ''
                                    }`}
                            />
                        </div>

                        <div className="flex-1">
                            <label className="text-xs lg:text-sm font-medium text-foreground mb-2 block">
                                State / Province / Region <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={localAddress.state}
                                onChange={(e) => handleChange('state', e.target.value)}
                                placeholder="eg. New York"
                                disabled={useRegisteredAgent}
                                className={`w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background ${useRegisteredAgent ? 'bg-muted opacity-60 cursor-not-allowed' : ''
                                    }`}
                            />
                        </div>
                    </div>

                    {/* ZIP Code and Country */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="text-xs lg:text-sm font-medium text-foreground mb-2 block">
                                Postal Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={localAddress.zipCode}
                                onChange={(e) => handleChange('zipCode', e.target.value)}
                                placeholder="eg. 10001"
                                disabled={useRegisteredAgent}
                                className={`w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background ${useRegisteredAgent ? 'bg-muted opacity-60 cursor-not-allowed' : ''
                                    }`}
                            />
                        </div>

                        <div className="flex-1 relative">
                            <label className="text-xs lg:text-sm font-medium text-foreground mb-2 block">
                                Country <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={localAddress.country}
                                onChange={(e) => handleChange('country', e.target.value)}
                                disabled={useRegisteredAgent}
                                className={`w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background appearance-none cursor-pointer pr-10 ${useRegisteredAgent ? 'bg-muted opacity-60 cursor-not-allowed' : ''
                                    }`}
                            >
                                {COUNTRIES.map((country) => (
                                    <option key={country.name} value={country.name}>
                                        {country.flag} {country.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-9 pointer-events-none">
                                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className='mt-8'>
                        {/* ask weather the user want to use the registered agent address */}

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={useRegisteredAgent}
                                disabled={isLoadingAddress}
                                className='cursor-pointer'
                                onChange={handleCheckboxChange}
                            />
                            <p className="text-xs lg:text-sm text-muted-foreground">
                                If you want to use the registered agent address, please check the box.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Step4Address;

