import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const HowMuchTime = () => {
    const timelines = [
        {
            time: "24",
            label: "LLC formation"
        },
        {
            time: "24",
            label: "Company docs delivery"
        },
        {
            time: "120",
            label: "EIN acquisition"
        },
        {
            time: "165",
            label: "Avg. order delivery time"
        }
    ];

    // Refs for time counting animations
    const timeRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Number counting animation for times
    useEffect(() => {
        timelines.forEach((timeline, index) => {
            const timeRef = timeRefs.current[index];
            if (!timeRef) return;

            const targetValue = parseInt(timeline.time);
            if (isNaN(targetValue)) return;

            // Create an object to animate
            const counter = { value: 0 };

            // Set initial value to 0
            timeRef.textContent = '0h';

            // Animate counting
            gsap.to(counter, {
                value: targetValue,
                duration: 2,
                ease: 'power2.out',
                delay: index * 0.2, // Stagger the animations
                onUpdate: function () {
                    if (timeRef) {
                        timeRef.textContent = Math.round(counter.value) + 'h';
                    }
                }
            });
        });
    }, []);

    return (
        <div className="relative bg-linear-to-br from-blue-900 via-blue-800 to-purple-800 pt-4 md:pt-8 lg:pt-12 ">
            <div className=" px-4 sm:px-6 lg:px-16">
                <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
                    {/* Left Content */}
                    <div className="flex-2 space-y-6  lg:space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-[1.6rem] md:text-3xl lg:text-5xl font-bold text-white leading-tight">
                        How much time to get your LLC?
                    </h1>
                            <div className="space-y-2 max-w-md  text-white/80">
                                <p className="text-sm md:text-base lg:text-base  leading-relaxed">
                                    At Privatily we count delivery time by  hours, not by days or weeks like others do.
                    </p>
                                <p className="text-sm md:text-base lg:text-base  leading-relaxed">
                        However, please be aware that these timelines are applicable only if you opt for LLC registration in one of our recommended US states.
                    </p>
                            </div>
                        </div>
                        <div className=' md:py-16 lg:py-20'></div>

                        {/* Hourglass Image - Desktop only (hidden on mobile) */}
                        <div className="hidden md:block">
                            <img
                                src="https://privatily.com/wp-content/uploads/2023/11/5-2-min.png"
                                alt="Hourglass"
                                className="w-120 h-80 object-contain"
                            />
                        </div>
                    </div>

                    {/* Right Card */}
                    <div className="flex-1 w-full h-fit lg:w-auto">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
                            <div className="text-center pt-6 md:pt-8">
                                {timelines.map((timeline, index) => (
                                    <div key={index}>
                                        <div className="py-6 md:py-8">
                                            <div
                                                ref={(el) => {
                                                    if (el) timeRefs.current[index] = el;
                                                }}
                                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
                                            >
                                                0h
                                            </div>
                                            <div className="text-sm md:text-base text-white/90">
                                                {timeline.label}
                                            </div>
                                        </div>
                                        {index < timelines.length - 1 && (
                                            <div className="border-t w-full border-white/20"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hourglass Image - Mobile only (shown below Right Card) */}
                <div className="md:hidden mt-8 flex justify-center">
                    <img
                        src="https://privatily.com/wp-content/uploads/2023/11/5-2-min.png"
                        alt="Hourglass"
                        className="w-full max-w-md h-auto object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default HowMuchTime;