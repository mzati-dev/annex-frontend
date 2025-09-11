// src/services/api/user-api.service.ts

import { BaseApiService, getRawResponse } from './base-api.service';
import { API_ENDPOINTS } from './api.constants';
import { UserProfile as User, UserProfile } from '@/types';// Assuming your User type is in a central types file


type UpdateProfilePayload = {
    name: string;
    phone: string;
    dob: string;
    gender: string;
};
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


    public async updateProfile(data: UpdateProfilePayload): Promise<UserProfile> {
        // We use 'request' here because your BaseApiService doesn't have a 'patch' helper.
        // PATCH is the correct method for partial updates.
        return this.request<UserProfile>('PATCH', API_ENDPOINTS.USER.UPDATE_PROFILE, data);
    }

    public async downloadUserData(): Promise<Response> {
        // ✅ CALL the standalone function directly, NOT "this.getRawResponse"
        return getRawResponse(API_ENDPOINTS.USER.DOWNLOAD_DATA);
    }

    // === START: NEW DELETE ACCOUNT METHOD ===
    /**
     * Sends a request to the backend to permanently delete the current user's account.
     * @returns A promise that resolves when the request is successful.
     */
    public async deleteAccount(): Promise<void> {
        // Use the 'delete' helper method from BaseApiService.
        // It returns a promise that resolves on success or throws an ApiError on failure.
        // The backend returns a 204 No Content, so the expected return type is `void`.
        await this.delete<void>(API_ENDPOINTS.USER.DELETE_ACCOUNT);
    }
    // === END: NEW DELETE ACCOUNT METHOD ===
}