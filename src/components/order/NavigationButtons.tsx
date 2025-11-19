import { Button } from '@/components/ui/button';
import { HiArrowRight } from 'react-icons/hi';

interface NavigationButtonsProps {
    onBack?: () => void;
    onNext: () => void;
    showBack?: boolean;
    nextDisabled?: boolean;
}

const NavigationButtons = ({ onBack, onNext, showBack = false, nextDisabled = false }: NavigationButtonsProps) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 mt-6 md:mt-8">
            {/* <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Saved 1 second ago</span>
            </div> */}
            <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                {showBack && onBack && (
                    <Button
                        variant="outline"
                        onClick={onBack}
                        className="px-4 sm:px-6 flex-1 sm:flex-initial"
                    >
                        Back
                    </Button>
                )}
                <Button
                    onClick={onNext}
                    disabled={nextDisabled}
                    className="bg-purple hover:bg-purple-dark text-white px-4 sm:px-6 flex-1 sm:flex-initial"
                >
                    Next
                    <HiArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
};

export default NavigationButtons;

