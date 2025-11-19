interface Tag {
    label: string;
}

interface StateCardProps {
    name: string;
    cost: string;
    description: string;
    tags: Tag[];
    isSelected?: boolean;
    onClick?: () => void;
}

const StateCard = ({ name, cost, description, tags, isSelected = false, onClick }: StateCardProps) => {
    return (
        <div
            onClick={onClick}
            className={`relative p-6 mx-2 sm:mx-0 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                    ? 'bg-purple/10 border-purple'
                    : 'bg-background border-border hover:border-purple/50'
            }`}
        >
            {isSelected && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-800 rounded-full border-2 border-white flex items-center justify-center z-10">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
            <div className="mb-4">
                <div className="flex justify-between items-center">
                <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-purple' : 'text-foreground'}`}>
                    {name}
                </h3>
                <p className="text-lg font-semibold text-foreground mb-3">{cost}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 bg-purple text-white text-xs font-medium rounded-full"
                    >
                        {tag.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default StateCard;

