import { Lesson } from '@/types';
import { API_ENDPOINTS } from './api.constants';
import { BaseApiService } from './base-api.service';

export class LessonsApiService extends BaseApiService {
    async createLesson(lessonData: FormData | Omit<Lesson, 'id' | 'teacherId' | 'teacherName' | 'createdAt'>): Promise<Lesson> {
        return this.post<Lesson>(API_ENDPOINTS.LESSONS, lessonData);
    }

    async updateLesson(id: string, lessonData: FormData | Partial<Lesson>): Promise<Lesson> {
        return this.put<Lesson>(`${API_ENDPOINTS.LESSONS}/${id}`, lessonData);
    }

    async getLessonById(id: string): Promise<Lesson> {
        return this.get<Lesson>(`${API_ENDPOINTS.LESSONS}/${id}`);
    }

    async deleteLesson(id: string): Promise<void> {
        return this.delete<void>(`${API_ENDPOINTS.LESSONS}/${id}`);
    }
}