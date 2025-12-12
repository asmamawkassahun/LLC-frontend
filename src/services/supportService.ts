import apiClient from '@/utils/api-helpers/apiClient';
import type { SupportTicket, CreateTicketRequest, ReplyTicketRequest, PaginatedTickets } from '@/types/SupportTicket';

class SupportService {
  async getTickets(page: number = 1, perPage: number = 15): Promise<PaginatedTickets> {
    const response = await apiClient.get('/support/tickets', {
      params: { page, per_page: perPage },
    });
    return response.data;
  }

  async getTicket(id: number): Promise<SupportTicket> {
    const response = await apiClient.get(`/support/tickets/${id}`);
    return response.data;
  }

  async createTicket(data: CreateTicketRequest): Promise<SupportTicket> {
    const response = await apiClient.post('/support/tickets', data);
    return response.data;
  }

  async replyToTicket(id: number, data: ReplyTicketRequest): Promise<void> {
    await apiClient.post(`/support/tickets/${id}/reply`, data);
  }
}

export default new SupportService();

