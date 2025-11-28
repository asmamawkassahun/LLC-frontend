import { useState, useEffect } from 'react';
import StepHeader from './StepHeader';

interface AddressData {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    hasSSNOrITIN: boolean;
    ssnOrITIN: string;
}

const COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
    'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
    'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
    'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
    'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
    'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
    'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
    'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
    'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
    'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
    'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
    'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
    'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
    'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
    'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
    'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

interface Step4AddressProps {
    companyName: string;
    address: AddressData;
    onAddressChange: (address: AddressData) => void;
    selectedState?: string; // State selected in step 2
    isUSPlan?: boolean; // Whether the plan is for US
}

const Step4Address = ({ companyName, address, onAddressChange, selectedState, isUSPlan = false }: Step4AddressProps) => {
    const [localAddress, setLocalAddress] = useState<AddressData>(address || {
        streetAddress: '',
        city: '',
        state: selectedState || '',
        zipCode: '',
        country: 'United States',
        hasSSNOrITIN: false,
        ssnOrITIN: '',
    });

    useEffect(() => {
        if (address) {
            setLocalAddress(address);
        } else if (selectedState) {
            setLocalAddress(prev => ({ ...prev, state: selectedState }));
        }
    }, [address, selectedState]);

    const handleChange = (field: keyof AddressData, value: string) => {
        const updated = { ...localAddress, [field]: value };
        setLocalAddress(updated);
        onAddressChange(updated);
    };

    const isValid = 
        localAddress.streetAddress.trim() !== '' &&
        localAddress.city.trim() !== '' &&
        localAddress.state.trim() !== '' &&
        localAddress.zipCode.trim() !== '' &&
        localAddress.country.trim() !== '' &&
        (localAddress.hasSSNOrITIN === false || localAddress.ssnOrITIN.trim() !== '');

    return (
        <div className="max-w-sm lg:max-w-2xl mx-auto px-4 md:px-0 pb-6 md:pb-8 space-y-24">
            <div className="flex flex-col gap-24">
                <StepHeader
                    icon="https://app.privatily.com/assets/img/header-icones/adresse.png"
                    title="Residential Address"
                    subtitle="This is the home address of my name, You can be located in any country."
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
                            className="w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background"
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
                                className="w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background"
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
                                className="w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background"
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
                                className="w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background"
                            />
                        </div>

                        <div className="flex-1 relative">
                            <label className="text-xs lg:text-sm font-medium text-foreground mb-2 block">
                                Country <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={localAddress.country}
                                onChange={(e) => handleChange('country', e.target.value)}
                                className="w-full px-4 py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background appearance-none cursor-pointer pr-10"
                            >
                                {COUNTRIES.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
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

                    {/* SSN/ITIN Question - Only show for US plans */}
                    {isUSPlan && (
                        <>
                    <div className="flex  items-center justify-center sm:items-center gap-4 pt-20">
                        <label className="text-sm font-medium text-foreground whitespace-nowrap">
                            Do you have SSN or ITIN ?
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    const updated = { ...localAddress, hasSSNOrITIN: true };
                                    setLocalAddress(updated);
                                    onAddressChange(updated);
                                }}
                                className={`px-4 py-2 rounded-sm border text-xs lg:text-sm font-medium transition-colors ${
                                    localAddress.hasSSNOrITIN === true
                                        ? 'bg-accent/15 border-purple text-blue-900'
                                        : 'bg-white border-gray-300 text-foreground hover:bg-gray-50'
                                }`}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    const updated = { ...localAddress, hasSSNOrITIN: false, ssnOrITIN: '' };
                                    setLocalAddress(updated);
                                    onAddressChange(updated);
                                }}
                                className={`px-4 py-2 rounded-sm border text-xs lg:text-sm font-medium transition-colors ${
                                    localAddress.hasSSNOrITIN === false
                                        ? 'bg-accent/15 border-purple text-blue-900'
                                        : 'bg-white border-gray-300 text-foreground hover:bg-gray-50'
                                }`}
                            >
                                No
                            </button>
                        </div>
                    </div>

                    {/* SSN/ITIN Input (shown when Yes is selected) */}
                    {localAddress.hasSSNOrITIN === true && (
                        <div className='max-w-xs md:max-w-2xs lg:max-w-lg mx-auto'>
                            <input
                                type="text"
                                value={localAddress.ssnOrITIN}
                                onChange={(e) => handleChange('ssnOrITIN', e.target.value)}
                                placeholder="Enter SSN or ITIN number"
                                className="w-full text-xs lg:text-sm px-4 py-2 sm:py-1 border border-input rounded-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background"
                            />
                        </div>
                            )}
                        </>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Step4Address;

