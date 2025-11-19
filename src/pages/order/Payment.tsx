import { HiCheck, HiArrowRight } from 'react-icons/hi';
import ChatIcon from '@/components/order/ChatIcon';
import { Button } from '@/components/ui/button';

const PaymentPage = () => {
    const perks = [
        { text: 'Priority processing' },
        { text: 'Chat and phone support' },
        { text: 'Bank account consultation' },
        { text: 'FREE Tax consultation' },
        { text: 'FREE US phone number' },
        { text: 'Dedicated account manager' },
        { text: 'FREE business email inbox' },
        { text: 'FREE .com domain' },
        { text: 'FREE Business website' },
        { text: '3 Logos for your company' },
    ];

    const handleUpgrade = () => {
        // Handle upgrade action
        console.log('Upgrading to Premium');
    };

    const handleStayBasic = () => {
        // Handle stay basic action
        console.log('Staying with Basic plan');
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden">
            {/* Dark Blue Background with Geometric Patterns */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-900 via-blue-800 to-blue-900">
                {/* Geometric Line Patterns - Abstract Cubes/Polygons */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-20"
                    viewBox="0 0 1200 800"
                    preserveAspectRatio="xMidYMid slice"
                >
                    {/* Grid of geometric shapes */}
                    <defs>
                        <pattern id="geometric-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path
                                d="M 0 0 L 30 0 L 30 30 L 0 30 Z M 30 30 L 60 30 L 60 60 L 30 60 Z M 60 0 L 90 0 L 90 30 L 60 30 Z"
                                fill="none"
                                stroke="rgba(147, 197, 253, 0.4)"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M 0 30 L 30 30 L 30 60 L 0 60 Z M 30 0 L 60 0 L 60 30 L 30 30 Z M 60 30 L 90 30 L 90 60 L 60 60 Z"
                                fill="none"
                                stroke="rgba(147, 197, 253, 0.3)"
                                strokeWidth="1.5"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#geometric-pattern)" />
                    
                    {/* Additional geometric lines */}
                    <g stroke="rgba(147, 197, 253, 0.3)" strokeWidth="1" fill="none">
                        {/* Diagonal lines creating cube effect */}
                        <line x1="0" y1="0" x2="200" y2="200" />
                        <line x1="200" y1="0" x2="400" y2="200" />
                        <line x1="400" y1="0" x2="600" y2="200" />
                        <line x1="600" y1="0" x2="800" y2="200" />
                        <line x1="800" y1="0" x2="1000" y2="200" />
                        <line x1="1000" y1="0" x2="1200" y2="200" />
                        
                        <line x1="0" y1="200" x2="200" y2="400" />
                        <line x1="200" y1="200" x2="400" y2="400" />
                        <line x1="400" y1="200" x2="600" y2="400" />
                        <line x1="600" y1="200" x2="800" y2="400" />
                        <line x1="800" y1="200" x2="1000" y2="400" />
                        <line x1="1000" y1="200" x2="1200" y2="400" />
                        
                        <line x1="0" y1="400" x2="200" y2="600" />
                        <line x1="200" y1="400" x2="400" y2="600" />
                        <line x1="400" y1="400" x2="600" y2="600" />
                        <line x1="600" y1="400" x2="800" y2="600" />
                        <line x1="800" y1="400" x2="1000" y2="600" />
                        <line x1="1000" y1="400" x2="1200" y2="600" />
                    </g>
                </svg>
            </div>

            {/* Main Content - Centered */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
                <div className="max-w-4xl w-full">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl  font-bold text-white mb-4">
                            Upgrade to Premium at 10% OFF
                        </h1>
                        <p className="text-lg  text-white/90">
                            For only $128 more, enjoy access to all the exclusive Premium perks:
                        </p>
                    </div>

                    {/* Premium Perks - Two Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
                        {perks.map((perk, index) => (
                            <div key={index} className="flex items-start gap-3">
                                {/* Checkmark Icon in Light Blue Circle */}
                                <div className="shrink-0 w-6 h-6 rounded-full bg-background flex items-center justify-center">
                                    <HiCheck className="w-4 h-4 text-accent" />
                                </div>
                                <span className="text-white text-base md:text-lg">{perk.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Call-to-Action Buttons */}
                    <div className="flex flex-col gap-4 max-w-md mx-auto">
                        {/* Upgrade Button - Coral/Orange-Red */}
                        <Button
                            onClick={handleUpgrade}
                            className="w-full bg-orange hover:bg-orange-dark text-white font-bold py-6 px-6 rounded-sm text-base md:text-lg flex items-center justify-center gap-2 shadow-lg"
                        >
                            <HiArrowRight className="w-5 h-5" />
                            Upgrade now with $40 savings
                        </Button>

                        {/* Stay Basic Button - White */}
                        <Button
                            onClick={handleStayBasic}
                            variant="outline"
                            className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-6 px-6 rounded-sm text-base md:text-lg border-2 border-white shadow-md"
                        >
                            Stay basic with $0 savings
                        </Button>
                    </div>
                </div>
            </div>

            {/* Chat Icon - Bottom Right */}
            <ChatIcon />
        </div>
    );
};

export default PaymentPage;
