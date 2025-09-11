'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Lesson, UserProfile, CartItem, AppContextType, MOCK_LESSONS, Purchase, } from '../types';
import { chatApiService, profileApiService } from '@/services/api/api';
import { TutorProfile } from '@/app/find-online-tutor/data/tutors';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    // --- STATE MANAGEMENT ---
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [purchasedLessonIds, setPurchasedLessonIds] = useState<string[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [tutors, setTutors] = useState<TutorProfile[]>([]);
    const [isLoadingTutors, setIsLoadingTutors] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);



    // --- ADD THESE NEW FUNCTIONS ---
    const openChatWithUser = async (participantId: string) => {
        try {
            // This calls your backend to create or find the conversation
            const conversation = await chatApiService.createConversation(participantId);
            setActiveChatId(conversation.id);
            setIsChatOpen(true);
        } catch (error) {
            console.error("Failed to start conversation", error);
            // Optionally show a toast message here
        }
    };

    // ADD THIS NEW FUNCTION RIGHT HERE:
    // const openChatWithTutor = async (tutorId: string) => {
    //     try {
    //         // This calls your backend to create or find the conversation with a tutor
    //         const conversation = await chatApiService.createConversation(tutorId);
    //         setActiveChatId(conversation.id);
    //         setIsChatOpen(true);
    //     } catch (error) {
    //         console.error("Failed to start conversation with tutor", error);
    //         // Optionally show a toast message here
    //     }
    // };

    // AppContext.tsx

    const openChatWithTutor = async (tutorId: string) => {
        try {
            // This still creates the conversation in the backend, which is good.
            await chatApiService.createConversation(tutorId);

            // ✅ THE FIX: Use the tutor's ID to identify the active chat.
            setActiveChatId(tutorId);
            setIsChatOpen(true);
        } catch (error) {
            console.error("Failed to start conversation with tutor", error);
            // Optionally show a toast message here to inform the user of an error
        }
    };

    const closeChat = () => {
        setIsChatOpen(false);
        setActiveChatId(null);
    };

    // --- CORRECTED TUTOR LOADING LOGIC ---
    // This useEffect runs once on startup to load ALL tutor profiles from localStorage.


    // useEffect(() => {
    //     const allTutors: TutorProfile[] = [];
    //     for (let i = 0; i < localStorage.length; i++) {
    //         const key = localStorage.key(i);
    //         // It looks for any key that starts with our specific pattern.
    //         if (key && key.startsWith('tutorProfileData_')) {
    //             try {
    //                 const profileString = localStorage.getItem(key);
    //                 if (profileString) {
    //                     allTutors.push(JSON.parse(profileString));
    //                 }
    //             } catch (error) {
    //                 console.error('Failed to parse a tutor profile from localStorage', error);
    //             }
    //         }
    //     }
    //     setTutors(allTutors);
    // }, []);

    useEffect(() => {
        const fetchAllTutors = async () => {
            try {
                const tutorsData = await profileApiService.getAllTutors();
                setTutors(tutorsData);
            } catch (error) {
                console.error("Failed to fetch tutors:", error);
            } finally {
                setIsLoadingTutors(false);
            }
        };
        fetchAllTutors();
    }, []);

    // --- CORRECTED TUTOR UPDATE FUNCTION ---
    // This function correctly adds a new tutor or updates an existing one in the list.
    const updateTutor = (tutorProfile: TutorProfile) => {
        setTutors(prevTutors => {
            const tutorExists = prevTutors.some(t => t.id === tutorProfile.id);
            if (tutorExists) {
                // If the tutor is already in the list, update their info.
                return prevTutors.map(t => (t.id === tutorProfile.id ? tutorProfile : t));
            } else {
                // If the tutor is new, add them to the list.
                return [...prevTutors, tutorProfile];
            }
        });
    };

    // --- YOUR ORIGINAL FUNCTIONS (UNCHANGED) ---
    const showToast = (message: string) => {
        setToast({ message, id: Date.now() });
        setTimeout(() => setToast(null), 3000);
    };

    const login = (userData: UserProfile) => {
        setUser(userData);
        router.push('/dashboard');
        showToast(`Welcome, ${userData.name}!`);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        setCart([]);
        setPurchasedLessonIds([]);
        setPurchases([]);
        setSearchTerm('');
        router.push('/auth');
        showToast('Logged out successfully');
    };

    const addLesson = (lesson: Lesson) => {
        setLessons(prev => {
            const index = prev.findIndex(l => l.id === lesson.id);
            if (index > -1) {
                const updatedLessons = [...prev];
                updatedLessons[index] = lesson;
                showToast("Lesson updated successfully!");
                return updatedLessons;
            }
            showToast("Lesson created successfully!");
            return [lesson, ...prev];
        });
    };

    const deleteLesson = (lessonId: string) => {
        setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
        setPurchases(prev => prev.filter(purchase => purchase.lessonId !== lessonId));
        showToast("Lesson deleted successfully");
    };

    const addToCart = (lesson: Lesson) => {
        if (cart.some(item => item.id === lesson.id)) {
            showToast("Lesson is already in your cart.");
            return;
        }
        if (purchasedLessonIds.includes(lesson.id)) {
            showToast("You have already purchased this lesson.");
            return;
        }
        setCart(prev => [...prev, lesson]);
        showToast("Added to cart!");
    };

    const removeFromCart = (lessonId: string) => {
        setCart(prev => prev.filter(item => item.id !== lessonId));
        showToast("Removed from cart.");
    };

    const purchaseCart = () => {
        if (!user) return;
        const newPurchases: Purchase[] = cart.map(item => ({
            lessonId: item.id,
            studentId: user.id,
            teacherId: item.teacherId,
            purchaseDate: new Date().toISOString(),
            price: item.price
        }));
        const newPurchasedIds = cart.map(item => item.id);
        setPurchases(prev => [...prev, ...newPurchases]);
        setPurchasedLessonIds(prev => [...new Set([...prev, ...newPurchasedIds])]);
        setCart([]);
        showToast("Purchase successful! Lessons added to your library.");
    };

    const rateLesson = (lessonId: string, rating: number, comment?: string) => {
        if (!user) return;
        setLessons(prevLessons => {
            return prevLessons.map(lesson => {
                if (lesson.id === lessonId) {
                    const existingRatingIndex = lesson.ratings?.findIndex(r => r.userId === user.id) ?? -1;
                    const newRating = {
                        userId: user.id,
                        rating,
                        comment,
                        createdAt: new Date().toISOString()
                    };
                    const updatedRatings = existingRatingIndex >= 0
                        ? [
                            ...(lesson.ratings?.slice(0, existingRatingIndex) || []),
                            newRating,
                            ...(lesson.ratings?.slice(existingRatingIndex + 1) || [])
                        ]
                        : [...(lesson.ratings || []), newRating];
                    const averageRating = updatedRatings.reduce((sum, r) => sum + r.rating, 0) / updatedRatings.length;
                    return {
                        ...lesson,
                        ratings: updatedRatings,
                        averageRating
                    };
                }
                return lesson;
            });
        });
        showToast("Thank you for your rating!");
    };

    // --- PROVIDING ALL VALUES TO THE CONTEXT ---
    const contextValue: AppContextType = {
        user,
        lessons,
        cart,
        purchasedLessonIds,
        purchases,
        login,
        logout,
        addLesson,
        deleteLesson,
        addToCart,
        removeFromCart,
        purchaseCart,
        showToast,
        searchTerm,
        setSearchTerm,
        rateLesson,
        tutors, // The corrected list of all tutors
        updateTutor,
        setUser,
        isChatOpen,
        activeChatId,
        openChatWithUser,
        openChatWithTutor,
        closeChat,
        isLoadingTutors,
        unreadMessageCount,
        setUnreadMessageCount,

    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
            {toast && (
                <div className="fixed bottom-5 right-5 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out z-50">
                    {toast.message}
                </div>
            )}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};


// // context/AppContext.tsx
// 'use client';

// import { createContext, useContext, useState, useEffect } from 'react'; // NEW: Added useEffect
// import { useRouter } from 'next/navigation';
// import { Lesson, UserProfile, CartItem, AppContextType, MOCK_LESSONS, Purchase } from '../types';

// // REMOVED: import { useTutorContext } from './TutorContext';
// // NEW: Import TutorProfile and mockTutors
// import { TutorProfile, mockTutors } from '@/app/find-online-tutor/data/tutors';

// export const AppContext = createContext<AppContextType | undefined>(undefined);

// export const AppProvider = ({ children }: { children: React.ReactNode }) => {
//     const router = useRouter();
//     const [user, setUser] = useState<UserProfile | null>(null);
//     const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
//     const [cart, setCart] = useState<CartItem[]>([]);
//     const [purchasedLessonIds, setPurchasedLessonIds] = useState<string[]>([]);
//     const [purchases, setPurchases] = useState<Purchase[]>([]);
//     const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
//     const [searchTerm, setSearchTerm] = useState('');

//     // NEW CODE: Use local state for tutors instead of TutorContext
//     const [tutors, setTutors] = useState<TutorProfile[]>(mockTutors);

//     // NEW CODE: Load saved profiles from localStorage on component mount
//     useEffect(() => {
//         const loadSavedProfiles = () => {
//             try {
//                 const savedProfile = localStorage.getItem('tutorProfileData');
//                 if (savedProfile) {
//                     const parsedProfile = JSON.parse(savedProfile);

//                     setTutors(currentTutors => {
//                         const tutorExists = currentTutors.some(t => t.id === parsedProfile.id);

//                         if (tutorExists) {
//                             // If the tutor is already in the list, update their profile
//                             return currentTutors.map(tutor =>
//                                 tutor.id === parsedProfile.id ? parsedProfile : tutor
//                             );
//                         } else {
//                             // If the tutor is new, add their profile to the list
//                             return [...currentTutors, parsedProfile];
//                         }
//                     });
//                 }
//             } catch (error) {
//                 console.error("Failed to load saved tutor profile:", error);
//             }
//         };

//         loadSavedProfiles();
//     }, []);

//     const showToast = (message: string) => {
//         setToast({ message, id: Date.now() });
//         setTimeout(() => setToast(null), 3000);
//     };

//     const login = (userData: UserProfile) => {
//         setUser(userData);
//         if (userData.role === 'teacher' && !userData.id.startsWith('t')) {
//             userData.id = 't' + Date.now();
//         }
//         router.push('/dashboard');
//         showToast(`Welcome, ${userData.name}!`);
//     };

//     const logout = () => {
//         setUser(null);
//         setCart([]);
//         setPurchasedLessonIds([]);
//         setPurchases([]);
//         setSearchTerm('');
//         router.push('/auth');
//         showToast('Logged out successfully');
//     };

//     const addLesson = (lesson: Lesson) => {
//         setLessons(prev => {
//             const index = prev.findIndex(l => l.id === lesson.id);
//             if (index > -1) {
//                 const updatedLessons = [...prev];
//                 updatedLessons[index] = lesson;
//                 showToast("Lesson updated successfully!");
//                 return updatedLessons;
//             }
//             showToast("Lesson created successfully!");
//             return [lesson, ...prev];
//         });
//     };

//     // NEW: Function to delete a lesson
//     const deleteLesson = (lessonId: string) => {
//         setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
//         // Also remove any purchases associated with this lesson
//         setPurchases(prev => prev.filter(purchase => purchase.lessonId !== lessonId));
//         showToast("Lesson deleted successfully");
//     };

//     const addToCart = (lesson: Lesson) => {
//         if (cart.some(item => item.id === lesson.id)) {
//             showToast("Lesson is already in your cart.");
//             return;
//         }
//         if (purchasedLessonIds.includes(lesson.id)) {
//             showToast("You have already purchased this lesson.");
//             return;
//         }
//         setCart(prev => [...prev, lesson]);
//         showToast("Added to cart!");
//     };

//     const removeFromCart = (lessonId: string) => {
//         setCart(prev => prev.filter(item => item.id !== lessonId));
//         showToast("Removed from cart.");
//     };

//     const purchaseCart = () => {
//         if (!user) return;

//         const newPurchases: Purchase[] = cart.map(item => ({
//             lessonId: item.id,
//             studentId: user.id,
//             teacherId: item.teacherId,
//             purchaseDate: new Date().toISOString(),
//             price: item.price
//         }));

//         const newPurchasedIds = cart.map(item => item.id);

//         setPurchases(prev => [...prev, ...newPurchases]);
//         setPurchasedLessonIds(prev => [...new Set([...prev, ...newPurchasedIds])]);
//         setCart([]);
//         showToast("Purchase successful! Lessons added to your library.");
//     };

//     const rateLesson = (lessonId: string, rating: number, comment?: string) => {
//         if (!user) return;

//         setLessons(prevLessons => {
//             return prevLessons.map(lesson => {
//                 if (lesson.id === lessonId) {
//                     const existingRatingIndex = lesson.ratings?.findIndex(r => r.userId === user.id) ?? -1;
//                     const newRating = {
//                         userId: user.id,
//                         rating,
//                         comment,
//                         createdAt: new Date().toISOString()
//                     };

//                     const updatedRatings = existingRatingIndex >= 0
//                         ? [
//                             ...(lesson.ratings?.slice(0, existingRatingIndex) || []),
//                             newRating,
//                             ...(lesson.ratings?.slice(existingRatingIndex + 1) || [])
//                         ]
//                         : [...(lesson.ratings || []), newRating];

//                     const averageRating = updatedRatings.reduce((sum, r) => sum + r.rating, 0) / updatedRatings.length;

//                     return {
//                         ...lesson,
//                         ratings: updatedRatings,
//                         averageRating
//                     };
//                 }
//                 return lesson;
//             });
//         });

//         showToast("Thank you for your rating!");
//     };

//     const contextValue: AppContextType = {
//         user,
//         lessons,
//         cart,
//         purchasedLessonIds,
//         purchases,
//         login,
//         logout,
//         addLesson,
//         deleteLesson, // Added deleteLesson function
//         addToCart,
//         removeFromCart,
//         purchaseCart,
//         showToast,
//         searchTerm,
//         setSearchTerm,
//         rateLesson,
//         // NEW CODE: Add tutors to the context value
//         tutors
//     };

//     return (
//         <AppContext.Provider value={contextValue}>
//             {children}
//             {toast && (
//                 <div className="fixed bottom-5 right-5 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out z-50">
//                     {toast.message}
//                 </div>
//             )}
//         </AppContext.Provider>
//     );
// };

// export const useAppContext = () => {
//     const context = useContext(AppContext);
//     if (!context) {
//         throw new Error('useAppContext must be used within an AppProvider');
//     }
//     return context;
// };

// // // context/AppContext.tsx
// // 'use client';

// // import { createContext, useContext, useState } from 'react';
// // import { useRouter } from 'next/navigation';
// // import { Lesson, UserProfile, CartItem, AppContextType, MOCK_LESSONS, Purchase } from '../types';

// // export const AppContext = createContext<AppContextType | undefined>(undefined);

// // export const AppProvider = ({ children }: { children: React.ReactNode }) => {
// //     const router = useRouter();
// //     const [user, setUser] = useState<UserProfile | null>(null);
// //     const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
// //     const [cart, setCart] = useState<CartItem[]>([]);
// //     const [purchasedLessonIds, setPurchasedLessonIds] = useState<string[]>([]);
// //     const [purchases, setPurchases] = useState<Purchase[]>([]);
// //     const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
// //     const [searchTerm, setSearchTerm] = useState('');

// //     const showToast = (message: string) => {
// //         setToast({ message, id: Date.now() });
// //         setTimeout(() => setToast(null), 3000);
// //     };

// //     const login = (userData: UserProfile) => {
// //         setUser(userData);
// //         if (userData.role === 'teacher' && !userData.id.startsWith('t')) {
// //             userData.id = 't' + Date.now();
// //         }
// //         router.push('/dashboard');
// //         showToast(`Welcome, ${userData.name}!`);
// //     };

// //     const logout = () => {
// //         setUser(null);
// //         setCart([]);
// //         setPurchasedLessonIds([]);
// //         setPurchases([]);
// //         setSearchTerm('');
// //         router.push('/auth');
// //         showToast('Logged out successfully');
// //     };

// //     const addLesson = (lesson: Lesson) => {
// //         setLessons(prev => {
// //             const index = prev.findIndex(l => l.id === lesson.id);
// //             if (index > -1) {
// //                 const updatedLessons = [...prev];
// //                 updatedLessons[index] = lesson;
// //                 showToast("Lesson updated successfully!");
// //                 return updatedLessons;
// //             }
// //             showToast("Lesson created successfully!");
// //             return [lesson, ...prev];
// //         });
// //     };

// //     // NEW: Function to delete a lesson
// //     const deleteLesson = (lessonId: string) => {
// //         setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
// //         // Also remove any purchases associated with this lesson
// //         setPurchases(prev => prev.filter(purchase => purchase.lessonId !== lessonId));
// //         showToast("Lesson deleted successfully");
// //     };

// //     const addToCart = (lesson: Lesson) => {
// //         if (cart.some(item => item.id === lesson.id)) {
// //             showToast("Lesson is already in your cart.");
// //             return;
// //         }
// //         if (purchasedLessonIds.includes(lesson.id)) {
// //             showToast("You have already purchased this lesson.");
// //             return;
// //         }
// //         setCart(prev => [...prev, lesson]);
// //         showToast("Added to cart!");
// //     };

// //     const removeFromCart = (lessonId: string) => {
// //         setCart(prev => prev.filter(item => item.id !== lessonId));
// //         showToast("Removed from cart.");
// //     };

// //     const purchaseCart = () => {
// //         if (!user) return;

// //         const newPurchases: Purchase[] = cart.map(item => ({
// //             lessonId: item.id,
// //             studentId: user.id,
// //             teacherId: item.teacherId,
// //             purchaseDate: new Date().toISOString(),
// //             price: item.price
// //         }));

// //         const newPurchasedIds = cart.map(item => item.id);

// //         setPurchases(prev => [...prev, ...newPurchases]);
// //         setPurchasedLessonIds(prev => [...new Set([...prev, ...newPurchasedIds])]);
// //         setCart([]);
// //         showToast("Purchase successful! Lessons added to your library.");
// //     };

// //     const rateLesson = (lessonId: string, rating: number, comment?: string) => {
// //         if (!user) return;

// //         setLessons(prevLessons => {
// //             return prevLessons.map(lesson => {
// //                 if (lesson.id === lessonId) {
// //                     const existingRatingIndex = lesson.ratings?.findIndex(r => r.userId === user.id) ?? -1;
// //                     const newRating = {
// //                         userId: user.id,
// //                         rating,
// //                         comment,
// //                         createdAt: new Date().toISOString()
// //                     };

// //                     const updatedRatings = existingRatingIndex >= 0
// //                         ? [
// //                             ...(lesson.ratings?.slice(0, existingRatingIndex) || []),
// //                             newRating,
// //                             ...(lesson.ratings?.slice(existingRatingIndex + 1) || [])
// //                         ]
// //                         : [...(lesson.ratings || []), newRating];

// //                     const averageRating = updatedRatings.reduce((sum, r) => sum + r.rating, 0) / updatedRatings.length;

// //                     return {
// //                         ...lesson,
// //                         ratings: updatedRatings,
// //                         averageRating
// //                     };
// //                 }
// //                 return lesson;
// //             });
// //         });

// //         showToast("Thank you for your rating!");
// //     };

// //     const contextValue: AppContextType = {
// //         user,
// //         lessons,
// //         cart,
// //         purchasedLessonIds,
// //         purchases,
// //         login,
// //         logout,
// //         addLesson,
// //         deleteLesson, // Added deleteLesson function
// //         addToCart,
// //         removeFromCart,
// //         purchaseCart,
// //         showToast,
// //         searchTerm,
// //         setSearchTerm,
// //         rateLesson
// //     };

// //     return (
// //         <AppContext.Provider value={contextValue}>
// //             {children}
// //             {toast && (
// //                 <div className="fixed bottom-5 right-5 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out z-50">
// //                     {toast.message}
// //                 </div>
// //             )}
// //         </AppContext.Provider>
// //     );
// // };

// // export const useAppContext = () => {
// //     const context = useContext(AppContext);
// //     if (!context) {
// //         throw new Error('useAppContext must be used within an AppProvider');
// //     }
// //     return context;
// // };

// // // // context/AppContext.tsx
// // // 'use client';

// // // import { createContext, useContext, useState } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import { Lesson, UserProfile, CartItem, AppContextType, MOCK_LESSONS, Purchase } from '../types'; // Add Purchase to your types

// // // export const AppContext = createContext<AppContextType | undefined>(undefined);

// // // export const AppProvider = ({ children }: { children: React.ReactNode }) => {
// // //     const router = useRouter();
// // //     const [user, setUser] = useState<UserProfile | null>(null);
// // //     const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
// // //     const [cart, setCart] = useState<CartItem[]>([]);
// // //     const [purchasedLessonIds, setPurchasedLessonIds] = useState<string[]>([]);
// // //     const [purchases, setPurchases] = useState<Purchase[]>([]); // New state for tracking purchases
// // //     const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
// // //     const [searchTerm, setSearchTerm] = useState('');

// // //     const showToast = (message: string) => {
// // //         setToast({ message, id: Date.now() });
// // //         setTimeout(() => setToast(null), 3000);
// // //     };

// // //     const login = (userData: UserProfile) => {
// // //         setUser(userData);
// // //         if (userData.role === 'teacher' && !userData.id.startsWith('t')) {
// // //             userData.id = 't' + Date.now();
// // //         }
// // //         router.push('/dashboard');
// // //         showToast(`Welcome, ${userData.name}!`);
// // //     };

// // //     const logout = () => {
// // //         setUser(null);
// // //         setCart([]);
// // //         setPurchasedLessonIds([]);
// // //         setPurchases([]);
// // //         setSearchTerm('');
// // //         router.push('/auth');
// // //         showToast('Logged out successfully');
// // //     };

// // //     const addLesson = (lesson: Lesson) => {
// // //         setLessons(prev => {
// // //             const index = prev.findIndex(l => l.id === lesson.id);
// // //             if (index > -1) {
// // //                 const updatedLessons = [...prev];
// // //                 updatedLessons[index] = lesson;
// // //                 showToast("Lesson updated successfully!");
// // //                 return updatedLessons;
// // //             }
// // //             showToast("Lesson created successfully!");
// // //             return [lesson, ...prev];
// // //         });
// // //     };

// // //     const addToCart = (lesson: Lesson) => {
// // //         if (cart.some(item => item.id === lesson.id)) {
// // //             showToast("Lesson is already in your cart.");
// // //             return;
// // //         }
// // //         if (purchasedLessonIds.includes(lesson.id)) {
// // //             showToast("You have already purchased this lesson.");
// // //             return;
// // //         }
// // //         setCart(prev => [...prev, lesson]);
// // //         showToast("Added to cart!");
// // //     };

// // //     const removeFromCart = (lessonId: string) => {
// // //         setCart(prev => prev.filter(item => item.id !== lessonId));
// // //         showToast("Removed from cart.");
// // //     };

// // //     const purchaseCart = () => {
// // //         if (!user) return;

// // //         const newPurchases: Purchase[] = cart.map(item => ({
// // //             lessonId: item.id,
// // //             studentId: user.id,
// // //             teacherId: item.teacherId,
// // //             purchaseDate: new Date().toISOString(),
// // //             price: item.price
// // //         }));

// // //         const newPurchasedIds = cart.map(item => item.id);

// // //         setPurchases(prev => [...prev, ...newPurchases]);
// // //         setPurchasedLessonIds(prev => [...new Set([...prev, ...newPurchasedIds])]);
// // //         setCart([]);
// // //         showToast("Purchase successful! Lessons added to your library.");
// // //     };

// // //     const rateLesson = (lessonId: string, rating: number, comment?: string) => {
// // //         if (!user) return;

// // //         setLessons(prevLessons => {
// // //             return prevLessons.map(lesson => {
// // //                 if (lesson.id === lessonId) {
// // //                     const existingRatingIndex = lesson.ratings?.findIndex(r => r.userId === user.id) ?? -1;
// // //                     const newRating = {
// // //                         userId: user.id,
// // //                         rating,
// // //                         comment,
// // //                         createdAt: new Date().toISOString()
// // //                     };

// // //                     const updatedRatings = existingRatingIndex >= 0
// // //                         ? [
// // //                             ...(lesson.ratings?.slice(0, existingRatingIndex) || []),
// // //                             newRating,
// // //                             ...(lesson.ratings?.slice(existingRatingIndex + 1) || [])
// // //                         ]
// // //                         : [...(lesson.ratings || []), newRating];

// // //                     const averageRating = updatedRatings.reduce((sum, r) => sum + r.rating, 0) / updatedRatings.length;

// // //                     return {
// // //                         ...lesson,
// // //                         ratings: updatedRatings,
// // //                         averageRating
// // //                     };
// // //                 }
// // //                 return lesson;
// // //             });
// // //         });

// // //         showToast("Thank you for your rating!");
// // //     };

// // //     const contextValue: AppContextType = {
// // //         user,
// // //         lessons,
// // //         cart,
// // //         purchasedLessonIds,
// // //         purchases, // Add purchases to context
// // //         login,
// // //         logout,
// // //         addLesson,
// // //         addToCart,
// // //         removeFromCart,
// // //         purchaseCart,
// // //         showToast,
// // //         searchTerm,
// // //         setSearchTerm,
// // //         rateLesson
// // //     };

// // //     return (
// // //         <AppContext.Provider value={contextValue}>
// // //             {children}
// // //             {toast && (
// // //                 <div className="fixed bottom-5 right-5 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out z-50">
// // //                     {toast.message}
// // //                 </div>
// // //             )}
// // //         </AppContext.Provider>
// // //     );
// // // };

// // // export const useAppContext = () => {
// // //     const context = useContext(AppContext);
// // //     if (!context) {
// // //         throw new Error('useAppContext must be used within an AppProvider');
// // //     }
// // //     return context;
// // // };


// // // // context/AppContext.tsx
// // // 'use client';

// // // import { createContext, useContext, useState } from 'react';
// // // import { useRouter } from 'next/navigation';
// // // import { Lesson, UserProfile, CartItem, AppContextType, MOCK_LESSONS } from '../types';

// // // export const AppContext = createContext<AppContextType | undefined>(undefined);

// // // export const AppProvider = ({ children }: { children: React.ReactNode }) => {
// // //     const router = useRouter();
// // //     const [user, setUser] = useState<UserProfile | null>(null);
// // //     const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
// // //     const [cart, setCart] = useState<CartItem[]>([]);
// // //     const [purchasedLessonIds, setPurchasedLessonIds] = useState<string[]>([]);
// // //     const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
// // //     const [searchTerm, setSearchTerm] = useState('');

// // //     const showToast = (message: string) => {
// // //         setToast({ message, id: Date.now() });
// // //         setTimeout(() => setToast(null), 3000);
// // //     };

// // //     const login = (userData: UserProfile) => {
// // //         setUser(userData);
// // //         if (userData.role === 'teacher' && !userData.id.startsWith('t')) {
// // //             userData.id = 't' + Date.now();
// // //         }
// // //         router.push('/dashboard');
// // //         showToast(`Welcome, ${userData.name}!`);
// // //     };

// // //     const logout = () => {
// // //         setUser(null);
// // //         setCart([]);
// // //         setPurchasedLessonIds([]);
// // //         setSearchTerm('');
// // //         router.push('/auth');
// // //         showToast('Logged out successfully');
// // //     };

// // //     const addLesson = (lesson: Lesson) => {
// // //         setLessons(prev => {
// // //             const index = prev.findIndex(l => l.id === lesson.id);
// // //             if (index > -1) {
// // //                 const updatedLessons = [...prev];
// // //                 updatedLessons[index] = lesson;
// // //                 showToast("Lesson updated successfully!");
// // //                 return updatedLessons;
// // //             }
// // //             showToast("Lesson created successfully!");
// // //             return [lesson, ...prev];
// // //         });
// // //     };

// // //     const addToCart = (lesson: Lesson) => {
// // //         if (cart.some(item => item.id === lesson.id)) {
// // //             showToast("Lesson is already in your cart.");
// // //             return;
// // //         }
// // //         if (purchasedLessonIds.includes(lesson.id)) {
// // //             showToast("You have already purchased this lesson.");
// // //             return;
// // //         }
// // //         setCart(prev => [...prev, lesson]);
// // //         showToast("Added to cart!");
// // //     };

// // //     const removeFromCart = (lessonId: string) => {
// // //         setCart(prev => prev.filter(item => item.id !== lessonId));
// // //         showToast("Removed from cart.");
// // //     };

// // //     const purchaseCart = () => {
// // //         const newPurchasedIds = cart.map(item => item.id);
// // //         setPurchasedLessonIds(prev => [...new Set([...prev, ...newPurchasedIds])]);
// // //         setCart([]);
// // //         showToast("Purchase successful! Lessons added to your library.");
// // //     };

// // //     // ADDED: Function to handle lesson ratings
// // //     const rateLesson = (lessonId: string, rating: number, comment?: string) => {
// // //         if (!user) return;

// // //         setLessons(prevLessons => {
// // //             return prevLessons.map(lesson => {
// // //                 if (lesson.id === lessonId) {
// // //                     // Check if user already rated this lesson
// // //                     const existingRatingIndex = lesson.ratings?.findIndex(r => r.userId === user.id) ?? -1;
// // //                     const newRating = {
// // //                         userId: user.id,
// // //                         rating,
// // //                         comment,
// // //                         createdAt: new Date().toISOString()
// // //                     };

// // //                     // Update ratings array
// // //                     const updatedRatings = existingRatingIndex >= 0
// // //                         ? [
// // //                             ...(lesson.ratings?.slice(0, existingRatingIndex) || []),
// // //                             newRating,
// // //                             ...(lesson.ratings?.slice(existingRatingIndex + 1) || [])
// // //                         ]
// // //                         : [...(lesson.ratings || []), newRating];

// // //                     // Calculate new average rating
// // //                     const averageRating = updatedRatings.reduce((sum, r) => sum + r.rating, 0) / updatedRatings.length;

// // //                     return {
// // //                         ...lesson,
// // //                         ratings: updatedRatings,
// // //                         averageRating
// // //                     };
// // //                 }
// // //                 return lesson;
// // //             });
// // //         });

// // //         showToast("Thank you for your rating!");
// // //     };

// // //     const contextValue: AppContextType = {
// // //         user,
// // //         lessons,
// // //         cart,
// // //         purchasedLessonIds,
// // //         login,
// // //         logout,
// // //         addLesson,
// // //         addToCart,
// // //         removeFromCart,
// // //         purchaseCart,
// // //         showToast,
// // //         searchTerm,
// // //         setSearchTerm,
// // //         rateLesson // ADDED: Include rateLesson in context
// // //     };

// // //     return (
// // //         <AppContext.Provider value={contextValue}>
// // //             {children}
// // //             {toast && (
// // //                 <div className="fixed bottom-5 right-5 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out z-50">
// // //                     {toast.message}
// // //                 </div>
// // //             )}
// // //         </AppContext.Provider>
// // //     );
// // // };

// // // export const useAppContext = () => {
// // //     const context = useContext(AppContext);
// // //     if (!context) {
// // //         throw new Error('useAppContext must be used within an AppProvider');
// // //     }
// // //     return context;
// // // };

