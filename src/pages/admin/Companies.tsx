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
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdminCompaniesPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ['admin-companies', statusFilter, page, perPage],
    queryFn: async () => {
      const params: any = { per_page: perPage, page };
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

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1); // Reset to first page when filter changes
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value));
    setPage(1); // Reset to first page when per_page changes
  };

  const currentPage = data?.current_page || 1;
  const lastPage = data?.last_page || 1;
  const total = data?.total || 0;
  const from = total > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const to = Math.min(currentPage * perPage, total);

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
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
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
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">Error loading companies</p>
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No companies found</p>
            </div>
          ) : (
            <>
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
                  {data.data.map((company: any) => (
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
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {from} to {to} of {total} companies
                </div>
                <div className="flex items-center gap-2">
                  <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                      <SelectItem value="100">100 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {lastPage}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
                    disabled={currentPage === lastPage || isLoading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCompaniesPage;

