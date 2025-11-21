import { useParams, useNavigate } from 'react-router-dom';
import { HiCheck } from 'react-icons/hi';
import { BiSolidRightTopArrowCircle } from "react-icons/bi";
// import ChatIcon from '@/components/order/ChatIcon';
import { Button } from '@/components/ui/button';

const PaymentPage = ({ type }: { type: 'summary' | 'payment' }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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
        // Navigate to payment summary page
        if (id) {
            navigate(`/order/payment/${id}`);
        }
    };

    return (
        <div className={` w-full relative overflow-hidden   ${type === 'summary' ? 'rounded-lg py-20' : 'py-28 sm:py-34 min-h-screen'}`}>
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
            <div className="relative z-10 flex items-center justify-center px-4 ">
                <div className="max-w-4xl w-full">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <h1 className="sm:text-3xl text-2xl  font-bold text-white mb-4">
                            Upgrade to Premium at 10% OFF
                        </h1>
                        <p className="text-lg  text-white/90">
                            For only $128 more, enjoy access to all the exclusive Premium perks:
                        </p>
                    </div>

                    {/* Premium Perks - Two Columns */}
                    <div className={` grid grid-cols-1 md:grid-cols-2  ${type === 'summary' ? 'gap-4' : 'gap-4 md:gap-6'} mb-10 px-10 sm:px-18 justify-start items-center justify-items-start`}>
                        {perks.map((perk, index) => (
                            <div key={index} className="flex items-center justify-center gap-3 ">
                                {/* Checkmark Icon in Light Blue Circle */}
                                <div className="shrink-0 w-6 h-6 rounded-full bg-background flex items-center justify-center">
                                    <HiCheck className="w-4 h-4 text-accent" />
                                </div>
                                <span className={`text-white ${type === 'summary' ? 'text-sm' : 'text-base md:text-lg'}`}>{perk.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Call-to-Action Buttons */}
                    <div className={`flex flex-col gap-4 ${type === 'summary' ? 'max-w-3xl' : 'md:max-w-2xl lg:max-w-3xl'} mx-auto`}>
                        {/* Upgrade Button - Coral/Orange-Red */}
                        <Button
                            onClick={handleUpgrade}
                            className={`w-full bg-orange hover:bg-orange-dark text-white font-bold ${type === 'summary' ? 'py-6' : 'py-8'} px-6 rounded-sm text-base md:text-lg hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-lg`}
                        >
                            <BiSolidRightTopArrowCircle className="w-5 h-5" />
                            Upgrade now with $40 savings
                        </Button>

                        {/* Stay Basic Button - White */}
                        <Button
                            onClick={handleStayBasic}
                            variant="outline"
                            className={`w-full bg-white hover:bg-gray-50 text-gray-900 font-bold ${type === 'summary' ? 'py-4 text-sm text-accent hover:text-accent' : 'py-6 text-base md:text-lg hover:text-foreground'} px-6 rounded-sm   border-2  border-white shadow-md cursor-pointer`}
                        >
                            Stay basic with $0 savings
                        </Button>
                    </div>
                </div>
            </div>

            {/* Chat Icon - Bottom Right */}
            {/* <ChatIcon /> */}
        </div>
    );
};

export default PaymentPage;
