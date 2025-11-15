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

    return (
        <div className="relative bg-linear-to-br from-blue-900 via-blue-800 to-purple-800 pt-4 md:pt-8 lg:pt-12 ">
            <div className=" px-4 sm:px-6 lg:px-16">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Left Content */}
                    <div className="flex-2 space-y-6  lg:space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                How much time to get your LLC?
                            </h1>
                            <div className="space-y-2 max-w-md  text-white/80">
                                <p className="text-base  leading-relaxed">
                                    At Privatily we count delivery time by  hours, not by days or weeks like others do.
                                </p>
                                <p className="text-base  leading-relaxed">
                                    However, please be aware that these timelines are applicable only if you opt for LLC registration in one of our recommended US states.
                                </p>
                            </div>
                        </div>
                        
                        {/* Hourglass Image */}
                        <div className="">
                            <img 
                                src="https://privatily.com/wp-content/uploads/2023/11/5-2-min.png" 
                                alt="Hourglass" 
                                className="w-120 h-120 object-contain"
                            />
                        </div>
                    </div>

                    {/* Right Card */}
                    <div className="flex-1 w-full lg:w-auto">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 md:p-8">
                            <div className="space-y-0 text-center">
                                {timelines.map((timeline, index) => (
                                    <div key={index}>
                                        <div className="py-4 md:py-6">
                                            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                                                {timeline.time}h
                                            </div>
                                            <div className="text-sm md:text-base text-white/90">
                                                {timeline.label}
                                            </div>
                                        </div>
                                        {index < timelines.length - 1 && (
                                            <div className="border-t border-white/20"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowMuchTime;