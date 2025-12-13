import { useQuery } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/formatters';

const AffiliatesList = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-affiliates'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/affiliates');
      return response.data;
    },
  });

  return (
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
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Referral Code</TableHead>
                <TableHead>Commission Rate</TableHead>
                <TableHead>Total Earnings</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.map((affiliate: any) => (
                <TableRow key={affiliate.id}>
                  <TableCell className="font-medium">{affiliate.id}</TableCell>
                  <TableCell className="font-medium">{affiliate.user?.name || 'N/A'}</TableCell>
                  <TableCell>{affiliate.referral_code}</TableCell>
                  <TableCell>{affiliate.commission_rate}%</TableCell>
                  <TableCell>{formatCurrency(affiliate.total_earnings)}</TableCell>
                  <TableCell>{formatCurrency(affiliate.pending_earnings)}</TableCell>
                  <TableCell>{affiliate.status?.value || affiliate.status}</TableCell>
                  <TableCell>{affiliate.joined_at ? formatDate(affiliate.joined_at) : 'N/A'}</TableCell>
                </TableRow>
              ))}
              {data?.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No affiliates found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AffiliatesList;

