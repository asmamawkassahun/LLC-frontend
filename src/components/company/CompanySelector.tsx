import { useState, useRef, useEffect } from 'react';
import { HiX, HiChevronDown } from 'react-icons/hi';
import { Button } from '../ui';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import companyService, { type Company } from '@/services/companyService';
import { Loader2 } from 'lucide-react';

interface CompanySelectorProps {
    variant?: 'navbar' | 'sidebar';
    onStartNewCompany?: () => void;
    className?: string;
}

const CompanySelector = ({ 
    variant = 'navbar', 
    onStartNewCompany,
    className = '' 
}: CompanySelectorProps) => {
    const navigate = useNavigate();
    const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);

    // Fetch companies on component mount
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setIsLoadingCompanies(true);
                const fetchedCompanies = await companyService.getCompanies();
                setCompanies(fetchedCompanies);
                
                // Set primary company as selected, or first company if no primary
                const primaryCompany = fetchedCompanies.find(c => c.is_primary) || fetchedCompanies[0];
                if (primaryCompany) {
                    setSelectedCompany(primaryCompany);
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
                setCompanies([]);
            } finally {
                setIsLoadingCompanies(false);
            }
        };

        fetchCompanies();

        // Listen for company primary change events (from orders table)
        const handleCompanyPrimaryChange = () => {
            fetchCompanies();
        };

        window.addEventListener('companyPrimaryChanged', handleCompanyPrimaryChange);

        return () => {
            window.removeEventListener('companyPrimaryChanged', handleCompanyPrimaryChange);
        };
    }, []);

    const otherCompanies = companies.filter(c => selectedCompany && c.id !== selectedCompany.id);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCompanyDropdownOpen(false);
            }
        };

        if (isCompanyDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCompanyDropdownOpen]);

    const handleCompanySelect = async (company: Company) => {
        try {
            // If selecting a different company, set it as primary
            if (selectedCompany && company.id !== selectedCompany.id) {
                await companyService.setAsPrimary(company.id);
                // Update the is_primary flag in local state
                setCompanies(prev => prev.map(c => ({
                    ...c,
                    is_primary: c.id === company.id
                })));
                
                // Dispatch event to refresh orders table
                window.dispatchEvent(new CustomEvent('companyChanged', { 
                    detail: { companyId: company.id } 
                }));
            }
            setSelectedCompany(company);
            setIsCompanyDropdownOpen(false);
        } catch (error) {
            console.error('Error setting company as primary:', error);
            // Still update the selected company even if API call fails
            setSelectedCompany(company);
            setIsCompanyDropdownOpen(false);
        }
    };

    const handleStartNewCompany = () => {
        setIsCompanyDropdownOpen(false);
        if (onStartNewCompany) {
            onStartNewCompany();
        } else {
            navigate(ROUTES.ORDER_COUNTRY_SELECTION);
        }
    };

    const getCountryFlag = (countryName?: string) => {
        if (!countryName) return '🇺🇸';
        const name = countryName.toLowerCase();
        if (name.includes('united states') || name.includes('usa') || name === 'us') {
            return '🇺🇸';
        } else if (name.includes('united kingdom') || name.includes('uk') || name === 'uk') {
            return '🇬🇧';
        }
        return '🌍'; // Default flag for other countries
    };

    // Don't render if loading or no companies
    if (isLoadingCompanies) {
        return (
            <div className={`flex items-center gap-4 px-3 py-2 bg-background border border-border rounded-sm ${className}`}>
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading companies...</span>
            </div>
        );
    }

    if (companies.length === 0 || !selectedCompany) {
        return null;
    }

    // Determine dropdown position based on variant
    const dropdownPosition = variant === 'sidebar' 
        ? 'absolute -bottom-2 -left-2  mb-2 w-64' 
        : 'absolute -top-2 -left-4 mt-2 w-72';

    const buttonClassName = variant === 'sidebar'
        ? 'w-full flex items-center justify-between px-4 py-3 bg-background hover:bg-gray-50 rounded-lg transition-colors border border-border'
        : 'flex items-center gap-4 px-3 py-2 bg-background border border-border hover:shadow-md shadow-sm cursor-pointer rounded-sm transition-colors';

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                className={buttonClassName}
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm">{getCountryFlag(selectedCompany.country?.name)}</span>
                    <span className="text-sm font-medium text-foreground">{selectedCompany.name}</span>
                </div>
                <div className='flex items-center justify-center w-5 h-5 rounded-full bg-blue-700'>
                    <HiChevronDown className={`w-4 h-4 text-background transition-transform ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {/* Company Dropdown Modal */}
            {isCompanyDropdownOpen && selectedCompany && (
                <div className={`${dropdownPosition} bg-background border border-border rounded-sm shadow-lg z-50 ${variant === 'sidebar' ? 'max-h-96 overflow-hidden flex flex-col' : ''}`}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center gap-2">
                            <span className="text-sm">{getCountryFlag(selectedCompany.country?.name)}</span>
                            <span className="text-sm font-semibold text-foreground">{selectedCompany.name}</span>
                        </div>
                        <button
                            onClick={() => setIsCompanyDropdownOpen(false)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                            aria-label="Close"
                        >
                            <HiX className="w-4 h-4 text-foreground" />
                        </button>
                    </div>

                    {/* Company List */}
                    <div className={`max-h-64 overflow-y-auto ${variant === 'navbar' ? 'p-1' : 'flex-1'}`}>
                        {otherCompanies.length > 0 ? (
                            otherCompanies.map((company) => (
                                <button
                                    key={company.id}
                                    onClick={() => handleCompanySelect(company)}
                                    className={`w-full flex items-center gap-2 px-4 py-3 transition-colors text-left cursor-pointer ${
                                        variant === 'navbar' 
                                            ? 'hover:bg-transparent rounded-md border-transparent border hover:border-accent' 
                                            : 'hover:bg-muted'
                                    }`}
                                >
                                    <span className="text-sm">{getCountryFlag(company.country?.name)}</span>
                                    <span className="text-sm text-foreground flex-1">{company.name}</span>
                                    {company.is_primary && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Primary</span>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                                No other companies
                            </div>
                        )}
                    </div>

                    {/* Start New Company Button */}
                    <div className={`${variant === 'navbar' ? 'p-1' : 'p-4'} border-t border-border`}>
                        <Button
                            onClick={handleStartNewCompany}
                            className={`w-full bg-purple hover:bg-purple-dark text-white font-semibold rounded-sm cursor-pointer ${
                                variant === 'navbar' ? 'py-6' : 'py-2.5'
                            }`}
                        >
                            Start a new company <span className="ml-1">&gt;</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanySelector;

