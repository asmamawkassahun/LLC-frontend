import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import echo from '@/lib/echo';
import adminAuthService from '@/services/adminAuthService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import adminSupportService from '@/services/adminSupportService';
import adminApiClient from '@/utils/api-helpers/adminApiClient';
import { toast } from 'sonner';
import type { SupportTicket, ReplyTicketRequest } from '@/types/SupportTicket';
import { MessageSquare, Clock, CheckCircle2, XCircle, AlertCircle, UserCheck, Send, Paperclip, X, Download, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AdminHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
}

const AdminHelpDialog = ({ open, onOpenChange }: AdminHelpDialogProps) => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const [filePreviewList, setFilePreviewList] = useState<Array<{file: File, id: string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentAdminId, setCurrentAdminId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Get current admin ID
  useEffect(() => {
    if (open && adminAuthService.isAuthenticated()) {
      adminAuthService.me()
        .then(admin => setCurrentAdminId(admin.id))
        .catch(() => setCurrentAdminId(null));
    }
  }, [open]);

  // Reset view when dialog opens/closes
  useEffect(() => {
    if (open) {
      setView('list');
      setSelectedTicket(null);
      setReplyMessage('');
      setIsInternal(false);
      setAssignedTo('');
      setReplyFiles([]);
      setFilePreviewList([]);
    }
  }, [open]);

  // Real-time message listener for admins
  useEffect(() => {
    if (!open || !currentAdminId || !adminAuthService.isAuthenticated()) {
      return;
    }

    // Update Echo auth token for admin - this must be done before subscribing
    const token = adminAuthService.getAccessToken();
    if (!token) {
      console.error('No admin token found');
      return;
    }

    // Check if user token exists and log a warning if it does
    const userToken = localStorage.getItem('access_token');
    if (userToken) {
      console.warn('User token also exists in localStorage - this may cause conflicts', {
        userTokenPrefix: userToken.substring(0, 15) + '...',
        adminTokenPrefix: token.substring(0, 15) + '...',
        tokensMatch: userToken === token
      });
    }

    console.log('Admin token found, updating Echo config', { 
      tokenPrefix: token.substring(0, 20) + '...',
      tokenLength: token.length,
      adminTokenStored: !!localStorage.getItem('admin_access_token'),
      userTokenStored: !!localStorage.getItem('access_token')
    });

    // Update Echo config with admin token - must be done before any channel subscription
    // CRITICAL: We need to update the auth headers BEFORE calling echo.private()
    if (echo.connector && echo.connector.pusher && echo.connector.pusher.config) {
      const config = echo.connector.pusher.config as any;
      if (!config.auth) {
        config.auth = {};
      }
      
      // CRITICAL: Completely replace auth headers with admin token
      // We need to delete the old headers first to ensure no user token remains
      delete config.auth.headers;
      config.auth.headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      };
      
      // CRITICAL: Intercept both fetch AND XMLHttpRequest for broadcasting/auth endpoint
      // Pusher.js might use XMLHttpRequest instead of fetch
      const originalFetch = window.fetch;
      const OriginalXHR = window.XMLHttpRequest;
      
      // Store originals for cleanup
      (window as any).__originalFetch = originalFetch;
      (window as any).__originalXHR = OriginalXHR;
      
      // Intercept fetch
      window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;
        
        // If this is a request to the broadcasting auth endpoint, use admin token
        if (url.includes('/broadcasting/auth')) {
          const adminToken = adminAuthService.getAccessToken();
          if (adminToken) {
            console.log('🔐 Intercepting fetch to broadcasting/auth - using admin token', {
              url,
              tokenPrefix: adminToken.substring(0, 20) + '...'
            });
            
            // Override the Authorization header with admin token
            const headers = new Headers(init?.headers);
            headers.set('Authorization', `Bearer ${adminToken}`);
            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'application/json');
            
            return originalFetch(input, {
              ...init,
              headers: headers,
            });
          }
        }
        
        // For all other requests, use original fetch
        return originalFetch(input, init);
      };
      
      // Intercept XMLHttpRequest (Pusher.js likely uses this)
      window.XMLHttpRequest = class extends OriginalXHR {
        private _url: string = '';
        
        open(method: string, url: string | URL, async?: boolean, username?: string | null, password?: string | null): void {
          this._url = typeof url === 'string' ? url : url.toString();
          super.open(method, url, async ?? true, username, password);
        }
        
        setRequestHeader(name: string, value: string): void {
          // If this is a request to broadcasting/auth, override Authorization header
          if (this._url.includes('/broadcasting/auth') && name.toLowerCase() === 'authorization') {
            const adminToken = adminAuthService.getAccessToken();
            if (adminToken) {
              console.log('🔐 Intercepting XMLHttpRequest to broadcasting/auth - using admin token', {
                url: this._url,
                tokenPrefix: adminToken.substring(0, 20) + '...',
                originalHeader: value.substring(0, 20) + '...'
              });
              super.setRequestHeader('Authorization', `Bearer ${adminToken}`);
              return;
            }
          }
          
          super.setRequestHeader(name, value);
        }
      };
      
      console.log('✅ Intercepted both fetch and XMLHttpRequest to use admin token for broadcasting auth');
      
      // Also set authorizer as backup (though fetch interception should handle it)
      const pusher = echo.connector?.pusher as any;
      if (pusher) {
        pusher.authorizer = (channel: string, options: any) => {
          const adminToken = adminAuthService.getAccessToken();
          console.log('🔐 Authorizer called (backup)', { channel, hasToken: !!adminToken });
          return fetch(config.authEndpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              socket_id: options.socketId,
              channel_name: channel,
            }),
          }).then(response => response.json());
        };
      }
      
      // Verify the token was set correctly
      const setToken = config.auth.headers?.Authorization?.replace('Bearer ', '');
      console.log('Updated Echo auth with admin token', {
        tokenSet: !!setToken,
        tokenMatches: setToken === token,
        setTokenPrefix: setToken ? setToken.substring(0, 20) + '...' : 'none',
        expectedTokenPrefix: token.substring(0, 20) + '...',
        hasAuthorizer: !!config.authorizer
      });
    } else {
      console.error('Echo connector or pusher config not found');
      return; // Don't proceed if we can't update the config
    }
    
    // Small delay to ensure config is updated before subscription
    // This is a workaround for Pusher.js timing issues
    const timeoutId = setTimeout(() => {
      // Double-check the token is still set correctly before subscribing
      if (echo.connector && echo.connector.pusher && echo.connector.pusher.config) {
        const config = echo.connector.pusher.config as any;
        const currentToken = config.auth?.headers?.Authorization?.replace('Bearer ', '');
        const expectedToken = adminAuthService.getAccessToken();
        console.log('Before subscription - token check', {
          hasConfig: !!config.auth,
          hasHeaders: !!config.auth?.headers,
          currentTokenPrefix: currentToken ? currentToken.substring(0, 15) + '...' : 'none',
          expectedTokenPrefix: expectedToken ? expectedToken.substring(0, 15) + '...' : 'none',
          tokensMatch: currentToken === expectedToken
        });
        
        // Re-update if token doesn't match (safety check)
        if (currentToken !== expectedToken && expectedToken) {
          console.warn('Token mismatch detected, re-updating...');
          delete config.auth.headers;
          config.auth.headers = {
            Authorization: `Bearer ${expectedToken}`,
            Accept: 'application/json',
          };
          
          // Also re-set the authorizer
          const pusher = echo.connector?.pusher as any;
          if (pusher && pusher.authorizer) {
            console.log('Re-setting authorizer with correct token');
            // The authorizer function already gets the token dynamically, so it should be fine
          }
        }
      }
      
      // Listen for ticket message events on both channels
      const handleMessage = (data: any) => {
        console.log('Admin received ticket message event:', data);
        
        // Update if we're viewing the ticket that received the message
        if (selectedTicket && data.ticket_id === selectedTicket.id) {
          console.log('Updating ticket view for ticket:', data.ticket_id);
          // Refetch the ticket to get the latest messages
          queryClient.invalidateQueries({ queryKey: ['admin-support-ticket', selectedTicket.id] });
          queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] });
        } else if (data.ticket_id) {
          // Also update the tickets list even if not viewing the specific ticket
          // This ensures the list shows updated message counts
          console.log('Updating tickets list for ticket:', data.ticket_id);
          queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] });
        }
      };

      // Subscribe to admin's private channel (for assigned tickets)
      const adminChannel = echo.private(`admin.${currentAdminId}`);
      
      // Subscribe to general admin support channel (for all user replies)
      const adminSupportChannel = echo.private('admin-support');

      // Add error handlers to debug subscription issues
      adminChannel.error((error: any) => {
        console.error('Admin channel subscription error:', error);
        toast.error('Failed to subscribe to admin channel');
      });

      adminSupportChannel.error((error: any) => {
        console.error('Admin support channel subscription error:', error);
        toast.error('Failed to subscribe to admin support channel');
      });

      // Set up listeners - use both subscribed callback and immediate listen
      // The subscribed callback ensures we listen after successful subscription
      const setupAdminChannelListener = () => {
        console.log('Setting up admin channel listener');
        adminChannel.listen('.ticket.message.sent', handleMessage);
      };

      const setupSupportChannelListener = () => {
        console.log('Setting up admin support channel listener');
        adminSupportChannel.listen('.ticket.message.sent', handleMessage);
      };

      // Wait for channels to be subscribed before listening
      adminChannel.subscribed(() => {
        console.log('Admin private channel subscribed successfully');
        setupAdminChannelListener();
      });

      adminSupportChannel.subscribed(() => {
        console.log('Admin support channel subscribed successfully');
        setupSupportChannelListener();
      });

      // Also set up listeners immediately in case channels are already subscribed
      // This handles the case where subscription happens synchronously
      setupAdminChannelListener();
      setupSupportChannelListener();

      // Store channels for cleanup
      (window as any).__adminChannels = {
        adminChannel,
        adminSupportChannel,
        handleMessage,
      };
    }, 100);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);
      
      // Restore original fetch and XMLHttpRequest
      if ((window as any).__originalFetch) {
        window.fetch = (window as any).__originalFetch;
        delete (window as any).__originalFetch;
        console.log('Restored original fetch');
      }
      
      if ((window as any).__originalXHR) {
        window.XMLHttpRequest = (window as any).__originalXHR;
        delete (window as any).__originalXHR;
        console.log('Restored original XMLHttpRequest');
      }
      
      if ((window as any).__adminChannels) {
        const { adminChannel, adminSupportChannel, handleMessage } = (window as any).__adminChannels;
        adminChannel?.stopListening('.ticket.message.sent', handleMessage);
        adminSupportChannel?.stopListening('.ticket.message.sent', handleMessage);
        echo.leave(`admin.${currentAdminId}`);
        echo.leave('admin-support');
        delete (window as any).__adminChannels;
      }
    };

    // Listen for ticket message events on both channels
    const handleMessage = (data: any) => {
      console.log('Admin received ticket message event:', data);
      
      // Update if we're viewing the ticket that received the message
      if (selectedTicket && data.ticket_id === selectedTicket.id) {
        console.log('Updating ticket view for ticket:', data.ticket_id);
        // Refetch the ticket to get the latest messages
        queryClient.invalidateQueries({ queryKey: ['admin-support-ticket', selectedTicket.id] });
        queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] });
      } else if (data.ticket_id) {
        // Also update the tickets list even if not viewing the specific ticket
        // This ensures the list shows updated message counts
        console.log('Updating tickets list for ticket:', data.ticket_id);
        queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] });
      }
    };

    // Subscribe to admin's private channel (for assigned tickets)
    const adminChannel = echo.private(`admin.${currentAdminId}`);
    
    // Subscribe to general admin support channel (for all user replies)
    const adminSupportChannel = echo.private('admin-support');

    // Add error handlers to debug subscription issues
    adminChannel.error((error: any) => {
      console.error('Admin channel subscription error:', error);
      toast.error('Failed to subscribe to admin channel');
    });

    adminSupportChannel.error((error: any) => {
      console.error('Admin support channel subscription error:', error);
      toast.error('Failed to subscribe to admin support channel');
    });

    // Set up listeners - use both subscribed callback and immediate listen
    // The subscribed callback ensures we listen after successful subscription
    const setupAdminChannelListener = () => {
      console.log('Setting up admin channel listener');
      adminChannel.listen('.ticket.message.sent', handleMessage);
    };

    const setupSupportChannelListener = () => {
      console.log('Setting up admin support channel listener');
      adminSupportChannel.listen('.ticket.message.sent', handleMessage);
    };

    // Wait for channels to be subscribed before listening
    adminChannel.subscribed(() => {
      console.log('Admin private channel subscribed successfully');
      setupAdminChannelListener();
    });

    adminSupportChannel.subscribed(() => {
      console.log('Admin support channel subscribed successfully');
      setupSupportChannelListener();
    });

    // Also set up listeners immediately in case channels are already subscribed
    // This handles the case where subscription happens synchronously
    setupAdminChannelListener();
    setupSupportChannelListener();

    // Cleanup on unmount
    return () => {
      adminChannel.stopListening('.ticket.message.sent', handleMessage);
      adminSupportChannel.stopListening('.ticket.message.sent', handleMessage);
      echo.leave(`admin.${currentAdminId}`);
      echo.leave('admin-support');
    };
  }, [open, currentAdminId, selectedTicket, queryClient]);

  // Fetch tickets
  const { data: ticketsData, isLoading: ticketsLoading, refetch: refetchTickets } = useQuery({
    queryKey: ['admin-support-tickets'],
    queryFn: async () => {
      const response = await adminSupportService.getTickets(1, 50);
      return response;
    },
    enabled: open && view === 'list',
  });

  // Fetch admin users for assignment
  const { data: adminUsers } = useQuery({
    queryKey: ['support-admins'],
    queryFn: async () => {
      const response = await adminApiClient.get('/admin/support/admins');
      return (response.data.data || []) as AdminUser[];
    },
    enabled: open && view === 'detail' && !!selectedTicket,
  });

  // Fetch ticket details
  const { data: ticketDetails, refetch: refetchTicket } = useQuery({
    queryKey: ['admin-support-ticket', selectedTicket?.id],
    queryFn: async () => {
      if (!selectedTicket) return null;
      return await adminSupportService.getTicket(selectedTicket.id);
    },
    enabled: !!selectedTicket && view === 'detail',
  });

  // Assign ticket mutation
  const assignTicketMutation = useMutation({
    mutationFn: ({ ticketId, userId }: { ticketId: number; userId: number }) =>
      adminSupportService.assignTicket(ticketId, userId),
    onSuccess: () => {
      toast.success('Ticket assigned successfully');
      refetchTicket();
      refetchTickets();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign ticket');
    },
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: async ({ ticketId, data, files }: { ticketId: number; data: ReplyTicketRequest; files?: File[] }) => {
      if (files && files.length > 0) {
        const formData = new FormData();
        // Only append message if it's not empty
        if (data.message && data.message.trim()) {
          formData.append('message', data.message);
        }
        if (data.is_internal !== undefined) {
          formData.append('is_internal', data.is_internal ? '1' : '0');
        }
        files.forEach((file) => {
          formData.append('files[]', file);
        });
        const response = await adminApiClient.post(`/admin/support/tickets/${ticketId}/reply`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        return await adminSupportService.replyToTicket(ticketId, data);
      }
    },
    onSuccess: () => {
      toast.success('Reply sent successfully');
      setReplyMessage('');
      setIsInternal(false);
      setReplyFiles([]);
      setFilePreviewList([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      refetchTicket();
      refetchTickets();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send reply');
    },
  });

  // Resolve ticket mutation
  const resolveTicketMutation = useMutation({
    mutationFn: (ticketId: number) => adminSupportService.resolveTicket(ticketId),
    onSuccess: () => {
      toast.success('Ticket resolved successfully');
      refetchTicket();
      refetchTickets();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to resolve ticket');
    },
  });

  const handleAssign = () => {
    if (!selectedTicket || !assignedTo) return;
    assignTicketMutation.mutate({
      ticketId: selectedTicket.id,
      userId: parseInt(assignedTo),
    });
  };

  const handleReply = () => {
    if (!selectedTicket) return;
    if (!replyMessage.trim() && replyFiles.length === 0) {
      toast.error('Please provide a message or attach files');
      return;
    }
    replyMutation.mutate({
      ticketId: selectedTicket.id,
      data: { message: replyMessage.trim() || '', is_internal: isInternal },
      files: replyFiles.length > 0 ? replyFiles : undefined,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(file => ({
        file,
        id: Math.random().toString(36).substring(7),
      }));
      setFilePreviewList(prev => [...prev, ...newFiles]);
      setReplyFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setFilePreviewList(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        setReplyFiles(prevFiles => prevFiles.filter(f => f !== fileToRemove.file));
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleResolve = () => {
    if (!selectedTicket) return;
    if (confirm('Are you sure you want to mark this ticket as resolved?')) {
      resolveTicketMutation.mutate(selectedTicket.id);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      open: 'default',
      in_progress: 'secondary',
      resolved: 'outline',
      closed: 'destructive',
    };
    const icons: Record<string, React.ReactNode> = {
      open: <AlertCircle className="w-3 h-3 mr-1" />,
      in_progress: <Clock className="w-3 h-3 mr-1" />,
      resolved: <CheckCircle2 className="w-3 h-3 mr-1" />,
      closed: <XCircle className="w-3 h-3 mr-1" />,
    };
    return (
      <Badge variant={variants[status] || 'default'} className="flex items-center gap-1">
        {icons[status]}
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Support Tickets Management
          </DialogTitle>
          <DialogDescription>
            View and manage all support tickets
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {view === 'list' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {ticketsData?.total || 0} ticket(s) found
                </p>
              </div>

              {ticketsLoading ? (
                <div className="text-center py-8">Loading tickets...</div>
              ) : ticketsData?.data && ticketsData.data.length > 0 ? (
                <div className="space-y-3">
                  {ticketsData.data.map((ticket) => (
                    <Card
                      key={ticket.id}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedTicket(ticket);
                        setView('detail');
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base">{ticket.subject}</CardTitle>
                            <CardDescription className="mt-1">
                              {ticket.ticket_number} • {ticket.user?.name || 'Unknown User'} ({ticket.user?.email || 'N/A'})
                            </CardDescription>
                            <CardDescription className="mt-1">
                              {ticket.message.substring(0, 150)}
                              {ticket.message.length > 150 ? '...' : ''}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(ticket.status)}
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority_label}
                          </Badge>
                          {ticket.order && (
                            <Badge variant="outline">Order: {ticket.order.order_number}</Badge>
                          )}
                          {ticket.assigned_to && (
                            <Badge variant="secondary">
                              <UserCheck className="w-3 h-3 mr-1" />
                              Assigned
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No support tickets found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {view === 'detail' && selectedTicket && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setView('list');
                    setSelectedTicket(null);
                  }}
                >
                  ← Back to Tickets
                </Button>
                <div className="flex items-center gap-2">
                  {getStatusBadge(ticketDetails?.status || selectedTicket.status)}
                  <Badge className={getPriorityColor(ticketDetails?.priority || selectedTicket.priority)}>
                    {ticketDetails?.priority_label || selectedTicket.priority_label}
                  </Badge>
                  {ticketDetails?.status !== 'resolved' && ticketDetails?.status !== 'closed' && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleResolve();
                      }}
                      disabled={resolveTicketMutation.isPending}
                    >
                      {resolveTicketMutation.isPending ? 'Resolving...' : 'Mark as Resolved'}
                    </Button>
                  )}
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{ticketDetails?.subject || selectedTicket.subject}</CardTitle>
                  <CardDescription>
                    {ticketDetails?.ticket_number || selectedTicket.ticket_number} • Created{' '}
                    {formatDistanceToNow(
                      new Date(ticketDetails?.created_at || selectedTicket.created_at),
                      { addSuffix: true }
                    )}
                  </CardDescription>
                  <CardDescription className="mt-2">
                    <strong>User:</strong> {ticketDetails?.user?.name || selectedTicket.user?.name || 'N/A'} ({ticketDetails?.user?.email || selectedTicket.user?.email || 'N/A'})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{ticketDetails?.message || selectedTicket.message}</p>
                </CardContent>
              </Card>

              {ticketDetails?.status !== 'resolved' && ticketDetails?.status !== 'closed' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Assign Ticket</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Select value={assignedTo} onValueChange={setAssignedTo}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select admin to assign" />
                        </SelectTrigger>
                        <SelectContent>
                          {adminUsers?.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.name} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAssign();
                        }}
                        disabled={!assignedTo || assignTicketMutation.isPending}
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        {assignTicketMutation.isPending ? 'Assigning...' : 'Assign'}
                      </Button>
                    </div>
                    {ticketDetails?.assigned_to && (
                      <p className="text-sm text-muted-foreground">
                        Currently assigned to: {ticketDetails.assigned_to.name}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold">Conversation</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {(ticketDetails?.messages || []).map((msg) => (
                    <Card key={msg.id} className={msg.is_internal ? 'bg-muted' : ''}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">
                              {msg.user?.name || msg.staff?.name || 'System'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                            </p>
                          </div>
                          {msg.is_internal && (
                            <Badge variant="secondary" className="text-xs">Internal Note</Badge>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">Attachments:</p>
                            <div className="flex flex-wrap gap-2">
                              {msg.attachments.map((attachment: any, idx: number) => (
                                <a
                                  key={idx}
                                  href={attachment.file_url || attachment}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md hover:bg-muted/80 transition-colors text-sm"
                                >
                                  <FileText className="w-4 h-4" />
                                  <span className="truncate max-w-[200px]">
                                    {attachment.file_name || attachment}
                                  </span>
                                  <Download className="w-3 h-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="reply" className="flex-1">Add a Reply</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="internal"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="internal" className="text-xs cursor-pointer">
                      Internal Note
                    </Label>
                  </div>
                </div>
                <Textarea
                  id="reply"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  rows={4}
                />
                
                {/* File Upload */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="reply-files"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="*/*"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Paperclip className="w-4 h-4" />
                      Attach Files
                    </Button>
                    {filePreviewList.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {filePreviewList.length} file(s) selected
                      </span>
                    )}
                  </div>
                  
                  {/* File Preview List */}
                  {filePreviewList.length > 0 && (
                    <div className="space-y-1">
                      {filePreviewList.map((fileItem) => (
                        <div
                          key={fileItem.id}
                          className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="truncate">{fileItem.file.name}</span>
                            <span className="text-xs text-muted-foreground shrink-0">
                              ({formatFileSize(fileItem.file.size)})
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(fileItem.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleReply();
                  }}
                  disabled={(!replyMessage.trim() && replyFiles.length === 0) || replyMutation.isPending}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminHelpDialog;

