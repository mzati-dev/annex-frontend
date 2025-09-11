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

    // --- ADDED METHODS ---

    /**
     * Fetches the total number of unread messages for the logged-in user.
     */
    public async getTotalUnreadCount(): Promise<{ count: number }> {
        // Use this.get to stay consistent with your class structure
        return this.get<{ count: number }>(API_ENDPOINTS.CHAT.GET_UNREAD_COUNT);
    }

    /**
     * Marks all messages in a conversation as read.
     */
    public async markConversationAsRead(conversationId: string): Promise<{ updated: number }> {
        // Use this.put for the PUT request
        return this.put<{ updated: number }>(API_ENDPOINTS.CHAT.MARK_AS_READ(conversationId), {});
    }

}