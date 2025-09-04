// src/services/api/api.ts
import { LessonsApiService } from './lessons-api.service';
import { StudentApiService } from './student-api.service';
import { TeacherApiService } from './teacher-api.service';
import { UserApiService } from './user-api.service';

// Create single instances of your services to be used throughout the app
export const lessonsApiService = new LessonsApiService();
export const studentApiService = new StudentApiService();
export const teacherApiService = new TeacherApiService();
export const userApiService = new UserApiService();