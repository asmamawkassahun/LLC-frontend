import Benefits from "@/components/sections/Benefits";
import CTASection from "@/components/sections/CTASection";
import FooterSection from "@/components/sections/Footer";
import GetToKnow from "@/components/sections/GetToKnow";
import HelpSection from "@/components/sections/HelpSection";
import StoryMission from "@/components/sections/StoryMission";

const AboutUs = () => {
    return (
        <div>
            <GetToKnow />
            <StoryMission />
            <Benefits />
            <HelpSection
                heading="Join the Privatily Family Today"
                description="Are you ready to take the next step in your entrepreneurial journey? Get started with Privatily today and let our team of experts guide you through the process of US/UK company formation and Stripe account setup. We look forward to helping you achieve your goals and grow your business."
                buttonText="Start My Business"
                variant="solid-blue"
            />
            <CTASection />
            <FooterSection />
        </div>
    );
}

export default AboutUs;