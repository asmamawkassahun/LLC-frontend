import { useState, useEffect, useRef } from 'react';
import { LiaMinusSolid, LiaPlusSolid } from "react-icons/lia";
import { gsap } from 'gsap';


const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number>(0);

    // Refs for profile avatars (6 profiles)
    const profileRefs = useRef<(HTMLDivElement | null)[]>([]);

    const faqs = [
        {
            question: "How much time you are going to take to finish my order?",
            answer: {
                subheading: "For the US:",
                points: [
                    "Premium orders have a processing speed 3 times faster than Basic orders.",
                    "We typically form companies within just 2 days.",
                    "Securing the EIN takes an additional 3-5 days (Note: Most other providers require at least 2 weeks for EIN acquisition)."
                ]
            }
        },
        {
            question: "What documents do I need to provide?",
            answer: {
                subheading: "We need two things from you:",
                points: [
                    "Either your ID card or passport. ",
                    "Your bank statement or a utility bill that includes your name, address and dated within the last 3 months (it should have a date on it so we know when the document was created)"

                ]
            }
        },
        {
            question: "What about taxes?",
            answer: {
                subheading: "",
                points: [
                    "Great question! When it comes to taxes for your US LLC, we’ve got you covered. We’ll connect you with a professional tax firm that specializes in helping non-residents handle everything smoothly, so you don’t have to worry about the details.",
                    "Since you’re not living in the US—and if you’re primarily selling outside the US—your tax obligations may be reduced significantly. The experts we connect you with will make sure you’re taking full advantage of any tax benefits available to non-residents. Rest assured, you’re in good hands!"
                ]
            }
        },
        {
            question: "Do you support my country?",
            answer: {
                subheading: "",
                points: [
                    "Yes, we accept clients from most countries! However, if you are from or based in a country that is currently sanctioned by the United States, we may not be able to assist you in forming a company in the US. For an updated list of sanctioned countries, please refer to the U.S. Department of the Treasury’s Office of Foreign Assets Control (OFAC) website."
                ]
            }
        },
        {
            question: "Your question wasn't listed above?",
            answer: {
                subheading: "",
                points: [
                    "We have answers for so many other questions in our Knowledgebase,",
                    "Check our helpdesk articles.",
                    "Or you can simply ask our Support team and we’ll be more than happy to help!"
                ]
            }
        }
    ];

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    // Animation for profile avatars - appear one after another
    useEffect(() => {
        profileRefs.current.forEach((profileRef, index) => {
            if (!profileRef) return;

            // Set initial state (hidden and scaled down)
            gsap.set(profileRef, {
                scale: 0,
                opacity: 0
            });

            // Animate each profile sequentially
            gsap.to(profileRef, {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                ease: 'back.out(1.7)',
                delay: index * 0.2, // Stagger by 0.2s between each profile
            });
        });
    }, []);

    return (
        <div className=" py-12 md:py-16 lg:py-20">
            <div className="max-w-96 md:max-w-3xl lg:max-w-7xl mx-auto bg-blue-500/5 rounded-xl  px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    {/* White Container Card */}
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 md:mb-12">
                        Frequently asked questions
                    </h1>
                    <div className="">
                        {/* Title */}

                        {/* FAQ Items */}
                        <div className="space-y-4">
                            {faqs.map((faq, index) => {
                                const isOpen = openIndex === index;

                                return (
                                    <div
                                        key={index}
                                        className="bg-background rounded-lg  overflow-hidden transition-all"
                                    >
                                        {/* Question Header */}
                                        <button
                                            onClick={() => toggleQuestion(index)}
                                            className="w-full flex items-center justify-between p-4 md:p-6 lg:p-10 text-left  transition-colors cursor-pointer"
                                        >
                                            <span className="text-base md:text-2xl font-semibold text-foreground hover:text-accent pr-4">
                                                {faq.question}
                                            </span>
                                            <div className="shrink-0">
                                                {isOpen ? (
                                                    <LiaMinusSolid className="w-6 h-6 text-purple" />
                                                ) : (
                                                    <LiaPlusSolid className="w-6 h-6 text-purple" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Answer Content */}
                                        {isOpen && faq.answer.points.length > 0 && (
                                            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                                                {faq.answer.subheading && (
                                                    <h3 className=" text-muted-foreground  text-start text-sm md:text-base mb-3 mt-4">
                                                        {faq.answer.subheading}
                                                    </h3>
                                                )}
                                                <ul className="space-y-2">
                                                    {faq.answer.points.map((point, pointIndex) => (
                                                        <li key={pointIndex} className="flex items-start gap-3">
                                                            <span className="text-purple">•</span>
                                                            <span className="text-sm md:text-base text-muted-foreground  text-start leading-relaxed">
                                                                {point}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {/* Launch Your Company Section */}
            <div className="max-w-7xl mx-auto rounded-xl  px-4 sm:px-6 lg:px-8 py-12 mt-16 md:mt-20">
                <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
                    {/* Left Column - Text */}
                    <div className="flex-1 space-y-6">
                        <h1 className="text-[1.5rem] sm:text-3xl  lg:text-5xl font-semibold text-foreground leading-tight">
                            Launch your company from <span className="text-blue-700">→ anywhere</span>
                        </h1>
                        <p className="text-sm px-2 sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                            Act now! Gain exclusive access to top-tier financial solutions, reserved solely for US-based companies, and significantly boost your business's potential for success.
                        </p>
                    </div>

                    {/* Right Column - World Map Visual */}
                    <div className="flex-1 bg-blue-700 rounded-xl w-full lg:w-auto relative overflow-hidden">
                        {/* Background Image */}
                        <img
                            src="https://privatily.com/wp-content/uploads/2023/04/Team-Testimonial-BG.webp"
                            alt="World map with team members"
                            className="w-full h-100 md:h-76 object-contain"
                        />

                        {/* Profile Avatars with Location Pins and Square Wave Animations */}
                        <div className="absolute inset-0">
                            {/* Profile 1 - Top-left (North Atlantic/Europe) - Light Green */}
                            <div
                                ref={(el) => {
                                    if (el) profileRefs.current[0] = el;
                                }}
                                className="absolute top-[12%] left-[18%]"
                            >
                                <div className="relative">
                                    {/* Square Wave Animations */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="square-wave square-wave-1"></div>
                                        <div className="square-wave square-wave-2"></div>
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-foreground border-2 border-primary-foreground shadow-lg overflow-hidden relative z-10">
                                        <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center text-primary-foreground font-bold text-lg">
                                            A
                                        </div>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-primary-foreground"></div>
                                </div>
                            </div>

                            {/* Profile 2 - Mid-top (North America) - Light Blue */}
                            <div
                                ref={(el) => {
                                    if (el) profileRefs.current[1] = el;
                                }}
                                className="absolute top-[8%] left-[35%]"
                            >
                                <div className="relative">
                                    {/* Square Wave Animations */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="square-wave square-wave-1"></div>
                                        <div className="square-wave square-wave-2"></div>
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-foreground border-2 border-primary-foreground shadow-lg overflow-hidden relative z-10">
                                        <div className="w-full h-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-primary-foreground font-bold text-lg">
                                            B
                                        </div>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-primary-foreground"></div>
                                </div>
                            </div>

                            {/* Profile 3 - Mid-left (Africa) - Light Pink */}
                            <div
                                ref={(el) => {
                                    if (el) profileRefs.current[2] = el;
                                }}
                                className="absolute top-[42%] left-[12%]"
                            >
                                <div className="relative">
                                    {/* Square Wave Animations */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="square-wave square-wave-1"></div>
                                        <div className="square-wave square-wave-2"></div>
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-foreground border-2 border-primary-foreground shadow-lg overflow-hidden relative z-10">
                                        <div className="w-full h-full bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center text-primary-foreground font-bold text-lg">
                                            C
                                        </div>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-primary-foreground"></div>
                                </div>
                            </div>

                            {/* Profile 4 - Mid-right (Europe/Asia border) - Light Brown */}
                            <div
                                ref={(el) => {
                                    if (el) profileRefs.current[3] = el;
                                }}
                                className="absolute top-[28%] right-[20%]"
                            >
                                <div className="relative">
                                    {/* Square Wave Animations */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="square-wave square-wave-1"></div>
                                        <div className="square-wave square-wave-2"></div>
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-foreground border-2 border-primary-foreground shadow-lg overflow-hidden relative z-10">
                                        <div className="w-full h-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-primary-foreground font-bold text-lg">
                                            D
                                        </div>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-primary-foreground"></div>
                                </div>
                            </div>

                            {/* Profile 5 - Bottom-middle (southern Africa/Middle East) - Light Pink */}
                            <div
                                ref={(el) => {
                                    if (el) profileRefs.current[4] = el;
                                }}
                                className="absolute bottom-[30%] left-[45%]"
                            >
                                <div className="relative">
                                    {/* Square Wave Animations */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="square-wave square-wave-1"></div>
                                        <div className="square-wave square-wave-2"></div>
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-foreground border-2 border-primary-foreground shadow-lg overflow-hidden relative z-10">
                                        <div className="w-full h-full bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center text-primary-foreground font-bold text-lg">
                                            E
                                        </div>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-primary-foreground"></div>
                                </div>
                            </div>

                            {/* Profile 6 - Bottom-right (Southeast Asia/Oceania) - Light Brown */}
                            <div
                                ref={(el) => {
                                    if (el) profileRefs.current[5] = el;
                                }}
                                className="absolute bottom-[20%] right-[18%]"
                            >
                                <div className="relative">
                                    {/* Square Wave Animations */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="square-wave square-wave-1"></div>
                                        <div className="square-wave square-wave-2"></div>
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-foreground border-2 border-primary-foreground shadow-lg overflow-hidden relative z-10">
                                        <div className="w-full h-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-primary-foreground font-bold text-lg">
                                            F
                                        </div>
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-primary-foreground"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQSection;