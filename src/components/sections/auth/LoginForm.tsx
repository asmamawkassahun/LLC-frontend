import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
// import { FcGoogle } from 'react-icons/fc';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaAngleRight } from 'react-icons/fa';
import { toast } from 'sonner';
import authService from '@/services/authService';

const LoginForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!email || !password) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            const response = await authService.login({
                email: email.trim(),
                password,
            });

            // Store tokens
            if (response.access_token) {
                localStorage.setItem('access_token', response.access_token);
            }
            if (response.refresh_token) {
                localStorage.setItem('refresh_token', response.refresh_token);
            }

            // Show success message
            toast.success('Login successful!');

            // Redirect to dashboard
            navigate(ROUTES.DASHBOARD);
        } catch (err: any) {
            console.error('Login error:', err);
            
            // Handle error response with toast
            let errorMessage = 'Login failed. Please check your credentials and try again.';
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.errors) {
                // Handle Laravel validation errors
                const errors = err.response.data.errors;
                const firstError = Object.values(errors)[0];
                errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError);
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto min-h-screen">
            {/* Heading */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-foreground mb-2">
                    Welcome back!
                </h1>
                <p className="text-sm text-foreground">
                    Please enter your details.
                </p>
            </div>

            {/* Login Form */}
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

                {/* Password Field */}
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
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

                {/* Remember Me and Forgotten Password */}
                <div className="flex items-center justify-between">
                    {/* <label className="flex items-center gap-2 cursor-pointer">
                        <button
                            type="button"
                            onClick={() => setRememberMe(!rememberMe)}
                            disabled={isLoading}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 ${
                                rememberMe ? 'bg-purple' : 'bg-muted'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    rememberMe ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                        <span className="text-sm text-foreground">Remember me</span>
                    </label> */}
                    <Link 
                        to="/forgot-password" 
                        className="text-sm text-accent hover:underline"
                    >
                        Forgotten password?
                    </Link>
                </div>

                {/* Sign In Button */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-purple hover:bg-purple-dark text-white py-8 text-base font-medium rounded-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                    {!isLoading && <FaAngleRight className="w-5 h-5 ml-2 shrink-0" />}
                </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                    New to our platform?{' '}
                    <Link to={ROUTES.REGISTER} className="text-accent hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>

            {/* Separator */}
            <div className="flex items-center my-6">
                <div className="flex-1 border-t border-border"></div>
                <span className="px-4 text-sm text-muted-foreground">Or</span>
                <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Google Sign In Button */}
            {/* <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                className="w-full border border-input bg-background hover:bg-background hover:text-foreground text-foreground py-8 text-base font-medium rounded-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
            >
                <FcGoogle className="w-5 h-5" />
                Sign In with Google
            </Button> */}

            {/* Copyright */}
            <p className="text-xs text-foreground font-bold mt-20 md:mt-12 text-center">
                Copyright © 2019-2025 Privatily.
            </p>
        </div>
    );
};

export default LoginForm;
