import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardHeader from "./DashboardHeader";
import { Button } from "@/components/ui";
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import { useMemo } from 'react';
import AddBankAccountModal from '@/components/modal/AddBankAccountModal';
import referralService from '@/services/referralService';
import type { Payout as ReferralPayout, CreateBankAccountRequest, RequestPayoutRequest } from '@/services/referralService';
import { toast } from 'sonner';
import { formatDate } from '@/lib/formatters';

const ReferralsDetail = () => {
    const [copied, setCopied] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();

    // Fetch stats
    const { data: stats, isLoading: isLoadingStats } = useQuery({
        queryKey: ['referrals-stats'],
        queryFn: () => referralService.getStats(),
    });

    // Fetch referral link
    const { data: referralLinkData, isLoading: isLoadingLink } = useQuery({
        queryKey: ['referrals-link'],
        queryFn: () => referralService.getReferralLink(),
    });

    // Fetch bank accounts
    const { data: bankAccounts = [], isLoading: isLoadingBankAccounts } = useQuery({
        queryKey: ['referrals-bank-accounts'],
        queryFn: () => referralService.getBankAccounts(),
    });

    // Fetch payouts
    const { data: payoutsData, isLoading: isLoadingPayouts } = useQuery({
        queryKey: ['referrals-payouts'],
        queryFn: () => referralService.getPayouts(),
    });

    const createBankAccountMutation = useMutation({
        mutationFn: (data: CreateBankAccountRequest) => referralService.createBankAccount(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['referrals-bank-accounts'] });
            setIsModalOpen(false);
            toast.success('Bank account added successfully');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to add bank account';
            toast.error(message);
        },
    });

    const requestPayoutMutation = useMutation({
        mutationFn: (data: RequestPayoutRequest) => referralService.requestPayout(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['referrals-payouts'] });
            queryClient.invalidateQueries({ queryKey: ['referrals-stats'] });
            toast.success('Payout request submitted successfully');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to request payout';
            toast.error(message);
        },
    });

    const loading = isLoadingStats || isLoadingLink || isLoadingBankAccounts || isLoadingPayouts;

    const payoutColumns = useMemo<MRT_ColumnDef<ReferralPayout>[]>(
        () => [
            {
                accessorKey: 'created_at',
                header: 'Date',
                size: 150,
                Cell: ({ cell }) => formatDate(cell.getValue<string>()),
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                size: 120,
                Cell: ({ cell }) => `$${Number(cell.getValue<number>()).toFixed(2)}`,
            },
            {
                accessorKey: 'bank_account',
                header: 'Bank',
                size: 150,
                Cell: ({ row }) => {
                    const bankAccount = (row.original as ReferralPayout).bank_account;
                    return bankAccount?.bank_name || 'N/A';
                },
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 120,
                Cell: ({ cell }) => {
                    const status = cell.getValue<string>();
                    return status.charAt(0).toUpperCase() + status.slice(1);
                },
            },
        ],
        []
    );

    const payoutTable = useMaterialReactTable({
        columns: payoutColumns,
        data: payoutsData?.data || [],
        enableRowSelection: false,
        enableColumnActions: true,
        enableColumnFilters: true,
        enableSorting: true,
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        enableHiding: true,
        enableGlobalFilter: true,
        globalFilterFn: 'contains',
        onGlobalFilterChange: setGlobalFilter,
        state: {
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0,
            },
            showColumnFilters: false,
        },
        columnFilterModeOptions: ['contains', 'equals', 'startsWith', 'endsWith'],
        defaultColumn: {
            filterFn: 'contains',
        },
        enableBottomToolbar: (payoutsData?.data || []).length > 0,
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
            },
        },
        muiTableHeadCellProps: {
            sx: {
                fontWeight: 600,
                fontSize: '0.875rem',
            },
        },
        muiTableBodyCellProps: {
            sx: {
                fontSize: '0.875rem',
            },
        },
    });

    const handleCopyLink = () => {
        if (referralLinkData?.referral_link) {
            navigator.clipboard.writeText(referralLinkData.referral_link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success('Referral link copied!');
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveBankAccount = (data: any) => {
        // Map modal data to backend format
        const bankAccountData: CreateBankAccountRequest = {
            account_holder_name: data.fullAccountName,
            account_number: data.accountNumber,
            bank_name: data.bankName,
            country: data.country,
            is_primary: bankAccounts.length === 0, // Set as primary if it's the first account
        };
        createBankAccountMutation.mutate(bankAccountData);
    };

    const handleRequestPayout = () => {
        const primaryBankAccount = bankAccounts.find(acc => acc.is_primary) || bankAccounts[0];
        if (!primaryBankAccount) {
            toast.error('Please add a bank account first');
            setIsModalOpen(true);
            return;
        }

        if (!stats || stats.pending_earnings <= 0) {
            toast.error('No pending earnings available');
            return;
        }

        requestPayoutMutation.mutate({
            amount: stats.pending_earnings,
            bank_account_id: primaryBankAccount.id,
        });
    };

    const statsCards = useMemo(() => {
        if (!stats) return [];

        return [
            {
                id: 'usersReferred',
                label: 'Users referred',
                value: stats.users_referred,
                imageUrl: 'https://app.privatily.com/assets/img/affiliate/icone-annonce.png',
            },
            {
                id: 'paidUsers',
                label: 'Paid users',
                value: stats.paid_users,
                imageUrl: 'https://app.privatily.com/assets/img/affiliate/icone-users.png',
            },
            {
                id: 'referralEarnings',
                label: 'Referral earnings',
                value: `$${stats.referral_earnings.toFixed(2)}`,
                imageUrl: 'https://app.privatily.com/assets/img/affiliate/icone-earnings.png',
            },
        ];
    }, [stats]);

    if (loading || !stats || !referralLinkData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-4 py-6 px-8">
            <DashboardHeader
                imageUrl="https://app.privatily.com/assets/img/header-icons/affiliate.png"
                title="Earn $30"
                description="Spread the word and get rewarded for every sale."
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* Left Column - Your Stats */}
                <div className="">
                    <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                        <h2 className="text-sm font-semibold text-foreground mb-2.5">Your stats</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {statsCards.map((stat) => (
                                <div
                                    key={stat.id}
                                    className={`relative rounded-lg px-4 py-5 overflow-hidden bg-foreground/5`}
                                >
                                    <div className="absolute bottom-0 right-2 ">
                                        <img
                                            src={stat.imageUrl}
                                            alt={stat.label}
                                            className="w-36 h-20"
                                        />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-lg font-bold text-accent mb-1">{stat.value}</div>
                                        <div className="text-sm text-foreground font-medium">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Your Link and Your Wallet */}
                <div className="space-y-2">
                    {/* Your Link Card */}
                    <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-foreground mb-2">Your Link</h2>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <img
                                    src="https://app.privatily.com/assets/img/affiliate/link.svg"
                                    alt="Link"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                                />
                                <input
                                    type="text"
                                    value={referralLinkData.referral_link}
                                    readOnly
                                    className="w-full pl-10 pr-4 py-3  bg-foreground/5 rounded-lg text-xs! sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className="absolute right-1 top-1 p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                                    title="Copy link"
                                >
                                    <img src='https://app.privatily.com/assets/img/affiliate/copy.svg' className={`w-5 h-5 ${copied ? 'text-green-600' : 'text-foreground'}`} />
                                </button>
                            </div>
                        </div>
                        {copied && (
                            <p className="text-sm text-green-600 mt-2">Link copied!</p>
                        )}
                    </div>

                    {/* Your Wallet Card */}
                    <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-foreground mb-6">Your Wallet</h2>

                        {/* Balance Section */}
                        <div className="mb-5">
                            <label className="text-sm font-medium text-accent mb-2 block">Balance</label>
                            <div className="flex items-center justify-between">
                                <div className="relative flex-1">
                                    <img
                                        src="https://app.privatily.com/assets/img/affiliate/balance.svg"
                                        alt="Balance"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                                    />
                                    <input
                                        type="text"
                                        value={`$${stats.pending_earnings.toFixed(2)}`}
                                        readOnly
                                        className="w-full pl-10 pr-4 py-3  bg-foreground/5 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                                    />
                                    <Button
                                        onClick={handleRequestPayout}
                                        disabled={stats.pending_earnings === 0 || requestPayoutMutation.isPending}
                                        className={`absolute right-1 top-1 text-xs! sm:text-sm rounded-sm bg-foreground/5 border border-foreground ${stats.pending_earnings === 0 ? " text-gray-500 cursor-not-allowed" : "bg-purple hover:bg-purple-dark text-white"}`}
                                    >
                                        {requestPayoutMutation.isPending ? 'Processing...' : 'Pay out'}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Bank Account Section */}
                        <div>
                            <label className="text-sm font-medium text-accent mb-2 block">Bank account</label>
                            <div className="flex items-center justify-between">
                                <div className="relative flex-1">
                                    <img
                                        src="https://app.privatily.com/assets/img/affiliate/bank.svg"
                                        alt="Bank account"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                                    />
                                    <input
                                        type="text"
                                        value={bankAccounts.length > 0 ? `${bankAccounts[0].bank_name} - ${bankAccounts[0].account_number.slice(-4)}` : 'Add your bank account'}
                                        readOnly
                                        disabled
                                        className="w-full pl-10 pr-4 py-3 bg-foreground/5 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                                    />
                                    <Button 
                                        onClick={handleOpenModal}
                                        className="absolute right-1 top-1 text-xs! sm:text-sm px-6 rounded-sm bg-purple hover:bg-purple-dark text-white"
                                    >
                                        {bankAccounts.length === 0 ? 'Add' : 'Edit'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Your Payouts Table */}
            <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                <h2 className="text-sm font-bold text-foreground mb-4">Your payouts</h2>
                <MaterialReactTable table={payoutTable} />
            </div>

            {/* Chat Icon */}
            {/* <div className="fixed bottom-6 right-6 z-50">
                <button className="w-14 h-14 bg-purple hover:bg-purple-dark rounded-full flex items-center justify-center shadow-lg transition-colors">
                    <HiChatBubbleLeftRight className="w-6 h-6 text-white" />
                </button>
            </div> */}

            {/* Add Bank Account Modal */}
            <AddBankAccountModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveBankAccount}
            />
        </div>
    );
};

export default ReferralsDetail;
