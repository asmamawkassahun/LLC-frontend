import { useNavigate } from 'react-router-dom';
import CountryInput from '@/components/sections/dashboard/CountryInput';
import { ROUTES } from '@/constants/routes';

const CountrySelectionPage = () => {
    const navigate = useNavigate();

    const handleCountrySelect = () => {
        // Navigate to order creation page after country selection
        navigate(ROUTES.ORDER_ADD);
    };

    return <CountryInput onCountrySelect={handleCountrySelect} />;
};

export default CountrySelectionPage;

