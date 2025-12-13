import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/formatters';
import { toast } from 'sonner';

const AdminSupportPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-support-tickets'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/support/tickets');
      return response.data;
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async (id: string) => {
      await adminApiClient.post(`/admin/support/tickets/${id}/resolve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] });
      toast.success('Ticket resolved');
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <p className="text-muted-foreground">Manage support tickets</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table className='min-w-[860px]!'>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket Number</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((ticket: any) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.ticket_number}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{ticket.user?.name || 'N/A'}</TableCell>
                    <TableCell>{ticket.priority_label || ticket.priority}</TableCell>
                    <TableCell>{ticket.status_label || ticket.status}</TableCell>
                    <TableCell>{formatDate(ticket.created_at)}</TableCell>
                    <TableCell>
                      {ticket.status !== 'resolved' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => resolveMutation.mutate(ticket.id)}
                        >
                          Resolve
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

export default AdminSupportPage;

