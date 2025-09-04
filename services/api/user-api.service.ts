// src/services/api/user-api.service.ts

import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS } from './api.constants';
import { UserProfile as User } from '@/types';// Assuming your User type is in a central types file

export class UserApiService extends BaseApiService {
    /**
     * Uploads a user's profile picture.
     * @param file The image file to upload.
     * @returns The updated user profile.
     */
    public async uploadAvatar(file: File): Promise<User> {
        // FormData is required for file uploads
        const formData = new FormData();
        formData.append('profileImage', file); // 'profileImage' MUST match the backend key

        // Use the inherited 'post' method. It already handles FormData.
        return this.post<User>(API_ENDPOINTS.USER.UPLOAD_AVATAR, formData);
    }
}