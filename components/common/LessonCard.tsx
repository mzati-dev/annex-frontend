// components/common/LessonCard.tsx
'use client';

import { useAppContext } from '../../context/AppContext';
import { Star, Clock, ShoppingCart } from 'lucide-react';
import Button from './Button';
import { Lesson } from '@/types';

interface LessonCardProps {
    lesson: Lesson;
    isPurchased: boolean;
    onView: (lesson: Lesson) => void;
    onAddToCart?: (lesson: Lesson) => void;
    onBuyNow?: (lesson: Lesson) => void;
    onEdit?: (lesson: Lesson) => void;
}

/**
 * Card component for displaying lesson information
 */
export default function LessonCard({
    lesson,
    isPurchased,
    onView,
    onAddToCart,
    onBuyNow,
    onEdit
}: LessonCardProps) {
    const { user } = useAppContext();
    const nameParts = lesson.teacherName?.split(' ') || [];
    let formattedTeacherName = lesson.teacherName; // Default to the full name

    // If there is a first and last name, format it as "J. Banda"
    if (nameParts.length > 1) {
        const firstNameInitial = nameParts[0][0]; // Gets the first letter of the first name
        const surname = nameParts[nameParts.length - 1]; // Gets the last name
        formattedTeacherName = `${firstNameInitial}. ${surname}`;
    }

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1 flex flex-col">
            {/* Lesson content */}
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
                    {/* Display average rating if available */}
                    {lesson.averageRating && (
                        <div className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded-full text-xs text-yellow-400 flex-shrink-0">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{lesson.averageRating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                <p className="text-sm text-slate-400 mb-4 h-10 line-clamp-2">{lesson.description}</p>

                {/* Lesson tags */}
                {/* <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs font-semibold bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">{lesson.subject}</span>
                     <span className="ml-2 text-slate-500">|</span>
                    <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{lesson.form}</span>
                    <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">By {lesson.teacherName}</span>
                </div> */}

                {/* Lesson tags */}
                <div className="flex justify-between items-center mb-4">
                    {/* Left side (subject + form) */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                            {lesson.subject}
                        </span>
                        <span className="text-slate-500">|</span>
                        <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                            {lesson.form}
                        </span>
                    </div>

                    {/* Right side (teacher name) */}
                    <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                        By {formattedTeacherName}
                    </span>
                </div>


                {/* Duration and price */}
                <div className="flex justify-between items-center text-sm text-slate-300 border-t border-slate-700 pt-3 mt-auto">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.durationMinutes} min</span>
                    </div>
                    <span className="text-xl font-bold text-white">
                        <span className="h-5 w-5 text-green-400">MWK </span>{(typeof lesson.price === 'number' ? lesson.price : Number(lesson.price) || 0).toFixed(2)}
                    </span>

                </div>
            </div>

            {/* Action buttons */}
            <div className="p-3 bg-slate-900/50">
                {user?.role === 'student' ? (
                    isPurchased ? (
                        <Button onClick={() => onView(lesson)} variant="secondary" className="w-full">
                            View Lesson
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                onClick={() => onAddToCart?.(lesson)}
                                variant="secondary"
                                className="flex-1 cursor-pointer "
                            >
                                <ShoppingCart className="h-4 w-4 mr-2 cursor-pointer " />
                                Add to Cart
                            </Button>
                            <Button
                                onClick={() => onBuyNow?.(lesson)}
                                className="flex-1 cursor-pointer "
                            >
                                Buy Now
                            </Button>
                        </div>
                    )
                ) : (
                    <Button onClick={() => onEdit?.(lesson)} variant="secondary" className="w-full">
                        Edit Lesson
                    </Button>
                )}
            </div>
        </div>
    );
}

// 'use client';

// import { useAppContext } from '../../context/AppContext';
// import { Star, Clock, ShoppingCart } from 'lucide-react';
// import Button from './Button';
// import { Lesson } from '@/types';

// interface LessonCardProps {
//     lesson: Lesson;
//     isPurchased: boolean;
//     onView: (lesson: Lesson) => void;
//     onAddToCart?: (lesson: Lesson) => void; // ADDED: Optional add to cart handler
//     onBuyNow?: (lesson: Lesson) => void;    // ADDED: Optional buy now handler
//     onEdit?: (lesson: Lesson) => void;
// }

// export default function LessonCard({
//     lesson,
//     isPurchased,
//     onView,
//     onAddToCart,
//     onBuyNow,
//     onEdit
// }: LessonCardProps) {
//     const { user } = useAppContext();

//     return (
//         <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1 flex flex-col">
//             <div className="p-5 flex-grow">
//                 <div className="flex justify-between items-start mb-2">
//                     <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
//                     <div className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded-full text-xs text-yellow-400 flex-shrink-0">
//                         <Star className="w-3 h-3 fill-current" />
//                         <span>{lesson.rating}</span>
//                     </div>
//                 </div>
//                 <p className="text-sm text-slate-400 mb-4 h-10 line-clamp-2">{lesson.description}</p>
//                 <div className="flex flex-wrap gap-2 mb-4">
//                     <span className="text-xs font-semibold bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">{lesson.subject}</span>
//                     <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{lesson.form}</span>
//                     <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">By {lesson.teacherName}</span>
//                 </div>
//                 <div className="flex justify-between items-center text-sm text-slate-300 border-t border-slate-700 pt-3 mt-auto">
//                     <div className="flex items-center gap-1">
//                         <Clock className="w-4 h-4" />
//                         <span>{lesson.durationMinutes} min</span>
//                     </div>
//                     <span className="text-xl font-bold text-white">MWK {lesson.price.toFixed(2)}</span>
//                 </div>
//             </div>
//             <div className="p-3 bg-slate-900/50">
//                 {user?.role === 'student' && (
//                     isPurchased ? (
//                         <Button onClick={() => onView(lesson)} variant="secondary" className="w-full">View Lesson</Button>
//                     ) : (
//                         <div className="flex gap-2">
//                             {/* CHANGED: Updated button handlers */}
//                             <Button
//                                 onClick={() => onAddToCart?.(lesson)}
//                                 variant="secondary"
//                                 className="flex-1"
//                             >
//                                 <ShoppingCart className="h-4 w-4 mr-2" />
//                                 Add to Cart
//                             </Button>
//                             <Button
//                                 onClick={() => onBuyNow?.(lesson)}
//                                 className="flex-1"
//                             >
//                                 Buy Now
//                             </Button>
//                         </div>
//                     )
//                 )}
//                 {user?.role === 'teacher' && (
//                     <Button onClick={() => onEdit?.(lesson)} variant="secondary" className="w-full">Edit Lesson</Button>
//                 )}
//             </div>
//         </div>
//     );
// }

// 'use client';

// import { useAppContext } from '../../context/AppContext';
// import { Star, Clock, ShoppingCart } from 'lucide-react';
// import Button from './Button';
// import { Lesson } from '@/types';

// export default function LessonCard({
//     lesson,
//     isPurchased,
//     onView,
//     onEdit
// }: {
//     lesson: Lesson;
//     isPurchased: boolean;
//     onView: (lesson: Lesson) => void;
//     onEdit?: (lesson: Lesson) => void;
// }) {
//     const { user, addToCart } = useAppContext();

//     return (
//         <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1 flex flex-col">
//             <div className="p-5 flex-grow">
//                 <div className="flex justify-between items-start mb-2">
//                     <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
//                     <div className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded-full text-xs text-yellow-400 flex-shrink-0">
//                         <Star className="w-3 h-3 fill-current" />
//                         <span>{lesson.rating}</span>
//                     </div>
//                 </div>
//                 <p className="text-sm text-slate-400 mb-4 h-10 line-clamp-2">{lesson.description}</p>
//                 <div className="flex flex-wrap gap-2 mb-4">
//                     <span className="text-xs font-semibold bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">{lesson.subject}</span>
//                     <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">{lesson.form}</span>
//                     <span className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-full">By {lesson.teacherName}</span>
//                 </div>
//                 <div className="flex justify-between items-center text-sm text-slate-300 border-t border-slate-700 pt-3 mt-auto">
//                     <div className="flex items-center gap-1">
//                         <Clock className="w-4 h-4" />
//                         <span>{lesson.durationMinutes} min</span>
//                     </div>
//                     <span className="text-xl font-bold text-white">MWK {lesson.price.toFixed(2)}</span>
//                 </div>
//             </div>
//             <div className="p-3 bg-slate-900/50">
//                 {user?.role === 'student' && (
//                     isPurchased ? (
//                         <Button onClick={() => onView(lesson)} variant="secondary" className="w-full">View Lesson</Button>
//                     ) : (
//                         <div className="flex gap-2">
//                             <Button onClick={() => addToCart(lesson)} variant="secondary" className="flex-1">
//                                 <ShoppingCart className="h-4 w-4 mr-2" />
//                                 Add to Cart
//                             </Button>
//                             <Button onClick={() => { addToCart(lesson); }} className="flex-1">Buy Now</Button>
//                         </div>
//                     )
//                 )}
//                 {user?.role === 'teacher' && (
//                     <Button onClick={() => onEdit?.(lesson)} variant="secondary" className="w-full">Edit Lesson</Button>
//                 )}
//             </div>
//         </div>
//     );
// }