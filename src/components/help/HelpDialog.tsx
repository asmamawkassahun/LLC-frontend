import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import echo from '@/lib/echo';
import userService from '@/services/userService';
import authService from '@/services/authService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import supportService from '@/services/supportService';
import apiClient from '@/utils/api-helpers/apiClient';
import { toast } from 'sonner';
import type { SupportTicket, TicketPriority, CreateTicketRequest } from '@/types/SupportTicket';
import { MessageSquare, Plus, Clock, CheckCircle2, XCircle, AlertCircle, Paperclip, X, Download, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Order {
  id: number;
  order_number: string;
}

const HelpDialog = ({ open, onOpenChange }: HelpDialogProps) => {
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [formData, setFormData] = useState<CreateTicketRequest>({
    subject: '',
    message: '',
    priority: 'medium',
  });
  const [replyMessage, setReplyMessage] = useState('');
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const [filePreviewList, setFilePreviewList] = useState<Array<{file: File, id: string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const conversationContainerRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Helper functions for tracking viewed tickets
  const getLastViewedTimestamp = (ticketId: number): string | null => {
    const key = `user_ticket_viewed_${ticketId}`;
    return localStorage.getItem(key);
  };

  const markTicketAsViewed = (ticketId: number) => {
    const key = `user_ticket_viewed_${ticketId}`;
    localStorage.setItem(key, new Date().toISOString());
  };

  const getUnreadMessageCount = (ticket: SupportTicket): number => {
    if (!ticket.messages || !Array.isArray(ticket.messages)) return 0;
    
    // Filter out internal messages for users
    const userMessages = ticket.messages.filter(msg => !msg.is_internal);
    if (userMessages.length === 0) return 0;
    
    const lastViewed = getLastViewedTimestamp(ticket.id);
    if (!lastViewed) {
      // If never viewed, count messages from admin/staff (not from user)
      return userMessages.filter(msg => !!msg.staff_id).length;
    }

    const lastViewedDate = new Date(lastViewed);
    // Count messages created after last view that are from admin/staff
    return userMessages.filter(msg => {
      const msgDate = new Date(msg.created_at);
      return msgDate > lastViewedDate && !!msg.staff_id;
    }).length;
  };

  // Get current user ID
  useEffect(() => {
    if (open && authService.isAuthenticated()) {
      userService.getCurrentUser()
        .then(user => setCurrentUserId(user.id))
        .catch(() => setCurrentUserId(null));
    }
  }, [open]);

  // Reset view when dialog closes
  useEffect(() => {
    if (!open) {
      // Reset everything when dialog closes
      setView('list');
      setSelectedTicket(null);
      setFormData({ subject: '', message: '', priority: 'medium' });
      setReplyMessage('');
      setReplyFiles([]);
      setFilePreviewList([]);
    }
  }, [open]);

  // Real-time message listener
  useEffect(() => {
    if (!open || !currentUserId || !authService.isAuthenticated()) {
      return;
    }

    // Update Echo auth token
    const updateEchoAuth = () => {
      const token = authService.getAccessToken();
      if (token && echo.connector && echo.connector.pusher && echo.connector.pusher.config) {
        const config = echo.connector.pusher.config as any;
        if (!config.auth) {
          config.auth = {};
        }
        if (!config.auth.headers) {
          config.auth.headers = {};
        }
        config.auth.headers = {
          ...config.auth.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    };

    updateEchoAuth();

    // Subscribe to user's private channel
    const channel = echo.private(`user.${currentUserId}`);

    // Listen for ticket message events
    channel.listen('.ticket.message.sent', (data: any) => {
      // Only update if we're viewing the ticket that received the message
      if (selectedTicket && data.ticket_id === selectedTicket.id && view === 'detail') {
        // If viewing the ticket detail, mark it as viewed (new message is automatically read)
        markTicketAsViewed(data.ticket_id);
        // Refetch the ticket to get the latest messages
        queryClient.invalidateQueries({ queryKey: ['support-ticket', selectedTicket.id] });
        queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
        // Scroll to bottom when new message arrives
        setTimeout(() => {
          if (conversationContainerRef.current) {
            conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
          }
        }, 300);
      } else if (data.ticket_id) {
        // Also update the tickets list even if not viewing the specific ticket
        // This ensures the list shows updated message counts and unread badges
        // Don't mark as viewed if not viewing the detail - message should remain unread
        queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      }
    });

    // Cleanup on unmount
    return () => {
      channel.stopListening('.ticket.message.sent');
      echo.leave(`user.${currentUserId}`);
    };
  }, [open, currentUserId, selectedTicket, view, queryClient]);

  // Fetch tickets
  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ['support-tickets'],
    queryFn: async () => {
      const response = await supportService.getTickets(1, 50);
      return response;
    },
    enabled: open && view === 'list',
  });

  // Fetch orders for dropdown
  const { data: ordersData } = useQuery({
    queryKey: ['user-orders-for-ticket'],
    queryFn: async () => {
      const response = await apiClient.get('/orders', { params: { per_page: 100 } });
      return (response.data.data || []) as Order[];
    },
    enabled: open && view === 'create',
  });

  // Fetch ticket details
  const { data: ticketDetails, refetch: refetchTicket } = useQuery({
    queryKey: ['support-ticket', selectedTicket?.id],
    queryFn: async () => {
      if (!selectedTicket) return null;
      return await supportService.getTicket(selectedTicket.id);
    },
    enabled: !!selectedTicket && view === 'detail',
  });

  // Auto-scroll to bottom of conversation when messages load or change
  useEffect(() => {
    if (view === 'detail' && conversationContainerRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (conversationContainerRef.current) {
          conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [ticketDetails?.messages, view, selectedTicket]);

  // Mark ticket as viewed when viewing detail
  useEffect(() => {
    if (view === 'detail' && selectedTicket) {
      markTicketAsViewed(selectedTicket.id);
      // Invalidate tickets query to update unread counts
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
    }
  }, [view, selectedTicket, queryClient]);

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: (data: CreateTicketRequest) => supportService.createTicket(data),
    onSuccess: () => {
      toast.success('Support ticket created successfully');
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      setFormData({ subject: '', message: '', priority: 'medium' });
      setView('list');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create ticket');
    },
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: async ({ ticketId, message, files }: { ticketId: number; message: string; files?: File[] }) => {
      if (files && files.length > 0) {
        const formData = new FormData();
        // Only append message if it's not empty
        if (message.trim()) {
          formData.append('message', message);
        }
        files.forEach((file) => {
          formData.append('files[]', file);
        });
        const response = await apiClient.post(`/support/tickets/${ticketId}/reply`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        return await supportService.replyToTicket(ticketId, { message });
      }
    },
    onSuccess: () => {
      toast.success('Reply sent successfully');
      setReplyMessage('');
      setReplyFiles([]);
      setFilePreviewList([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      refetchTicket();
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      // Scroll to bottom after sending reply
      setTimeout(() => {
        if (conversationContainerRef.current) {
          conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
        }
      }, 300);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send reply');
    },
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    createTicketMutation.mutate(formData);
  };

  const handleReply = () => {
    if (!selectedTicket) return;
    if (!replyMessage.trim() && replyFiles.length === 0) {
      toast.error('Please provide a message or attach files');
      return;
    }
    replyMutation.mutate({ 
      ticketId: selectedTicket.id, 
      message: replyMessage.trim() || '',
      files: replyFiles.length > 0 ? replyFiles : undefined
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

  const handleOpenChange = (newOpen: boolean) => {
    // Only allow closing if we're in the list view
    if (!newOpen && view !== 'list') {
      // Don't close, just go back to list view
      setView('list');
      setSelectedTicket(null);
      return;
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onPointerDownOutside={(e) => {
          // Prevent closing when clicking outside if we're in create or detail view
          if (view !== 'list') {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Help & Support
          </DialogTitle>
          <DialogDescription>
            Create a support ticket or view your existing tickets
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          {view === 'list' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {ticketsData?.total || 0} ticket(s) found
                </p>
                <Button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setView('create');
                  }} 
                  className="cursor-pointer"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Ticket
                </Button>
              </div>

              {ticketsLoading ? (
                <div className="text-center py-8">Loading tickets...</div>
              ) : ticketsData?.data && ticketsData.data.length > 0 ? (
                <div className="space-y-3">
                  {ticketsData.data.map((ticket) => (
                    <Card
                      key={ticket.id}
                      className="cursor-pointer hover:bg-foreground/5 transition-colors"
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
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base">{ticket.subject}</CardTitle>
                              {(() => {
                                const unreadCount = getUnreadMessageCount(ticket);
                                return unreadCount > 0 ? (
                                  <Badge variant="destructive" className="flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    {unreadCount}
                                  </Badge>
                                ) : null;
                              })()}
                            </div>
                            <CardDescription className="mt-1">
                              {ticket.ticket_number} • {ticket.message.substring(0, 100)}
                              {ticket.message.length > 100 ? '...' : ''}
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
                    <p className="text-muted-foreground">No support tickets yet</p>
                    <Button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setView('create');
                      }} 
                      className="mt-4 cursor-pointer" 
                      size="sm"
                    >
                      Create Your First Ticket
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : view === 'create' ? (
            <form onSubmit={handleCreateTicket} className="space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Related Order (Optional)</Label>
                <Select
                  value={formData.order_id?.toString() || 'none'}
                  onValueChange={(value) =>
                    setFormData({ ...formData, order_id: value === 'none' ? undefined : parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an order (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {ordersData?.map((order) => (
                      <SelectItem key={order.id} value={order.id.toString()}>
                        {order.order_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority || 'medium'}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value as TicketPriority })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your issue in detail..."
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setView('list');
                    setFormData({ subject: '', message: '', priority: 'medium' });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createTicketMutation.isPending}>
                  {createTicketMutation.isPending ? 'Creating...' : 'Create Ticket'}
                </Button>
              </div>
            </form>
          ) : view === 'detail' && selectedTicket ? (
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
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{ticketDetails?.message || selectedTicket.message}</p>
                </CardContent>
              </Card>

              <Separator />

              <div className="space-y-3">
                <h3 className="font-semibold">Conversation</h3>

                {/* Conversation List */}
                <div ref={conversationContainerRef} className="space-y-3 max-h-64 overflow-y-auto border-2 border-accent/30 rounded-md p-2">
                  {(ticketDetails?.messages || [])
                    .filter(msg => !msg.is_internal) // Filter out internal messages for users
                    .map((msg) => {
                      // Determine if message is outgoing (from current user) or incoming (from admin/staff)
                      const isOutgoing = msg.user_id === currentUserId;
                      
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-full px-4 py-2 bg-foreground/5 text-foreground ${isOutgoing ? 'rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-none' : 'rounded-tl-none rounded-tr-lg rounded-bl-lg rounded-br-lg'}`}
                          >
                            {/* Sender name and timestamp */}
                            <div className={`flex items-center gap-2 mb-1 ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-xs font-semibold opacity-90">
                                {msg.user?.name || msg.staff?.name || 'System'}
                              </span>
                              <span className={`text-xs opacity-70 text-foreground`}>
                                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            
                            {/* Message content */}
                            <p className={`text-sm whitespace-pre-wrap text-foreground`}>
                              {msg.message}
                            </p>
                            
                            {/* Attachments */}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                <div className="flex flex-wrap gap-2">
                                  {msg.attachments.map((attachment: any, idx: number) => (
                                    <a
                                      key={idx}
                                      href={attachment.file_url || attachment}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md hover:opacity-80 transition-opacity text-sm ${
                                        isOutgoing
                                          ? 'bg-blue-700 text-white'
                                          : 'bg-gray-300 text-gray-900'
                                      }`}
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
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {ticketDetails?.status !== 'resolved' && ticketDetails?.status !== 'closed' && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="reply">Add a Reply</Label>
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
                      {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;

