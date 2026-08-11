import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { FaAngleRight } from 'react-icons/fa';
import authService from '@/services/authService';

const VerifyCodeForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Get email from URL params
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!email || !code) {
            setError('Please fill in all fields');
            return;
        }

        if (code.length !== 6) {
            setError('Reset code must be 6 digits');
            return;
        }

        setIsLoading(true);

        try {
            await authService.verifyResetCode(email.trim(), code.trim());
            // Code verified successfully - redirect to reset password page
            navigate(`${ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(email.trim())}&code=${encodeURIComponent(code.trim())}`);
        } catch (err: any) {
            console.error('Verify code error:', err);
            
            // Handle error response
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors) {
                // Handle Laravel validation errors
                const errors = err.response.data.errors;
                const firstError = Object.values(errors)[0];
                setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
            } else if (err.message) {
                setError(err.message);
            } else {
                setError('Invalid or expired reset code. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto min-h-screen">
            {/* Heading */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-foreground mb-2">
                    Verify Reset Code
                </h1>
                <p className="text-sm text-foreground">
                    Enter the 6-digit code sent to your email.
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Verify Code Form */}
            <form 
                className="space-y-5" 
                onSubmit={handleSubmit}
            >
                {/* Email Field */}
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground disabled:opacity-50"
                    />
                </div>

                {/* Reset Code Field */}
                <div>
                    <input
                        type="text"
                        placeholder="Reset Code (6 digits)"
                        value={code}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setCode(value);
                        }}
                        required
                        disabled={isLoading}
                        maxLength={6}
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground disabled:opacity-50 text-center text-2xl tracking-widest font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                        Enter the 6-digit code sent to your email
                    </p>
                </div>

                {/* Verify Code Button */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-purple hover:bg-purple-dark text-white py-8 text-base font-medium rounded-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                    {!isLoading && <FaAngleRight className="w-5 h-5 ml-2 shrink-0" />}
                </Button>
            </form>

            {/* Back to Login Link */}
            <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                    Remember your password?{' '}
                    <Link to={ROUTES.LOGIN} className="text-accent hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>

            {/* Resend Code Link */}
            <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                    Didn't receive the code?{' '}
                    <Link 
                        to={ROUTES.FORGOT_PASSWORD} 
                        className="text-accent hover:underline"
                    >
                        Resend
                    </Link>
                </p>
            </div>

            {/* Copyright */}
            <p className="text-xs text-foreground font-bold mt-20 md:mt-12 text-center">
                Copyright © 2019-2026 Incorporia.
            </p>
        </div>
    );
};

export default VerifyCodeForm;

