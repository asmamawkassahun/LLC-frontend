import type { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
    icon: LucideIcon;
    label: string;
    isSelected?: boolean;
    onClick?: () => void;
}

const CategoryCard = ({ icon, label, isSelected = false, onClick }: CategoryCardProps) => {
    const Icon = icon;
    return (
        <div
            onClick={onClick}
            className={`relative flex flex-col items-center justify-center py-10  md:py-5 lg:py-6 px-4 md:px-5 lg:px-6 rounded-lg border-2 cursor-pointer transition-all w-full shadow-sm ${
                isSelected
                    ? 'bg-purple/10 border-purple'
                    : 'bg-white border-gray-200 hover:border-purple/50'
            }`}
        >
            {isSelected && (
                <div className="absolute -top-2 -right-2 z-50 w-5 h-5 md:w-6 md:h-6 bg-gold-800 rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
            <div className="mb-6 md:mb-3 flex items-center justify-center h-12 md:h-14 lg:h-16">
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-navy-800" />
            </div>
            <span className="text-base md:text-sm font-bold text-center text-gray-900">
                {label}
            </span>
        </div>
    );
};

export default CategoryCard;

