
import { useQuery } from '@tanstack/react-query';
import { fetchStatsData } from '@/lib/api/stats';
import { TfiMedall } from "react-icons/tfi";
import { PiCurrencyDollarThin } from "react-icons/pi";
import { BsLightning } from "react-icons/bs";

const WhyUs = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: fetchStatsData,
    });

    const benefits = [
        {
            icon: TfiMedall,
            text: "Expert guidance since 2019"
        },
        {
            icon: PiCurrencyDollarThin,
            text: "Affordable, no hidden fees"
        },
        {
            icon: BsLightning,
            text: "Fast, hassle-free setup"
        }
    ];

    return (
        <div className="bg-background py-12 md:py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-18">
                {/* Stats Section */}
                {!isLoading && data && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-28 max-w-3xl mx-auto">
                        {data.stats.map((stat, index) => (
                            <div key={index} className="flex flex-col text-center gap-1.5">
                                <div className="text-4xl md:text-5xl lg:text-[2.8rem] font-bold text-primary mb-2 leading">
                                    {stat.value}+
                                </div>
                                <div className="text-sm md:text-base text-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Why Privatily Section */}
                <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
                    {/* Left Content */}
                    <div className="flex-1 space-y-6 lg:space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                                Why Privatily?
                            </h2>
                            <p className="text-[0.9rem] md:text-sm lg:text-[1.085rem] text-muted-foreground leading-relaxed">
                                We know how to take the complexity out of forming your company because we've been in your shoes. Privatily was born because we struggled ourselves—facing a complicated, lengthy process when trying to set up our own company in a supported country. Since 2019, we've been committed to providing unmatched expertise, affordable prices, and the fastest turnaround time to help entrepreneurs like you start your business journey smoothly and confidently.
                            </p>
                        </div>

                        {/* Benefits List */}
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="shrink-0 bg-accent/10 p-3 rounded-full">
                                            <Icon className="w-6 h-6 text-accent" />
                                        </div>
                                        <p className="text-sm font-bold md:text-lg text-foreground">
                                            {benefit.text}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="flex-1 w-full lg:w-auto">
                        <img
                            src="https://privatily.com/wp-content/uploads/2023/11/image-19-min.png"
                            alt="Privatily team member"
                            className="w-full h-auto rounded-lg object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyUs;