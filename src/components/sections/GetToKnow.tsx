import { useQuery } from '@tanstack/react-query';
import { fetchGetToKnowData } from '@/lib/api/getToKnow';

const GetToKnow = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['getToKnow'],
        queryFn: fetchGetToKnowData,
    });

    return (
        <div className="bg-background py-12 md:py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Left Section - Text and Statistics */}
                    <div className="flex-1 space-y-8">
                        {/* Heading */}
                        <div className="-space-y-4 text-center justify-center items-center">
                            <h2 className="text-[2.5rem] md:text-6xl font-semibold text-foreground">
                                Get to Know
                            </h2>
                            <h2 className="text-[2.5rem] md:text-6xl font-semibold text-accent">
                                Privatily
                            </h2>
                        </div>
                        <div className=' py-0.5 md:py-6 lg:py-20'></div>


                        {/* Statistics */}
                        {!isLoading && data && (
                            <div className="flex flex-row gap-6 md:gap-8">
                                {/* Statistics Block 1 - Companies */}
                                <div className="flex items-center">
                                    <div className=" rounded-lg px-4 md:px-6 py-3 md:py-4">
                                        <div className="text-3xl md:text-5xl lg:text-5xl ">
                                            {data.companiesFormed}+
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs md:text-sm  text-foreground">Companies</span>
                                        <span className="text-xs md:text-sm  text-foreground">formed</span>

                                    </div>
                                </div>
                                <div className="flex items-center ">
                                    <div className="flex flex-col">
                                        <div className="-mt-2.5 sm:-mt-2 w-0.25 h-4 bg-muted-foreground/30 rotate-60"></div>
                                        <div className="-mt-2.5 sm:-mt-2 w-0.25 h-4 bg-muted-foreground/30 rotate-60"></div>
                                        <div className="-mt-2.5 sm:-mt-2 w-0.25 h-4 bg-muted-foreground/30 rotate-60"></div>
                                        <div className="-mt-2.5 sm:-mt-2 w-0.25 h-4 bg-muted-foreground/30 rotate-60"></div>
                                        <div className="-mt-2.5 sm:-mt-2 w-0.25 h-4 bg-muted-foreground/30 rotate-60"></div>
                                    </div>

                                </div>

                                {/* Statistics Block 2 - Countries */}
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl md:text-5xl lg:text-5xl text-foreground">
                                        {data.countriesServed}+
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs md:text-sm text-foreground">Countries</span>
                                        <span className="text-xs md:text-sm text-foreground">served</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Section - Image with Background Graphics */}
                    <div className="flex-1 w-full lg:w-auto relative overflow-hidden">
                        <div className="relative max-w-xs md:max-w-sm mx-auto ">
                            {/* Large Blue-Purple Irregular Shape */}
                            <div className="absolute inset-0 -z-10 overflow-hidden">
                                <div className="absolute top-0 right-0 w-[120%] h-[110%] bg-gradient-to-br from-blue-700 via-blue-600 to-[var(--color-purple)] rounded-[40%] transform translate-x-1/4 -translate-y-1/4"></div>

                                {/* Concentric Semi-Circles */}
                                <div className="absolute bottom-0 right-0 w-full h-full overflow-hidden">
                                    <svg className="absolute bottom-0 right-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
                                        <path
                                            d="M 400 400 Q 200 350 0 400 L 0 400 L 400 400 Z"
                                            fill="rgba(147, 197, 253, 0.3)"
                                        />
                                        <path
                                            d="M 400 400 Q 200 320 0 400 L 0 400 L 400 400 Z"
                                            fill="rgba(147, 197, 253, 0.2)"
                                        />
                                        <path
                                            d="M 400 400 Q 200 290 0 400 L 0 400 L 400 400 Z"
                                            fill="rgba(147, 197, 253, 0.15)"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Decorative Squiggly Lines */}
                            <div className="absolute top-8 right-8 z-20">
                                {/* Black squiggly lines */}
                                <svg className="w-16 h-16" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path
                                        d="M 10 20 Q 30 10, 50 20 T 90 20"
                                        stroke="rgba(0, 0, 0, 0.3)"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <path
                                        d="M 10 30 Q 30 20, 50 30 T 90 30"
                                        stroke="rgba(0, 0, 0, 0.3)"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                    <path
                                        d="M 10 40 Q 30 30, 50 40 T 90 40"
                                        stroke="rgba(0, 0, 0, 0.3)"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                </svg>
                            </div>

                            {/* Orange-Yellow squiggly line */}
                            <div className="absolute top-4 right-4 z-20">
                                <svg className="w-12 h-12" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path
                                        d="M 10 50 Q 30 40, 50 50 T 90 50"
                                        stroke="#f97316"
                                        strokeWidth="2.5"
                                        fill="none"
                                    />
                                </svg>
                            </div>

                            {/* Black squiggly line on far right */}
                            <div className="absolute top-1/2 -right-2 z-20">
                                <svg className="w-8 h-16" viewBox="0 0 50 100" preserveAspectRatio="none">
                                    <path
                                        d="M 10 20 Q 20 30, 10 40 Q 20 50, 10 60 Q 20 70, 10 80"
                                        stroke="rgba(0, 0, 0, 0.3)"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                </svg>
                            </div>

                            {/* Main Image */}
                            <div className="relative z-10">
                                <img
                                    src="https://privatily.com/wp-content/uploads/2023/08/img-about-min.png"
                                    alt="Privatily team member"
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetToKnow;