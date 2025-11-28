import { useState, useRef, useEffect } from 'react';
import StepHeader from './StepHeader';
import StateCard from './StateCard';

interface Step2StateSelectionProps {
    selectedState: string;
    onStateChange: (stateName: string, stateCost: number) => void;
    companyName?: string;
}

// Helper function to get state cost
const getStateCost = (stateId: string): number => {
    switch (stateId) {
        case 'new-mexico':
            return 0;
        case 'wyoming':
            return 50;
        case 'delaware':
            return 100;
        case 'other':
            return 0; // For "other" states, fee will be 0
        default:
            // If it's an "other" state name, return 0
            return 0;
    }
};

const US_STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const states = [
    {
        id: 'new-mexico',
        name: 'New Mexico',
        cost: '$0 extra',
        description: 'This is the most cost-effective state for ongoing maintenance, with minimal annual fees and no required annual reports.',
        tags: [
            { label: 'Most affordable' },
            { label: 'Fast setup' },
            { label: 'No annual report required' },
        ],
    },
    {
        id: 'wyoming',
        name: 'Wyoming',
        cost: '$50 extra',
        description: 'It has slightly higher costs than New Mexico, but it still offers low operating fees. It only requires an annual report and has no state income tax, making it highly affordable.',
        tags: [
            { label: 'No state income tax' },
            { label: 'Fast setup' },
        ],
    },
    {
        id: 'delaware',
        name: 'Delaware',
        cost: '$100 extra',
        description: 'It has the highest operating costs among the three, with annual franchise tax and report requirements. While it has medium ongoing costs, it offers strong legal protections and no sales tax.',
        tags: [
            { label: 'No sales tax' },
            { label: 'Slower setup' },
        ],
    },
    {
        id: 'other',
        name: 'Other',
        cost: '',
        description: '',
        tags: [],
    },
];

const Step2StateSelection = ({ selectedState, onStateChange, companyName = 'your' }: Step2StateSelectionProps) => {
    const [isOtherDropdownOpen, setIsOtherDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Check if selected state is an "other" state (not one of the predefined states)
    const isOtherStateSelected = Boolean(selectedState === 'other' || 
        (selectedState && !['new-mexico', 'wyoming', 'delaware'].includes(selectedState)));
    
    // Get the selected state name if it's an "other" state
    const getSelectedOtherState = () => {
        if (isOtherStateSelected && selectedState !== 'other') {
            return selectedState;
        }
        return '';
    };

    const [selectedOtherState, setSelectedOtherState] = useState(getSelectedOtherState());

    useEffect(() => {
        setSelectedOtherState(getSelectedOtherState());
    }, [selectedState]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOtherDropdownOpen(false);
            }
        };

        if (isOtherDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOtherDropdownOpen]);

    const handleOtherCardClick = () => {
        if (selectedState !== 'other') {
            onStateChange('other', 0);
        }
        setIsOtherDropdownOpen(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const handleStateSelect = (stateName: string) => {
        onStateChange(stateName, 0); // "Other" states have 0 cost
        setSelectedOtherState(stateName);
        setIsOtherDropdownOpen(false);
        setSearchTerm('');
    };

    const filteredStates = US_STATES.filter(state =>
        state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto">
            <StepHeader
                icon="https://app.privatily.com/assets/img/header-icones/states.png"
                title="Choose a State for your LLC Registration"
                subtitle={`Select the state where ${companyName} journey begins.`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {states.map((state) => (
                    <StateCard
                        key={state.id}
                        name={state.name}
                        cost={state.cost}
                        description={state.description}
                        tags={state.tags}
                        isSelected={state.id === 'other' ? isOtherStateSelected : Boolean(selectedState === state.id)}
                        onClick={() => {
                            if (state.id === 'other') {
                                handleOtherCardClick();
                            } else {
                                const cost = getStateCost(state.id);
                                onStateChange(state.id, cost);
                                setIsOtherDropdownOpen(false);
                            }
                        }}
                        isOther={state.id === 'other'}
                        showDropdown={state.id === 'other' ? isOtherStateSelected : false}
                        isDropdownOpen={isOtherDropdownOpen}
                        dropdownRef={dropdownRef as React.RefObject<HTMLDivElement>}
                        inputRef={inputRef as React.RefObject<HTMLInputElement>}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filteredStates={filteredStates}
                        selectedOtherState={selectedOtherState}
                        onStateSelect={handleStateSelect}
                    />
                ))}
            </div>

        </div>
    );
};

export default Step2StateSelection;

