import { useState, useEffect } from 'react';
import { HiInformationCircle } from 'react-icons/hi';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import StepHeader from './StepHeader';
import CategoryCard from './CategoryCard';
import NavigationButtons from './NavigationButtons';
import Tooltip from './Tooltip';

interface Step1CompanyNameProps {
    onNext: () => void;
    formData: {
        companyName: string;
        type: string;
        category: string;
    };
    onFormDataChange: (data: Partial<{ companyName: string; type: string; category: string }>) => void;
}

const categories = [
    { id: 'tech', label: 'Tech', icon: 'https://app.privatily.com/assets/img/icone-categorie/tech.png' },
    { id: 'retail', label: 'Retail', icon: 'https://app.privatily.com/assets/img/icone-categorie/retail.png' },
    { id: 'marketing', label: 'Marketing', icon: 'https://app.privatily.com/assets/img/icone-categorie/marketing.png' },
    { id: 'consulting', label: 'Consulting', icon: 'https://app.privatily.com/assets/img/icone-categorie/consulting.png' },
    { id: 'education', label: 'Education', icon: 'https://app.privatily.com/assets/img/icone-categorie/education.png' },
    { id: 'entertainment', label: 'Entertainment', icon: 'https://app.privatily.com/assets/img/icone-categorie/entertainment.png' },
    { id: 'manufacturing', label: 'Manufacturing', icon: 'https://app.privatily.com/assets/img/icone-categorie/manufacturing.png' },
    { id: 'finance', label: 'Finance', icon: 'https://app.privatily.com/assets/img/icone-categorie/finance.png' },
    { id: 'real-estate', label: 'Real Estate', icon: 'https://app.privatily.com/assets/img/icone-categorie/real-estate.png' },
    { id: 'logistics', label: 'Logistics', icon: 'https://app.privatily.com/assets/img/icone-categorie/logistics.png' },
    { id: 'food', label: 'Food', icon: 'https://app.privatily.com/assets/img/icone-categorie/food.png' },
    { id: 'wellness', label: 'Wellness', icon: 'https://app.privatily.com/assets/img/icone-categorie/wellness.png' },
    { id: 'hospitality', label: 'Hospitality', icon: 'https://app.privatily.com/assets/img/icone-categorie/hospitality.png' },
    { id: 'construction', label: 'Construction', icon: 'https://app.privatily.com/assets/img/icone-categorie/construction.png' },
    { id: 'legal', label: 'Legal', icon: 'https://app.privatily.com/assets/img/icone-categorie/legal.png' },
    { id: 'other', label: 'Other', icon: 'https://app.privatily.com/assets/img/icone-categorie/other.png' },
];

const types = ['LLC', 'L.L.C.', 'LIMITED LIABILITY COMPANY'];

const Step1CompanyName = ({ onNext, formData, onFormDataChange }: Step1CompanyNameProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);

    useEffect(() => {
        const updateItemsPerPage = () => {
            const newItemsPerPage = window.innerWidth >= 768 ? 4 : 2;
            setItemsPerPage(newItemsPerPage);
            // Reset to first page if current page becomes invalid
            const newTotalPages = Math.ceil(categories.length / newItemsPerPage);
            setCurrentPage((prev) => Math.min(prev, newTotalPages - 1));
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const handleNext = () => {
        if (formData.companyName && formData.type && formData.category) {
            onNext();
        }
    };

    const handleCategoryClick = (categoryId: string) => {
        onFormDataChange({ category: categoryId });
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(0, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
    };

    return (
        <div className="max-w-4xl mx-auto pb-6 md:pb-8">
            <StepHeader
                icon="https://app.privatily.com/assets/img/header-icones/company.png"
                title="Let's name your business!"
                subtitle="What's the name of your company and what category does it belong to?"
            />

            <div className="space-y-6 mt-24">
                <div className="flex w-8/9 sm:w-1/2 md:w-5/6 lg:w-7/8 mx-auto gap-4 md:gap-2">
                    {/* Company Name */}
                    <div className="flex-2 ">
                        <div className="flex items-center gap-2 mb-2">
                            <label className="sm:text-sm text-xs font-medium text-foreground">
                                Company Name <span className="text-red-500">*</span>
                            </label>
                            <Tooltip content="Your chosen company name is subject to review and may require a change if already taken.">
                                <HiInformationCircle className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                            </Tooltip>
                        </div>
                        <input
                            type="text"
                            value={formData.companyName}
                            onChange={(e) => onFormDataChange({ companyName: e.target.value })}
                            placeholder="eg. Privatily"
                            className="w-full text-xs sm:text-sm px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background"
                        />
                    </div>

                    {/* Type */}
                    <div className="relative flex-1">
                        <label className="sm:text-sm text-xs font-medium text-foreground mb-2 block">
                            Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => onFormDataChange({ type: e.target.value })}
                            className="w-full text-xs sm:text-sm px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-foreground bg-background appearance-none cursor-pointer pr-10"
                        >
                            {types.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 sm:top-11 top-9 pointer-events-none">
                            <svg className="w-5 h-5 sm:w-5 sm:h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <label className="sm:text-sm text-xs text-center font-medium text-foreground mb-4 block">
                        Categories <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap- md:gap-3 lg:gap-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                            className="w-5 h-5 sm:w-10 sm:h-10 md:w-10 md:h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm"
                        >
                            <HiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 text-gray-600" />
                        </button>
                        <div className="flex-1 overflow-hidden">
                            <div 
                                className="flex gap-2 md:gap-3 lg:gap-4 transition-transform duration-300 ease-in-out"
                                style={{ 
                                    transform: `translateX(-${currentPage * 100}%)` 
                                }}
                            >
                                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                                    <div key={pageIndex} className="flex gap-2 md:gap-3 lg:gap-4 shrink-0 w-full mx-auto -mr-2 sm:-mr-3 lg:-mr-4">
                                        {categories.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((category) => (
                                            <div key={category.id} className="flex-1 shrink-0" style={{ minWidth: 0 }}>
                                                <CategoryCard
                                                    icon={category.icon}
                                                    label={category.label}
                                                    isSelected={formData.category === category.id}
                                                    onClick={() => handleCategoryClick(category.id)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages - 1}
                            className="w-5 h-5 lg:w-10 lg:h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm"
                        >
                            <HiChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                        </button>
                    </div>
                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === currentPage ? 'bg-purple' : 'bg-muted'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <NavigationButtons
                onNext={handleNext}
                nextDisabled={!formData.companyName || !formData.type || !formData.category}
            />
        </div>
    );
};

export default Step1CompanyName;

