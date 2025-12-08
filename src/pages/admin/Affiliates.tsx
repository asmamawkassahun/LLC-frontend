import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { toast } from 'sonner';

const AdminAffiliatesPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-affiliates'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/affiliates');
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await adminApiClient.put(`/admin/affiliates/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-affiliates'] });
      toast.success('Affiliate status updated');
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Affiliates</h1>
        <p className="text-muted-foreground">Manage affiliates and commissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Affiliates</CardTitle>
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
                  <TableHead>User</TableHead>
                  <TableHead>Referral Code</TableHead>
                  <TableHead>Commission Rate</TableHead>
                  <TableHead>Total Earnings</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((affiliate: any) => (
                  <TableRow key={affiliate.id}>
                    <TableCell className="font-medium">{affiliate.user?.name || 'N/A'}</TableCell>
                    <TableCell>{affiliate.referral_code}</TableCell>
                    <TableCell>{affiliate.commission_rate}%</TableCell>
                    <TableCell>{formatCurrency(affiliate.total_earnings)}</TableCell>
                    <TableCell>{formatCurrency(affiliate.pending_earnings)}</TableCell>
                    <TableCell>{affiliate.status?.value || affiliate.status}</TableCell>
                    <TableCell>{affiliate.joined_at ? formatDate(affiliate.joined_at) : 'N/A'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateStatusMutation.mutate({
                          id: affiliate.id,
                          status: affiliate.status?.value === 'approved' ? 'suspended' : 'approved'
                        })}
                      >
                        {affiliate.status?.value === 'approved' ? 'Suspend' : 'Approve'}
                      </Button>
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

export default AdminAffiliatesPage;

