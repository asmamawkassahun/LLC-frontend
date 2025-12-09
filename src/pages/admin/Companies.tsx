import { useQuery } from '@tanstack/react-query';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Upload, Download, MoreVertical } from 'lucide-react';

const AdminCompaniesPage = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [uploadingCompanyId, setUploadingCompanyId] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ['admin-companies', page, perPage],
    queryFn: async () => {
      const params: any = { per_page: perPage, page };
      const response = await adminApiClient.get('/admin/companies', { params });
      return response.data;
    },
  });

  const handleFileUpload = async (companyId: string, file: File) => {
    if (!file) return;

    setUploadingCompanyId(companyId);
    try {
      const formData = new FormData();
      formData.append('file', file);

      await adminApiClient.post(`/admin/companies/${companyId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('File uploaded successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploadingCompanyId(null);
      // Reset file input
      if (fileInputRefs.current[companyId]) {
        fileInputRefs.current[companyId]!.value = '';
      }
    }
  };

  const handleFileSelect = (companyId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(companyId, file);
    }
  };

  const handleDownloadSummary = async (companyId: string) => {
    try {
      const response = await adminApiClient.get(`/admin/companies/${companyId}/download-summary`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (response.status >= 200 && response.status < 300) {
        const contentType = response.headers['content-type'] || '';
        if (!contentType.includes('application/pdf')) {
          const text = await response.data.text();
          try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.message || 'Failed to download company summary');
          } catch (parseError) {
            throw new Error('Invalid response from server');
          }
        }

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `company-summary-${companyId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('Company summary downloaded successfully');
      } else {
        throw new Error('Failed to download company summary');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to download company summary');
    }
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value));
    setPage(1);
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
          <CardTitle>All Companies</CardTitle>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((company: any) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        {company.name} ({company.type})
                      </TableCell>
                      <TableCell>{company.status_label || company.status}</TableCell>
                      <TableCell>{formatDate(company.created_at)}</TableCell>
                      <TableCell>
                        <input
                          ref={(el) => {
                            fileInputRefs.current[company.id] = el;
                          }}
                          type="file"
                          id={`file-upload-${company.id}`}
                          className="hidden"
                          onChange={(e) => handleFileSelect(company.id, e)}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          disabled={uploadingCompanyId === company.id}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 bg-accent hover:bg-accent/90 border-none cursor-pointer">
                              <MoreVertical className="h-4 w-4 text-white" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => fileInputRefs.current[company.id]?.click()}
                              disabled={uploadingCompanyId === company.id}
                            >
                              <Upload className="mr-2 h-4 w-4 hover:text-white" />
                              {uploadingCompanyId === company.id ? 'Uploading...' : 'Upload File'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDownloadSummary(company.id)}
                            >
                              <Download className="mr-2 h-4 w-4 hover:text-white" />
                              Download Summary
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

