export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        FORGOT_PASSWORD: '/auth/forgot-password',
        CHANGE_PASSWORD: '/auth/change-password'
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
    PROFILE: {
        GET_ME: '/profiles/me',
        UPDATE_ME: '/profiles/me',
        GET_ALL_TUTORS: '/profiles',
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
        UPDATE_PROFILE: '/users/profile',
        DOWNLOAD_DATA: '/users/download-data',
        DELETE_ACCOUNT: '/users/delete-account',
    },
    // --- START: NEW CODE FOR PAYMENT GATEWAY ---
    PAYMENTS: {
        INITIATE_MOBILE_MONEY: '/payments/initiate-mobile-money',
        INITIATE_BANK_TRANSFER: '/payments/initiate-bank-transfer',
    },
    // --- END: NEW CODE FOR PAYMENT GATEWAY ---

    NOTIFICATIONS: {
        GET_ALL: '/notifications',
        MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
        MARK_ALL_AS_READ: '/notifications/mark-all-as-read',
    },

    CHAT: {
        GET_CONVERSATIONS: '/chat/conversations',
        GET_MESSAGES: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
        CREATE_CONVERSATION: '/chat/conversations',
        GET_UNREAD_COUNT: '/chat/unread-count',
        MARK_AS_READ: (conversationId: string) => `/chat/conversations/${conversationId}/read`,
    },
    // === ADD THIS NEW SECTION ===
    SUPPORT: {
        CREATE_TICKET: '/support/ticket',
    },
    // ============================
};