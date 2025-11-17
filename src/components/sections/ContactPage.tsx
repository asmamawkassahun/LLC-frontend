import { Button } from '@/components/ui/button';
import { HiCheckCircle, HiBell } from 'react-icons/hi';
import ContactForm from './ContactForm';

const ContactSection = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="relative">
        {/* Top Section - Purple Banner */}
        <div className="bg-purple py-12 md:py-16 lg:py-20 pb-100! relative overflow-hidden">
          {/* Curved bottom edge on right side */}
          {/* <div className="absolute bottom-0 right-0 w-1/3 h-24 bg-background rounded-tl-full"></div> */}

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 md:mb-6">
                Reach Out, We're Here to Help!
              </h1>
              <p className="text-base md:text-lg  text-primary-foreground/90  ">
                Complete the form, and our team will promptly respond to your inquiry within our working hours!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section - White Content Area */}
        <div className="bg-background py-80 sm:py-100 md:py-100 lg:py-52">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          </div>
        </div>
      </div>

      <div className=" absolute left-1/2 -translate-x-1/2 top-65 max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-6xl mx-auto w-full bg-background px-0 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 md:py-20 lg:py-16 flex flex-col lg:flex-row items-start gap-8 lg:gap-12 rounded-2xl">            {/* Left Side - Contact Form */}
        <div className="flex-1 w-full lg:max-w-lg md:order-2 lg:order-1">
          <div className="bg-card rounded-lg  p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
              Send us a message
            </h2>

            <ContactForm />
          </div>
        </div>

        {/* Right Side - Team Image with UI Elements */}
        <div className="flex-1 w-full lg:w-auto md:order-1 lg:order-2 relative">
          <div className="relative">
            {/* Abstract Geometric Outlines (Light Blue Deconstructed Cube) */}
            <div className="absolute inset-0 -z-10">
              {/* Cube outline elements */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-blue-300/40 transform rotate-45"></div>
              <div className="absolute top-1/3 right-1/4 w-24 h-24 border-2 border-blue-300/40 transform -rotate-12"></div>
              <div className="absolute bottom-1/4 left-1/3 w-28 h-28 border-2 border-blue-300/40 transform rotate-12"></div>
              <div className="absolute top-1/2 right-1/3 w-20 h-20 border-2 border-blue-300/40 transform -rotate-45"></div>
            </div>

            {/* Team Image */}
            <div className="relative z-10">
              <img
                src="https://privatily.com/wp-content/uploads/2023/08/image-1-min-1.png"
                alt="Team collaboration"
                className="w-full md:w-1/2 lg:w-full mx-auto h-auto rounded-lg"
              />
            </div>

            {/* Floating Notification Cards */}
            {/* Top Card - Purple with Checkmark */}
            <div className="absolute -top-8 sm:top-4 left-4  md:-top-4 md:left-44 lg:-left-12 z-20 bg-[var(--color-purple)] rounded-lg shadow-lg pb-1 -pt-4 px-1 max-w-xs animate-pulse-slow">
              <span className="text-[0.4rem] lg:text-xs pl-6 text-primary-foreground/70">Just now</span>
              <div className="flex items-center justify-between gap-1 lg:gap-3">
                <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                  <HiCheckCircle className="w-2 h-2 lg:w-5 lg:h-5 text-primary-foreground shrink-0 mt-0.5" />
                  <p className="text-[0.4rem] lg:text-xs text-primary-foreground font-medium">
                    Your ticket has been resolved
                  </p>

                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 h-4 lg:h-6 px-3 rounded-sm text-[0.4rem] lg:text-xs"
                >
                  View
                </Button>
              </div>
            </div>

            {/* Bottom Card - Light Gray with Bell */}
            <div className="absolute top-6  left-4 md:top-10 md:left-44 lg:-left-12 z-20 bg-muted rounded-lg shadow-lg p-1 max-w-xs">
              <span className="text-[0.4rem] lg:text-xs pl-6 text-muted-foreground">30 min ago</span>
              <div className="flex items-center justify-between gap-1 lg:gap-3">

                <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                  <HiBell className="w-2 h-2 lg:w-5 lg:h-5 text-foreground shrink-0 " />
                  <p className="text-[0.4rem] lg:text-xs text-foreground font-medium ">
                    Your ticket has been received
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-4 lg:h-6 px-3 text-[0.4rem] lg:text-xs rounded-sm"
                >
                  View
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ContactSection;