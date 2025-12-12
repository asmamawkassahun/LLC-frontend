import { useState, useEffect } from "react";
import CountryInput from "@/components/sections/dashboard/CountryInput";
// import PhoneInput from "@/components/sections/dashboard/PhoneInput";
import TransparentPricing from "@/components/sections/Features/TransparentPricing";
import userService from "@/services/userService";

const DashboardPage = () => {
    // const [phoneSubmitted, setPhoneSubmitted] = useState(false);
    const [countrySelected, setCountrySelected] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<'US' | 'UK'>('US');
    // const [hasPhoneNumber, setHasPhoneNumber] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user data on mount to check if phone number exists
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await userService.getCurrentUser();
                // Check if phone number exists and is not empty
                const phoneExists = Boolean(user.phone && user.phone.trim() !== '');
                // setHasPhoneNumber(phoneExists);
                
                // If phone exists, skip phone input step
                if (phoneExists) {
                    // setPhoneSubmitted(true);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // If error, assume no phone number (show phone input)
                // setHasPhoneNumber(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // const handlePhoneSubmit = () => {
    //     setPhoneSubmitted(true);
    // };

    const handleCountrySelect = (country: 'US' | 'UK') => {
        setSelectedCountry(country);
        setCountrySelected(true);
    };

    // Show loading state while fetching user data
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-foreground">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            {/* If phone number doesn't exist, show PhoneInput */}
            {/* {!hasPhoneNumber && !phoneSubmitted ? (
                <PhoneInput onNext={handlePhoneSubmit} />
            ) :  */}
            {
            !countrySelected  ? (
                /* If phone exists or was submitted, show CountryInput */
                <CountryInput onCountrySelect={handleCountrySelect} />
            ) : (
                /* After country is selected, show pricing */
                <>
                    <TransparentPricing variant="dashboard" defaultCountry={selectedCountry} />
                </>
            )}
        </div>
    );
};

export default DashboardPage;