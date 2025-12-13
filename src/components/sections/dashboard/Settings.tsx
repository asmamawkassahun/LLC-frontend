import { useEffect, useState } from 'react';
import DashboardHeader from "./DashboardHeader";
import { Button } from "@/components/ui";
import { HiChevronDown, HiEye, HiEyeOff } from 'react-icons/hi';
import { getUniqueCountries } from '@/constants/countries';
import userService from '@/services/userService';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import EmailUpdateModal from './EmailUpdateModal';

interface PasswordErrors {
    current_password?: string;
    password?: string;
    password_confirmation?: string;
}

const Settings = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [profileUpdating, setProfileUpdating] = useState(false);
    const [passwordUpdating, setPasswordUpdating] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        country: '',
        email: '',
        phoneNumber: '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const countries = getUniqueCountries();
    const selectedCountry = countries.find(c => c.code === '+251') || countries[0];
    const allCountries = getUniqueCountries();

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const user = await userService.getCurrentUser();
                
                // Split name into first and last name
                const nameParts = user.name ? user.name.trim().split(' ') : ['', ''];
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';

                // Extract phone number (remove country code if present)
                let phoneNumber = '';
                if (user.phone) {
                    // Remove country code prefix (e.g., +1, +251)
                    phoneNumber = user.phone.replace(/^\+\d{1,3}\s?/, '');
                }

                // Format date_of_birth for date input (YYYY-MM-DD)
                let birthDate = '';
                if (user.profile?.date_of_birth) {
                    const date = new Date(user.profile.date_of_birth);
                    if (!isNaN(date.getTime())) {
                        birthDate = date.toISOString().split('T')[0];
                    }
                }

                // Use profile country if available, otherwise use user country
                const country = user.profile?.country || user.country || '';

                setFormData({
                    firstName,
                    lastName,
                    birthDate,
                    country,
                    email: user.email || '',
                    phoneNumber,
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (passwordErrors[field as keyof PasswordErrors]) {
            setPasswordErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field as keyof PasswordErrors];
                return newErrors;
            });
        }
    };

    const handleSaveBasicInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setProfileUpdating(true);
            // Combine first and last name
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();

            // Prepare update data
            const updateData: any = {
                name: fullName,
                date_of_birth: formData.birthDate || null,
                country: formData.country || null,
            };

            // Update user and profile
            await userService.updateUser(updateData);

            toast.success('Profile updated successfully');
        } catch (error: any) {
            console.error('Error updating profile:', error);
        } finally {
            setProfileUpdating(false);
        }
    };

    const validatePasswordForm = (): boolean => {
        const errors: PasswordErrors = {};

        // Validate current password
        if (!formData.current_password.trim()) {
            errors.current_password = 'Current password is required';
        }

        // Validate new password
        if (!formData.password.trim()) {
            errors.password = 'New password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }

        // Validate password confirmation
        if (!formData.password_confirmation.trim()) {
            errors.password_confirmation = 'Password confirmation is required';
        } else if (formData.password !== formData.password_confirmation) {
            errors.password_confirmation = 'Passwords do not match';
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Clear previous errors
        setPasswordErrors({});

        // Validate form
        if (!validatePasswordForm()) {
            return;
        }

        try {
            setPasswordUpdating(true);
            
            await userService.changePassword({
                current_password: formData.current_password,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            });
            
            // Success - clear password fields
            toast.success('Password updated successfully');
            setFormData(prev => ({
                ...prev,
                current_password: '',
                password: '',
                password_confirmation: '',
            }));
        } catch (error: any) {
            console.error('Error changing password:', error);
            
            // Handle validation errors from backend
            if (error.response?.data?.errors) {
                const backendErrors = error.response.data.errors;
                const errors: PasswordErrors = {};
                
                if (backendErrors.current_password) {
                    errors.current_password = Array.isArray(backendErrors.current_password) 
                        ? backendErrors.current_password[0] 
                        : backendErrors.current_password;
                }
                if (backendErrors.password) {
                    errors.password = Array.isArray(backendErrors.password) 
                        ? backendErrors.password[0] 
                        : backendErrors.password;
                }
                if (backendErrors.password_confirmation) {
                    errors.password_confirmation = Array.isArray(backendErrors.password_confirmation) 
                        ? backendErrors.password_confirmation[0] 
                        : backendErrors.password_confirmation;
                }
                
                setPasswordErrors(errors);
            }
        } finally {
            setPasswordUpdating(false);
        }
    };

    const handleUpdateEmail = () => {
        setIsEmailModalOpen(true);
    };

    const handleEmailUpdateSuccess = async () => {
        // Refresh user data to get updated email
        try {
            const user = await userService.getCurrentUser();
            setFormData(prev => ({ ...prev, email: user.email || '' }));
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto space-y-2 pb-6 px-6 sm:px-8">
                <DashboardHeader
                    imageUrl="https://app.privatily.com/assets/img/header-icones/settings.png"
                    title="Settings"
                    description="Manage and edit your profile."
                />
                <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">Loading profile data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-2 pb-6 px-2">
            <DashboardHeader
                imageUrl="https://app.privatily.com/assets/img/header-icones/settings.png"
                title="Settings"
                description="Manage and edit your profile."
            />

            <div className="space-y-2">
                {/* Basic Info Section */}
                <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Basic Info</h2>

                    <form onSubmit={handleSaveBasicInfo} className="space-y-6">
                        {/* First Name and Last Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    className="w-full px-4 py-2 border border-input rounded-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-muted-foreground bg-background"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    className="w-full px-4 py-2 border border-input rounded-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-muted-foreground bg-background"
                                />
                            </div>
                        </div>

                        {/* Birth Date and Country */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Birth Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => handleInputChange('birthDate', e.target.value)}
                                        className="w-full px-4 py-2 border border-input rounded-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-muted-foreground bg-background"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Country
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.country}
                                        onChange={(e) => handleInputChange('country', e.target.value)}
                                        className="w-full px-4 py-2 pr-10 border border-input rounded-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-muted-foreground bg-background appearance-none cursor-pointer"
                                    >
                                        <option value="">Select a country</option>
                                        {allCountries.map((country) => (
                                            <option key={country.name} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <HiChevronDown className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Email
                                </label>
                                <div className="relative flex items-center gap-2">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="flex-1 text-xs sm:text-sm px-4 py-2 bg-muted border border-input rounded-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-muted-foreground"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleUpdateEmail}
                                        className="bg-purple hover:bg-purple-dark h-full rounded-r-sm rounded-l-none text-white px-6 py-3 absolute right-0 top-0 cursor-pointer"
                                    >
                                        Update
                                    </Button>
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Phone Number
                                </label>
                                <div className="flex items-center bg-foreground/5 border border-input rounded-sm shadow-xs">
                                    <div className="flex items-center gap-2 px-4 py-3 border-r border-input bg-muted rounded-l-lg">
                                        <span className="text-xl">{selectedCountry.flag}</span>
                                        <span className="text-sm font-medium text-foreground">{selectedCountry.code}</span>
                                    </div>
                                    <input
                                        type="tel"
                                        value={formData.phoneNumber}
                                        disabled
                                        onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, ''))}
                                        placeholder="962808100"
                                        className="flex-1 px-4 py-3 border-0 focus:outline-none text-muted-foreground"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={profileUpdating}
                                className="bg-purple hover:bg-purple-dark text-white px-6 py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {profileUpdating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Password Section */}
                <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-foreground mb-6">Password</h2>

                    <form onSubmit={handleSavePassword} className="space-y-4">
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            {/* Current Password */}
                            <div>
                                <label className="text-sm font-semibold text-foreground mb-2 block">
                                    Current Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        value={formData.current_password}
                                        onChange={(e) => handleInputChange('current_password', e.target.value)}
                                        placeholder="Current Password"
                                        disabled={passwordUpdating}
                                        className={`w-full px-4 py-2 pr-10 border rounded-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-muted-foreground bg-background placeholder:text-muted-foreground disabled:opacity-50 ${
                                            passwordErrors.current_password ? 'border-red-500' : 'border-input'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        disabled={passwordUpdating}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        {showCurrentPassword ? (
                                            <HiEyeOff className="w-5 h-5" />
                                        ) : (
                                            <HiEye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {passwordErrors.current_password && (
                                    <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="text-sm font-semibold text-foreground mb-2 block">
                                    New Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="New Password"
                                        disabled={passwordUpdating}
                                        minLength={8}
                                        className={`w-full px-4 py-2 pr-10 border rounded-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-muted-foreground bg-background placeholder:text-muted-foreground disabled:opacity-50 ${
                                            passwordErrors.password ? 'border-red-500' : 'border-input'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={passwordUpdating}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        {showPassword ? (
                                            <HiEyeOff className="w-5 h-5" />
                                        ) : (
                                            <HiEye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {passwordErrors.password && (
                                    <p className="mt-1 text-sm text-red-600">{passwordErrors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="text-sm font-semibold text-foreground mb-2 block">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.password_confirmation}
                                        onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                                        placeholder="Confirm Password"
                                        disabled={passwordUpdating}
                                        minLength={8}
                                        className={`w-full px-4 py-2 pr-10 border rounded-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-muted-foreground bg-background placeholder:text-muted-foreground disabled:opacity-50 ${
                                            passwordErrors.password_confirmation ? 'border-red-500' : 'border-input'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={passwordUpdating}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        {showConfirmPassword ? (
                                            <HiEyeOff className="w-5 h-5" />
                                        ) : (
                                            <HiEye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {passwordErrors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-600">{passwordErrors.password_confirmation}</p>
                                )}
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={passwordUpdating}
                                className="bg-purple hover:bg-purple-dark text-white px-6 py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {passwordUpdating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                                        Updating...
                                    </>
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Email Update Modal */}
            <EmailUpdateModal
                open={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                currentEmail={formData.email}
                onSuccess={handleEmailUpdateSuccess}
            />
        </div>
    );
};

export default Settings;
