import { API_ENDPOINTS } from './api.constants';
import { BaseApiService } from './base-api.service';
import { Conversation, Message } from '@/types'; // Assuming these types exist

export class ChatApiService extends BaseApiService {
    public async getConversations(): Promise<Conversation[]> {
        return this.get<Conversation[]>(API_ENDPOINTS.CHAT.GET_CONVERSATIONS);
    }

    public async getMessages(conversationId: string): Promise<Message[]> {
        return this.get<Message[]>(API_ENDPOINTS.CHAT.GET_MESSAGES(conversationId));
    }

    public async createConversation(participantId: string): Promise<Conversation> {
        return this.post<Conversation>(API_ENDPOINTS.CHAT.CREATE_CONVERSATION, { participantId });
    }
}