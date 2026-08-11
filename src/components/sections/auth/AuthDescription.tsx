import { ROUTES } from "@/constants/routes";
import { Link } from "react-router-dom";
import Logo from "@/components/brand/Logo";
import { Building2, ShieldCheck, TrendingUp } from "lucide-react";

const AuthDescription = () => {
    return (
            <div className="hidden md:flex md:w-1/2 flex-col p-8 lg:p-12 bg-button-secondary">
                {/* Logo */}
                <div className="">
                    <Link to={ROUTES.HOME} className="flex items-center gap-2">
                        <Logo markClassName="h-10 w-10" />
                    </Link>
                </div>

                {/* Heading and Tagline */}
                <div className=" max-w-lg flex-1 flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 pr-28 md:pr-0 lg:pr-28 leading-tight">
                        Your journey starts here
                    </h1>
                    <p className="text-sm md:text-base text-foreground leading-relaxed">
                        Every great business starts with a solid foundation — let's build yours.
                    </p>
                </div>

                {/* Dashboard Mockup Illustration */}
                <div className="flex items-end">
                    <div className="relative w-full max-w-md">
                        {/* Floating icon badges */}
                        <div className="absolute -top-6 -left-3 z-10 bg-white rounded-full p-3 shadow-lg ring-1 ring-gold-200">
                            <ShieldCheck className="w-6 h-6 text-gold-500" />
                        </div>
                        <div className="absolute top-1/3 -right-3 z-10 bg-white rounded-full p-3 shadow-lg ring-1 ring-gold-200">
                            <TrendingUp className="w-6 h-6 text-navy-900" />
                        </div>

                        {/* Main card */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-gold-200/60">
                            {/* Header bar */}
                            <div className="bg-navy-900 px-5 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-gold-500" />
                                    <span className="text-xs font-semibold text-white">Company Dashboard</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-gold-500" />
                                    <span className="w-2 h-2 rounded-full bg-gold-300" />
                                    <span className="w-2 h-2 rounded-full bg-navy-500" />
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-5 space-y-5">
                                {/* Entity status row */}
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                            Entity status
                                        </div>
                                        <div className="text-sm font-bold text-navy-900 flex items-center gap-2 mt-1">
                                            <span className="w-2 h-2 rounded-full bg-gold-500" />
                                            Formed &amp; Compliant
                                        </div>
                                    </div>
                                    <div className="bg-gold-100 rounded-xl p-2.5">
                                        <Building2 className="w-6 h-6 text-gold-700" />
                                    </div>
                                </div>

                                {/* Placeholder rows */}
                                <div className="space-y-2">
                                    <div className="h-3 rounded bg-navy-100 w-full" />
                                    <div className="h-3 rounded bg-navy-100 w-3/4" />
                                    <div className="h-3 rounded bg-gold-100 w-1/2" />
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3 pt-1">
                                    <div className="bg-navy-50 rounded-lg p-3">
                                        <div className="flex items-center gap-1.5">
                                            <TrendingUp className="w-4 h-4 text-gold-600" />
                                            <span className="text-xs font-bold text-navy-900">+32%</span>
                                        </div>
                                        <div className="text-[10px] text-muted-foreground mt-1">Revenue growth</div>
                                    </div>
                                    <div className="bg-navy-50 rounded-lg p-3">
                                        <div className="text-xs font-bold text-navy-900">$128k</div>
                                        <div className="text-[10px] text-muted-foreground mt-1">Assets under care</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating badge */}
                        <div className="absolute -bottom-5 -right-3 z-10 bg-navy-900 rounded-xl px-4 py-3 flex items-center gap-2 shadow-lg">
                            <ShieldCheck className="w-5 h-5 text-gold-500" />
                            <span className="text-xs font-semibold text-white">Fully Compliant</span>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default AuthDescription;
