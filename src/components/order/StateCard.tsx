import { useRef } from 'react';

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
    isOther?: boolean;
    showDropdown?: boolean;
    isDropdownOpen?: boolean;
    dropdownRef?: React.RefObject<HTMLDivElement>;
    inputRef?: React.RefObject<HTMLInputElement>;
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    filteredStates?: string[];
    selectedOtherState?: string;
    onStateSelect?: (state: string) => void;
}

const StateCard = ({ 
    name, 
    cost, 
    description, 
    tags, 
    isSelected = false, 
    onClick,
    isOther = false,
    showDropdown = false,
    isDropdownOpen = false,
    dropdownRef,
    inputRef,
    searchTerm = '',
    onSearchChange,
    filteredStates = [],
    selectedOtherState = '',
    onStateSelect
}: StateCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={cardRef}
            onClick={!isOther || !showDropdown ? onClick : undefined}
            className={`relative p-6 mx-2 sm:mx-0 rounded-lg border-2 transition-all ${
                isSelected
                    ? 'bg-purple/10 border-purple'
                    : 'bg-background border-border hover:border-purple/50'
            } ${isOther && showDropdown ? '' : 'cursor-pointer'}`}
            style={{ minHeight: isOther && showDropdown ? '200px' : 'auto' }}
        >
            {isSelected && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-gold-800 rounded-full border-2 border-white flex items-center justify-center z-10">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
            
            {isOther && showDropdown ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                    <div ref={dropdownRef} className="relative w-full max-w-xs z-50">
                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchTerm || selectedOtherState}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isDropdownOpen) {
                                        onClick?.();
                                    }
                                }}
                                onFocus={() => {
                                    if (onSearchChange && !searchTerm) {
                                        onSearchChange('');
                                    }
                                }}
                                placeholder="Choose another state"
                                className="w-full px-4 py-3 border-2 border-purple rounded-lg focus:outline-none focus:ring-2 focus:ring-purple text-foreground bg-background pr-10"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-purple rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
                                <div className="p-2">
                                    {filteredStates.length > 0 ? (
                                        filteredStates.map((state) => (
                                            <div
                                                key={state}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onStateSelect?.(state);
                                                }}
                                                className={`px-4 py-2 cursor-pointer hover:bg-purple/10 rounded ${
                                                    selectedOtherState === state ? 'bg-purple/20' : ''
                                                }`}
                                            >
                                                {state}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-muted-foreground text-sm">
                                            No states found
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <>
            <div className="mb-4">
                <div className="flex justify-between items-center">
                <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-purple' : 'text-foreground'}`}>
                    {name}
                </h3>
                            {cost && <p className="text-lg font-semibold text-foreground mb-3">{cost}</p>}
                </div>
                        {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
            </div>
                    {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 bg-accent/15 text-blue-700 text-xs font-medium rounded-xs"
                    >
                        {tag.label}
                    </span>
                ))}
            </div>
                    )}
                </>
            )}
        </div>
    );
};

export default StateCard;

