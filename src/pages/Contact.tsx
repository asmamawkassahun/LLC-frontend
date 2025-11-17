import ContactHeroSection from "@/components/sections/ContactHeroSection";
import ContactInfoSection from "@/components/sections/ContactInfoSection";
import FooterSection from "@/components/sections/Footer";
import HelpSection from "@/components/sections/HelpSection";


const Contact = () => {
    return (
        <div className=" mx-auto">
            <ContactHeroSection />
            <ContactInfoSection />
            <HelpSection />  
            <FooterSection />
        </div>
    )
}

export default Contact;