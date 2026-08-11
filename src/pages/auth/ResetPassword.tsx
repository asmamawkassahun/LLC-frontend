import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import Logo from '@/components/brand/Logo';
import ResetPasswordForm from '@/components/sections/auth/ResetPasswordForm';
import AuthDescription from '@/components/sections/auth/AuthDescription';

const ResetPasswordPage = () => {
    return (
        <div className="min-h-screen overflow-y-hidden bg-accent sm:bg-button-secondary px-6 pt-6 pb-28 sm:p-0 flex">
            {/* Left Column - Branding and Illustration */}
            <AuthDescription />
            
            {/* Right Column - Reset Password Form */}
            <div className="w-full md:w-1/2 bg-background flex flex-col relative rounded-t-2xl sm:rounded-none">
                <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 pt-4 sm:pt-12 gap-12 pb-4 sm:pb-0">
                    {/* Mobile Logo */}
                    <div className="md:hidden mx-auto">
                        <Link to={ROUTES.HOME} className="flex items-center gap-2">
                            <Logo markClassName="h-10 w-10" />
                        </Link>
                    </div>

                    {/* Reset Password Form Component */}
                    <ResetPasswordForm />
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;

