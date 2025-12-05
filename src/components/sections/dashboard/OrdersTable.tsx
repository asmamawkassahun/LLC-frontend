import { useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import { TextField, Button as MuiButton, Menu, MenuItem, IconButton, Chip, useMediaQuery, useTheme } from '@mui/material';
import Tooltip from '@/components/order/Tooltip';
import { HiInformationCircle } from 'react-icons/hi';
import { HiHome } from 'react-icons/hi';
import { FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { Edit as EditIcon, Download as DownloadIcon, Home as HomeIcon, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { HiCheckCircle } from 'react-icons/hi';

export interface Order {
    id: string;
    item: string;
    orderNumber: string;
    planType: string;
    price: number;
    status: string;
    updatedAt: string;
    isPrimary: boolean;
    paymentStatus?: string; // Add payment status
}

interface OrdersTableProps {
    data: Order[];
    onPay: (id: string) => void;
    onUpdate: (id: string) => void;
    onDownload: (id: string) => void;
    onSetPrimary: (id: string) => void;
    onDelete: (id: string) => void;
    onNewOrder?: () => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSize?: number;
    processingPaymentId?: string | null; // Add processing state
}

interface ActionCellProps {
    row: { original: Order };
    onPay: (id: string) => void;
    onUpdate: (id: string) => void;
    onDownload: (id: string) => void;
    onSetPrimary: (id: string) => void;
    onDelete: (id: string) => void;
    isProcessing?: boolean; // Add loading state
}

const ActionCell = ({ row, onPay, onUpdate, onDownload, onSetPrimary, onDelete, isProcessing }: ActionCellProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    
    // Check if payment is already paid
    const isPaid = row.original.paymentStatus === 'paid' || row.original.paymentStatus === 'Paid';

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Only show Pay button if not paid */}
            {!isPaid && (
                <MuiButton
                    variant="contained"
                    size="small"
                    onClick={() => onPay(row.original.id)}
                    disabled={isProcessing}
                    sx={{
                        backgroundColor: '#9333ea',
                        color: 'white',
                        fontSize: '0.75rem',
                        padding: '4px 12px',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#7e22ce',
                        },
                        '&:disabled': {
                            backgroundColor: '#a78bfa',
                            opacity: 0.6,
                        },
                    }}
                >
                    {isProcessing ? 'Processing...' : 'Pay'}
                </MuiButton>
            )}
            <MuiButton
                variant="contained"
                size="small"
                onClick={handleClick}
                sx={{ 
                    backgroundColor: '#9333ea',
                    color: 'white',
                    fontSize: '0.75rem',
                    padding: '4px 12px',
                    textTransform: 'none', 
                    borderRadius: '4px',
                    '&:hover': {
                        backgroundColor: '#7e22ce',
                    },
                }}
            >
                <FiMoreVertical style={{ width: '16px', height: '22px' }} />
            </MuiButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem
                    onClick={() => {
                        onUpdate(row.original.id);
                        handleClose();
                    }}
                >
                    <EditIcon sx={{ fontSize: '16px', mr: 1 }} />
                    Update order
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onDownload(row.original.id);
                        handleClose();
                    }}
                >
                    <DownloadIcon sx={{ fontSize: '16px', mr: 1 }} />
                    Download summary
                </MenuItem>
                {!row.original.isPrimary && (
                <MenuItem
                    onClick={() => {
                        onSetPrimary(row.original.id);
                        handleClose();
                    }}
                >
                    <HomeIcon sx={{ fontSize: '16px', mr: 1 }} />
                    Set as primary
                </MenuItem>
                )}
            </Menu>
            <IconButton
                size="small"
                onClick={() => onDelete(row.original.id)}
                sx={{
                    padding: '7px',
                    color: '#dc2626',
                    borderRadius: '4px',
                    boxShadow: 'rgba(0, 0, 0, 0.4) -0.5px 1.5px 3px 0px',
                    backgroundColor: '#FF3838',
                    '&:hover': {
                        backgroundColor: '#FF3838',
                        boxShadow: 'rgba(0, 0, 0, 0.3) -0.5px 2px 3px 0px',
                    },
                }}
            >
                <FiTrash2 style={{ width: '16px', height: '16px', color: '#ffffff' }} />
            </IconButton>
        </div>
    );
};

const OrdersTable = ({ 
    data, 
    onPay, 
    onUpdate, 
    onDownload, 
    onSetPrimary, 
    onDelete,
    onNewOrder,
    onPageSizeChange,
    pageSize: externalPageSize,
    processingPaymentId
}: OrdersTableProps) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const columns = useMemo<MRT_ColumnDef<Order>[]>(
        () => [
            {
                accessorKey: 'item',
                header: 'Item',
                size: 200,
                Cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        {row.original.isPrimary && (
                            <HiHome className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="font-medium">{row.original.item}</span>
                        <Tooltip content={row.original.planType} position="top" width="w-40">
                            <HiInformationCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        </Tooltip>
                    </div>
                ),
            },
            {
                accessorKey: 'orderNumber',
                header: 'Order number',
                size: 150,
            },
            {
                accessorKey: 'price',
                header: 'Price',
                size: 120,
                Cell: ({ row }) => (
                    <span className="font-medium">${row.original.price}</span>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 120,
                Cell: ({ row }) => {
                    const paymentStatus = row.original.paymentStatus?.toLowerCase() || '';
                    const isPaid = paymentStatus === 'paid';
                    const isPending = paymentStatus === 'pending';
                    const isFailed = paymentStatus === 'failed';
                    const isRefunded = paymentStatus === 'refunded';

                    // Determine chip styling based on payment status
                    let chipStyle = {
                        backgroundColor: '#fee2e2', // Default red for unpaid
                        color: '#991b1b',
                        border: '1px solid #dc2626',
                    };

                    if (isPaid) {
                        chipStyle = {
                            backgroundColor: '#628141', // Green background
                            color: '#ffffff', // Dark green text
                            border: '1px solid #22c55e',
                        };
                    } else if (isPending) {
                        chipStyle = {
                            backgroundColor: '#fef3c7', // Yellow/amber background
                            color: '#92400e', // Dark amber text
                            border: '1px solid #f59e0b',
                        };
                    } else if (isFailed) {
                        chipStyle = {
                            backgroundColor: '#fee2e2', // Red background
                            color: '#991b1b', // Dark red text
                            border: '1px solid #dc2626',
                        };
                    } else if (isRefunded) {
                        chipStyle = {
                            backgroundColor: '#f3f4f6', // Gray background
                            color: '#374151', // Dark gray text
                            border: '1px solid #9ca3af',
                        };
                    }

                    return (
                        <Chip
                            icon={isPaid ? <HiCheckCircle style={{ color: '#ffffff', fontSize: '16px' }} /> : undefined}
                            label={row.original.status}
                            size="small"
                            sx={{
                                ...chipStyle,
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                height: '24px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                '& .MuiChip-icon': {
                                    marginLeft: '4px',
                                    marginRight: '-4px',
                                },
                            }}
                        />
                    );
                },
            },
            {
                accessorKey: 'updatedAt',
                header: 'Updated at',
                size: 150,
            },
            {
                id: 'actions',
                header: 'Action',
                size: 200,
                enableSorting: false,
                enableColumnFilter: false,
                enableHiding: false,
                Cell: ({ row }) => (
                    <ActionCell 
                        row={row} 
                        onPay={onPay}
                        onUpdate={onUpdate}
                        onDownload={onDownload}
                        onSetPrimary={onSetPrimary}
                        onDelete={onDelete}
                        isProcessing={processingPaymentId === row.original.id} // Pass processing state
                    />
                ),
            },
        ],
        [onPay, onUpdate, onDownload, onSetPrimary, onDelete, processingPaymentId]
    );

    const table = useMaterialReactTable({
        columns,
        data,
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
                pageSize: externalPageSize || 10,
                pageIndex: 0,
            },
            showColumnFilters: false,
        },
        columnFilterModeOptions: ['contains', 'equals', 'startsWith', 'endsWith'],
        defaultColumn: {
            filterFn: 'contains',
        },
        muiTableContainerProps: {
            sx: {
                maxHeight: 'none',
                bgcolor: 'black'
            },
        },
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
                overflow: 'visible',
                position: 'relative',
            },
        },
        muiTableBodyRowProps: {
            sx: {
                '&:hover': {
                    backgroundColor: '#f9fafb',
                },
            },
        },
        renderTopToolbarCustomActions: () => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', marginBottom: '16px', paddingTop: '12px' }}>
                {onNewOrder && (
                    <MuiButton
                        variant="contained"
                        startIcon={<IoMdAddCircleOutline style={{ width: '16px', height: '16px' }} />}
                        onClick={onNewOrder}
                        sx={{
                            backgroundColor: '#9333ea',
                            color: 'white',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#7e22ce',
                            },
                        }}
                    >
                        New order
                    </MuiButton>
                )}
            </div>
        ),
        renderBottomToolbar: ({ table }) => {
            const startRow = table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1;
            const endRow = Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
            );
            const totalRows = table.getFilteredRowModel().rows.length;
            
            return (
                <div style={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center', 
                    justifyContent: 'space-between', 
                    width: '100%', 
                    padding: '12px 16px',
                    borderTop: '1px solid #e5e7eb',
                    gap: isMobile ? '12px' : '0',
                }}>
                    {isMobile ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280', flex: 1 }}>
                                    Showing {startRow} to {endRow} of {totalRows} orders
                                </div>
                                <TextField
                                    select
                                    size="small"
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => {
                                        const newPageSize = Number(e.target.value);
                                        table.setPageSize(newPageSize);
                                        onPageSizeChange?.(newPageSize);
                                    }}
                                    sx={{
                                        minWidth: '80px',
                                        '& .MuiOutlinedInput-root': {
                                            fontSize: '0.875rem',
                                        },
                                    }}
                                >
                                    {[10, 20, 30, 50].map((pageSize) => (
                                        <MenuItem key={pageSize} value={pageSize}>
                                            {pageSize}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }}>
                                <MuiButton
                                    variant="outlined"
                                    size="small"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    sx={{ 
                                        textTransform: 'none', 
                                        fontSize: '0.875rem',
                                        minWidth: '40px',
                                        padding: '8px',
                                    }}
                                >
                                    <ChevronLeft />
                                </MuiButton>
                                <MuiButton
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        backgroundColor: '#9333ea',
                                        color: 'white',
                                        textTransform: 'none',
                                        fontSize: '0.875rem',
                                        minWidth: '40px',
                                        '&:hover': {
                                            backgroundColor: '#7e22ce',
                                        },
                                    }}
                                >
                                    {table.getState().pagination.pageIndex + 1}
                                </MuiButton>
                                <MuiButton
                                    variant="outlined"
                                    size="small"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    sx={{ 
                                        textTransform: 'none', 
                                        fontSize: '0.875rem',
                                        minWidth: '40px',
                                        padding: '8px',
                                    }}
                                >
                                    <ChevronRight />
                                </MuiButton>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                Showing {startRow} to {endRow} of {totalRows} orders
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Orders per page</span>
                                <TextField
                                    select
                                    size="small"
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => {
                                        const newPageSize = Number(e.target.value);
                                        table.setPageSize(newPageSize);
                                        onPageSizeChange?.(newPageSize);
                                    }}
                                    sx={{
                                        minWidth: '80px',
                                        '& .MuiOutlinedInput-root': {
                                            fontSize: '0.875rem',
                                        },
                                    }}
                                >
                                    {[10, 20, 30, 50].map((pageSize) => (
                                        <MenuItem key={pageSize} value={pageSize}>
                                            {pageSize}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MuiButton
                                    variant="outlined"
                                    size="small"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    sx={{ 
                                        textTransform: 'none', 
                                        fontSize: '0.875rem',
                                        padding: '6px 16px',
                                    }}
                                >
                                    Previous
                                </MuiButton>
                                <MuiButton
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        backgroundColor: '#9333ea',
                                        color: 'white',
                                        textTransform: 'none',
                                        fontSize: '0.875rem',
                                        minWidth: '40px',
                                        '&:hover': {
                                            backgroundColor: '#7e22ce',
                                        },
                                    }}
                                >
                                    {table.getState().pagination.pageIndex + 1}
                                </MuiButton>
                                <MuiButton
                                    variant="outlined"
                                    size="small"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    sx={{ 
                                        textTransform: 'none', 
                                        fontSize: '0.875rem',
                                        padding: '6px 16px',
                                    }}
                                >
                                    Next
                                </MuiButton>
                            </div>
                        </>
                    )}
                </div>
            );
        },
    });

    return <MaterialReactTable table={table} />;
};

export default OrdersTable;

