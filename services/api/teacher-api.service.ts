// src/services/api/teacher-api.service.ts
import { Lesson, UserProfile } from '@/types';
import { API_ENDPOINTS } from './api.constants';
import { BaseApiService } from './base-api.service';

export class TeacherApiService extends BaseApiService {
    // Get all lessons for current teacher
    // async getLessons(): Promise<Lesson[]> {
    //     return this.get<Lesson[]>(API_ENDPOINTS.TEACHER.LESSONS);
    // }

    // async getLessons(): Promise<Lesson[]> {
    //     const lessons = await this.get<Lesson[]>(API_ENDPOINTS.TEACHER.LESSONS);
    //     console.log('API returned lessons:', lessons); // <-- debug log
    //     return lessons;
    // }

    async getLessons(): Promise<Lesson[]> {
        const lessons = await this.get<Lesson[]>(API_ENDPOINTS.TEACHER.LESSONS);
        console.log('API returned lessons:', lessons);

        return lessons.map(lesson => ({
            ...lesson,
            price: Number(lesson.price),  // Convert string price to number
            salesCount: lesson.salesCount ? Number(lesson.salesCount) : 0  // Ensure salesCount exists
        }));
    }


    // Create new lesson
    async createLesson(
        lessonData: Omit<Lesson, 'id' | 'teacherId' | 'teacherName' | 'createdAt'>
    ): Promise<Lesson> {
        return this.post<Lesson>(API_ENDPOINTS.TEACHER.LESSONS, lessonData);
    }

    // Update existing lesson
    async updateLesson(
        id: string,
        lessonData: Partial<Lesson>
    ): Promise<Lesson> {
        return this.put<Lesson>(
            `${API_ENDPOINTS.TEACHER.LESSONS}/${id}`,
            lessonData
        );
    }

    // Delete lesson
    async deleteLesson(id: string): Promise<void> {
        return this.delete<void>(`${API_ENDPOINTS.TEACHER.LESSONS}/${id}`);
    }

    // Get students who purchased a specific lesson (using UserProfile instead of Student)
    async getLessonStudents(lessonId: string): Promise<UserProfile[]> {
        return this.get<UserProfile[]>(
            `${API_ENDPOINTS.TEACHER.LESSONS}/${lessonId}/students`
        );
    }

    // Add these new methods:
    // async getSalesStatistics(): Promise<{
    //     totalLessonsSold: number;
    //     totalSales: number;
    //     totalEarnings: number;
    // }> {
    //     return this.get(API_ENDPOINTS.TEACHER.STATS);
    // }
    async getSalesStatistics() {
        const data = await this.get<{
            totalLessonsSold: number;
            totalSales: number;
            totalEarnings: number;
        }>(API_ENDPOINTS.TEACHER.STATS);
        console.log('Raw sales stats from API:', data);  // Debug log
        return {
            totalLessonsSold: data.totalLessonsSold || 0,
            totalSales: data.totalSales || 0,
            totalEarnings: data.totalEarnings || 0
        };
    }

    // async getLessonStudents(lessonId: string): Promise<{id: string, name: string}[]> {
    //     return this.get(`${API_ENDPOINTS.TEACHER.LESSONS}/${lessonId}/students`);
    // }
}