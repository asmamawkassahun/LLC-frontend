interface CategoryCardProps {
    icon: string;
    label: string;
    isSelected?: boolean;
    onClick?: () => void;
}

const CategoryCard = ({ icon, label, isSelected = false, onClick }: CategoryCardProps) => {
    return (
        <div
            onClick={onClick}
            className={`relative flex flex-col items-center justify-center p-4 md:p-5 lg:p-6 rounded-lg border-2 cursor-pointer transition-all w-full shadow-sm ${
                isSelected
                    ? 'bg-purple/10 border-purple'
                    : 'bg-white border-gray-200 hover:border-purple/50'
            }`}
        >
            {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 md:w-6 md:h-6 bg-purple rounded-full flex items-center justify-center z-10">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
            <div className="mb-2 md:mb-3 flex items-center justify-center h-12 md:h-14 lg:h-16">
                <img src={icon} alt={label} className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain" />
            </div>
            <span className="text-xs md:text-sm font-bold text-center text-gray-900">
                {label}
            </span>
        </div>
    );
};

export default CategoryCard;

