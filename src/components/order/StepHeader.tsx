interface StepHeaderProps {
    icon?: string;
    title: string;
    subtitle: string;
}

const StepHeader = ({ icon, title, subtitle }: StepHeaderProps) => {
    return (
        <div className="text-center mb-4 md:mb-8">
            {icon && (
                <div className="hidden sm:flex justify-center mb-3 md:mb-4">
                    <img 
                        src={icon} 
                        alt="Step icon" 
                        className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
                    />
                </div>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 md:mb-3">
                {title}
            </h1>
            <p className="text-sm md:text-base text-foreground/80 px-2">
                {subtitle}
            </p>
        </div>
    );
};

export default StepHeader;

