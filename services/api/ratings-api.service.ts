import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS } from './api.constants';

export interface Rating {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    userId: string;
    userName: string;
}

export interface CreateRatingDto {
    rating: number;
    comment?: string;
}

export class RatingApiService extends BaseApiService {
    async rateLesson(lessonId: string, ratingData: CreateRatingDto): Promise<Rating> {
        return this.post(`${API_ENDPOINTS.LESSONS}/${lessonId}/ratings`, ratingData);
    }

    async getLessonRatings(lessonId: string): Promise<Rating[]> {
        return this.get(`${API_ENDPOINTS.LESSONS}/${lessonId}/ratings`);
    }
}

export const ratingApiService = new RatingApiService();