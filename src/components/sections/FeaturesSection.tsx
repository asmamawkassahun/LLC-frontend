import HowMuchTime from "./Features/HowMuchTime";
import TransparentPricing from "./Features/TransparentPricing";
import WhyInUs from "./Features/WhyInUs";
import WhyUs from "./Features/WhyUs";


const FeaturesSection = () => {
    return (
        <div>
            <WhyUs />
            <HowMuchTime />
            <WhyInUs />
            <TransparentPricing />
        </div>
    )
}

export default FeaturesSection;