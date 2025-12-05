import { useState, useEffect } from 'react';
import DashboardHeader from "./DashboardHeader";
import { Button } from "@/components/ui";
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import { useMemo } from 'react';
import axios from 'axios';
import AddBankAccountModal from '@/components/modal/AddBankAccountModal';

interface Payout {
    id: string;
    date: string;
    amount: string;
    method: string;
    status: string;
}

interface ReferralsData {
    stats: {
        usersReferred: number;
        paidUsers: number;
        referralEarnings: number;
    };
    wallet: {
        balance: number;
        bankAccount: string | null;
    };
    referralLink: string;
    payouts: Payout[];
}

const ReferralsDetail = () => {
    const [referralsData, setReferralsData] = useState<ReferralsData | null>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchReferralsData = async () => {
            try {
                const response = await axios.get<ReferralsData>('/data/referrals.json');
                setReferralsData(response.data);
            } catch (error) {
                console.error('Error fetching referrals data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReferralsData();
    }, []);

    const payoutColumns = useMemo<MRT_ColumnDef<Payout>[]>(
        () => [
            {
                accessorKey: 'date',
                header: 'Date',
                size: 150,
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                size: 120,
            },
            {
                accessorKey: 'method',
                header: 'Method',
                size: 150,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 120,
            },
        ],
        []
    );

    const payoutTable = useMaterialReactTable({
        columns: payoutColumns,
        data: referralsData?.payouts || [],
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
        enableBottomToolbar: (referralsData?.payouts || []).length > 0,
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
        if (referralsData?.referralLink) {
            navigator.clipboard.writeText(referralsData.referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveBankAccount = (data: any) => {
        // Save bank account data
        console.log('Saving bank account:', data);
        // TODO: Implement actual save logic
    };

    const statsCards = useMemo(() => {
        if (!referralsData) return [];

        return [
            {
                id: 'usersReferred',
                label: 'Users referred',
                value: referralsData.stats.usersReferred,
                imageUrl: 'https://app.privatily.com/assets/img/affiliate/icone-annonce.png',
            },
            {
                id: 'paidUsers',
                label: 'Paid users',
                value: referralsData.stats.paidUsers,
                imageUrl: 'https://app.privatily.com/assets/img/affiliate/icone-users.png',
            },
            {
                id: 'referralEarnings',
                label: 'Referral earnings',
                value: `$${referralsData.stats.referralEarnings.toFixed(2)}`,
                imageUrl: 'https://app.privatily.com/assets/img/affiliate/icone-earnings.png',
            },
        ];
    }, [referralsData]);

    if (loading || !referralsData) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
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
                                    value={referralsData.referralLink}
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
                                        value={`$${referralsData.wallet.balance}`}
                                        readOnly
                                        className="w-full pl-10 pr-4 py-3  bg-foreground/5 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                                    />
                                    {/* <span className="text-2xl font-bold text-foreground">${referralsData.wallet.balance}</span> */}
                                    <Button
                                        // disabled={referralsData.wallet.balance === 0}
                                        className={`absolute right-1 top-1 text-xs! sm:text-sm rounded-sm bg-foreground/5 border border-foreground ${referralsData.wallet.balance === 0 ? " text-gray-500 cursor-not-allowed" : "bg-purple hover:bg-purple-dark text-white"}`}
                                    >
                                        Pay out
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
                                        value={referralsData.wallet.bankAccount || 'Add your bank account'}
                                        readOnly
                                        className="w-full pl-10 pr-4 py-3 bg-foreground/5 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                                    />
                                    <Button 
                                        onClick={handleOpenModal}
                                        className="absolute right-1 top-1 text-xs! sm:text-sm px-6 rounded-sm bg-purple hover:bg-purple-dark text-white"
                                    >
                                        {!referralsData.wallet.bankAccount ? 'Edit' : 'Add'}
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
