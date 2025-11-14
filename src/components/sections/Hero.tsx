import { useQuery } from '@tanstack/react-query';
import { fetchHeroData } from '@/lib/api/hero';

const Hero = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['hero'],
        queryFn: fetchHeroData,
    });

    // Hardcoded values
    const title = "Form your company from anywhere";
    const description = "Join the thousands of entrepreneurs using our platform to incorporate their companies and unlock premium payment & banking options.";
    const stars = 5;
    const imageUrl = "https://privatily.com/wp-content/uploads/2024/11/Privatily-Product-Preview-2.jpg";
    const imageAlt = "Kimem Technology Product Preview";

    return (
        <div className=" py-12 md:py-16 lg:py-20">
            <div className="space-y-8 md:space-y-12">
                {/* Text Content */}
                <div className="space-y-6 max-w-176 mx-auto text-center">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl lg:text-[4.22rem] font-semibold text-foreground leading-tight">
                            {title}
                        </h1>
                        <p className="text-sm sm:text-lg px-4 sm:px-0 text-foreground/80 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Rating */}
                    {!isLoading && (
                        <div className="flex flex-row items-center gap-2 sm:gap-4 px-4 sm:px-0 justify-center">
                            <div className="flex items-center gap-1 border-r-2 border-border pr-4 py-2">
                                {Array.from({ length: stars }).map((_, index) => (
                                    <span key={index} className="text-yellow-400 text-[0.67rem] sm:text-sm ">
                                        ⭐
                                    </span>
                                ))}
                            </div>
                            <p className="text-[0.67rem] sm:text-sm text-foreground">
                                Rated {data?.rating?.value || 4.2}+ stars <span className="text-muted-foreground">by</span> entrepreneurs worldwide
                            </p>
                        </div>
                    )}
                </div>

                {/* Hero Image */}
                <div className="w-full">
                    <img
                        src={imageUrl}
                        alt={imageAlt}
                        className="w-full h-auto  shadow-lg object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero;