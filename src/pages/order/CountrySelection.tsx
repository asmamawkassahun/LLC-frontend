import { useState } from 'react';
import CountryInput from '@/components/sections/dashboard/CountryInput';
import TransparentPricing from '@/components/sections/Features/TransparentPricing';

const CountrySelectionPage = () => {
    const [countrySelected, setCountrySelected] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<'US' | 'UK'>('US');

    const handleCountrySelect = (country: 'US' | 'UK') => {
        setSelectedCountry(country);
        setCountrySelected(true);
    };

    return (
        <div>
            {!countrySelected ? (
                <CountryInput onCountrySelect={handleCountrySelect} />
            ) : (
                <TransparentPricing variant="dashboard" defaultCountry={selectedCountry} />
            )}
        </div>
    );
};

export default CountrySelectionPage;

