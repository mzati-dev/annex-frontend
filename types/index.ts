// types.ts

import { TutorProfile } from "@/app/find-online-tutor/data/tutors";

/**
 * User profile interface representing both teachers and students
 */
export interface UserProfile {
    id: string;             // Unique identifier for the user
    name: string;           // User's full name
    email: string;          // User's email address
    phone: string;
    role: 'teacher' | 'student';  // User's role in the system
    profileImageUrl?: string;
    dob?: string;
    gender?: string;
}

/**
 * Rating interface for lesson reviews
 */
export interface Rating {
    userId: string;         // ID of the user who left the rating
    rating: number;         // Numeric rating (e.g., 1-5)
    comment?: string;       // Optional review comment
    createdAt: string;      // When the rating was created (ISO string)
}

/**
 * Purchase interface to track lesson transactions
 */
export interface Purchase {
    lessonId: string;       // ID of the purchased lesson
    studentId: string;      // ID of the student who purchased
    teacherId: string;      // ID of the teacher who created the lesson
    purchaseDate: string;   // When the purchase occurred (ISO string)
    price: number;          // Price at time of purchase
}


/**
 * Lesson interface representing educational content
 */
export interface Lesson {
    id: string;             // Unique identifier for the lesson
    title: string;          // Lesson title
    description: string;    // Short description of the lesson
    subject: string;        // Subject area (e.g., "Mathematics")
    form: 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4';  // Educational level
    price: number;          // Price in MWK
    videoUrl?: string;      // Optional URL to video content
    textContent?: string;   // Optional text content
    teacherId: string;      // ID of the teacher who created this
    teacherName: string;    // Name of the teacher
    createdAt: string;      // When the lesson was created (ISO string)
    durationMinutes: number; // Estimated duration in minutes

    // Rating system properties
    ratings?: Rating[];     // Array of user ratings
    averageRating?: number; // Calculated average rating
    salesCount?: number; // Add this line
    purchases?: Purchase[]; // Optional: Add if you want direct access to purchases
    teacherTitle: string;
}

/**
 * Cart item interface (extends Lesson with no additional fields)
 */
export interface CartItem extends Lesson { }

/**
 * App context type defining all shared state and methods
 */
export interface AppContextType {
    // State properties
    user: UserProfile | null;           // Current logged-in user
    lessons: Lesson[];                  // All available lessons
    cart: CartItem[];                   // Items in shopping cart
    purchasedLessonIds: string[];       // IDs of purchased lessons (for current user)
    purchases: Purchase[];              // All purchase records in the system
    tutors: TutorProfile[];             // NEW: All available tutors

    setUser: (user: UserProfile) => void;
    // Authentication methods
    login: (user: UserProfile) => void; // Login handler
    logout: () => void;                 // Logout handler

    // Lesson management
    addLesson: (lesson: Lesson) => void; // Add/update lesson
    deleteLesson: (lessonId: string) => void; // NEW: Delete lesson handler

    // ✅ ADD THIS SECTION FOR TUTOR MANAGEMENT
    updateTutor: (tutorProfile: TutorProfile) => void;

    // Cart methods
    addToCart: (lesson: Lesson) => void; // Add to cart
    removeFromCart: (lessonId: string) => void; // Remove from cart
    purchaseCart: () => void;            // Complete purchase

    // UI methods
    showToast: (message: string) => void; // Show toast notification

    // Search functionality
    searchTerm: string;                  // Current search term
    setSearchTerm: (term: string) => void; // Update search term

    // Rating system
    rateLesson: (lessonId: string, rating: number, comment?: string) => void;
}

/**
 * Mock lessons data for initial state and testing
 */
export const MOCK_LESSONS: Lesson[] = [
    {
        id: '1',
        title: 'Introduction to Photosynthesis',
        description: 'A deep dive into the process of photosynthesis in plants.',
        subject: 'Biology',
        form: 'Form 2',
        price: 1500,
        teacherId: 't1',
        teacherName: 'Mr. Phiri',
        createdAt: new Date().toISOString(),
        videoUrl: 'https://placehold.co/1920x1080/000000/FFFFFF/mp4?text=Video+Placeholder',
        textContent: 'Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy.',
        durationMinutes: 25,
        ratings: [
            {
                userId: 's1',
                rating: 5,
                comment: 'Excellent explanation!',
                createdAt: new Date('2023-01-15').toISOString()
            }
        ],
        averageRating: 5,
        teacherTitle: ''
    },
    {
        id: '2',
        title: 'Algebraic Equations',
        description: 'Solving linear and quadratic equations.',
        subject: 'Mathematics',
        form: 'Form 3',
        price: 2000,
        teacherId: 't2',
        teacherName: 'Mrs. Banda',
        createdAt: new Date().toISOString(),
        textContent: 'An equation is a statement that asserts the equality of two expressions. This lesson covers solving for x.',
        durationMinutes: 45,
        ratings: [
            {
                userId: 's1',
                rating: 4,
                comment: 'Very helpful',
                createdAt: new Date('2023-02-20').toISOString()
            },
            {
                userId: 's2',
                rating: 5,
                createdAt: new Date('2023-03-10').toISOString()
            }
        ],
        averageRating: 4.5,
        teacherTitle: ''
    },
    {
        id: '3',
        title: 'Shakespeare\'s Macbeth',
        description: 'An analysis of the themes and characters in Macbeth.',
        subject: 'English Literature',
        form: 'Form 4',
        price: 1800,
        teacherId: 't2',
        teacherName: 'Mrs. Banda',
        createdAt: new Date().toISOString(),
        videoUrl: 'https://placehold.co/1920x1080/000000/FFFFFF/mp4?text=Video+Placeholder',
        textContent: 'Macbeth is a tragedy by William Shakespeare about a Scottish general who, spurred by a prophecy, murders the king to seize the throne.',
        durationMinutes: 35,
        ratings: [],
        averageRating: 0,
        teacherTitle: ''
    },
];
// // types.ts

// /**
//  * User profile interface representing both teachers and students
//  */
// export interface UserProfile {
//     id: string;             // Unique identifier for the user
//     name: string;           // User's full name
//     email: string;          // User's email address
//     role: 'teacher' | 'student';  // User's role in the system
// }

// /**
//  * Rating interface for lesson reviews
//  */
// export interface Rating {
//     userId: string;         // ID of the user who left the rating
//     rating: number;         // Numeric rating (e.g., 1-5)
//     comment?: string;       // Optional review comment
//     createdAt: string;      // When the rating was created (ISO string)
// }

// /**
//  * Purchase interface to track lesson transactions
//  */
// export interface Purchase {
//     lessonId: string;       // ID of the purchased lesson
//     studentId: string;      // ID of the student who purchased
//     teacherId: string;      // ID of the teacher who created the lesson
//     purchaseDate: string;   // When the purchase occurred (ISO string)
//     price: number;          // Price at time of purchase
// }

// /**
//  * Lesson interface representing educational content
//  */
// export interface Lesson {
//     id: string;             // Unique identifier for the lesson
//     title: string;          // Lesson title
//     description: string;    // Short description of the lesson
//     subject: string;        // Subject area (e.g., "Mathematics")
//     form: 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4';  // Educational level
//     price: number;          // Price in MWK
//     videoUrl?: string;      // Optional URL to video content
//     textContent?: string;   // Optional text content
//     teacherId: string;      // ID of the teacher who created this
//     teacherName: string;    // Name of the teacher
//     createdAt: string;      // When the lesson was created (ISO string)
//     durationMinutes: number; // Estimated duration in minutes

//     // Rating system properties
//     ratings?: Rating[];     // Array of user ratings
//     averageRating?: number; // Calculated average rating
// }

// /**
//  * Cart item interface (extends Lesson with no additional fields)
//  */
// export interface CartItem extends Lesson { }

// /**
//  * App context type defining all shared state and methods
//  */
// export interface AppContextType {
//     // State properties
//     user: UserProfile | null;           // Current logged-in user
//     lessons: Lesson[];                  // All available lessons
//     cart: CartItem[];                   // Items in shopping cart
//     purchasedLessonIds: string[];       // IDs of purchased lessons (for current user)
//     purchases: Purchase[];              // All purchase records in the system

//     // Authentication methods
//     login: (user: UserProfile) => void; // Login handler
//     logout: () => void;                 // Logout handler

//     // Lesson management
//     addLesson: (lesson: Lesson) => void; // Add/update lesson

//     // Cart methods
//     addToCart: (lesson: Lesson) => void; // Add to cart
//     removeFromCart: (lessonId: string) => void; // Remove from cart
//     purchaseCart: () => void;            // Complete purchase

//     // UI methods
//     showToast: (message: string) => void; // Show toast notification

//     // Search functionality
//     searchTerm: string;                  // Current search term
//     setSearchTerm: (term: string) => void; // Update search term

//     // Rating system
//     rateLesson: (lessonId: string, rating: number, comment?: string) => void;
// }

// /**
//  * Mock lessons data for initial state and testing
//  */
// export const MOCK_LESSONS: Lesson[] = [
//     {
//         id: '1',
//         title: 'Introduction to Photosynthesis',
//         description: 'A deep dive into the process of photosynthesis in plants.',
//         subject: 'Biology',
//         form: 'Form 2',
//         price: 1500,
//         teacherId: 't1',
//         teacherName: 'Mr. Phiri',
//         createdAt: new Date().toISOString(),
//         videoUrl: 'https://placehold.co/1920x1080/000000/FFFFFF/mp4?text=Video+Placeholder',
//         textContent: 'Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy.',
//         durationMinutes: 25,
//         ratings: [
//             {
//                 userId: 's1',
//                 rating: 5,
//                 comment: 'Excellent explanation!',
//                 createdAt: new Date('2023-01-15').toISOString()
//             }
//         ],
//         averageRating: 5
//     },
//     {
//         id: '2',
//         title: 'Algebraic Equations',
//         description: 'Solving linear and quadratic equations.',
//         subject: 'Mathematics',
//         form: 'Form 3',
//         price: 2000,
//         teacherId: 't2',
//         teacherName: 'Mrs. Banda',
//         createdAt: new Date().toISOString(),
//         textContent: 'An equation is a statement that asserts the equality of two expressions. This lesson covers solving for x.',
//         durationMinutes: 45,
//         ratings: [
//             {
//                 userId: 's1',
//                 rating: 4,
//                 comment: 'Very helpful',
//                 createdAt: new Date('2023-02-20').toISOString()
//             },
//             {
//                 userId: 's2',
//                 rating: 5,
//                 createdAt: new Date('2023-03-10').toISOString()
//             }
//         ],
//         averageRating: 4.5
//     },
//     {
//         id: '3',
//         title: 'Shakespeare\'s Macbeth',
//         description: 'An analysis of the themes and characters in Macbeth.',
//         subject: 'English Literature',
//         form: 'Form 4',
//         price: 1800,
//         teacherId: 't2',
//         teacherName: 'Mrs. Banda',
//         createdAt: new Date().toISOString(),
//         videoUrl: 'https://placehold.co/1920x1080/000000/FFFFFF/mp4?text=Video+Placeholder',
//         textContent: 'Macbeth is a tragedy by William Shakespeare about a Scottish general who, spurred by a prophecy, murders the king to seize the throne.',
//         durationMinutes: 35,
//         ratings: [],
//         averageRating: 0
//     },
// ];

// export interface UserProfile {
//     id: string;
//     name: string;
//     email: string;
//     role: 'teacher' | 'student';
// }

// export interface Rating {
//     userId: string;
//     rating: number;
//     comment?: string;
//     createdAt: string;
// }

// export interface Lesson {
//     id: string;
//     title: string;
//     description: string;
//     subject: string;
//     form: 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4';
//     price: number;
//     videoUrl?: string;
//     textContent?: string;
//     teacherId: string;
//     teacherName: string;
//     createdAt: string;
//     durationMinutes: number;
//     // CHANGED: Updated rating system
//     ratings?: Rating[];
//     averageRating?: number;
// }

// export interface CartItem extends Lesson { }

// export interface AppContextType {
//     user: UserProfile | null;
//     lessons: Lesson[];
//     cart: CartItem[];
//     purchasedLessonIds: string[];
//     login: (user: UserProfile) => void;
//     logout: () => void;
//     addLesson: (lesson: Lesson) => void;
//     addToCart: (lesson: Lesson) => void;
//     removeFromCart: (lessonId: string) => void;
//     purchaseCart: () => void;
//     showToast: (message: string) => void;

//     // ✅ Add these two lines below
//     searchTerm: string;
//     setSearchTerm: (term: string) => void;
//     rateLesson: (lessonId: string, rating: number, comment?: string) => void;
// }


// export const MOCK_LESSONS: Lesson[] = [
//     {
//         id: '1',
//         title: 'Introduction to Photosynthesis',
//         description: 'A deep dive into the process of photosynthesis in plants.',
//         subject: 'Biology',
//         form: 'Form 2',
//         price: 1500,
//         teacherId: 't1',
//         teacherName: 'Mr. Phiri',
//         createdAt: new Date().toISOString(),
//         videoUrl: 'https://placehold.co/1920x1080/000000/FFFFFF/mp4?text=Video+Placeholder',
//         textContent: 'Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy.',

//         durationMinutes: 25
//     },
//     {
//         id: '2',
//         title: 'Algebraic Equations',
//         description: 'Solving linear and quadratic equations.',
//         subject: 'Mathematics',
//         form: 'Form 3',
//         price: 2000,
//         teacherId: 't2',
//         teacherName: 'Mrs. Banda',
//         createdAt: new Date().toISOString(),
//         textContent: 'An equation is a statement that asserts the equality of two expressions. This lesson covers solving for x.',

//         durationMinutes: 45
//     },
//     {
//         id: '3',
//         title: 'Shakespeare\'s Macbeth',
//         description: 'An analysis of the themes and characters in Macbeth.',
//         subject: 'English Literature',
//         form: 'Form 4',
//         price: 1800,
//         teacherId: 't2',
//         teacherName: 'Mrs. Banda',
//         createdAt: new Date().toISOString(),
//         videoUrl: 'https://placehold.co/1920x1080/000000/FFFFFF/mp4?text=Video+Placeholder',
//         textContent: 'Macbeth is a tragedy by William Shakespeare about a Scottish general who, spurred by a prophecy, murders the king to seize the throne.',

//         durationMinutes: 35
//     },
// ];