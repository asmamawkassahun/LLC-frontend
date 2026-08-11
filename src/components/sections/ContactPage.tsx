import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { HiCheckCircle, HiBell } from 'react-icons/hi';
import { gsap } from 'gsap';
import { Headset, Send } from 'lucide-react';
import ContactForm from './ContactForm';

const ContactSection = () => {
  // Refs for floating notification cards
  const bottomCardRef = useRef<HTMLDivElement>(null);
  const topCardRef = useRef<HTMLDivElement>(null);

  // Animation for floating notification cards
  useEffect(() => {
    if (!bottomCardRef.current || !topCardRef.current) return;

    // Small delay to ensure layout is ready
    const timer = setTimeout(() => {
      const bottomCard = bottomCardRef.current;
      const topCard = topCardRef.current;
      
      if (!bottomCard || !topCard) return;

      // Get the positions of both cards
      const bottomRect = bottomCard.getBoundingClientRect();
      const topRect = topCard.getBoundingClientRect();
      
      // Calculate the vertical distance between top and bottom card positions
      const distance = bottomRect.top - topRect.top;

      // Set initial state - bottom card at top card's position (suddenly displayed)
      gsap.set(bottomCard, {
        y: -distance, // Position at top card's location
        opacity: 1 // Suddenly displayed
      });

      // Set initial state - top card completely hidden (not visible at all)
      gsap.set(topCard, {
        y: -30, // Start 30px above its position (much closer)
        opacity: 0, // Hidden initially
        visibility: 'hidden' // Completely hidden
      });

      // Bottom card slowly goes down to its position (slower speed)
      gsap.to(bottomCard, {
        y: 0,
        duration: 2.5, // Increased from 1.5s to 2.5s (slower)
        ease: 'power3.out',
      });

      // Top card appears and goes down to its position 1 second after bottom card starts
      gsap.to(topCard, {
        visibility: 'visible', // Make visible
        opacity: 1, // Appear
        y: 0,
        duration: 1.5, // Keep same speed
        ease: 'power3.out',
        delay: 1.0, // Start 1 second after bottom card starts
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="relative">
        {/* Top Section - Navy Banner */}
        <div className="bg-navy-900 py-12 md:py-16 lg:py-20 pb-100! relative overflow-hidden">
          {/* Gold Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white px-4 mb-4 md:mb-6">
                Reach Out, We're Here to Help!
              </h1>
              <p className="text-base md:text-lg px-4  text-white/80  ">
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

        {/* Right Side - Support Visual with UI Elements */}
        <div className="flex-1 w-full lg:w-auto md:order-1 lg:order-2 relative">
          <div className="relative">
            {/* Abstract Geometric Outlines (Gold Deconstructed Cube) */}
            <div className="absolute inset-0 -z-10">
              {/* Cube outline elements */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-gold-400/40 transform rotate-45"></div>
              <div className="absolute top-1/3 right-1/4 w-24 h-24 border-2 border-gold-400/40 transform -rotate-12"></div>
              <div className="absolute bottom-1/4 left-1/3 w-28 h-28 border-2 border-gold-400/40 transform rotate-12"></div>
              <div className="absolute top-1/2 right-1/3 w-20 h-20 border-2 border-gold-400/40 transform -rotate-45"></div>
            </div>

            {/* Support Visual */}
            <div className="relative z-10">
              <div className="bg-navy-900 rounded-lg p-6 md:p-8 relative overflow-hidden">
                {/* Glow */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-gold-500/15 rounded-full blur-3xl"></div>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-500/40 flex items-center justify-center">
                    <Headset className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Incorporia Support Team</p>
                    <p className="text-xs text-gold-300">Online now</p>
                  </div>
                </div>

                {/* Chat Bubbles */}
                <div className="space-y-3">
                  <div className="bg-white/5 border border-white/10 rounded-lg rounded-tl-none p-3 max-w-[85%]">
                    <p className="text-xs text-white/80">Hi there! How can we help you get started?</p>
                    <span className="text-[0.6rem] text-white/40">Just now</span>
                  </div>
                  <div className="bg-gold-500/15 border border-gold-500/30 rounded-lg rounded-br-none p-3 max-w-[85%] ml-auto">
                    <p className="text-xs text-gold-200">I'd like to form a US LLC</p>
                    <span className="text-[0.6rem] text-white/40">Just now</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2">
                      <p className="text-xs text-white/40">Type your message...</p>
                    </div>
                    <div className="w-8 h-8 rounded-md bg-gold-500 flex items-center justify-center">
                      <Send className="w-4 h-4 text-navy-950" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Notification Cards */}
            {/* Top Card - Gold with Checkmark */}
            <div 
              ref={topCardRef}
              className="absolute -top-8 sm:top-4 left-4  md:-top-4 md:left-44 lg:-left-12 z-20 bg-gold-500 rounded-lg shadow-lg pb-1 -pt-4 px-1 max-w-xs animate-pulse-slow"
            >
              <span className="text-[0.4rem] lg:text-xs pl-6 text-navy-950/70">Just now</span>
              <div className="flex items-center justify-between gap-1 lg:gap-3">
                <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                  <HiCheckCircle className="w-2 h-2 lg:w-5 lg:h-5 text-navy-950 shrink-0 mt-0.5" />
                  <p className="text-[0.4rem] lg:text-xs text-navy-950 font-medium">
                    Your ticket has been resolved
                  </p>

                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-navy-950/20 text-navy-950 hover:bg-navy-950/30 h-4 lg:h-6 px-3 rounded-sm text-[0.4rem] lg:text-xs"
                >
                  View
                </Button>
              </div>
            </div>

            {/* Bottom Card - Light Gray with Bell */}
            <div 
              ref={bottomCardRef}
              className="absolute top-6  left-4 md:top-10 md:left-44 lg:-left-12 z-20 bg-muted rounded-lg shadow-lg p-1 max-w-xs"
            >
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
