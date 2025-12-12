import adminApiClient from '@/utils/api-helpers/adminApiClient';
import type { SupportTicket, ReplyTicketRequest, PaginatedTickets } from '@/types/SupportTicket';

class AdminSupportService {
  async getTickets(page: number = 1, perPage: number = 20): Promise<PaginatedTickets> {
    const response = await adminApiClient.get('/admin/support/tickets', {
      params: { page, per_page: perPage },
    });
    return response.data;
  }

  async getTicket(id: number): Promise<SupportTicket> {
    const response = await adminApiClient.get(`/admin/support/tickets/${id}`);
    return response.data;
  }

  async assignTicket(id: number, assignedTo: number): Promise<SupportTicket> {
    const response = await adminApiClient.post(`/admin/support/tickets/${id}/assign`, {
      assigned_to: assignedTo,
    });
    return response.data;
  }

  async replyToTicket(id: number, data: ReplyTicketRequest): Promise<void> {
    await adminApiClient.post(`/admin/support/tickets/${id}/reply`, data);
  }

  async resolveTicket(id: number): Promise<SupportTicket> {
    const response = await adminApiClient.post(`/admin/support/tickets/${id}/resolve`);
    return response.data;
  }
}

export default new AdminSupportService();

