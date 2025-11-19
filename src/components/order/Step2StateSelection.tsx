import StepHeader from './StepHeader';
import StateCard from './StateCard';
import NavigationButtons from './NavigationButtons';

interface Step2StateSelectionProps {
    onNext: () => void;
    onBack: () => void;
    selectedState: string;
    onStateChange: (state: string) => void;
    companyName?: string;
}

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

const Step2StateSelection = ({ onNext, onBack, selectedState, onStateChange, companyName = 'your' }: Step2StateSelectionProps) => {
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
                        isSelected={selectedState === state.id}
                        onClick={() => onStateChange(state.id)}
                    />
                ))}
            </div>

            <NavigationButtons
                onBack={onBack}
                onNext={onNext}
                showBack={true}
                nextDisabled={!selectedState || selectedState === 'other'}
            />
        </div>
    );
};

export default Step2StateSelection;

