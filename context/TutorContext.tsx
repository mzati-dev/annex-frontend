// // context/TutorContext.tsx
// 'use client';

// import { mockTutors, TutorProfile } from '@/app/find-online-tutor/data/tutors';
// import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// // Define the shape of the data the context will provide
// interface TutorContextType {
//     tutors: TutorProfile[];
//     updateTutor: (updatedProfile: TutorProfile) => void;
// }

// // Create the context with a default value of undefined
// const TutorContext = createContext<TutorContextType | undefined>(undefined);

// // NEW CODE: Storage key constant
// const PROFILE_STORAGE_KEY = 'tutorProfileData';

// // Create a Provider component that will wrap your application
// export const TutorProvider = ({ children }: { children: ReactNode }) => {
//     const [tutors, setTutors] = useState<TutorProfile[]>(mockTutors);

//     // NEW CODE: Load saved profiles from localStorage on component mount
//     useEffect(() => {
//         const loadSavedProfiles = () => {
//             try {
//                 const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
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

//     // --- THIS IS THE CORRECTED FUNCTION ---
//     const updateTutor = (updatedProfile: TutorProfile) => {
//         setTutors(currentTutors => {
//             const tutorExists = currentTutors.some(t => t.id === updatedProfile.id);

//             if (tutorExists) {
//                 // If the tutor is already in the list, update their profile
//                 return currentTutors.map(tutor =>
//                     tutor.id === updatedProfile.id ? updatedProfile : tutor
//                 );
//             } else {
//                 // If the tutor is new, add their profile to the list
//                 return [...currentTutors, updatedProfile];
//             }
//         });

//         // NEW CODE: Also save to localStorage for persistence
//         localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
//     };

//     return (
//         <TutorContext.Provider value={{ tutors, updateTutor }}>
//             {children}
//         </TutorContext.Provider>
//     );
// };

// // Create a custom hook for easy access to the context
// export const useTutorContext = () => {
//     const context = useContext(TutorContext);
//     if (context === undefined) {
//         throw new Error('useTutorContext must be used within a TutorProvider');
//     }
//     return context;
// };


// 'use client';

// import { mockTutors, TutorProfile } from '@/app/find-online-tutor/data/tutors';
// import React, { createContext, useContext, useState, ReactNode } from 'react';

// // Define the shape of the data the context will provide
// interface TutorContextType {
//     tutors: TutorProfile[];
//     updateTutor: (updatedProfile: TutorProfile) => void;
// }

// // Create the context with a default value of undefined
// const TutorContext = createContext<TutorContextType | undefined>(undefined);

// // Create a Provider component that will wrap your application
// export const TutorProvider = ({ children }: { children: ReactNode }) => {
//     const [tutors, setTutors] = useState<TutorProfile[]>(mockTutors);

//     // --- THIS IS THE CORRECTED FUNCTION ---
//     const updateTutor = (updatedProfile: TutorProfile) => {
//         setTutors(currentTutors => {
//             const tutorExists = currentTutors.some(t => t.id === updatedProfile.id);

//             if (tutorExists) {
//                 // If the tutor is already in the list, update their profile
//                 return currentTutors.map(tutor =>
//                     tutor.id === updatedProfile.id ? updatedProfile : tutor
//                 );
//             } else {
//                 // If the tutor is new, add their profile to the list
//                 return [...currentTutors, updatedProfile];
//             }
//         });
//     };

//     return (
//         <TutorContext.Provider value={{ tutors, updateTutor }}>
//             {children}
//         </TutorContext.Provider>
//     );
// };

// // Create a custom hook for easy access to the context
// export const useTutorContext = () => {
//     const context = useContext(TutorContext);
//     if (context === undefined) {
//         throw new Error('useTutorContext must be used within a TutorProvider');
//     }
//     return context;
// };



// // src/context/TutorContext.tsx
// 'use client';

// import { mockTutors, TutorProfile } from '@/app/find-online-tutor/data/tutors';
// import React, { createContext, useContext, useState, ReactNode } from 'react';
// // import { mockTutors, TutorProfile } from '@/data/tutors';

// // Define the shape of the data the context will provide
// interface TutorContextType {
//     tutors: TutorProfile[];
//     updateTutor: (updatedProfile: TutorProfile) => void;
// }

// // Create the context with a default value of undefined
// const TutorContext = createContext<TutorContextType | undefined>(undefined);

// // Create a Provider component that will wrap your application
// export const TutorProvider = ({ children }: { children: ReactNode }) => {
//     const [tutors, setTutors] = useState<TutorProfile[]>(mockTutors);

//     const updateTutor = (updatedProfile: TutorProfile) => {
//         setTutors(currentTutors =>
//             currentTutors.map(tutor =>
//                 tutor.id === updatedProfile.id ? updatedProfile : tutor
//             )
//         );
//     };

//     return (
//         <TutorContext.Provider value={{ tutors, updateTutor }}>
//             {children}
//         </TutorContext.Provider>
//     );
// };

// // Create a custom hook for easy access to the context
// export const useTutorContext = () => {
//     const context = useContext(TutorContext);
//     if (context === undefined) {
//         throw new Error('useTutorContext must be used within a TutorProvider');
//     }
//     return context;
// };