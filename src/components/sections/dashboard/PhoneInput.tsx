import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { HiChevronDown } from 'react-icons/hi';
import { getUniqueCountries } from '@/constants/countries';

interface PhoneInputProps {
    onNext?: () => void;
}

const PhoneInput = ({ onNext }: PhoneInputProps) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+251');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearchQuery, setCountrySearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                buttonRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setShowCountryDropdown(false);
            }
        };

        if (showCountryDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCountryDropdown]);

    const countries = getUniqueCountries();

    const selectedCountry = countries.find(c => c.code === countryCode) || countries.find(c => c.code === '+251') || countries[0];
    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
        country.code.includes(countrySearchQuery)
    );

    const handleNext = () => {
        // Validate phone number
        if (!phoneNumber.trim()) {
            return; // Don't proceed if phone number is empty
        }
        
        console.log('Phone number:', countryCode + phoneNumber);
        
        // Call the onNext callback to proceed to next step
        if (onNext) {
            onNext();
        }
    };

    return (
        <div className=" bg-white relative ">
            {/* Header Section - Top Left */}
            <div className='max-w-8xl mx-auto px-6 sm:px-8 flex items-center justify-between'>
                <div className=" ">
                    <h1 className="sm:text-3xl md:text-4xl text-2xl font-bold text-foreground mb-2">
                        Action Required
                    </h1>
                    <p className="sm:text-sm md:text-lg text-xs text-foreground/80 ">
                        Enter your phone number below to not miss out on important updates
                    </p>
                </div>

                {/* Icon - Top Right */}
                <div className="">
                    <div className="relative">
                        <img src="https://app.privatily.com/assets/img/header-icons/phone.png" alt="phone" className="sm:w-24 sm:h-24 w-42 h-22" />
                    </div>
                </div>
            </div>

            {/* Main Content - Centered */}
            <div className="flex items-center justify-center max-h-screen px-4  py-40">
                <div className="w-full flex flex-col items-center justify-center max-w-lg mx-auto">
                    {/* Prompt */}
                    <h2 className="sm:text-2xl md:text-[2rem] text-xl font-bold text-foreground mb-8 text-center">
                        Please enter your phone number
                    </h2>

                    {/* Phone Number Input Field */}
                    <div className="mb-6 relative w-full">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                            {/* Country Code Selector */}
                            <div className="relative">
                                <button
                                    ref={buttonRef}
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        console.log('Button clicked, current state:', showCountryDropdown);
                                        setShowCountryDropdown(!showCountryDropdown);
                                        setCountrySearchQuery('');
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 border-r border-gray-300 bg-white hover:bg-gray-50 rounded-l-lg focus:outline-none cursor-pointer"
                                >
                                    <span className="text-xl">{selectedCountry.flag}</span>
                                    <span className="text-sm font-medium text-foreground">{selectedCountry.code}</span>
                                    <HiChevronDown className="w-4 h-4 text-gray-500" />
                                </button>

                                {/* Dropdown */}
                                {showCountryDropdown && (
                                    <div
                                        ref={dropdownRef}
                                        className="absolute top-full left-0 mt-1 w-80 bg-white border-2 border-gray-400 rounded-lg shadow-2xl max-h-60 overflow-visible"
                                        style={{
                                            zIndex: 9999,
                                            display: 'block',
                                            visibility: 'visible',
                                            opacity: 1
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                    >
                                        <div className="p-2 border-b border-gray-200">
                                            <input
                                                type="text"
                                                value={countrySearchQuery}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    setCountrySearchQuery(e.target.value);
                                                }}
                                                onKeyDown={(e) => e.stopPropagation()}
                                                placeholder="Search country..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-sm"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="max-h-48 overflow-y-auto">
                                            {filteredCountries.length > 0 ? (
                                                filteredCountries.map((country) => (
                                                    <button
                                                        key={`${country.code}-${country.name}`}
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCountryCode(country.code);
                                                            setShowCountryDropdown(false);
                                                            setCountrySearchQuery('');
                                                        }}
                                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm transition-colors"
                                                    >
                                                        <span className="text-lg">{country.flag}</span>
                                                        <span className="text-foreground flex-1">{country.name}</span>
                                                        <span className="text-gray-500">{country.code}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-8 text-center text-sm text-gray-500">
                                                    No countries found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Phone Number Input */}
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                placeholder="91 123 4567"
                                className="flex-1 px-4 py-3 border-0 focus:outline-none text-foreground placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    {/* Next Button */}
                    <Button
                        onClick={handleNext}
                        disabled={!phoneNumber.trim()}
                        className=" bg-purple hover:bg-purple-dark text-white font-bold py-3 px-12 rounded-sm text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PhoneInput;
