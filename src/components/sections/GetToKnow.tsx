import { useQuery } from '@tanstack/react-query';
import { fetchGetToKnowData } from '@/lib/api/getToKnow';
import { FileCheck2, Award, BadgeCheck } from 'lucide-react';

const GetToKnow = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['getToKnow'],
        queryFn: fetchGetToKnowData,
    });

    const documents = [
        { icon: FileCheck2, label: "Certificate of Formation", sub: "Registered with the State" },
        { icon: BadgeCheck, label: "EIN Confirmation", sub: "IRS Tax ID issued" },
        { icon: Award, label: "Banking Ready", sub: "Work with Mercury & Stripe" }
    ];

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
                                Incorporia
                            </h2>
                        </div>
                        <div className=' py-0.5 md:py-6 lg:py-20'></div>


                        {/* Statistics */}
                        {!isLoading && data && (
                            <div className="flex flex-row gap-6 md:gap-8">
                                {/* Statistics Block 1 - Companies */}
                                <div className="flex items-center">
                                    <div className=" rounded-lg px-4 md:px-6 py-3 md:py-4">
                                        <div className="text-3xl md:text-5xl lg:text-5xl text-accent">
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
                                    <div className="text-3xl md:text-5xl lg:text-5xl text-accent">
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

                    {/* Right Section - Visual with Background Graphics */}
                    <div className="flex-1 w-full lg:w-auto relative overflow-hidden">
                        <div className="relative max-w-xs md:max-w-sm mx-auto ">
                            {/* Large Navy Shape */}
                            <div className="absolute inset-0 -z-10 overflow-hidden">
                                <div className="absolute top-0 right-0 w-[120%] h-[110%] bg-gradient-to-br from-navy-800 via-navy-900 to-[var(--color-purple)] rounded-[40%] transform translate-x-1/4 -translate-y-1/4"></div>

                                {/* Concentric Semi-Circles */}
                                <div className="absolute bottom-0 right-0 w-full h-full overflow-hidden">
                                    <svg className="absolute bottom-0 right-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
                                        <path
                                            d="M 400 400 Q 200 350 0 400 L 0 400 L 400 400 Z"
                                            fill="rgba(201, 162, 74, 0.25)"
                                        />
                                        <path
                                            d="M 400 400 Q 200 320 0 400 L 0 400 L 400 400 Z"
                                            fill="rgba(201, 162, 74, 0.2)"
                                        />
                                        <path
                                            d="M 400 400 Q 200 290 0 400 L 0 400 L 400 400 Z"
                                            fill="rgba(201, 162, 74, 0.15)"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Document Stack Visual */}
                            <div className="relative z-10 p-8">
                                <div className="relative">
                                    {/* Back cards */}
                                    <div className="absolute inset-0 translate-x-3 translate-y-3 bg-white/10 rounded-xl border border-gold-500/20"></div>
                                    <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-white/15 rounded-xl border border-gold-500/20"></div>

                                    {/* Front card */}
                                    <div className="relative bg-navy-900 rounded-xl border border-gold-500/40 p-6 space-y-4 shadow-2xl">
                                        {documents.map((doc, index) => {
                                            const Icon = doc.icon;
                                            return (
                                                <div key={index} className="flex items-center gap-4 bg-white/5 rounded-lg p-4">
                                                    <div className="w-10 h-10 rounded-full bg-gold-500/15 flex items-center justify-center shrink-0">
                                                        <Icon className="w-5 h-5 text-gold-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{doc.label}</p>
                                                        <p className="text-xs text-white/60">{doc.sub}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetToKnow;
