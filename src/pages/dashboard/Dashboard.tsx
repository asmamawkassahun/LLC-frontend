import CountryInput from "@/components/sections/dashboard/CountryInput";
import PhoneInput from "@/components/sections/dashboard/PhoneInput";
import TransparentPricing from "@/components/sections/Features/TransparentPricing";

const DashboardPage = () => {
    return (
        <div>
            <PhoneInput />
            <CountryInput />
            <TransparentPricing variant="dashboard" />
        </div>
    );
};

export default DashboardPage;