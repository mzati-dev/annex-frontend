import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS } from './api.constants';

type SupportTicketPayload = {
    subject: string;
    message: string;
};

export class SupportApiService extends BaseApiService {
    public async createSupportTicket(data: SupportTicketPayload): Promise<{ message: string }> {
        return this.post<{ message: string }>(API_ENDPOINTS.SUPPORT.CREATE_TICKET, data);
    }
}


