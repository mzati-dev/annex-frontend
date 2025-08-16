// components/common/RatingForm.tsx
'use client';

import { useState } from 'react';
import { Star, StarOff, Loader2, Check } from 'lucide-react';
import Button from './Button';
import { ratingApiService } from '@/services/api/ratings-api.service';
// import { toast } from 'react-hot-toast';
// import { ratingApiService } from '@/services/api/rating-api.service';

/**
 * RatingForm component - Allows users to submit star ratings and optional comments
 * 
 * Props:
 * - lessonId: string - ID of the lesson being rated
 * - initialRating: number (optional) - Pre-selected rating
 * - initialComment: string (optional) - Pre-filled comment
 * - onSuccess: function (optional) - Called when rating is successfully submitted
 * - onCancel: function (optional) - Called when cancel is clicked
 */
export default function RatingForm({
    lessonId,
    initialRating = 0,
    initialComment = '',
    onSuccess,
    onCancel
}: {
    lessonId: string;
    initialRating?: number;
    initialComment?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}) {
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(initialComment);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            await ratingApiService.rateLesson(lessonId, {
                rating,
                comment: comment || undefined,
            });

            setIsSuccess(true);
            // toast.success('Rating submitted successfully!');
            if (onSuccess) onSuccess();

            // Reset form after successful submission
            setTimeout(() => {
                setIsSuccess(false);
                setRating(0);
                setComment('');
            }, 1500);
        } catch (error) {
            // toast.error('Failed to submit rating. Please try again.');
            console.error('Rating submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Star rating input */}
            <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none disabled:opacity-50"
                        aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                        disabled={isSubmitting || isSuccess}
                    >
                        {star <= (hoverRating || rating) ? (
                            <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                        ) : (
                            <StarOff className="w-8 h-8 text-slate-400" />
                        )}
                    </button>
                ))}
            </div>

            {/* Comment textarea */}
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional comment about the lesson..."
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-slate-300 disabled:opacity-50"
                rows={3}
                disabled={isSubmitting || isSuccess}
            />

            {/* Action buttons */}
            <div className="flex gap-2">
                <Button
                    onClick={handleSubmit}
                    disabled={rating === 0 || isSubmitting || isSuccess}
                    className="flex-1"
                >
                    {isSubmitting ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : isSuccess ? (
                        <Check className="h-5 w-5 mr-2" />
                    ) : null}
                    {isSubmitting ? 'Submitting...' : isSuccess ? 'Success!' : 'Submit Rating'}
                </Button>
                {onCancel && (
                    <Button
                        onClick={onCancel}
                        variant="ghost"
                        className="flex-1"
                        disabled={isSubmitting || isSuccess}
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </div>
    );
}

// // components/common/RatingForm.tsx
// 'use client';

// import { useState } from 'react';
// import { Star, StarOff } from 'lucide-react';
// import Button from './Button';

// /**
//  * RatingForm component - Allows users to submit star ratings and optional comments
//  *
//  * Props:
//  * - initialRating: number (optional) - Pre-selected rating
//  * - initialComment: string (optional) - Pre-filled comment
//  * - onSubmit: function - Called when form is submitted
//  * - onCancel: function (optional) - Called when cancel is clicked
//  */
// export default function RatingForm({
//     initialRating = 0,
//     initialComment = '',
//     onSubmit,
//     onCancel
// }: {
//     initialRating?: number;
//     initialComment?: string;
//     onSubmit: (rating: number, comment: string) => void;
//     onCancel?: () => void;
// }) {
//     // State for the selected rating
//     const [rating, setRating] = useState(initialRating);
//     // State for hover effect on stars
//     const [hoverRating, setHoverRating] = useState(0);
//     // State for the comment
//     const [comment, setComment] = useState(initialComment);

//     return (
//         <div className="space-y-4">
//             {/* Star rating input */}
//             <div className="flex justify-center">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                     <button
//                         key={star}
//                         onClick={() => setRating(star)}
//                         onMouseEnter={() => setHoverRating(star)}
//                         onMouseLeave={() => setHoverRating(0)}
//                         className="p-1 focus:outline-none"
//                         aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
//                     >
//                         {star <= (hoverRating || rating) ? (
//                             <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
//                         ) : (
//                             <StarOff className="w-8 h-8 text-slate-400" />
//                         )}
//                     </button>
//                 ))}
//             </div>

//             {/* Comment textarea */}
//             <textarea
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 placeholder="Optional comment about the lesson..."
//                 className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-slate-300"
//                 rows={3}
//             />

//             {/* Action buttons */}
//             <div className="flex gap-2">
//                 <Button
//                     onClick={() => onSubmit(rating, comment)}
//                     disabled={rating === 0}
//                     className="flex-1"
//                 >
//                     Submit Rating
//                 </Button>
//                 {onCancel && (
//                     <Button
//                         onClick={onCancel}
//                         variant="ghost"
//                         className="flex-1"
//                     >
//                         Cancel
//                     </Button>
//                 )}
//             </div>
//         </div>
//     );
// }