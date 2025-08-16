// context/AppContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lesson, UserProfile, CartItem, AppContextType, MOCK_LESSONS, Purchase } from '../types';

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [purchasedLessonIds, setPurchasedLessonIds] = useState<string[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const showToast = (message: string) => {
        setToast({ message, id: Date.now() });
        setTimeout(() => setToast(null), 3000);
    };

    const login = (userData: UserProfile) => {
        setUser(userData);
        if (userData.role === 'teacher' && !userData.id.startsWith('t')) {
            userData.id = 't' + Date.now();
        }
        router.push('/dashboard');
        showToast(`Welcome, ${userData.name}!`);
    };

    const logout = () => {
        setUser(null);
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

    // NEW: Function to delete a lesson
    const deleteLesson = (lessonId: string) => {
        setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
        // Also remove any purchases associated with this lesson
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

    const contextValue: AppContextType = {
        user,
        lessons,
        cart,
        purchasedLessonIds,
        purchases,
        login,
        logout,
        addLesson,
        deleteLesson, // Added deleteLesson function
        addToCart,
        removeFromCart,
        purchaseCart,
        showToast,
        searchTerm,
        setSearchTerm,
        rateLesson
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

// import { createContext, useContext, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Lesson, UserProfile, CartItem, AppContextType, MOCK_LESSONS, Purchase } from '../types'; // Add Purchase to your types

// export const AppContext = createContext<AppContextType | undefined>(undefined);

// export const AppProvider = ({ children }: { children: React.ReactNode }) => {
//     const router = useRouter();
//     const [user, setUser] = useState<UserProfile | null>(null);
//     const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
//     const [cart, setCart] = useState<CartItem[]>([]);
//     const [purchasedLessonIds, setPurchasedLessonIds] = useState<string[]>([]);
//     const [purchases, setPurchases] = useState<Purchase[]>([]); // New state for tracking purchases
//     const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
//     const [searchTerm, setSearchTerm] = useState('');

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
//         purchases, // Add purchases to context
//         login,
//         logout,
//         addLesson,
//         addToCart,
//         removeFromCart,
//         purchaseCart,
//         showToast,
//         searchTerm,
//         setSearchTerm,
//         rateLesson
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


// // context/AppContext.tsx
// 'use client';

// import { createContext, useContext, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Lesson, UserProfile, CartItem, AppContextType, MOCK_LESSONS } from '../types';

// export const AppContext = createContext<AppContextType | undefined>(undefined);

// export const AppProvider = ({ children }: { children: React.ReactNode }) => {
//     const router = useRouter();
//     const [user, setUser] = useState<UserProfile | null>(null);
//     const [lessons, setLessons] = useState<Lesson[]>(MOCK_LESSONS);
//     const [cart, setCart] = useState<CartItem[]>([]);
//     const [purchasedLessonIds, setPurchasedLessonIds] = useState<string[]>([]);
//     const [toast, setToast] = useState<{ message: string; id: number } | null>(null);
//     const [searchTerm, setSearchTerm] = useState('');

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
//         const newPurchasedIds = cart.map(item => item.id);
//         setPurchasedLessonIds(prev => [...new Set([...prev, ...newPurchasedIds])]);
//         setCart([]);
//         showToast("Purchase successful! Lessons added to your library.");
//     };

//     // ADDED: Function to handle lesson ratings
//     const rateLesson = (lessonId: string, rating: number, comment?: string) => {
//         if (!user) return;

//         setLessons(prevLessons => {
//             return prevLessons.map(lesson => {
//                 if (lesson.id === lessonId) {
//                     // Check if user already rated this lesson
//                     const existingRatingIndex = lesson.ratings?.findIndex(r => r.userId === user.id) ?? -1;
//                     const newRating = {
//                         userId: user.id,
//                         rating,
//                         comment,
//                         createdAt: new Date().toISOString()
//                     };

//                     // Update ratings array
//                     const updatedRatings = existingRatingIndex >= 0
//                         ? [
//                             ...(lesson.ratings?.slice(0, existingRatingIndex) || []),
//                             newRating,
//                             ...(lesson.ratings?.slice(existingRatingIndex + 1) || [])
//                         ]
//                         : [...(lesson.ratings || []), newRating];

//                     // Calculate new average rating
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
//         login,
//         logout,
//         addLesson,
//         addToCart,
//         removeFromCart,
//         purchaseCart,
//         showToast,
//         searchTerm,
//         setSearchTerm,
//         rateLesson // ADDED: Include rateLesson in context
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

