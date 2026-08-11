import type { ReactNode } from 'react';

interface StepHeaderProps {
    icon?: ReactNode;
    title: string;
    subtitle: string;
}

const StepHeader = ({ icon, title, subtitle }: StepHeaderProps) => {
    return (
        <div className="text-center mb-4 md:mb-8">
            {icon && (
                <div className="hidden sm:flex justify-center mb-3 md:mb-4">{icon}</div>
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

