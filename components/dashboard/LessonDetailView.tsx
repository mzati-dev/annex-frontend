// components/student/LessonDetailView.tsx
'use client';

import { ArrowLeft, Star, Loader2 } from 'lucide-react';
import Button from '../common/Button';
import { Lesson } from '@/types';
import { useAppContext } from '../../context/AppContext';
import { useState } from 'react';
import RatingForm from '../common/RatingForm';

interface LessonDetailViewProps {
    lesson: Lesson;
    onBack: () => void;
    onRatingSubmitted?: () => void;
}

/**
 * Detailed view of a lesson with rating functionality
 */
export default function LessonDetailView({
    lesson,
    onBack,
    onRatingSubmitted,
}: LessonDetailViewProps) {
    const { user } = useAppContext();
    const [showRatingForm, setShowRatingForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentLesson, setCurrentLesson] = useState(lesson);

    // Check if current user has already rated this lesson
    const userRating = user ? currentLesson.ratings?.find(r => r.userId === user.id) : undefined;
    const hasRated = Boolean(userRating);

    // Called when RatingForm successfully submits
    const handleRatingSuccess = () => {
        setShowRatingForm(false);
        // Optionally refresh or notify parent
        if (onRatingSubmitted) onRatingSubmitted();

        // For better UX, you might want to refetch lesson ratings here,
        // or just append new rating manually if you can get it from backend
        // For now, we do not update currentLesson locally since RatingForm handles submission
    };

    return (
        <div className="animate-fade-in">
            {/* Back button */}
            <Button onClick={onBack} variant="ghost" className="mb-6" disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                    <ArrowLeft className="h-4 w-4 mr-2" />
                )}
                Back to Lessons
            </Button>

            {/* Lesson content container */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
                {/* Video player */}
                {currentLesson.videoUrl && (
                    <div className="bg-black">
                        <video
                            controls
                            className="w-full aspect-video"
                            src={currentLesson.videoUrl}
                            key={currentLesson.videoUrl}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}

                {/* Lesson details */}
                <div className="p-8 space-y-6">
                    {/* Title and rating display */}
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold text-white">{currentLesson.title}</h1>
                        {currentLesson.averageRating && (
                            <div className="flex items-center bg-slate-700/50 px-3 py-1 rounded-full">
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="font-medium text-white">
                                    {currentLesson.averageRating.toFixed(1)}
                                </span>
                                <span className="text-slate-400 ml-1 text-sm">
                                    ({currentLesson.ratings?.length || 0})
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Lesson metadata */}
                    <div className="flex items-center gap-4 text-slate-300">
                        <span>{currentLesson.subject}</span>
                        <span>&bull;</span>
                        <span>{currentLesson.form}</span>
                        <span>&bull;</span>
                        <span>By {currentLesson.teacherName}</span>
                    </div>

                    {/* Rating section */}
                    {user?.role === 'student' && (
                        <>
                            {/* Show rating button if not rated and form not shown */}
                            {!showRatingForm && !hasRated && (
                                <Button
                                    onClick={() => setShowRatingForm(true)}
                                    className="w-full sm:w-auto"
                                    disabled={isLoading}
                                >
                                    Rate This Lesson
                                </Button>
                            )}

                            {/* Show rating form */}
                            {showRatingForm && (
                                <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700">
                                    <h3 className="text-xl font-semibold text-white mb-4">Rate This Lesson</h3>
                                    <RatingForm
                                        lessonId={currentLesson.id}
                                        onSuccess={handleRatingSuccess} // correct prop with zero args
                                        onCancel={() => setShowRatingForm(false)}
                                    />
                                </div>
                            )}

                            {/* Show user's existing rating */}
                            {hasRated && userRating && (
                                <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-700">
                                    <h3 className="text-xl font-semibold text-white mb-2">Your Rating</h3>
                                    <div className="flex items-center mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-5 w-5 ${star <= userRating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    {userRating.comment && <p className="text-slate-300 mt-2">{userRating.comment}</p>}
                                </div>
                            )}
                        </>
                    )}

                    {/* Lesson content */}
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Lesson Notes</h3>
                        <div className="bg-slate-900 p-6 rounded-md prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
                            {currentLesson.textContent || 'No notes available for this lesson.'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


// // components/student/LessonDetailView.tsx
// 'use client';

// import { ArrowLeft, Star } from 'lucide-react';
// import Button from '../common/Button';
// import { Lesson } from '@/types';
// import { useAppContext } from '../../context/AppContext';
// import { useState } from 'react';
// import RatingForm from '../common/RatingForm';

// interface LessonDetailViewProps {
//     lesson: Lesson;
//     onBack: () => void;
// }

// /**
//  * Detailed view of a lesson with rating functionality
//  */
// export default function LessonDetailView({ lesson, onBack }: LessonDetailViewProps) {
//     const { user, rateLesson } = useAppContext();
//     const [showRatingForm, setShowRatingForm] = useState(false);

//     // Check if current user has already rated this lesson
//     const userRating = user ? lesson.ratings?.find(r => r.userId === user.id) : undefined;
//     const hasRated = Boolean(userRating);

//     return (
//         <div className="animate-fade-in">
//             {/* Back button */}
//             <Button onClick={onBack} variant="ghost" className="mb-6">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Lessons
//             </Button>

//             {/* Lesson content container */}
//             <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
//                 {/* Video player */}
//                 {lesson.videoUrl && (
//                     <div className="bg-black">
//                         <video
//                             controls
//                             className="w-full aspect-video"
//                             src={lesson.videoUrl}
//                             key={lesson.videoUrl}
//                         >
//                             Your browser does not support the video tag.
//                         </video>
//                     </div>
//                 )}

//                 {/* Lesson details */}
//                 <div className="p-8 space-y-6">
//                     {/* Title and rating display */}
//                     <div className="flex justify-between items-start">
//                         <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
//                         {lesson.averageRating && (
//                             <div className="flex items-center bg-slate-700/50 px-3 py-1 rounded-full">
//                                 <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
//                                 <span className="font-medium text-white">
//                                     {lesson.averageRating.toFixed(1)}
//                                 </span>
//                                 <span className="text-slate-400 ml-1 text-sm">
//                                     ({lesson.ratings?.length || 0})
//                                 </span>
//                             </div>
//                         )}
//                     </div>

//                     {/* Lesson metadata */}
//                     <div className="flex items-center gap-4 text-slate-300">
//                         <span>{lesson.subject}</span>
//                         <span>&bull;</span>
//                         <span>{lesson.form}</span>
//                         <span>&bull;</span>
//                         <span>By {lesson.teacherName}</span>
//                     </div>

//                     {/* Rating section */}
//                     {user?.role === 'student' && (
//                         <>
//                             {/* Show rating button if not rated and form not shown */}
//                             {!showRatingForm && !hasRated && (
//                                 <Button
//                                     onClick={() => setShowRatingForm(true)}
//                                     className="w-full sm:w-auto"
//                                 >
//                                     Rate This Lesson
//                                 </Button>
//                             )}

//                             {/* Show rating form */}
//                             {showRatingForm && (
//                                 <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700">
//                                     <h3 className="text-xl font-semibold text-white mb-4">Rate This Lesson</h3>
//                                     <RatingForm
//                                         onSubmit={(rating, comment) => {
//                                             rateLesson(lesson.id, rating, comment);
//                                             setShowRatingForm(false);
//                                         }}
//                                         onCancel={() => setShowRatingForm(false)}
//                                     />
//                                 </div>
//                             )}

//                             {/* Show user's existing rating */}
//                             {hasRated && (
//                                 <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-700">
//                                     <h3 className="text-xl font-semibold text-white mb-2">Your Rating</h3>
//                                     <div className="flex items-center mb-2">
//                                         {[1, 2, 3, 4, 5].map((star) => (
//                                             <Star
//                                                 key={star}
//                                                 className={`h-5 w-5 ${star <= userRating!.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`}
//                                             />
//                                         ))}
//                                     </div>
//                                     {userRating!.comment && (
//                                         <p className="text-slate-300 mt-2">{userRating!.comment}</p>
//                                     )}
//                                 </div>
//                             )}
//                         </>
//                     )}

//                     {/* Lesson content */}
//                     <div>
//                         <h3 className="text-xl font-semibold text-white mb-2">Lesson Notes</h3>
//                         <div className="bg-slate-900 p-6 rounded-md prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
//                             {lesson.textContent || "No notes available for this lesson."}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
// // 'use client';

// // import { ArrowLeft } from 'lucide-react';
// // import Button from '../common/Button';
// // import { Lesson } from '@/types';

// // export default function LessonDetailView({ lesson, onBack }: { lesson: Lesson; onBack: () => void }) {
// //     return (
// //         <div className="animate-fade-in">
// //             <Button onClick={onBack} variant="ghost" className="mb-6">
// //                 <ArrowLeft className="h-4 w-4 mr-2" />
// //                 Back to Lessons
// //             </Button>
// //             <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
// //                 {lesson.videoUrl && (
// //                     <div className="bg-black">
// //                         <video controls className="w-full aspect-video" src={lesson.videoUrl} key={lesson.videoUrl}>
// //                             Your browser does not support the video tag.
// //                         </video>
// //                     </div>
// //                 )}
// //                 <div className="p-8 space-y-6">
// //                     <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
// //                     <div className="flex items-center gap-4 text-slate-300">
// //                         <span>{lesson.subject}</span>
// //                         <span>&bull;</span>
// //                         <span>{lesson.form}</span>
// //                         <span>&bull;</span>
// //                         <span>By {lesson.teacherName}</span>
// //                     </div>
// //                     <div>
// //                         <h3 className="text-xl font-semibold text-white mb-2">Lesson Notes</h3>
// //                         <div className="bg-slate-900 p-6 rounded-md prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap">
// //                             {lesson.textContent || "No notes available for this lesson."}
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }