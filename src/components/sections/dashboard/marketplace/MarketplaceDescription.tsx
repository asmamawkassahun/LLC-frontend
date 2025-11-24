import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

type DescriptionItem = 
    | { type: 'paragraph'; text: string }
    | { type: 'heading'; text: string }
    | { type: 'bullets'; items: string[] };

interface MarketplaceDescriptionProps {
    title: string;
    description: DescriptionItem[];
    requirements: string[];
    onClose?: () => void;
}

// Helper function to render text with bold formatting
const renderTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.slice(2, -2);
            return <strong key={index}>{boldText}</strong>;
        }
        return <span key={index}>{part}</span>;
    });
};

const MarketplaceDescription = ({ title, description, requirements, onClose }: MarketplaceDescriptionProps) => {
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
    const [isRequirementsOpen, setIsRequirementsOpen] = useState(true);

    return (
        <div className="w-full ">
            {/* Header */}
            <div className="flex items-center justify-between bg-[#F5F5F5] mb-4">
                <button
                    onClick={onClose}
                    className="w-12 h-10 flex items-center justify-center rounded-lg bg-background border border-border hover:bg-muted/80 transition-colors shadow-sm cursor-pointer"
                    aria-label="Close"
                >
                    <HiX className="w-4 h-4 text-foreground" />
                </button>
                <h1 className="text-2xl font-bold text-foreground flex-1 text-start pl-8">
                    {title}
                </h1>
            </div>

            {/* Description Section */}
            <div className="mb-4 bg-background border border-border rounded-lg overflow-hidden">
                <button
                    onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                    className="w-full flex items-center justify-between p-4 text-left transition-colors cursor-pointer hover:bg-muted/50"
                >
                    <span className="text-xl font-bold text-foreground">Description</span>
                    <div className="shrink-0">
                        {isDescriptionOpen ? (
                            <HiChevronUp className="w-5 h-5 text-foreground" />
                        ) : (
                            <HiChevronDown className="w-5 h-5 text-foreground" />
                        )}
                    </div>
                </button>
                {isDescriptionOpen && (
                    <div className="px-4 pb-4 pt-0">
                        <div className="text-base text-foreground leading-relaxed space-y-4">
                            {description.map((item, index) => {
                                if (item.type === 'paragraph') {
                                    return (
                                        <p key={index} className="text-foreground leading-relaxed">
                                            {renderTextWithBold(item.text)}
                                        </p>
                                    );
                                } else if (item.type === 'heading') {
                                    return (
                                        <p key={index} className="text-foreground leading-relaxed font-semibold">
                                            {item.text}
                                        </p>
                                    );
                                } else if (item.type === 'bullets') {
                                    return (
                                        <ul key={index} className="space-y-2 pl-0">
                                            {item.items.map((bullet, bulletIndex) => (
                                                <li key={bulletIndex} className="flex items-start gap-3">
                                                    <span className="text-foreground mt-1">•</span>
                                                    <span className="text-foreground leading-relaxed">
                                                        {renderTextWithBold(bullet)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Requirements Section */}
            <div className="bg-background border border-border rounded-lg overflow-hidden">
                <button
                    onClick={() => setIsRequirementsOpen(!isRequirementsOpen)}
                    className="w-full flex items-center justify-between p-4 text-left transition-colors cursor-pointer hover:bg-muted/50"
                >
                    <span className="text-[1.08rem] font-bold text-foreground">Requirements</span>
                    <div className="shrink-0">
                        {isRequirementsOpen ? (
                            <HiChevronUp className="w-5 h-5 text-foreground" />
                        ) : (
                            <HiChevronDown className="w-5 h-5 text-foreground" />
                        )}
                    </div>
                </button>
                {isRequirementsOpen && (
                    <div className="px-4 pb-4 pt-0">
                        <ul className="space-y-2">
                            {requirements.map((requirement, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-foreground mt-1">•</span>
                                    <span className="text-[1.08rem] text-foreground leading-relaxed">
                                        {requirement}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketplaceDescription;
