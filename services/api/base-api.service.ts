// src/services/api/base-api.service.ts
import { API_BASE_URL } from './api.constants';

// ✅ STEP 1: ADD THIS CUSTOM ERROR CLASS AT THE TOP
export class ApiError extends Error {
    public readonly status: number;
    public readonly statusText: string;

    constructor(message: string, status: number, statusText: string) {
        super(message);
        this.status = status;
        this.statusText = statusText;
    }
}
export class BaseApiService {
    protected async request<T>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        endpoint: string,
        data?: any
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers: Record<string, string> = {
            // 'Content-Type': 'application/json',
        };

        if (!(data instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        // Add auth token if exists
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            method,
            headers,
            credentials: 'include', // For cookies if using HTTP-only tokens
        };

        // if (data) {
        //     config.body = JSON.stringify(data);
        // }

        if (data) {
            config.body = data instanceof FormData ? data : JSON.stringify(data);
        }

        const response = await fetch(url, config);

        //     if (!response.ok) {
        //         const error = await response.json().catch(() => ({}));
        //         throw new Error(error.message || 'Request failed');
        //     }

        //     return response.json();
        // }

        // ✅ STEP 2: REPLACE YOUR OLD if BLOCK WITH THIS ONE
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Request failed without a JSON body' }));
            throw new ApiError(errorData.message || response.statusText, response.status, response.statusText);
        }

        const contentType = response.headers.get('content-type');
        if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
            return {} as T;
        }

        return response.json();
    }

    // Convenience methods
    protected get<T>(endpoint: string): Promise<T> {
        return this.request('GET', endpoint);
    }

    protected post<T>(endpoint: string, data: any): Promise<T> {
        return this.request('POST', endpoint, data);
    }

    // --- ADD THIS METHOD ---
    protected patch<T>(endpoint: string, data: any): Promise<T> {
        return this.request('PATCH', endpoint, data);
    }
    // --- END OF NEW METHOD ---

    protected put<T>(endpoint: string, data: any): Promise<T> {
        return this.request('PUT', endpoint, data);
    }

    protected delete<T>(endpoint: string): Promise<T> {
        return this.request('DELETE', endpoint);
    }
}