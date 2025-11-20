import { useState } from "react";
import CountryInput from "@/components/sections/dashboard/CountryInput";
import PhoneInput from "@/components/sections/dashboard/PhoneInput";
import TransparentPricing from "@/components/sections/Features/TransparentPricing";

const DashboardPage = () => {
    const [phoneSubmitted, setPhoneSubmitted] = useState(false);
    const [countrySelected, setCountrySelected] = useState(false);

    const handlePhoneSubmit = () => {
        setPhoneSubmitted(true);
    };

    const handleCountrySelect = () => {
        setCountrySelected(true);
    };

    return (
        <div>
            {!phoneSubmitted ? (
                <PhoneInput onNext={handlePhoneSubmit} />
            ) : !countrySelected ? (
                <CountryInput onCountrySelect={handleCountrySelect} />
            ) : (
                <>
                    {/* <CountryInput onCountrySelect={handleCountrySelect} /> */}
                    <TransparentPricing variant="dashboard" />
                </>
            )}
        </div>
    );
};

export default DashboardPage;