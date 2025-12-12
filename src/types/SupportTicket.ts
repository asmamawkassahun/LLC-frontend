export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SupportMessage {
  id: number;
  ticket_id: number;
  user_id?: number;
  staff_id?: number;
  message: string;
  attachments?: string[];
  is_internal: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  staff?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface SupportTicket {
  id: number;
  ticket_number: string;
  subject: string;
  message: string;
  priority: TicketPriority;
  priority_label: string;
  status: TicketStatus;
  status_label: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  order_id?: number;
  order?: {
    id: number;
    order_number: string;
  };
  messages?: SupportMessage[];
  assigned_to?: {
    id: number;
    name: string;
    email: string;
  };
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketRequest {
  subject: string;
  message: string;
  order_id?: number;
  priority?: TicketPriority;
}

export interface ReplyTicketRequest {
  message: string;
  is_internal?: boolean;
}

export interface PaginatedTickets {
  data: SupportTicket[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

