// src/data/tutors.ts

// Defines the shape of the full tutor profile object
export interface TutorProfile {
    id: string;
    userId: string;
    title: string;
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
    bio: string;
    subjects: string[];
    isAvailableForNewStudents: boolean;
    whatsappNumber?: string;
    monthlyRate: number | null;
}

// Defines the shape of the data coming from the editor form
export interface ProfileFormData {
    title: string;
    name: string;
    bio: string;
    subjects: string[];
    whatsappNumber?: string;
    monthlyRate: number | null;
}

// This is now our single, central list of tutors
export const mockTutors: TutorProfile[] = [
    {
        id: 't1',
        userId: '',
        title: 'Mr',
        name: 'John Phiri',
        avatar: 'JP',
        rating: 4.8,
        reviews: 120,
        bio: 'Experienced and passionate Biology and Chemistry tutor with over 10 years of teaching experience. I focus on making complex topics easy to understand.',
        subjects: ['Biology', 'Chemistry', 'Physics'],
        isAvailableForNewStudents: true,
        monthlyRate: null,
    },
    {
        id: 't2',
        userId: '',
        title: 'Ms.',
        name: 'Jane Doe',
        avatar: 'JD',
        rating: 4.9,
        reviews: 85,
        bio: 'I help students conquer Mathematics with simple and effective strategies. Let\'s make math fun!',
        subjects: ['Mathematics', 'Statistics'],
        isAvailableForNewStudents: true,
        monthlyRate: null,
    },
    {
        id: 't3',
        userId: '',
        title: 'Ms.',
        name: 'Jane Doe',
        avatar: 'JD',
        rating: 4.9,
        reviews: 85,
        bio: 'I help students conquer Mathematics with simple and effective strategies. Let\'s make math fun!',
        subjects: ['Mathematics', 'Statistics'],
        isAvailableForNewStudents: true,
        monthlyRate: null,
    },

    {
        id: 't4',
        userId: '',
        title: 'Ms.',
        name: 'Jane Doe',
        avatar: 'JD',
        rating: 4.9,
        reviews: 85,
        bio: 'I help students conquer Mathematics with simple and effective strategies. Let\'s make math fun!',
        subjects: ['Mathematics', 'Statistics'],
        isAvailableForNewStudents: true,
        monthlyRate: null,
    }

];