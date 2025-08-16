import { API_ENDPOINTS } from "./api/api.constants";
import { BaseApiService } from "./api/base-api.service";

interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'teacher';
}

interface LoginResponse {
    token: string;
    user: User;
}

export class AuthApiService extends BaseApiService {
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
        return this.post<LoginResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
    }

    async forgotPassword(email: string): Promise<{ message: string }> {
        return this.post<{ message: string }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    }

    async getProfile(): Promise<User> {
        return this.get<User>(API_ENDPOINTS.SHARED.PROFILE);
    }
}


// // src/services/api/auth-api.service.ts
// // import { BaseApiService } from './base-api.service';
// // import { API_ENDPOINTS } from './api.constants';

// import { API_ENDPOINTS } from "./api/api.constants";
// import { BaseApiService } from "./api/base-api.service";

// interface LoginResponse {
//     token: string;
//     user: {
//         id: string;
//         name: string;
//         email: string;
//         role: 'student' | 'teacher';
//     };
// }

// export class AuthApiService extends BaseApiService {
//     async login(email: string, password: string): Promise<LoginResponse> {
//         return this.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
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
//         return this.post(API_ENDPOINTS.AUTH.REGISTER, userData);
//     }

//     async forgotPassword(email: string): Promise<{ message: string }> {
//         return this.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
//     }
// }