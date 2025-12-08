import { useQuery } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { toast } from 'sonner';

const AdminPaymentsPage = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/payments', { params: { per_page: 20 } });
      return response.data;
    },
  });

  const handleRefund = async (paymentId: string) => {
    if (!confirm('Are you sure you want to refund this payment?')) return;
    
    try {
      await adminApiClient.post(`/admin/payments/${paymentId}/refund`);
      toast.success('Refund processed');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to process refund');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">Manage all payments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Payments</CardTitle>
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
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((payment: any) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.transaction_id || 'N/A'}</TableCell>
                    <TableCell>#{payment.order?.order_number || 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{payment.payment_method || 'N/A'}</TableCell>
                    <TableCell>{payment.status_label || payment.status}</TableCell>
                    <TableCell>{formatDate(payment.created_at)}</TableCell>
                    <TableCell>
                      {payment.status === 'paid' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRefund(payment.id)}
                        >
                          Refund
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPaymentsPage;

