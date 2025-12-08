import { useQuery } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateTime } from '@/lib/formatters';

const AdminActivityLogsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-activity-logs'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/activity-logs', { params: { per_page: 20 } });
      return response.data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activity Logs</h1>
        <p className="text-muted-foreground">View system activity logs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Activity Logs</CardTitle>
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
                  <TableHead>Action</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.user?.name || 'System'}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.model_type}</TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell>{formatDateTime(log.created_at)}</TableCell>
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

export default AdminActivityLogsPage;

