import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaAngleRight } from 'react-icons/fa';

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+1');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearchQuery, setCountrySearchQuery] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const countries = [
        { code: '+1', flag: '🇺🇸', name: 'United States' },
        { code: '+1', flag: '🇨🇦', name: 'Canada' },
        { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
        { code: '+61', flag: '🇦🇺', name: 'Australia' },
        { code: '+49', flag: '🇩🇪', name: 'Germany' },
        { code: '+33', flag: '🇫🇷', name: 'France' },
        { code: '+39', flag: '🇮🇹', name: 'Italy' },
        { code: '+34', flag: '🇪🇸', name: 'Spain' },
        { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
        { code: '+32', flag: '🇧🇪', name: 'Belgium' },
        { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
        { code: '+43', flag: '🇦🇹', name: 'Austria' },
        { code: '+46', flag: '🇸🇪', name: 'Sweden' },
        { code: '+47', flag: '🇳🇴', name: 'Norway' },
        { code: '+45', flag: '🇩🇰', name: 'Denmark' },
        { code: '+358', flag: '🇫🇮', name: 'Finland' },
        { code: '+351', flag: '🇵🇹', name: 'Portugal' },
        { code: '+353', flag: '🇮🇪', name: 'Ireland' },
        { code: '+48', flag: '🇵🇱', name: 'Poland' },
        { code: '+420', flag: '🇨🇿', name: 'Czech Republic' },
        { code: '+36', flag: '🇭🇺', name: 'Hungary' },
        { code: '+40', flag: '🇷🇴', name: 'Romania' },
        { code: '+30', flag: '🇬🇷', name: 'Greece' },
        { code: '+7', flag: '🇷🇺', name: 'Russia' },
        { code: '+81', flag: '🇯🇵', name: 'Japan' },
        { code: '+82', flag: '🇰🇷', name: 'South Korea' },
        { code: '+86', flag: '🇨🇳', name: 'China' },
        { code: '+91', flag: '🇮🇳', name: 'India' },
        { code: '+65', flag: '🇸🇬', name: 'Singapore' },
        { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
        { code: '+66', flag: '🇹🇭', name: 'Thailand' },
        { code: '+62', flag: '🇮🇩', name: 'Indonesia' },
        { code: '+63', flag: '🇵🇭', name: 'Philippines' },
        { code: '+84', flag: '🇻🇳', name: 'Vietnam' },
        { code: '+852', flag: '🇭🇰', name: 'Hong Kong' },
        { code: '+886', flag: '🇹🇼', name: 'Taiwan' },
        { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
        { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
        { code: '+974', flag: '🇶🇦', name: 'Qatar' },
        { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
        { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
        { code: '+968', flag: '🇴🇲', name: 'Oman' },
        { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
        { code: '+962', flag: '🇯🇴', name: 'Jordan' },
        { code: '+972', flag: '🇮🇱', name: 'Israel' },
        { code: '+90', flag: '🇹🇷', name: 'Turkey' },
        { code: '+20', flag: '🇪🇬', name: 'Egypt' },
        { code: '+27', flag: '🇿🇦', name: 'South Africa' },
        { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
        { code: '+254', flag: '🇰🇪', name: 'Kenya' },
        { code: '+256', flag: '🇺🇬', name: 'Uganda' },
        { code: '+255', flag: '🇹🇿', name: 'Tanzania' },
        { code: '+233', flag: '🇬🇭', name: 'Ghana' },
        { code: '+251', flag: '🇪🇹', name: 'Ethiopia' },
        { code: '+212', flag: '🇲🇦', name: 'Morocco' },
        { code: '+213', flag: '🇩🇿', name: 'Algeria' },
        { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
        { code: '+218', flag: '🇱🇾', name: 'Libya' },
        { code: '+20', flag: '🇪🇬', name: 'Egypt' },
        { code: '+249', flag: '🇸🇩', name: 'Sudan' },
        { code: '+252', flag: '🇸🇴', name: 'Somalia' },
        { code: '+257', flag: '🇧🇮', name: 'Burundi' },
        { code: '+250', flag: '🇷🇼', name: 'Rwanda' },
        { code: '+260', flag: '🇿🇲', name: 'Zambia' },
        { code: '+263', flag: '🇿🇼', name: 'Zimbabwe' },
        { code: '+264', flag: '🇳🇦', name: 'Namibia' },
        { code: '+267', flag: '🇧🇼', name: 'Botswana' },
        { code: '+268', flag: '🇸🇿', name: 'Eswatini' },
        { code: '+269', flag: '🇰🇲', name: 'Comoros' },
        { code: '+230', flag: '🇲🇺', name: 'Mauritius' },
        { code: '+230', flag: '🇲🇺', name: 'Mauritius' },
        { code: '+261', flag: '🇲🇬', name: 'Madagascar' },
        { code: '+265', flag: '🇲🇼', name: 'Malawi' },
        { code: '+258', flag: '🇲🇿', name: 'Mozambique' },
        { code: '+244', flag: '🇦🇴', name: 'Angola' },
        { code: '+235', flag: '🇹🇩', name: 'Chad' },
        { code: '+236', flag: '🇨🇫', name: 'Central African Republic' },
        { code: '+237', flag: '🇨🇲', name: 'Cameroon' },
        { code: '+238', flag: '🇨🇻', name: 'Cape Verde' },
        { code: '+240', flag: '🇬🇶', name: 'Equatorial Guinea' },
        { code: '+241', flag: '🇬🇦', name: 'Gabon' },
        { code: '+242', flag: '🇨🇬', name: 'Republic of the Congo' },
        { code: '+243', flag: '🇨🇩', name: 'Democratic Republic of the Congo' },
        { code: '+225', flag: '🇨🇮', name: 'Ivory Coast' },
        { code: '+221', flag: '🇸🇳', name: 'Senegal' },
        { code: '+223', flag: '🇲🇱', name: 'Mali' },
        { code: '+224', flag: '🇬🇳', name: 'Guinea' },
        { code: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
        { code: '+227', flag: '🇳🇪', name: 'Niger' },
        { code: '+228', flag: '🇹🇬', name: 'Togo' },
        { code: '+229', flag: '🇧🇯', name: 'Benin' },
        { code: '+232', flag: '🇸🇱', name: 'Sierra Leone' },
        { code: '+231', flag: '🇱🇷', name: 'Liberia' },
        { code: '+220', flag: '🇬🇲', name: 'Gambia' },
        { code: '+245', flag: '🇬🇼', name: 'Guinea-Bissau' },
        { code: '+248', flag: '🇸🇨', name: 'Seychelles' },
        { code: '+253', flag: '🇩🇯', name: 'Djibouti' },
        { code: '+254', flag: '🇰🇪', name: 'Kenya' },
        { code: '+255', flag: '🇹🇿', name: 'Tanzania' },
        { code: '+256', flag: '🇺🇬', name: 'Uganda' },
        { code: '+257', flag: '🇧🇮', name: 'Burundi' },
        { code: '+250', flag: '🇷🇼', name: 'Rwanda' },
        { code: '+52', flag: '🇲🇽', name: 'Mexico' },
        { code: '+55', flag: '🇧🇷', name: 'Brazil' },
        { code: '+54', flag: '🇦🇷', name: 'Argentina' },
        { code: '+56', flag: '🇨🇱', name: 'Chile' },
        { code: '+57', flag: '🇨🇴', name: 'Colombia' },
        { code: '+51', flag: '🇵🇪', name: 'Peru' },
        { code: '+58', flag: '🇻🇪', name: 'Venezuela' },
        { code: '+593', flag: '🇪🇨', name: 'Ecuador' },
        { code: '+595', flag: '🇵🇾', name: 'Paraguay' },
        { code: '+598', flag: '🇺🇾', name: 'Uruguay' },
        { code: '+591', flag: '🇧🇴', name: 'Bolivia' },
        { code: '+592', flag: '🇬🇾', name: 'Guyana' },
        { code: '+597', flag: '🇸🇷', name: 'Suriname' },
        { code: '+594', flag: '🇬🇫', name: 'French Guiana' },
        { code: '+500', flag: '🇫🇰', name: 'Falkland Islands' },
        { code: '+507', flag: '🇵🇦', name: 'Panama' },
        { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
        { code: '+505', flag: '🇳🇮', name: 'Nicaragua' },
        { code: '+504', flag: '🇭🇳', name: 'Honduras' },
        { code: '+503', flag: '🇸🇻', name: 'El Salvador' },
        { code: '+502', flag: '🇬🇹', name: 'Guatemala' },
        { code: '+501', flag: '🇧🇿', name: 'Belize' },
        { code: '+509', flag: '🇭🇹', name: 'Haiti' },
        { code: '+1-876', flag: '🇯🇲', name: 'Jamaica' },
        { code: '+1-809', flag: '🇩🇴', name: 'Dominican Republic' },
        { code: '+1-787', flag: '🇵🇷', name: 'Puerto Rico' },
        { code: '+53', flag: '🇨🇺', name: 'Cuba' },
        { code: '+1-242', flag: '🇧🇸', name: 'Bahamas' },
        { code: '+1-246', flag: '🇧🇧', name: 'Barbados' },
        { code: '+1-284', flag: '🇻🇬', name: 'British Virgin Islands' },
        { code: '+1-340', flag: '🇻🇮', name: 'US Virgin Islands' },
        { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
        { code: '+679', flag: '🇫🇯', name: 'Fiji' },
        { code: '+676', flag: '🇹🇴', name: 'Tonga' },
        { code: '+685', flag: '🇼🇸', name: 'Samoa' },
        { code: '+687', flag: '🇳🇨', name: 'New Caledonia' },
        { code: '+689', flag: '🇵🇫', name: 'French Polynesia' },
        { code: '+678', flag: '🇻🇺', name: 'Vanuatu' },
        { code: '+677', flag: '🇸🇧', name: 'Solomon Islands' },
        { code: '+675', flag: '🇵🇬', name: 'Papua New Guinea' },
        { code: '+672', flag: '🇦🇶', name: 'Antarctica' },
        { code: '+670', flag: '🇹🇱', name: 'Timor-Leste' },
        { code: '+673', flag: '🇧🇳', name: 'Brunei' },
        { code: '+674', flag: '🇳🇷', name: 'Nauru' },
        { code: '+676', flag: '🇹🇴', name: 'Tonga' },
        { code: '+677', flag: '🇸🇧', name: 'Solomon Islands' },
        { code: '+678', flag: '🇻🇺', name: 'Vanuatu' },
        { code: '+679', flag: '🇫🇯', name: 'Fiji' },
        { code: '+680', flag: '🇵🇼', name: 'Palau' },
        { code: '+681', flag: '🇼🇫', name: 'Wallis and Futuna' },
        { code: '+682', flag: '🇨🇰', name: 'Cook Islands' },
        { code: '+683', flag: '🇳🇺', name: 'Niue' },
        { code: '+684', flag: '🇦🇸', name: 'American Samoa' },
        { code: '+685', flag: '🇼🇸', name: 'Samoa' },
        { code: '+686', flag: '🇰🇮', name: 'Kiribati' },
        { code: '+687', flag: '🇳🇨', name: 'New Caledonia' },
        { code: '+688', flag: '🇹🇻', name: 'Tuvalu' },
        { code: '+689', flag: '🇵🇫', name: 'French Polynesia' },
        { code: '+690', flag: '🇹🇰', name: 'Tokelau' },
        { code: '+691', flag: '🇫🇲', name: 'Micronesia' },
        { code: '+692', flag: '🇲🇭', name: 'Marshall Islands' },
        { code: '+850', flag: '🇰🇵', name: 'North Korea' },
        { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
        { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
        { code: '+93', flag: '🇦🇫', name: 'Afghanistan' },
        { code: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
        { code: '+95', flag: '🇲🇲', name: 'Myanmar' },
        { code: '+960', flag: '🇲🇻', name: 'Maldives' },
        { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
        { code: '+962', flag: '🇯🇴', name: 'Jordan' },
        { code: '+963', flag: '🇸🇾', name: 'Syria' },
        { code: '+964', flag: '🇮🇶', name: 'Iraq' },
        { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
        { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
        { code: '+967', flag: '🇾🇪', name: 'Yemen' },
        { code: '+968', flag: '🇴🇲', name: 'Oman' },
        { code: '+970', flag: '🇵🇸', name: 'Palestine' },
        { code: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
        { code: '+972', flag: '🇮🇱', name: 'Israel' },
        { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
        { code: '+974', flag: '🇶🇦', name: 'Qatar' },
        { code: '+975', flag: '🇧🇹', name: 'Bhutan' },
        { code: '+976', flag: '🇲🇳', name: 'Mongolia' },
        { code: '+977', flag: '🇳🇵', name: 'Nepal' },
        { code: '+992', flag: '🇹🇯', name: 'Tajikistan' },
        { code: '+993', flag: '🇹🇲', name: 'Turkmenistan' },
        { code: '+994', flag: '🇦🇿', name: 'Azerbaijan' },
        { code: '+995', flag: '🇬🇪', name: 'Georgia' },
        { code: '+996', flag: '🇰🇬', name: 'Kyrgyzstan' },
        { code: '+998', flag: '🇺🇿', name: 'Uzbekistan' },
        { code: '+380', flag: '🇺🇦', name: 'Ukraine' },
        { code: '+375', flag: '🇧🇾', name: 'Belarus' },
        { code: '+370', flag: '🇱🇹', name: 'Lithuania' },
        { code: '+371', flag: '🇱🇻', name: 'Latvia' },
        { code: '+372', flag: '🇪🇪', name: 'Estonia' },
        { code: '+373', flag: '🇲🇩', name: 'Moldova' },
        { code: '+374', flag: '🇦🇲', name: 'Armenia' },
        { code: '+376', flag: '🇦🇩', name: 'Andorra' },
        { code: '+377', flag: '🇲🇨', name: 'Monaco' },
        { code: '+378', flag: '🇸🇲', name: 'San Marino' },
        { code: '+379', flag: '🇻🇦', name: 'Vatican City' },
        { code: '+381', flag: '🇷🇸', name: 'Serbia' },
        { code: '+382', flag: '🇲🇪', name: 'Montenegro' },
        { code: '+383', flag: '🇽🇰', name: 'Kosovo' },
        { code: '+385', flag: '🇭🇷', name: 'Croatia' },
        { code: '+386', flag: '🇸🇮', name: 'Slovenia' },
        { code: '+387', flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
        { code: '+389', flag: '🇲🇰', name: 'North Macedonia' },
        { code: '+350', flag: '🇬🇮', name: 'Gibraltar' },
        { code: '+351', flag: '🇵🇹', name: 'Portugal' },
        { code: '+352', flag: '🇱🇺', name: 'Luxembourg' },
        { code: '+353', flag: '🇮🇪', name: 'Ireland' },
        { code: '+354', flag: '🇮🇸', name: 'Iceland' },
        { code: '+355', flag: '🇦🇱', name: 'Albania' },
        { code: '+356', flag: '🇲🇹', name: 'Malta' },
        { code: '+357', flag: '🇨🇾', name: 'Cyprus' },
        { code: '+358', flag: '🇫🇮', name: 'Finland' },
        { code: '+359', flag: '🇧🇬', name: 'Bulgaria' },
        { code: '+421', flag: '🇸🇰', name: 'Slovakia' },
        { code: '+423', flag: '🇱🇮', name: 'Liechtenstein' },
    ];

    // Remove duplicates and sort alphabetically
    const uniqueCountries = countries.filter((country, index, self) =>
        index === self.findIndex((c) => c.code === country.code && c.name === country.name)
    ).sort((a, b) => a.name.localeCompare(b.name));

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

    return (
        <div className="flex flex-col justify-between w-full md:h-auto ">
            <div className="max-w-md mx-auto w-full">
                <div className='flex flex-col space-y-6 mt-18 items-center'>
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

                {/* Sign Up Form */}
                <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    // Handle sign up logic here
                }}>
                    {/* First Name and Last Name - Side by Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground shadow-xs"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground shadow-xs"
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
                                    className="flex items-center gap-2 px-3 py-3 border border-input rounded-l-lg border-r-0 bg-background hover:bg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
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
                                className="flex-1 px-4 py-3 border border-input rounded-r-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground max-w-62 md:max-w-60 lg:max-w-full"
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
                            className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground shadow-xs"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 pr-12 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-foreground bg-background placeholder:text-muted-foreground shadow-xs"
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



                    {/* Terms and Conditions Checkbox */}
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={agreeToTerms}
                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                            className="mt-1 w-4 h-4 border border-input rounded focus:ring-2 focus:ring-accent text-[var(--color-purple)] cursor-pointer"
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
                        className="w-full bg-purple hover:bg-purple-dark text-white py-8 text-base font-medium rounded-sm flex items-center justify-center gap-2 mt-2 cursor-pointer"
                    >
                        Sign up
                        <FaAngleRight className="w-5 h-5 ml-2 shrink-0" />
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
                    className="w-full border border-input bg-background hover:bg-background hover:text-foreground text-foreground py-8 text-base font-medium rounded-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-md cursor-pointer"
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
