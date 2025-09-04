export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        FORGOT_PASSWORD: '/auth/forgot-password'
    },
    STUDENT: {
        LESSONS: '/student/lessons',
        PURCHASES: '/student/purchases',
    },
    TEACHER: {
        LESSONS: '/teacher/lessons',
        EARNINGS: '/teacher/earnings',
        STATS: '/teacher/stats',
    },
    LESSONS: '/lessons',
    PURCHASES: {
        BASE: '/purchases',
        CHECKOUT: '/purchases/checkout',
    },
    RATINGS: {
        BASE: '/ratings',
        LESSON_RATINGS: (lessonId: string) => `/lessons/${lessonId}/ratings`,
    },
    SHARED: {
        PROFILE: '/auth/profile',
    },
    USER: {
        UPLOAD_AVATAR: '/users/upload-avatar',
        GET_PROFILE: '/users/profile',
    },
    // --- START: NEW CODE FOR PAYMENT GATEWAY ---
    PAYMENTS: {
        INITIATE_MOBILE_MONEY: '/payments/initiate-mobile-money',
        INITIATE_BANK_TRANSFER: '/payments/initiate-bank-transfer',
    },
    // --- END: NEW CODE FOR PAYMENT GATEWAY ---
};