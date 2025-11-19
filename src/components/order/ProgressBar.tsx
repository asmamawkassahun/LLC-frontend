interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    stepLabel: string;
}

const ProgressBar = ({ currentStep, totalSteps, stepLabel }: ProgressBarProps) => {
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="mb-4">
            <div className="text-sm text-foreground mb-2">
                {stepLabel} - Step {currentStep} of {totalSteps}
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                    className="h-full bg-purple rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;

