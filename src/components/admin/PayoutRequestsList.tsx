import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

const PayoutRequestsList = () => {
  const queryClient = useQueryClient();
  const [selectedPayout, setSelectedPayout] = useState<any>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payouts'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/payouts');
      return response.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      await adminApiClient.post(`/admin/payouts/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
      toast.success('Payout approved successfully');
      setApproveDialogOpen(false);
      setSelectedPayout(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to approve payout');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      await adminApiClient.post(`/admin/payouts/${id}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
      toast.success('Payout rejected successfully');
      setRejectDialogOpen(false);
      setSelectedPayout(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to reject payout');
    },
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      processing: { variant: 'default', label: 'Processing' },
      completed: { variant: 'default', label: 'Completed' },
      failed: { variant: 'destructive', label: 'Failed' },
    };

    const statusInfo = statusMap[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const handleApprove = (payout: any) => {
    setSelectedPayout(payout);
    setApproveDialogOpen(true);
  };

  const handleReject = (payout: any) => {
    setSelectedPayout(payout);
    setRejectDialogOpen(true);
  };

  const confirmApprove = () => {
    if (selectedPayout) {
      approveMutation.mutate(selectedPayout.id);
    }
  };

  const confirmReject = () => {
    if (selectedPayout) {
      rejectMutation.mutate(selectedPayout.id);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Payout Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Affiliate ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Bank Name</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((payout: any) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">{payout.id}</TableCell>
                    <TableCell>{payout.affiliate_id}</TableCell>
                    <TableCell className="font-medium">
                      {payout.affiliate?.user?.name || 'N/A'}
                    </TableCell>
                    <TableCell>{formatCurrency(payout.amount)}</TableCell>
                    <TableCell>{payout.bank_account?.bank_name || 'N/A'}</TableCell>
                    <TableCell>
                      {payout.bank_account?.account_number 
                        ? `${payout.bank_account.account_number}` 
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{getStatusBadge(payout.status)}</TableCell>
                    <TableCell>
                      {payout.created_at ? formatDate(payout.created_at) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {payout.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(payout)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(payout)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {payout.status !== 'pending' && (
                        <span className="text-muted-foreground text-sm">No actions</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {data?.data?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No payout requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Payout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this payout request?
              <br />
              <br />
              <strong>Amount:</strong> {selectedPayout && formatCurrency(selectedPayout.amount)}
              <br />
              <strong>Affiliate:</strong> {selectedPayout?.affiliate?.user?.name || 'N/A'}
              <br />
              <strong>Bank:</strong> {selectedPayout?.bank_account?.bank_name || 'N/A'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApprove}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? 'Approving...' : 'Approve'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Payout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this payout request? The amount will be returned to the affiliate's pending earnings.
              <br />
              <br />
              <strong>Amount:</strong> {selectedPayout && formatCurrency(selectedPayout.amount)}
              <br />
              <strong>Affiliate:</strong> {selectedPayout?.affiliate?.user?.name || 'N/A'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReject}
              disabled={rejectMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PayoutRequestsList;

