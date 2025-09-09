
// import { TutorProfile } from '@/types';
import { TutorProfile } from '@/app/find-online-tutor/data/tutors';
import { API_ENDPOINTS } from './api.constants';
import { BaseApiService } from './base-api.service';
// ✅ 1. Import your existing TutorProfile type.
//    Adjust the path to point to your central types file.


// ✅ 2. Define the DTO for updates using TypeScript's Partial utility type.
//    This automatically makes all properties of TutorProfile optional.
export type UpdateTutorProfileDto = Partial<TutorProfile>;


export class ProfileApiService extends BaseApiService {
    /**
     * Fetches the currently logged-in user's tutor profile.
     */
    public async getMyProfile(): Promise<TutorProfile> {
        return this.get<TutorProfile>(API_ENDPOINTS.PROFILE.GET_ME);
    }

    /**
     * Creates or updates the logged-in user's tutor profile.
     */
    public async updateMyProfile(data: UpdateTutorProfileDto): Promise<TutorProfile> {
        return this.patch<TutorProfile>(API_ENDPOINTS.PROFILE.UPDATE_ME, data);
    }

    public async getAllTutors(): Promise<TutorProfile[]> {
        // ✅ FIX: Change GET_ME to GET_ALL_TUTORS
        return this.get<TutorProfile[]>(API_ENDPOINTS.PROFILE.GET_ALL_TUTORS);
    }
}