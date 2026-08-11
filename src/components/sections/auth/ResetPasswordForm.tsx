import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaAngleRight } from 'react-icons/fa';
import authService from '@/services/authService';

const ResetPasswordForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Get email and code from URL params (code should be verified already)
        const emailParam = searchParams.get('email');
        const codeParam = searchParams.get('code');
        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
        }
        if (codeParam) {
            setCode(decodeURIComponent(codeParam));
        } else {
            // If no code in URL, redirect to verify code page
            if (emailParam) {
                navigate(`${ROUTES.VERIFY_CODE}?email=${encodeURIComponent(emailParam)}`);
            } else {
                navigate(ROUTES.FORGOT_PASSWORD);
            }
        }
    }, [searchParams, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Validation
        if (!email || !code || !password || !passwordConfirmation) {
            setError('Please fill in all fields');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            await authService.resetPassword({
                email: email.trim(),
                code: code.trim(),
                password,
                password_confirmation: passwordConfirmation,
            });
            setSuccess(true);
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate(ROUTES.LOGIN);
            }, 2000);
        } catch (err: any) {
            console.error('Reset password error:', err);
            
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
                setError('Failed to reset password. Please try again.');
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
                    Reset Password
                </h1>
                <p className="text-sm text-foreground">
                    Enter your new password below.
                </p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    Password reset successfully! Redirecting to login...
                </div>
            )}

            {/* Error Message */}
            {error && !success && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Reset Password Form */}
            {!success && (
                <form 
                    className="space-y-5" 
                    onSubmit={handleSubmit}
                >
                    {/* New Password Field */}
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full px-4 py-3 pr-12 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground disabled:opacity-50"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {showPassword ? (
                                <HiEyeOff className="w-5 h-5" />
                            ) : (
                                <HiEye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative">
                        <input
                            type={showPasswordConfirmation ? 'text' : 'password'}
                            placeholder="Confirm New Password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full px-4 py-3 pr-12 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground disabled:opacity-50"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                            disabled={isLoading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {showPasswordConfirmation ? (
                                <HiEyeOff className="w-5 h-5" />
                            ) : (
                                <HiEye className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Reset Password Button */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-purple hover:bg-purple-dark text-white py-8 text-base font-medium rounded-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
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
                Copyright © 2019-2026 Incorporia.
            </p>
        </div>
    );
};

export default ResetPasswordForm;

