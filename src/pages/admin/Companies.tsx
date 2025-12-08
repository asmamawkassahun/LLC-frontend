import { useQuery } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';

const AdminCompaniesPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-companies', statusFilter, page],
    queryFn: async () => {
      const params: any = { per_page: 20, page };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const response = await adminApiClient.get('/admin/companies', { params });
      return response.data;
    },
  });

  const handleStatusUpdate = async (companyId: string, newStatus: string) => {
    try {
      await adminApiClient.put(`/admin/companies/${companyId}/status`, { status: newStatus });
      toast.success('Company status updated');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update company status');
    }
  };

  const handleApprove = async (companyId: string) => {
    try {
      await adminApiClient.post(`/admin/companies/${companyId}/approve`);
      toast.success('Company approved');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve company');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Companies</h1>
        <p className="text-muted-foreground">Manage all companies</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Companies</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="formed">Formed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registration Number</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((company: any) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.type_label || company.type}</TableCell>
                    <TableCell>{company.status_label || company.status}</TableCell>
                    <TableCell>{company.registration_number || 'N/A'}</TableCell>
                    <TableCell>{formatDate(company.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Select
                          value={company.status}
                          onValueChange={(value) => handleStatusUpdate(company.id, value)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="formed">Formed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        {company.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(company.id)}
                          >
                            Approve
                          </Button>
                        )}
                      </div>
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

export default AdminCompaniesPage;

