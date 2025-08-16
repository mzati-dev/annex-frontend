// src/services/api/student-api.service.ts
import { Lesson } from '@/types';
import { API_ENDPOINTS } from './api.constants';
import { BaseApiService } from './base-api.service';
// import { API_ENDPOINTS } from './api.constants';

export class StudentApiService extends BaseApiService {
    async getAvailableLessons(): Promise<Lesson[]> {
        return this.get(API_ENDPOINTS.STUDENT.LESSONS);
    }

    async getPurchasedLessons(): Promise<Lesson[]> {
        return this.get(API_ENDPOINTS.STUDENT.PURCHASES);
    }

    async purchaseLessons(cartItems: { lessonId: string }[]): Promise<{ success: boolean }> {
        return this.post(API_ENDPOINTS.STUDENT.PURCHASES, { items: cartItems });
    }
}