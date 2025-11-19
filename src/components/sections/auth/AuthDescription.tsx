import { ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";



const AuthDescription = () => {
    return (
            <div className="hidden md:flex md:w-1/2 flex-col p-8 lg:p-12 bg-button-secondary">
                {/* Logo */}
                <div className="">
                    <Link to={ROUTES.HOME} className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <span className="text-xl font-semibold text-foreground">privatily</span>
                    </Link>
                </div>

                {/* Heading and Tagline */}
                <div className=" max-w-lg flex-1 flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 pr-28 md:pr-0 lg:pr-28 leading-tight">
                        Your journey starts here
                    </h1>
                    <p className="text-sm md:text-base text-foreground leading-relaxed">
                        Every great business starts with a solid foundation — let's build yours.
                    </p>
                </div>

                {/* Illustration */}
                <div className="flex items-end">
                    <img 
                        src="https://app.privatily.com/assets/img/register.png" 
                        alt="Business journey illustration" 
                        className="w-full max-w-md"
                    />
                </div>
        </div>
    );
};

export default AuthDescription;