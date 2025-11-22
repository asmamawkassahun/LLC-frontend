import { useState } from 'react';
import DashboardHeader from "./DashboardHeader";
import { Button } from "@/components/ui";
import { HiChevronDown } from 'react-icons/hi';
import { getUniqueCountries } from '@/constants/countries';

const Settings = () => {
    const [formData, setFormData] = useState({
        firstName: 'Abebe',
        lastName: 'Yaregal',
        birthDate: '',
        country: 'Ethiopia',
        email: 'asmamewkassahun@gmail.com',
        phoneNumber: '962808100',
        oldPassword: '',
        password: '',
        confirmPassword: '',
    });

    const countries = getUniqueCountries();
    const selectedCountry = countries.find(c => c.code === '+251') || countries[0];
    const allCountries = getUniqueCountries();

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveBasicInfo = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Saving basic info:', formData);
        // Add save logic here
    };

    const handleSavePassword = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Saving password');
        // Add save logic here
    };

    const handleUpdateEmail = () => {
        console.log('Updating email:', formData.email);
        // Add update email logic here
    };

    return (
        <div className="max-w-7xl mx-auto space-y-2 pb-6 px-6 sm:px-8">
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
                                    {/* <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <HiCalendar className="w-5 h-5 text-muted-foreground" />
                                    </div> */}
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
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="flex-1 px-4 py-2 bg-muted border border-input rounded-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-muted-foreground"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleUpdateEmail}
                                        className="bg-purple hover:bg-purple-dark h-full rounded-r-lg rounded-l-none text-white px-6 py-3 absolute right-0 top-0"
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
                                className="bg-purple hover:bg-purple-dark text-white px-6 py-3"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Password Section */}
                <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-foreground mb-6">Password</h2>

                    <form onSubmit={handleSavePassword} className="space-y-4">
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            {/* Old Password */}
                            <div>
                                <label className="text-sm font-semibold text-foreground mb-2 block">
                                    Old Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={formData.oldPassword}
                                    onChange={(e) => handleInputChange('oldPassword', e.target.value)}
                                    placeholder="Old Password"
                                    className="w-full px-4 py-2 border border-input rounded-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-muted-foreground bg-background placeholder:text-muted-foreground"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-semibold text-foreground mb-2 block">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="Password"
                                    className="w-full px-4 py-2 border border-input rounded-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-muted-foreground bg-background placeholder:text-muted-foreground"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="text-sm font-semibold text-foreground mb-2 block">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    placeholder="Password confirmation"
                                    className="w-full px-4 py-2 border border-input rounded-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-muted-foreground bg-background placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="bg-purple hover:bg-purple-dark text-white px-6 py-3"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
