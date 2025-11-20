import { HiCheck } from 'react-icons/hi';

interface Step {
    number: number;
    label: string;
}

interface ProgressSidebarProps {
    currentStep: number;
    steps: Step[];
}

const ProgressSidebar = ({ currentStep, steps }: ProgressSidebarProps) => {
    return (
        <div className="w-48 lg:w-64 h-full bg-muted/30 px-6 py-8">
            <div className="flex flex-col gap-6">
                {steps.map((step, index) => {
                    const isCompleted = step.number < currentStep;
                    const isActive = step.number === currentStep;
                    const isFuture = step.number > currentStep;

                    return (
                        <div key={step.number} className="relative flex items-start h-28 gap-4">
                            {/* Vertical Line */}
                            {index < steps.length - 1 && (
                                <div 
                                    className={`absolute left-4 w-0.5 ${isCompleted || isActive ? 'bg-purple' : 'bg-muted'}`}
                                    style={{ top: '2.3rem', height: '6rem' }}
                                />
                            )}
                            
                            {/* Step Circle */}
                            <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0 ${
                                isCompleted 
                                    ? 'bg-purple border-purple' 
                                    : isActive 
                                    ? ' border-purple' 
                                    : 'bg-background border-muted'
                            }`}>
                                {isCompleted ? (
                                    <HiCheck className="w-5 h-5 text-white" />
                                ) : (
                                    <span className={`text-sm font-bold ${isActive ? 'text-purple' : 'text-muted-foreground'}`}>
                                        {step.number}
                                    </span>
                                )}
                            </div>

                            {/* Step Label */}
                            <div className="flex-1 pt-1">
                                <span className={`text-sm font-medium ${
                                    isActive ? 'text-foreground' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                    {step.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressSidebar;

