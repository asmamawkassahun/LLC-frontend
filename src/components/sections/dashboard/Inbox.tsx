import { useQuery } from '@tanstack/react-query';
import DashboardHeader from "./DashboardHeader";
import apiClient from '@/utils/api-helpers/apiClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Eye, Download, Calendar, Package } from 'lucide-react';
import { formatDate } from '@/lib/formatters';

interface MarketplaceOrderFile {
    file_path: string;
    file_name: string;
    file_url: string;
    uploaded_at?: string;
    order_id: number;
    order_number: string;
    order_status: string;
    service_name: string;
    order_date: string;
}

const Inbox = () => {

    // Fetch marketplace orders for the current user
    const { data: ordersData, isLoading, error } = useQuery({
        queryKey: ['user-marketplace-orders'],
        queryFn: async () => {
            try {
                // Try to fetch user's marketplace orders
                // If endpoint doesn't exist, we'll need to create it
                const response = await apiClient.get('/marketplace/orders');
                return response.data;
            } catch (err: any) {
                // If endpoint doesn't exist, return empty array for now
                if (err.response?.status === 404) {
                    return { data: [] };
                }
                throw err;
            }
        },
        retry: false,
    });

    console.log("marketplace Orders file data: ", ordersData);

    // Files are already extracted and formatted by the backend
    const allFiles = ordersData?.data || [];

    // Use all files directly (no filtering)
    const filteredFiles = allFiles;

    const handleViewFile = (file: MarketplaceOrderFile) => {
        window.open(file.file_url, '_blank');
    };

    const handleDownloadFile = (file: MarketplaceOrderFile) => {
        window.open(file.file_url, '_blank');
    };

    if (error) {
        return (
            <div className="max-w-7xl mx-auto space-y-6 py-6 px-2">
                <DashboardHeader
                    imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK9rP8x5i8swWmAGwbnyiSVOiWPwFek7fWnA&s"
                    title="Inbox"
                    description="Manage your inbox"
                />
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                Unable to load files. Please try again later.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 py-6 px-2">
            <DashboardHeader
                imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK9rP8x5i8swWmAGwbnyiSVOiWPwFek7fWnA&s"
                title="Inbox"
                description="View and download files from your marketplace orders"
            />

            {/* Files Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="pt-6">
                                <div className="space-y-3">
                                    <Skeleton className="h-12 w-12 rounded-lg" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredFiles.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No files found</h3>
                            <p className="text-muted-foreground">
                                You don't have any files in your marketplace orders yet.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFiles.map((file: any, index: number) => (
                        <Card key={`${file.order_id}-${index}`} className="hover:shadow-lg transition-shadow duration-200">
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    {/* File Icon and Name */}
                                    <div className="flex items-start gap-3">
                                        <div className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${file.file_name?.toLowerCase().endsWith('.pdf')
                                                ? 'bg-red-50 dark:bg-red-950'
                                                : file.file_name?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)
                                                    ? 'bg-blue-50 dark:bg-blue-950'
                                                    : file.file_name?.toLowerCase().match(/\.(doc|docx)$/)
                                                        ? 'bg-blue-50 dark:bg-blue-950'
                                                        : 'bg-gray-50 dark:bg-gray-950'
                                            }`}>
                                            <FileText className={`w-6 h-6 ${file.file_name?.toLowerCase().endsWith('.pdf')
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : file.file_name?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)
                                                        ? 'text-blue-600 dark:text-blue-400'
                                                        : file.file_name?.toLowerCase().match(/\.(doc|docx)$/)
                                                            ? 'text-blue-600 dark:text-blue-400'
                                                            : 'text-gray-600 dark:text-gray-400'
                                                }`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm truncate" title={file.file_name}>
                                                {file.file_name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {file.service_name}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Info */}
                                    <div className="space-y-2 pt-2 border-t">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Package className="w-3 h-3" />
                                            <span>Order: {file.order_number}</span>
                                        </div>
                                        {file.order_date && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(file.order_date)}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${file.order_status === 'provided'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : file.order_status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                                }`}>
                                                {file.order_status?.charAt(0).toUpperCase() + file.order_status?.slice(1) || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 cursor-pointer"
                                            onClick={() => handleViewFile(file)}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="flex-1 cursor-pointer"
                                            onClick={() => handleDownloadFile(file)}
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Stats Card */}
            {/* {!isLoading && allFiles.length > 0 && (
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Files</p>
                                <p className="text-2xl font-bold">{allFiles.length}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Showing</p>
                                <p className="text-2xl font-bold">{filteredFiles.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )} */}
        </div>
    );
};

export default Inbox;
