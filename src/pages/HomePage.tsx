import Hero from "@/components/sections/Hero";
import FeaturesSection from "@/components/sections/FeaturesSection";
import TestimonialsSection from "@/components/sections/Testimonials";
import OurMissionSection from "../components/sections/OurMission";
import FAQSection from "../components/sections/FAQ";
import FooterSection from "../components/sections/Footer";
import ContactSection from "../components/sections/ContactPage";
function HomePage() {
  return (
    <div className="">
      < Hero />
      < FeaturesSection />
      < TestimonialsSection />
      <OurMissionSection />
      <FAQSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
}

export default HomePage;