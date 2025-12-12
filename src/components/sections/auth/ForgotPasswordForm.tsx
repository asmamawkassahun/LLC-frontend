import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { FaAngleRight } from 'react-icons/fa';
import authService from '@/services/authService';

const ForgotPasswordForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            await authService.forgotPassword(email.trim());
            setSuccess(true);
            // Redirect to verify code page after 2 seconds
            setTimeout(() => {
                navigate(`${ROUTES.VERIFY_CODE}?email=${encodeURIComponent(email.trim())}`);
            }, 2000);
        } catch (err: any) {
            console.error('Forgot password error:', err);
            
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
                setError('Failed to send reset code. Please try again.');
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
                    Forgot Password?
                </h1>
                <p className="text-sm text-foreground">
                    Enter your email address and we'll send you a reset code.
                </p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    Reset code sent! Redirecting to reset password page...
                </div>
            )}

            {/* Error Message */}
            {error && !success && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Forgot Password Form */}
            {!success && (
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

                    {/* Send Code Button */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-purple hover:bg-purple-dark text-white py-8 text-base font-medium rounded-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Code'}
                        {!isLoading && <FaAngleRight className="w-5 h-5 ml-2 shrink-0" />}
                    </Button>
                </form>
            )}

            {/* Back to Login Link */}
            <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                    Remember your password?{' '}
                    <Link to={ROUTES.LOGIN} className="text-accent hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>

            {/* Copyright */}
            <p className="text-xs text-foreground font-bold mt-20 md:mt-12 text-center">
                Copyright © 2019-2025 Privatily.
            </p>
        </div>
    );
};

export default ForgotPasswordForm;

