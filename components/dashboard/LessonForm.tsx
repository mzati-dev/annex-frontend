'use client';

import { useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import Button from '../common/Button';
import FormRow from '../common/FormRow';
import { Lesson } from '@/types';

// === CHANGE: Define new type extending Lesson omitting some fields + adding videoFile ===
type LessonFormData = Omit<Lesson, 'id' | 'teacherId' | 'teacherName' | 'createdAt'> & {
  videoFile: File | null;
};

export default function LessonForm({
    onSubmit,
    onCancel,
    initialData
}: {
    // === CHANGE: onSubmit now expects LessonFormData which includes videoFile ===
    onSubmit: (formData: FormData) => void | Promise<void>;
    onCancel: () => void;
    initialData?: Lesson | null;
}) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        subject: initialData?.subject || 'Biology',
        form: initialData?.form || 'Form 1',
        price: initialData?.price ? String(initialData.price) : '1000',
        videoFile: null as File | null,  // This is the File object for upload
        videoUrl: initialData?.videoUrl || '',
        textContent: initialData?.textContent || '',
        durationMinutes: initialData?.durationMinutes || 30,
    });
    const [fileName, setFileName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, videoFile: file }));
        setFileName(file?.name || null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setIsLoading(true);

    //     // === CHANGE: Prepare plain object matching LessonFormData type ===
    //     const submitData: LessonFormData = {
    //         title: formData.title,
    //         description: formData.description,
    //         subject: formData.subject,
    //         form: formData.form,
    //         price: Number(formData.price),
    //         textContent: formData.textContent,
    //         durationMinutes: formData.durationMinutes,
    //         videoFile: formData.videoFile,  // include file object here
    //         videoUrl: formData.videoUrl,
    //     };

    //     try {
    //         // Call parent onSubmit passing the form data including videoFile
    //         await onSubmit(submitData);
    //     } catch (error) {
    //         // Optional error handling here
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // In components/teacher/LessonForm.tsx

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // === CHANGE: Use FormData for file uploads ===
    const formDataPayload = new FormData();

    // Append all the text-based form fields
    formDataPayload.append('title', formData.title);
    formDataPayload.append('description', formData.description);
    formDataPayload.append('subject', formData.subject);
    formDataPayload.append('form', formData.form);
    formDataPayload.append('price', String(formData.price));
    formDataPayload.append('textContent', formData.textContent);
    formDataPayload.append('durationMinutes', String(formData.durationMinutes));
    
    // IMPORTANT: Only append the file if one was selected
    if (formData.videoFile) {
        formDataPayload.append('videoFile', formData.videoFile);
    }

    try {
        // === CHANGE: Pass the FormData object to the onSubmit handler ===
        // Your parent component will now receive and send this FormData object.
        await onSubmit(formDataPayload); 
    } catch (error) {
        console.error("Failed to submit the lesson:", error);
    } finally {
        setIsLoading(false);
    }
};

    const inputClass = "w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none";

    return (
        <div className="max-w-4xl mx-auto">
            <Button onClick={onCancel} variant="ghost" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
            </Button>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                    {initialData ? 'Edit Lesson' : 'Create New Lesson'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                    <FormRow label="Lesson Title">
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={inputClass}
                            required
                            disabled={isLoading}
                        />
                    </FormRow>

                    <FormRow label="Description">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={inputClass}
                            rows={4}
                            required
                            disabled={isLoading}
                        />
                    </FormRow>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormRow label="Subject">
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className={inputClass}
                                disabled={isLoading}
                            >
                                {['Agriculture', 'Biology', 'English Language', 'Chemistry', 'Chichewa Language', 'Chichewa Literature', 'Mathematics', 'Physics', 'Geography', 'Social and Life Skills', 'Additional Mathematics', 'History', 'Bible Knowledge', 'Computer Studies'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </FormRow>

                        <FormRow label="Form Level">
                            <select
                                name="form"
                                value={formData.form}
                                onChange={handleChange}
                                className={inputClass}
                                disabled={isLoading}
                            >
                                {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </FormRow>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormRow label="Price (MWK)">
                            <input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                className={inputClass}
                                required
                                disabled={isLoading}
                                min="0"
                                step="100"
                            />
                        </FormRow>

                        <FormRow label="Duration (min)">
                            <input
                                name="durationMinutes"
                                type="number"
                                value={formData.durationMinutes}
                                onChange={handleChange}
                                className={inputClass}
                                required
                                disabled={isLoading}
                                min="1"
                            />
                        </FormRow>
                    </div>

                    <FormRow label="Lesson Video">
                        <label htmlFor="video-upload" className={`${inputClass} flex items-center cursor-pointer`}>
                            <Upload className="h-5 w-5 mr-3 text-slate-400" />
                            <span className="text-slate-300">{fileName || 'Upload a video file'}</span>
                        </label>
                        <input 
                            id="video-upload" 
                            name="videoFile" 
                            type="file" 
                            accept="video/*" 
                            onChange={handleFileChange} 
                            className="hidden" 
                            disabled={isLoading}
                        />
                        {initialData?.videoUrl && !fileName && (
                            <p className="text-sm text-slate-400 mt-2">Current video: {initialData.videoUrl}</p>
                        )}
                    </FormRow>

                    <FormRow label="Lesson Text Content">
                        <textarea
                            name="textContent"
                            value={formData.textContent}
                            onChange={handleChange}
                            className={inputClass}
                            rows={10}
                            required
                            disabled={isLoading}
                        />
                    </FormRow>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : initialData ? 'Save Changes' : 'Create Lesson'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}



// 'use client';

// import { useState } from 'react';
// import { ArrowLeft, Upload } from 'lucide-react';
// import Button from '../common/Button';
// import FormRow from '../common/FormRow';
// import { Lesson } from '@/types';
// import { LessonsApiService } from '@/services/api/lessons-api.service';

// export default function LessonForm({
//     onSubmit,
//     onCancel,
//     initialData
// }: {
//     // onSubmit: () => void;
//      onSubmit: (formData: Omit<Lesson, 'id' | 'teacherId' | 'teacherName' | 'createdAt'>) => Promise<void>;
//     onCancel: () => void;
//     initialData?: Lesson | null;
// }) {
//     const [formData, setFormData] = useState({
//         title: initialData?.title || '',
//         description: initialData?.description || '',
//         subject: initialData?.subject || 'Biology',
//         form: initialData?.form || 'Form 1',
//         price: initialData?.price ? String(initialData.price) : '1000',
//         videoFile: null as File | null,
//         videoUrl: initialData?.videoUrl || '',
//         textContent: initialData?.textContent || '',
//         durationMinutes: initialData?.durationMinutes || 30,
//     });
//     const [fileName, setFileName] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState(false);

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0] || null;
//         setFormData(prev => ({ ...prev, videoFile: file }));
//         setFileName(file?.name || null);
//     };

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);

//         const apiService = new LessonsApiService();
//         const lessonData = new FormData();
        
//         // Append all form data to the FormData object
//         lessonData.append('title', formData.title);
//         lessonData.append('description', formData.description);
//         lessonData.append('subject', formData.subject);
//         lessonData.append('form', formData.form);
//         lessonData.append('price', formData.price);
//         lessonData.append('textContent', formData.textContent);
//         lessonData.append('durationMinutes', formData.durationMinutes.toString());
        
//         // If there's a new video file, append it
//         if (formData.videoFile) {
//             lessonData.append('videoFile', formData.videoFile);
//         } else if (formData.videoUrl) {
//             // If no new file but existing URL, keep the existing URL
//             lessonData.append('videoUrl', formData.videoUrl);
//         }

//         try {
//             if (initialData) {
//                 await apiService.updateLesson(initialData.id, lessonData);
//             } else {
//                 await apiService.createLesson(lessonData);
//             }
//             // onSubmit();
//              await onSubmit(submitData); 
//         } catch {
//             // Error handling removed as requested
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const inputClass = "w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none";

//     return (
//         <div className="max-w-4xl mx-auto">
//             <Button onClick={onCancel} variant="ghost" className="mb-6">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Dashboard
//             </Button>

//             <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
//                 <h2 className="text-2xl font-bold text-white mb-6">
//                     {initialData ? 'Edit Lesson' : 'Create New Lesson'}
//                 </h2>

//                 <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
//                     <FormRow label="Lesson Title">
//                         <input
//                             name="title"
//                             value={formData.title}
//                             onChange={handleChange}
//                             className={inputClass}
//                             required
//                             disabled={isLoading}
//                         />
//                     </FormRow>

//                     <FormRow label="Description">
//                         <textarea
//                             name="description"
//                             value={formData.description}
//                             onChange={handleChange}
//                             className={inputClass}
//                             rows={4}
//                             required
//                             disabled={isLoading}
//                         />
//                     </FormRow>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <FormRow label="Subject">
//                             <select
//                                 name="subject"
//                                 value={formData.subject}
//                                 onChange={handleChange}
//                                 className={inputClass}
//                                 disabled={isLoading}
//                             >
//                                 {['Agriculture', 'Biology', 'English Language', 'Chemistry', 'Chichewa Language', 'Chichewa Literature', 'Mathematics', 'Physics', 'Geography', 'Social and Life Skills', 'Additional Mathematics', 'History', 'Bible Knowledge', 'Computer Studies'].map(s => (
//                                     <option key={s} value={s}>{s}</option>
//                                 ))}
//                             </select>
//                         </FormRow>

//                         <FormRow label="Form Level">
//                             <select
//                                 name="form"
//                                 value={formData.form}
//                                 onChange={handleChange}
//                                 className={inputClass}
//                                 disabled={isLoading}
//                             >
//                                 {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map(f => (
//                                     <option key={f} value={f}>{f}</option>
//                                 ))}
//                             </select>
//                         </FormRow>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <FormRow label="Price (MWK)">
//                             <input
//                                 name="price"
//                                 type="number"
//                                 value={formData.price}
//                                 onChange={handleChange}
//                                 className={inputClass}
//                                 required
//                                 disabled={isLoading}
//                                 min="0"
//                                 step="100"
//                             />
//                         </FormRow>

//                         <FormRow label="Duration (min)">
//                             <input
//                                 name="durationMinutes"
//                                 type="number"
//                                 value={formData.durationMinutes}
//                                 onChange={handleChange}
//                                 className={inputClass}
//                                 required
//                                 disabled={isLoading}
//                                 min="1"
//                             />
//                         </FormRow>
//                     </div>

//                     <FormRow label="Lesson Video">
//                         <label htmlFor="video-upload" className={`${inputClass} flex items-center cursor-pointer`}>
//                             <Upload className="h-5 w-5 mr-3 text-slate-400" />
//                             <span className="text-slate-300">{fileName || 'Upload a video file'}</span>
//                         </label>
//                         <input 
//                             id="video-upload" 
//                             name="videoFile" 
//                             type="file" 
//                             accept="video/*" 
//                             onChange={handleFileChange} 
//                             className="hidden" 
//                             disabled={isLoading}
//                         />
//                         {initialData?.videoUrl && !fileName && (
//                             <p className="text-sm text-slate-400 mt-2">Current video: {initialData.videoUrl}</p>
//                         )}
//                     </FormRow>

//                     <FormRow label="Lesson Text Content">
//                         <textarea
//                             name="textContent"
//                             value={formData.textContent}
//                             onChange={handleChange}
//                             className={inputClass}
//                             rows={10}
//                             required
//                             disabled={isLoading}
//                         />
//                     </FormRow>

//                     <div className="flex justify-end gap-4 pt-4">
//                         <Button
//                             type="button"
//                             variant="secondary"
//                             onClick={onCancel}
//                             disabled={isLoading}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             type="submit"
//                             disabled={isLoading}
//                         >
//                             {isLoading ? 'Processing...' : initialData ? 'Save Changes' : 'Create Lesson'}
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// // 'use client';

// // import { useState } from 'react';
// // import { ArrowLeft, Upload } from 'lucide-react';
// // import Button from '../common/Button';
// // import FormRow from '../common/FormRow';
// // import { Lesson } from '@/types';
// // import { LessonsApiService } from '@/services/api/lessons-api.service';
// // // import { LessonApiService } from '@/services/api/lessons-api.service';

// // export default function LessonForm({
// //     onSuccess,
// //     onCancel,
// //     initialData
// // }: {
// //     onSuccess: () => void;
// //     onCancel: () => void;
// //     initialData?: Lesson | null;
// // }) {
// //     const [formData, setFormData] = useState({
// //         title: initialData?.title || '',
// //         description: initialData?.description || '',
// //         subject: initialData?.subject || 'Biology',
// //         form: initialData?.form || 'Form 1',
// //         price: initialData?.price ? String(initialData.price) : '1000',
// //         videoUrl: initialData?.videoUrl || '',
// //         textContent: initialData?.textContent || '',
// //         durationMinutes: initialData?.durationMinutes || 30,
// //     });
// //     const [isLoading, setIsLoading] = useState(false);

// //     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// //         const { name, value } = e.target;
// //         setFormData(prev => ({ ...prev, [name]: value }));
// //     };

// //     const handleSubmit = async (e: React.FormEvent) => {
// //         e.preventDefault();
// //         setIsLoading(true);

// //         const apiService = new LessonsApiService();
// //         const lessonData = {
// //             ...formData,
// //             price: parseFloat(formData.price),
// //             durationMinutes: parseInt(formData.durationMinutes as unknown as string),
// //         };

// //         try {
// //             if (initialData) {
// //                 await apiService.updateLesson(initialData.id, lessonData);
// //             } else {
// //                 await apiService.createLesson(lessonData);
// //             }
// //             onSuccess();
// //         } catch {
// //             // Error handling removed as requested
// //         } finally {
// //             setIsLoading(false);
// //         }
// //     };

// //     const inputClass = "w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none";

// //     return (
// //         <div className="max-w-4xl mx-auto">
// //             <Button onClick={onCancel} variant="ghost" className="mb-6">
// //                 <ArrowLeft className="h-4 w-4 mr-2" />
// //                 Back to Dashboard
// //             </Button>

// //             <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
// //                 <h2 className="text-2xl font-bold text-white mb-6">
// //                     {initialData ? 'Edit Lesson' : 'Create New Lesson'}
// //                 </h2>

// //                 <form onSubmit={handleSubmit} className="space-y-6">
// //                     <FormRow label="Lesson Title">
// //                         <input
// //                             name="title"
// //                             value={formData.title}
// //                             onChange={handleChange}
// //                             className={inputClass}
// //                             required
// //                             disabled={isLoading}
// //                         />
// //                     </FormRow>

// //                     <FormRow label="Description">
// //                         <textarea
// //                             name="description"
// //                             value={formData.description}
// //                             onChange={handleChange}
// //                             className={inputClass}
// //                             rows={4}
// //                             required
// //                             disabled={isLoading}
// //                         />
// //                     </FormRow>

// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                         <FormRow label="Subject">
// //                             <select
// //                                 name="subject"
// //                                 value={formData.subject}
// //                                 onChange={handleChange}
// //                                 className={inputClass}
// //                                 disabled={isLoading}
// //                             >
// //                                 {['Agriculture', 'Biology', 'English Language', 'Chemistry', 'Chichewa Language', 'Chichewa Literature', 'Mathematics', 'Physics', 'Geography', 'Social and Life Skills', 'Additional Mathematics', 'History', 'Bible Knowledge', 'Computer Studies'].map(s => (
// //                                     <option key={s} value={s}>{s}</option>
// //                                 ))}
// //                             </select>
// //                         </FormRow>

// //                         <FormRow label="Form Level">
// //                             <select
// //                                 name="form"
// //                                 value={formData.form}
// //                                 onChange={handleChange}
// //                                 className={inputClass}
// //                                 disabled={isLoading}
// //                             >
// //                                 {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map(f => (
// //                                     <option key={f} value={f}>{f}</option>
// //                                 ))}
// //                             </select>
// //                         </FormRow>
// //                     </div>

// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                         <FormRow label="Price (MWK)">
// //                             <input
// //                                 name="price"
// //                                 type="number"
// //                                 value={formData.price}
// //                                 onChange={handleChange}
// //                                 className={inputClass}
// //                                 required
// //                                 disabled={isLoading}
// //                                 min="0"
// //                                 step="100"
// //                             />
// //                         </FormRow>

// //                         <FormRow label="Duration (min)">
// //                             <input
// //                                 name="durationMinutes"
// //                                 type="number"
// //                                 value={formData.durationMinutes}
// //                                 onChange={handleChange}
// //                                 className={inputClass}
// //                                 required
// //                                 disabled={isLoading}
// //                                 min="1"
// //                             />
// //                         </FormRow>
// //                     </div>

            
// //                     <FormRow label="Lesson Video">
// //                         <label htmlFor="video-upload" className={`${inputClass} flex items-center cursor-pointer`}>
// //                             <Upload className="h-5 w-5 mr-3 text-slate-400" />
// //                             <span className="text-slate-300">{fileName || 'Upload a video file'}</span>
// //                         </label>
// //                         <input id="video-upload" name="videoFile" type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
// //                     </FormRow>

// //                     <FormRow label="Lesson Text Content">
// //                         <textarea
// //                             name="textContent"
// //                             value={formData.textContent}
// //                             onChange={handleChange}
// //                             className={inputClass}
// //                             rows={10}
// //                             required
// //                             disabled={isLoading}
// //                         />
// //                     </FormRow>

// //                     <div className="flex justify-end gap-4 pt-4">
// //                         <Button
// //                             type="button"
// //                             variant="secondary"
// //                             onClick={onCancel}
// //                             disabled={isLoading}
// //                         >
// //                             Cancel
// //                         </Button>
// //                         <Button
// //                             type="submit"
// //                             disabled={isLoading}
// //                         >
// //                             {isLoading ? 'Processing...' : initialData ? 'Save Changes' : 'Create Lesson'}
// //                         </Button>
// //                     </div>
// //                 </form>
// //             </div>
// //         </div>
// //     );
// // }

// // 'use client';

// // import { useState } from 'react';
// // import { ArrowLeft, Upload } from 'lucide-react';
// // import Button from '../common/Button';
// // import FormRow from '../common/FormRow';
// // import { Lesson } from '@/types';

// // export default function LessonForm({
// //     onSubmit,
// //     onCancel,
// //     initialData
// // }: {
// //     onSubmit: (data: any) => void;
// //     onCancel: () => void;
// //     initialData?: Lesson | null;
// // }) {
// //     const [formData, setFormData] = useState({
// //         title: initialData?.title || '',
// //         description: initialData?.description || '',
// //         subject: initialData?.subject || 'Biology',
// //         form: initialData?.form || 'Form 1',
// //         price: String(initialData?.price || '1000'),
// //         videoFile: null as File | null,
// //         videoUrl: initialData?.videoUrl || '',
// //         textContent: initialData?.textContent || '',
// //         // rating: initialData?.rating || 4.5,
// //         durationMinutes: initialData?.durationMinutes || 30,
// //     });
// //     const [fileName, setFileName] = useState<string | null>(null);

// //     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //         const file = e.target.files?.[0] || null;
// //         setFormData(prev => ({ ...prev, videoFile: file }));
// //         setFileName(file?.name || null);
// //     };

// //     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
// //         const { name, value } = e.target;
// //         setFormData(prev => ({ ...prev, [name]: value }));
// //     };

// //     const handleSubmit = (e: React.FormEvent) => {
// //         e.preventDefault();
// //         const submissionData = {
// //             ...formData,
// //             price: parseFloat(formData.price) || 0,
// //             // rating: parseFloat(String(formData.rating)) || 0,
// //             durationMinutes: parseInt(String(formData.durationMinutes), 10) || 0,
// //             videoUrl: formData.videoFile ? URL.createObjectURL(formData.videoFile) : formData.videoUrl,
// //         };
// //         onSubmit(submissionData);
// //     };

// //     const inputClass = "w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none";

// //     return (
// //         <div className="max-w-4xl mx-auto">
// //             <Button onClick={onCancel} variant="ghost" className="mb-6">
// //                 <ArrowLeft className="h-4 w-4 mr-2" />
// //                 Back to Dashboard
// //             </Button>
// //             <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
// //                 <h2 className="text-2xl font-bold text-white mb-6">{initialData ? 'Edit Lesson' : 'Create New Lesson'}</h2>
// //                 <form onSubmit={handleSubmit} className="space-y-6">
// //                     <FormRow label="Lesson Title">
// //                         <input name="title" value={formData.title} onChange={handleChange} className={inputClass} required />
// //                     </FormRow>
// //                     <FormRow label="Description">
// //                         <textarea name="description" value={formData.description} onChange={handleChange} className={inputClass} rows={4} required />
// //                     </FormRow>
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                         <FormRow label="Subject">
// //                             <select name="subject" value={formData.subject} onChange={handleChange} className={inputClass}>
// //                                 {['Agriculture', 'Biology', 'English Language', 'Chemistry', 'Chichewa Language', 'Chichewa Literature', 'Mathematics', 'Physics', 'Geography', 'Social and Life Skills', 'Additional Mathematics', 'History', 'Bible Knowledge', 'Computer Studies'].map(s => <option key={s}>{s}</option>)}
// //                             </select>
// //                         </FormRow>
// //                         <FormRow label="Form Level">
// //                             <select name="form" value={formData.form} onChange={handleChange} className={inputClass}>
// //                                 {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map(f => <option key={f}>{f}</option>)}
// //                             </select>
// //                         </FormRow>
// //                     </div>
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                         <FormRow label="Price (MWK)">
// //                             <input name="price" type="number" value={formData.price} onChange={handleChange} className={inputClass} required />
// //                         </FormRow>

// //                         <FormRow label="Duration (min)">
// //                             <input name="durationMinutes" type="number" value={formData.durationMinutes} onChange={handleChange} className={inputClass} required />
// //                         </FormRow>
// //                         {/* <FormRow label="Rating (1-5)">
// //                             <input name="rating" type="number" step="0.1" min="1" max="5" value={formData.rating} onChange={handleChange} className={inputClass} required />
// //                         </FormRow> */}
// //                     </div>
// //                     <FormRow label="Lesson Video">
// //                         <label htmlFor="video-upload" className={`${inputClass} flex items-center cursor-pointer`}>
// //                             <Upload className="h-5 w-5 mr-3 text-slate-400" />
// //                             <span className="text-slate-300">{fileName || 'Upload a video file'}</span>
// //                         </label>
// //                         <input id="video-upload" name="videoFile" type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
// //                     </FormRow>
// //                     <FormRow label="Lesson Text Content">
// //                         <textarea name="textContent" value={formData.textContent} onChange={handleChange} className={inputClass} rows={10} required />
// //                     </FormRow>
// //                     <div className="flex justify-end gap-4 pt-4">
// //                         <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
// //                         <Button type="submit">{initialData ? 'Save Changes' : 'Create Lesson'}</Button>
// //                     </div>
// //                 </form>
// //             </div>
// //         </div>
// //     );
// // }