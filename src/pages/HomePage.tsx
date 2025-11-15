import Hero from "@/components/sections/Hero";
import FeaturesSection from "@/components/sections/FeaturesSection";
import TestimonialsSection from "@/components/sections/Testimonials";
import OurMissionSection from "./OurMission";
import FAQSection from "./FAQ";
import FooterSection from "./Footer";
import ContactSection from "./ContactPage";
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