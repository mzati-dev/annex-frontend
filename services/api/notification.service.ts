
import { Notification } from '@/types'; // Assuming you have a Notification type
import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS } from './api.constants';

export class NotificationApiService extends BaseApiService {
    public async getNotifications(): Promise<Notification[]> {
        return this.get<Notification[]>(API_ENDPOINTS.NOTIFICATIONS.GET_ALL);
    }

    public async markAsRead(id: string): Promise<Notification> {
        return this.patch<Notification>(API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id), {});
    }

    public async markAllAsRead(): Promise<{ affected: number }> {
        return this.post<{ affected: number }>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ, {});
    }
}