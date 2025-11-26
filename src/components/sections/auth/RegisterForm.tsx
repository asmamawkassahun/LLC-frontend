// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { ROUTES } from '@/constants/routes';
// import { getUniqueCountries } from '@/constants/countries';
// import { Button } from '@/components/ui/button';
// import { FcGoogle } from "react-icons/fc";
// import { HiEye, HiEyeOff } from 'react-icons/hi';
// import { FaAngleRight } from 'react-icons/fa';

// const RegisterForm = () => {
//     const [showPassword, setShowPassword] = useState(false);
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [countryCode, setCountryCode] = useState('+1');
//     const [showCountryDropdown, setShowCountryDropdown] = useState(false);
//     const [countrySearchQuery, setCountrySearchQuery] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [agreeToTerms, setAgreeToTerms] = useState(false);

//     const countries = getUniqueCountries();
//     const uniqueCountries = countries;

//     // Filter countries based on search query
//     const filteredCountries = uniqueCountries.filter((country) => {
//         const query = countrySearchQuery.toLowerCase();
//         return (
//             country.name.toLowerCase().includes(query) ||
//             country.code.includes(query) ||
//             country.flag.includes(query)
//         );
//     });

//     const selectedCountry = uniqueCountries.find(c => c.code === countryCode) || uniqueCountries[0];

//     return (
//         <div className="flex flex-col justify-between w-full min-h-screen ">
//             <div className="max-w-md mx-auto w-full">
//                 <div className='flex flex-col space-y-6 lg:mt-18 items-center'>
//                     <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground ">
//                         Let's get started!
//                     </h2>
//                     <p className="text-xs text-foreground mb-8">
//                         Already have an account?{' '}
//                         <Link to={ROUTES.LOGIN} className="text-accent hover:underline font-bold">
//                             Sign in
//                         </Link>
//                     </p>
//                 </div>

//                 {/* Sign Up Form */}
//                 <form className="space-y-4" onSubmit={(e) => {
//                     e.preventDefault();
//                     // Handle sign up logic here
//                 }}>
//                     {/* First Name and Last Name - Side by Side */}
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                         <div>
//                             <input
//                                 type="text"
//                                 placeholder="First Name"
//                                 value={firstName}
//                                 onChange={(e) => setFirstName(e.target.value)}
//                                 className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground shadow-xs"
//                             />
//                         </div>
//                         <div>
//                             <input
//                                 type="text"
//                                 placeholder="Last Name"
//                                 value={lastName}
//                                 onChange={(e) => setLastName(e.target.value)}
//                                 className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground shadow-xs"
//                             />
//                         </div>
//                     </div>

//                     {/* Phone Number with Country Code */}
//                     <div className="relative">
//                         <div className="flex shadow-xs rounded-lg">
//                             {/* Country Code Selector */}
//                             <div className="relative">
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setShowCountryDropdown(!showCountryDropdown);
//                                         setCountrySearchQuery('');
//                                     }}
//                                     className="flex items-center gap-2 px-3 py-3 border border-input rounded-l-lg border-r-0 bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
//                                 >
//                                     <span className="text-lg">{selectedCountry.flag}</span>
//                                     <span className="text-sm text-foreground">{selectedCountry.code}</span>
//                                 </button>

//                                 {/* Dropdown */}
//                                 {showCountryDropdown && (
//                                     <>
//                                         <div
//                                             className="fixed inset-0 z-40"
//                                             onClick={() => setShowCountryDropdown(false)}
//                                         />
//                                         <div className="absolute top-full left-0 mt-1 w-80 bg-background border border-input rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
//                                             <div className="p-2 sticky top-0 bg-background border-b border-input">
//                                                 <input
//                                                     type="text"
//                                                     placeholder="Search country..."
//                                                     value={countrySearchQuery}
//                                                     onChange={(e) => setCountrySearchQuery(e.target.value)}
//                                                     className="w-full px-3 py-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-accent text-sm"
//                                                     onClick={(e) => e.stopPropagation()}
//                                                     onKeyDown={(e) => e.stopPropagation()}
//                                                 />
//                                             </div>
//                                             <div className="max-h-80 overflow-y-auto">
//                                                 {filteredCountries.length > 0 ? (
//                                                     filteredCountries.map((country) => (
//                                                         <button
//                                                             key={`${country.code}-${country.name}`}
//                                                             type="button"
//                                                             onClick={() => {
//                                                                 setCountryCode(country.code);
//                                                                 setShowCountryDropdown(false);
//                                                                 setCountrySearchQuery('');
//                                                             }}
//                                                             className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted text-left"
//                                                         >
//                                                             <span className="text-lg">{country.flag}</span>
//                                                             <span className="text-sm text-foreground flex-1">{country.name}</span>
//                                                             <span className="text-sm text-muted-foreground">{country.code}</span>
//                                                         </button>
//                                                     ))
//                                                 ) : (
//                                                     <div className="px-4 py-8 text-center text-sm text-muted-foreground">
//                                                         No countries found
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </>
//                                 )}
//                             </div>

//                             {/* Phone Number Input */}
//                             <input
//                                 type="tel"
//                                 placeholder="201-555-0123"
//                                 value={phoneNumber}
//                                 onChange={(e) => setPhoneNumber(e.target.value)}
//                                 className="flex-1 px-4 py-3 border border-input rounded-r-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground max-w-62 md:max-w-60 lg:max-w-full"
//                             />
//                         </div>
//                     </div>

//                     {/* Email Field */}
//                     <div>
//                         <input
//                             type="email"
//                             placeholder="Email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground shadow-xs"
//                         />
//                     </div>

//                     {/* Password Field */}
//                     <div className="relative">
//                         <input
//                             type={showPassword ? 'text' : 'password'}
//                             placeholder="Password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full px-4 py-3 pr-12 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground shadow-xs"
//                         />
//                         <button
//                             type="button"
//                             onClick={() => setShowPassword(!showPassword)}
//                             className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
//                         >
//                             {showPassword ? (
//                                 <HiEyeOff className="w-5 h-5" />
//                             ) : (
//                                 <HiEye className="w-5 h-5" />
//                             )}
//                         </button>
//                     </div>



//                     {/* Terms and Conditions Checkbox */}
//                     <div className="flex items-start gap-3">
//                         <input
//                             type="checkbox"
//                             id="terms"
//                             checked={agreeToTerms}
//                             onChange={(e) => setAgreeToTerms(e.target.checked)}
//                             className="mt-1 w-4 h-4 border border-input rounded focus:ring-2 focus:ring-accent text-[var(--color-purple)] cursor-pointer"
//                         />
//                         <label htmlFor="terms" className="text-sm text-foreground cursor-pointer">
//                             I have read and agree to Privatily's{' '}
//                             <Link to="/terms" className="text-accent hover:underline">
//                                 Terms
//                             </Link>
//                             {' '}and{' '}
//                             <Link to="/legal-disclaimer" className="text-accent hover:underline">
//                                 Legal Disclaimer
//                             </Link>
//                             .
//                         </label>
//                     </div>

//                     {/* Sign Up Button */}
//                     <Button
//                         type="submit"
//                         className="w-full bg-purple hover:bg-purple-dark text-white py-8 text-base font-medium rounded-sm flex items-center justify-center gap-2 mt-2 cursor-pointer"
//                     >
//                         Sign up
//                         <FaAngleRight className="w-5 h-5 ml-2 shrink-0" />
//                     </Button>
//                 </form>

//                 {/* Separator */}
//                 <div className="flex items-center my-6">
//                     <div className="flex-1 border-t border-border"></div>
//                     <span className="px-4 text-sm text-muted-foreground">Or</span>
//                     <div className="flex-1 border-t border-border"></div>
//                 </div>

//                 {/* Google Sign Up Button */}
//                 <Button
//                     type="button"
//                     variant="outline"
//                     className="w-full border border-input bg-background hover:bg-background hover:text-foreground text-foreground py-8 text-base font-medium rounded-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-md cursor-pointer"
//                 >
//                     <FcGoogle className="w-5 h-5" />
//                     Sign Up with Google
//                 </Button>

//             </div>
//             <div>
//                 {/* Copyright */}
//             <p className="text-sm font-bold text-foreground mt-8 sm:mt-16 mb-4 text-center">
//                 Copyright © 2019-2025 Privatily.
//             </p>
//             </div>
//         </div>
//     );
// };

// export default RegisterForm;




import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { getUniqueCountries } from '@/constants/countries';
import { Button } from '@/components/ui/button';
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaAngleRight } from 'react-icons/fa';
import  authService  from '@/services/authService';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+1');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearchQuery, setCountrySearchQuery] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const countries = getUniqueCountries();
    const uniqueCountries = countries;

    // Filter countries based on search query
    const filteredCountries = uniqueCountries.filter((country) => {
        const query = countrySearchQuery.toLowerCase();
        return (
            country.name.toLowerCase().includes(query) ||
            country.code.includes(query) ||
            country.flag.includes(query)
        );
    });

    const selectedCountry = uniqueCountries.find(c => c.code === countryCode) || uniqueCountries[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!firstName || !lastName || !email || !password) {
            setError('Please fill in all required fields');
            return;
        }

        if (password !== passwordConfirmation) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (!agreeToTerms) {
            setError('Please agree to the terms and conditions');
            return;
        }

        setIsLoading(true);

        try {
            // Combine first and last name
            const fullName = `${firstName} ${lastName}`;
            
            // Combine country code and phone number
            const phone = phoneNumber ? `${countryCode}${phoneNumber}` : undefined;
            
            // Get country name from selected country
            const country = selectedCountry.name;

            const response = await authService.register({
                name: fullName,
                email: email.trim(),
                password,
                password_confirmation: passwordConfirmation,
                phone,
                country,
            });

            // Store tokens
            if (response.access_token) {
                localStorage.setItem('access_token', response.access_token);
            }
            if (response.refresh_token) {
                localStorage.setItem('refresh_token', response.refresh_token);
            }

            // Redirect to dashboard
            navigate(ROUTES.DASHBOARD);
        } catch (err: any) {
            console.error('Registration error:', err);
            
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
                setError('Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-between w-full min-h-screen ">
            <div className="max-w-md mx-auto w-full">
                <div className='flex flex-col space-y-6 lg:mt-18 items-center'>
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground ">
                        Let's get started!
                    </h2>
                    <p className="text-xs text-foreground mb-8">
                        Already have an account?{' '}
                        <Link to={ROUTES.LOGIN} className="text-accent hover:underline font-bold">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Sign Up Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* First Name and Last Name - Side by Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground shadow-xs disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground shadow-xs disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Phone Number with Country Code */}
                    <div className="relative">
                        <div className="flex shadow-xs rounded-lg">
                            {/* Country Code Selector */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCountryDropdown(!showCountryDropdown);
                                        setCountrySearchQuery('');
                                    }}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-3 py-3 border border-input rounded-l-lg border-r-0 bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
                                >
                                    <span className="text-lg">{selectedCountry.flag}</span>
                                    <span className="text-sm text-foreground">{selectedCountry.code}</span>
                                </button>

                                {/* Dropdown */}
                                {showCountryDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowCountryDropdown(false)}
                                        />
                                        <div className="absolute top-full left-0 mt-1 w-80 bg-background border border-input rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                                            <div className="p-2 sticky top-0 bg-background border-b border-input">
                                                <input
                                                    type="text"
                                                    placeholder="Search country..."
                                                    value={countrySearchQuery}
                                                    onChange={(e) => setCountrySearchQuery(e.target.value)}
                                                    className="w-full px-3 py-2 border border-input rounded focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                                                    onClick={(e) => e.stopPropagation()}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {filteredCountries.length > 0 ? (
                                                    filteredCountries.map((country) => (
                                                        <button
                                                            key={`${country.code}-${country.name}`}
                                                            type="button"
                                                            onClick={() => {
                                                                setCountryCode(country.code);
                                                                setShowCountryDropdown(false);
                                                                setCountrySearchQuery('');
                                                            }}
                                                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted text-left"
                                                        >
                                                            <span className="text-lg">{country.flag}</span>
                                                            <span className="text-sm text-foreground flex-1">{country.name}</span>
                                                            <span className="text-sm text-muted-foreground">{country.code}</span>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                                                        No countries found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Phone Number Input */}
                            <input
                                type="tel"
                                placeholder="201-555-0123"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 border border-input rounded-r-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground max-w-62 md:max-w-60 lg:max-w-full disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground shadow-xs disabled:opacity-50"
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
                            minLength={8}
                            className="w-full px-4 py-3 pr-12 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground shadow-xs disabled:opacity-50"
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

                    {/* Password Confirmation Field */}
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm Password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            disabled={isLoading}
                            minLength={8}
                            className="w-full px-4 py-3 pr-12 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground shadow-xs disabled:opacity-50"
                        />
                    </div>

                    {/* Terms and Conditions Checkbox */}
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            disabled={isLoading}
                            className="mt-1 w-4 h-4 border border-input rounded focus:ring-2 focus:ring-accent text-[var(--color-purple)] cursor-pointer disabled:opacity-50"
                        />
                        <label htmlFor="terms" className="text-sm text-foreground cursor-pointer">
                            I have read and agree to Privatily's{' '}
                            <Link to="/terms" className="text-accent hover:underline">
                                Terms
                            </Link>
                            {' '}and{' '}
                            <Link to="/legal-disclaimer" className="text-accent hover:underline">
                                Legal Disclaimer
                            </Link>
                            .
                        </label>
                    </div>

                    {/* Sign Up Button */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-purple hover:bg-purple-dark text-white py-8 text-base font-medium rounded-sm flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Signing up...' : 'Sign up'}
                        {!isLoading && <FaAngleRight className="w-5 h-5 ml-2 shrink-0" />}
                    </Button>
                </form>

                {/* Separator */}
                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-border"></div>
                    <span className="px-4 text-sm text-muted-foreground">Or</span>
                    <div className="flex-1 border-t border-border"></div>
                </div>

                {/* Google Sign Up Button */}
                <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    className="w-full border border-input bg-background hover:bg-background hover:text-foreground text-foreground py-8 text-base font-medium rounded-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
                >
                    <FcGoogle className="w-5 h-5" />
                    Sign Up with Google
                </Button>

            </div>
            <div>
                {/* Copyright */}
            <p className="text-sm font-bold text-foreground mt-8 sm:mt-16 mb-4 text-center">
                Copyright © 2019-2025 Privatily.
            </p>
            </div>
        </div>
    );
};

export default RegisterForm;