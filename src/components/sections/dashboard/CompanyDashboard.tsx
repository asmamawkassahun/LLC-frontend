import { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import apiClient from '@/utils/api-helpers/apiClient';
import { Loader2, Building2, MapPin, FileText, Users, DollarSign, Calendar, Tag, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface CompanyOwner {
    id: number;
    full_name: string;
    ownership_percentage: number;
    is_company: boolean;
    email?: string;
    phone?: string;
    address?: any;
}

interface CompanyAddress {
    id: number;
    type: string;
    street_address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    use_registered_agent?: boolean;
    is_active?: boolean;
}

interface Company {
    id: number;
    name: string;
    type?: string;
    type_label?: string;
    category?: string[];
    status?: string;
    status_label?: string;
    registration_number?: string;
    is_primary?: boolean;
    formed_at?: string;
    created_at?: string;
    country?: {
        id: number;
        name: string;
    };
    state?: {
        id: number;
        name: string;
    };
    owners?: CompanyOwner[];
    addresses?: CompanyAddress[];
}

interface PrimaryOrder {
    id: number;
    order_number: string;
    status?: string;
    status_label?: string;
    payment_status: string;
    payment_status_label?: string;
    base_price?: number;
    discount_amount?: number;
    subtotal?: number;
    tax_amount?: number;
    total_amount: number;
    paid_at?: string;
    completed_at?: string;
    created_at?: string;
    company?: Company;
    country?: {
        id: number;
        name: string;
    };
    pricing_plan?: {
        id: number;
        name: string;
    };
}

const CompanyDashboard = () => {
    const [order, setOrder] = useState<PrimaryOrder | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrimaryOrder = async () => {
            try {
                const response = await apiClient.get('/orders/primary-company');
                setOrder(response.data.data);
            } catch (error: any) {
                if (error.response?.status !== 404) {
                    console.error('Error fetching primary company order:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchPrimaryOrder();

        // Re-fetch when company selection changes elsewhere in the app
        const handleCompanyChanged = () => {
            // show a small loading state while refetching
            setLoading(true);
            fetchPrimaryOrder();
        };

        window.addEventListener('companyChanged', handleCompanyChanged as EventListener);

        return () => {
            window.removeEventListener('companyChanged', handleCompanyChanged as EventListener);
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple" />
            </div>
        );
    }

    if (!order || !order.company) {
        return (
            <div className="max-w-7xl mx-auto space-y-4 py-6 px-2">
                <DashboardHeader
                    imageUrl="https://app.privatily.com/assets/img/header-icones/settings.png"
                    title="Company Dashboard"
                    description="No primary company found."
                />
            </div>
        );
    }

    const getStatusIcon = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'formed':
            case 'paid':
                return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'processing':
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            case 'rejected':
            case 'failed':
                return <XCircle className="w-5 h-5 text-red-600" />;
            case 'confirmed':
                return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            default:
                return <Clock className="w-5 h-5 text-gray-600" />;
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-4 py-6 px-2 sm:px-4">
            <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold"><span className="hidden sm:inline">Company</span> Dashboard</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Welcome to your {order.company.name} dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 1: Company Information */}
                <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-purple/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-purple" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Company Information</h3>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Company Name</p>
                            <p className="text-sm font-medium text-foreground">{order.company.name}</p>
                        </div>
                        {order.company.type_label && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Company Type</p>
                                <p className="text-sm font-medium text-foreground">{order.company.type_label}</p>
                            </div>
                        )}
                        {order.company.registration_number && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Registration Number</p>
                                <p className="text-sm font-medium text-foreground">{order.company.registration_number}</p>
                            </div>
                        )}
                        {order.company.status_label && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(order.company.status)}
                                    <span className="text-sm font-medium text-foreground">{order.company.status_label}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Card 2: Location Details */}
                <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Location Details</h3>
                    </div>
                    <div className="space-y-3">
                        {order.company.country && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Country</p>
                                <p className="text-sm font-medium text-foreground">{order.company.country.name}</p>
                            </div>
                        )}
                        {order.company.state && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">State/Province</p>
                                <p className="text-sm font-medium text-foreground">{order.company.state.name}</p>
                            </div>
                        )}
                        {order.country && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Order Country</p>
                                <p className="text-sm font-medium text-foreground">{order.country.name}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Card 3: Order Details */}
                <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Order Details</h3>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Order Number</p>
                            <p className="text-sm font-medium text-foreground font-mono">{order.order_number}</p>
                        </div>
                        {order.pricing_plan && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Pricing Plan</p>
                                <p className="text-sm font-medium text-foreground">{order.pricing_plan.name}</p>
                            </div>
                        )}
                        {order.status_label && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Order Status</p>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(order.status)}
                                    <span className="text-sm font-medium text-foreground">{order.status_label}</span>
                                </div>
                            </div>
                        )}
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Payment Status</p>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(order.payment_status)}
                                <span className={`text-sm font-medium ${
                                    order.payment_status === 'paid' 
                                        ? 'text-green-600' 
                                        : 'text-yellow-600'
                                }`}>
                                    {order.payment_status_label || order.payment_status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 4: Financial Summary */}
                <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Financial Summary</h3>
                    </div>
                    <div className="space-y-3">
                        {order.base_price !== undefined && order.base_price !== null && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Base Price</p>
                                <p className="text-sm font-medium text-foreground">${Number(order.base_price).toFixed(2)}</p>
                            </div>
                        )}
                        {order.discount_amount !== undefined && order.discount_amount !== null && Number(order.discount_amount) > 0 && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Discount</p>
                                <p className="text-sm font-medium text-green-600">-${Number(order.discount_amount).toFixed(2)}</p>
                            </div>
                        )}
                        {order.tax_amount !== undefined && order.tax_amount !== null && Number(order.tax_amount) > 0 && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Tax</p>
                                <p className="text-sm font-medium text-foreground">${Number(order.tax_amount).toFixed(2)}</p>
                            </div>
                        )}
                        <div className="pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                            <p className="text-lg font-bold text-foreground">${Number(order.total_amount || 0).toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Card 5: Company Owners */}
                <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Company Owners</h3>
                    </div>
                    <div className="space-y-3">
                        {order.company.owners && order.company.owners.length > 0 ? (
                            order.company.owners.map((owner) => (
                                <div key={owner.id} className="pb-3 border-b border-border last:border-0 last:pb-0">
                                    <div className="flex items-start justify-between mb-1">
                                        <p className="text-sm font-medium text-foreground">{owner.full_name}</p>
                                        <span className="text-xs font-semibold text-purple">
                                            {Number(owner.ownership_percentage || 0).toFixed(2)}%
                                        </span>
                                    </div>
                                    {owner.is_company && (
                                        <span className="text-xs text-muted-foreground">(Company Owner)</span>
                                    )}
                                    {owner.email && (
                                        <p className="text-xs text-muted-foreground mt-1">{owner.email}</p>
                                    )}
                                    {owner.phone && (
                                        <p className="text-xs text-muted-foreground">{owner.phone}</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No owners registered</p>
                        )}
                    </div>
                </div>

                {/* Card 6: Company Addresses */}
                <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-pink-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Company Addresses</h3>
                    </div>
                    <div className="space-y-3">
                        {order.company.addresses && order.company.addresses.length > 0 ? (
                            order.company.addresses.map((address) => (
                                <div key={address.id} className="pb-3 border-b border-border last:border-0 last:pb-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs font-semibold text-foreground uppercase">
                                            {address.type || 'Address'}
                                        </p>
                                        {address.use_registered_agent && (
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                                Registered Agent
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground space-y-0.5">
                                        {address.street_address && <p>{address.street_address}</p>}
                                        {(address.city || address.state || address.zip_code) && (
                                            <p>
                                                {[
                                                    address.city,
                                                    // address.state may be an object ({ id, name }) or a string
                                                    typeof address.state === 'string' ? address.state : address.state?.name,
                                                    address.zip_code,
                                                ]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </p>
                                        )}
                                        {address.country && (
                                            <p>
                                                {typeof address.country === 'string'
                                                    ? address.country
                                                    : address.country?.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No addresses registered</p>
                        )}
                    </div>
                </div>

                {/* Card 7: Timeline & Dates */}
                <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Timeline & Dates</h3>
                    </div>
                    <div className="space-y-3">
                        {order.created_at && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Order Created</p>
                                <p className="text-sm font-medium text-foreground">{formatDate(order.created_at)}</p>
                            </div>
                        )}
                        {order.company.created_at && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Company Registered</p>
                                <p className="text-sm font-medium text-foreground">{formatDate(order.company.created_at)}</p>
                            </div>
                        )}
                        {order.company.formed_at && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Company Formed</p>
                                <p className="text-sm font-medium text-green-600">{formatDate(order.company.formed_at)}</p>
                            </div>
                        )}
                        {order.paid_at && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Payment Date</p>
                                <p className="text-sm font-medium text-foreground">{formatDate(order.paid_at)}</p>
                            </div>
                        )}
                        {order.completed_at && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Order Completed</p>
                                <p className="text-sm font-medium text-foreground">{formatDate(order.completed_at)}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Card 8: Categories (if available) */}
                {order.company.category && order.company.category.length > 0 && (
                    <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                                <Tag className="w-5 h-5 text-teal-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Categories</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {order.company.category.map((cat, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-purple/10 text-purple text-xs font-medium rounded-full"
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyDashboard;

