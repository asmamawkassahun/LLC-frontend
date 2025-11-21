import { useState } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom';
    width?: string;
}

const Tooltip = ({ content, children, position = 'top', width = 'w-40' }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <span className="relative inline-block">
            <span
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="cursor-help"
            >
                {children}
            </span>
            {isVisible && (
                <div className={`absolute left-1/2 -translate-x-1/2 ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} px-2 py-2.5 bg-foreground text-background text-[10px] rounded-lg shadow-lg text-center ${width} pointer-events-none`} style={{ zIndex: 9999 }}>
                    {content}
                    {/* Arrow */}
                    <div className={`absolute ${position === 'top' ? 'top-full' : 'bottom-full'} left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] ${position === 'top' ? 'border-t-[6px] border-transparent border-t-foreground' : 'border-b-[6px] border-transparent border-b-foreground'}`} />
                </div>
            )}
        </span>
    );
};

export default Tooltip;

