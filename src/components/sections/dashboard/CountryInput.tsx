import { Button } from '@/components/ui/button';
import { HiChat } from 'react-icons/hi';

interface CountryInputProps {
    onCountrySelect?: (country: 'US' | 'UK') => void;
}

const CountryInput = ({ onCountrySelect }: CountryInputProps) => {
    const countries = [
        {
            flag: '🇺🇸',
            name: 'United States',
            description: 'Starts from $229 (one-time, no extra fees), then $99/year',
            hasButton: false
        },
        {
            flag: '🇬🇧',
            name: 'United Kingdom',
            description: 'Starts from $197 (one-time, no extra fees), then $59/year',
            hasButton: false
        },
        {
            flag: '🇭🇰',
            name: 'Hong kong',
            description: 'Gateway to Asia with world-class financial infrastructure',
            hasButton: true,
            buttonText: 'Join Waitlist'
        },
        {
            flag: '🇦🇪',
            name: 'Dubai, UAE',
            description: 'Most millionaires & future millionaires launch their businesses here',
            hasButton: true,
            buttonText: 'Join Waitlist'
        }
    ];

    return (
        <div className=" bg-background py-12 px-4 md:py-16 lg:py-20">
            <div className="max-w-2xl lg:max-w-3xl mx-auto ">
                {/* Header Section */}
                <div className="text-center mb-12 md:mb-4 lg:mb-8">
                    {/* 3D Globe Icon */}
                    <div className="flex justify-center ">
                        <img
                            src="https://app.privatily.com/assets/img/header-icones/incorporate.png"
                            alt="Globe icon"
                            className="w-20 h-24 md:w-28 md:h-32"
                        />
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-lg sm:text-[1.3rem] md:text-2xl  font-extrabold text-foreground">
                        Where do you want to Incorporate?
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xs lg:text-sm text-foreground  max-w-sm md:max-w-md lg:max-w-3xl mx-auto leading-relaxed">
                        Privatily is the only service that enables non-residents to easily form their company in their chosen country
                    </p>
                </div>

                {/* Country Selection Cards */}
                <div className="space-y-2 px-4 sm:px-6 md:px-24 lg:px-10">
                    {countries.map((country, index) => {
                        // Map country names to US/UK codes (ignore others for now)
                        const getCountryCode = (countryName: string): 'US' | 'UK' | null => {
                            if (countryName === 'United States') return 'US';
                            if (countryName === 'United Kingdom') return 'UK';
                            return null;
                        };

                        const countryCode = getCountryCode(country.name);
                        const isSelectable = countryCode !== null;

                        return (
                        <div
                            key={index}
                            onClick={() => {
                                if (onCountrySelect && countryCode) {
                                    onCountrySelect(countryCode);
                                }
                            }}
                            className={`bg-card rounded-lg shadow-sm border border-border hover:border-accent transition-all duration-300 hover:scale-102 px-4 md:px-6 py-4 flex flex-col md:flex-row items-end md:items-center justify-between gap-4 ${isSelectable ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Flag Icon */}
                                <div className="shrink-0">
                                    <div className="w-12 h-12  rounded-full flex items-center justify-center text-2xl md:text-3xl ">
                                        {country.flag}
                                    </div>
                                </div>

                                {/* Country Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-foreground  ">
                                        {country.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {country.description}
                                    </p>
                                </div>
                            </div>

                            {/* Button (if applicable) */}
                            {country.hasButton && (
                                <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // For waitlist countries, don't trigger country selection
                                        }}
                                        className="bg-purple hover:bg-purple-dark text-white px-4 rounded-sm font-medium text-xs whitespace-nowrap"
                                    >
                                        {country.buttonText}
                                    </Button>
                                </div>
                            )}
                        </div>
                        );
                    })}
                </div>
            </div>

            {/* Fixed Chat Icon */}
            <div className="fixed bottom-6 right-6 z-50">
                <button className="w-12 h-12 md:w-14 md:h-14 bg-purple hover:bg-purple-dark rounded-full flex items-center justify-center shadow-lg transition-colors">
                    <HiChat className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </button>
            </div>
        </div>
    );
};

export default CountryInput;
