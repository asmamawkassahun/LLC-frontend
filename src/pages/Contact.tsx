import ContactHeroSection from "@/components/sections/ContactHeroSection";
import ContactInfoSection from "@/components/sections/ContactInfoSection";
import FooterSection from "@/components/sections/Footer";
import HelpSection from "@/components/sections/HelpSection";

const Contact = () => {
    return (
        <div className="mx-auto">
            <ContactHeroSection />
            <ContactInfoSection />
            <HelpSection
                heading="Need Help Fast?"
                description="Browse our articles on frequently asked questions and easily find the answers you're looking for."
                buttonText="Visit Helpdesk"
                variant="gradient"
            />
            <FooterSection />
        </div>
    );
}

export default Contact;