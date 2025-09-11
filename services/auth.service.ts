// auth.service.ts

import { UserProfile } from '@/types';
import { API_ENDPOINTS } from "./api/api.constants";
import { BaseApiService } from "./api/base-api.service";

// Step 2: Define the login response using the correct UserProfile
interface LoginResponse {
    token: string;
    user: UserProfile; // Use UserProfile here
}

export class AuthApiService extends BaseApiService {
    // Step 3: Update the method to return the correct LoginResponse
    async login(email: string, password: string): Promise<LoginResponse> {
        return this.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    }

    async register(userData: {
        name: string;
        email: string;
        phone: string;
        dob: string;
        gender: string;
        password: string;
        role: 'student' | 'teacher';
    }): Promise<LoginResponse> {
        // The register method can remain the same as it likely returns the full user object
        return this.post<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
    }

    async forgotPassword(email: string): Promise<{ message: string }> {
        return this.post<{ message: string }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    }

    // Step 4: Update getProfile to return the full UserProfile
    async getProfile(): Promise<UserProfile> {
        return this.get<UserProfile>(API_ENDPOINTS.SHARED.PROFILE);
    }

    // Add this method to your AuthApiService class on the frontend

    public async changePassword(data: { currentPassword: string, newPassword: string }): Promise<any> {
        // Assuming your API endpoint constants are set up
        return this.patch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    }
}

// import { API_ENDPOINTS } from "./api/api.constants";
// import { BaseApiService } from "./api/base-api.service";

// interface User {
//     id: string;
//     name: string;
//     email: string;
//     role: 'student' | 'teacher';
// }

// interface LoginResponse {
//     token: string;
//     user: User;
// }

// export class AuthApiService extends BaseApiService {
//     async login(email: string, password: string): Promise<LoginResponse> {
//         return this.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, { email, password });
//     }

//     async register(userData: {
//         name: string;
//         email: string;
//         phone: string;
//         dob: string;
//         gender: string;
//         password: string;
//         role: 'student' | 'teacher';
//     }): Promise<LoginResponse> {
//         return this.post<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
//     }

//     async forgotPassword(email: string): Promise<{ message: string }> {
//         return this.post<{ message: string }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
//     }

//     async getProfile(): Promise<User> {
//         return this.get<User>(API_ENDPOINTS.SHARED.PROFILE);
//     }
// }


// // // src/services/api/auth-api.service.ts
// // // import { BaseApiService } from './base-api.service';
// // // import { API_ENDPOINTS } from './api.constants';

// // import { API_ENDPOINTS } from "./api/api.constants";
// // import { BaseApiService } from "./api/base-api.service";

// // interface LoginResponse {
// //     token: string;
// //     user: {
// //         id: string;
// //         name: string;
// //         email: string;
// //         role: 'student' | 'teacher';
// //     };
// // }

// // export class AuthApiService extends BaseApiService {
// //     async login(email: string, password: string): Promise<LoginResponse> {
// //         return this.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
// //     }

// //     async register(userData: {
// //         name: string;
// //         email: string;
// //         phone: string;
// //         dob: string;
// //         gender: string;
// //         password: string;
// //         role: 'student' | 'teacher';
// //     }): Promise<LoginResponse> {
// //         return this.post(API_ENDPOINTS.AUTH.REGISTER, userData);
// //     }

// //     async forgotPassword(email: string): Promise<{ message: string }> {
// //         return this.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
// //     }
// // }