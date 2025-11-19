import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaAngleRight } from 'react-icons/fa';

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

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
                onSubmit={(e) => {
                    e.preventDefault();
                    // Handle login logic here
                }}
            >
                {/* Email Field */}
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground"
                    />
                </div>

                {/* Password Field */}
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
                    <label className="flex items-center gap-2 cursor-pointer">
                        <button
                            type="button"
                            onClick={() => setRememberMe(!rememberMe)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
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
                    </label>
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
                    className="w-full bg-purple hover:bg-purple-dark text-white py-8 text-base font-medium rounded-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                    Sign in
                    <FaAngleRight className="w-5 h-5 ml-2 shrink-0" />
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
            <Button
                type="button"
                variant="outline"
                className="w-full border border-input bg-background hover:bg-background hover:text-foreground text-foreground py-8 text-base font-medium rounded-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-md cursor-pointer"
            >
                <FcGoogle className="w-5 h-5" />
                Sign In with Google
            </Button>

            {/* Copyright */}
            <p className="text-xs text-foreground font-bold mt-20 md:mt-12 text-center">
                Copyright © 2019-2025 Privatily.
            </p>
        </div>
    );
};

export default LoginForm;
