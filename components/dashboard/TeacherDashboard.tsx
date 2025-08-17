'use client';

import { useAppContext } from '../../context/AppContext';
import { FileText, DollarSign, Plus, ShoppingBag, Eye, Trash2, Archive, Edit, Star } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import StatCard from '../common/StatCard';
import LessonForm from './LessonForm';
import { Lesson } from '@/types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { TeacherApiService } from '@/services/api/teacher-api.service';

export default function TeacherDashboard() {
    const { user, searchTerm } = useAppContext();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [viewingStudents, setViewingStudents] = useState<{ lessonId: string, students: string[] } | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const [salesData, setSalesData] = useState({
        totalLessonsSold: 0,
        totalSales: 0,
        totalEarnings: 0
    });
    const teacherApi = new TeacherApiService();

    // Fetch lessons from API and normalize price
    // useEffect(() => {
    //     if (!user?.id) return;
    //     teacherApi.getLessons()
    //         .then(fetchedLessons => {
    //             console.log('Fetched lessons from API:', fetchedLessons);
    //             const lessonsWithNumericPrice = fetchedLessons.map(l => ({
    //                 ...l,
    //                 price: Number(l.price || 0) // Ensure numeric
    //             }));
    //             setLessons(lessonsWithNumericPrice);
    //         })
    //         .catch(err => {
    //             console.error('Failed to fetch lessons', err);
    //             setLessons([]); // fallback empty
    //         });
    // }, [user?.id]);

    // Update the useEffect to fetch sales data
    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            try {
                const [fetchedLessons, stats] = await Promise.all([
                    teacherApi.getLessons(),
                    teacherApi.getSalesStatistics()
                ]);

                const lessonsWithNumericPrice = fetchedLessons.map(l => ({
                    ...l,
                    price: Number(l.price || 0)
                }));

                setLessons(lessonsWithNumericPrice);
                setSalesData(stats);
            } catch (err) {
                console.error('Failed to fetch data', err);
                setLessons([]);
            }
        };

        fetchData();
    }, [user?.id]);

    // const teacherLessons = useMemo(() => {
    //     console.log('Filtered teacherLessons:');
    //     return lessons;
    // }, [lessons, user]);

    const teacherLessons = useMemo(() => {
        if (!searchTerm) return lessons; // Show all if no search

        return lessons.filter((lesson) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                lesson.subject.toLowerCase().includes(searchLower) ||
                lesson.form.toLowerCase().includes(searchLower)
            );
        });
    }, [lessons, user, searchTerm]);

    // const getDemoSalesCount = (lessonId: string) => {
    //     const base = parseInt(lessonId.replace(/\D/g, '')) || 1;
    //     return (base % 4) + 2; // 2-5 sales demo
    // };

    const handleSubmit = async (formData: Omit<Lesson, 'id' | 'teacherId' | 'teacherName' | 'createdAt'>) => {
        if (!user) return;

        try {
            if (editingLesson) {
                const updated = await teacherApi.updateLesson(editingLesson.id, formData);
                updated.price = Number(updated.price || 0);
                setLessons(lessons.map(l => l.id === editingLesson.id ? updated : l));
            } else {
                const created = await teacherApi.createLesson(formData);
                created.price = Number(created.price || 0);
                setLessons([created, ...lessons]);
            }
            setShowForm(false);
            setEditingLesson(null);
        } catch (err) {
            console.error('Error saving lesson', err);
        }
    };

    const handleEdit = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setShowForm(true);
    };

    const handleDelete = async (lessonId: string) => {
        try {
            await teacherApi.deleteLesson(lessonId);
            setLessons(lessons.filter(l => l.id !== lessonId));
            setConfirmDeleteId(null);
        } catch (err) {
            console.error('Error deleting lesson', err);
        }
    };

    const handleArchive = (lessonId: string) => {
        console.log('Archiving lesson:', lessonId);
    };


    // Update handleViewStudents to use real data
    const handleViewStudents = async (lessonId: string) => {
        try {
            const students = await teacherApi.getLessonStudents(lessonId);
            setViewingStudents({
                lessonId,
                students: students.map(s => s.name) // Just show names
            });
        } catch (err) {
            console.error('Failed to fetch students', err);
            // Optionally show error to user
        }
    };


    // const handleViewStudents = (lessonId: string) => {
    //     setViewingStudents({
    //         lessonId,
    //         students: [`Demo Student 1`, `Demo Student 2`]
    //     });
    // };

    const handleAddNew = () => {
        setEditingLesson(null);
        setShowForm(true);
    };

    if (showForm) {
        return <LessonForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} initialData={editingLesson} />;
    }

    return (
        <div className="relative">
            {/* Fixed header section */}
            <div className="fixed left-0 right-0 bg-slate-900/90 backdrop-blur-md z-20 p-6 border-b border-slate-700 -mt-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        {/* <h2 className="text-3xl font-bold text-white">Teacher Dashboard</h2> */}
                        <h2 className="text-3xl font-bold text-white">
                            Welcome back, {user?.name.split(' ')[0]}!
                        </h2>
                        <Button onClick={handleAddNew}>
                            <Plus className="h-5 w-5 mr-2" />
                            Create New Lesson
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard icon={FileText} title="Total Lessons" value={teacherLessons.length} />
                        <StatCard icon={ShoppingBag} title="Total Sales" value={salesData.totalSales} />
                        <StatCard icon={DollarSign} title="Total Earnings" value={`MWK${Number(salesData.totalEarnings).toFixed(2)}`} />
                    </div>
                </div>
            </div>

            {/* Scrollable content section */}
            <div className="pt-[220px]">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mx-auto max-w-7xl -mt-8">
                    <h3 className="text-xl font-bold text-white mb-4">My Published Lessons</h3>

                    {teacherLessons.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teacherLessons.map(lesson => {
                                // const salesCount = getDemoSalesCount(lesson.id);
                                const salesCount = lesson.salesCount || 0;
                                return (
                                    <div key={lesson.id} className="relative bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-500 transition-colors flex flex-col h-full">



                                        <div className="flex-grow space-y-2">
                                            <h4 className="font-bold text-lg text-white">{lesson.title}</h4>
                                            <p className="text-slate-300 text-sm line-clamp-2 h-[40px]">{lesson.description}</p>
                                        </div>
                                        <div className="mt-auto">
                                            <div className="flex justify-between text-sm text-slate-400 pt-3">

                                                <div>
                                                    <span>{lesson.subject}</span>
                                                    <span className="ml-2 text-slate-500">|</span>
                                                    <span className="ml-2">{lesson.form}</span>
                                                </div>
                                                <span className="font-semibold text-white">MWK {Number(lesson.price).toFixed(2)}</span>
                                            </div>
                                            <div className="mt-2 flex justify-between items-center">
                                                {/* Sales count badge */}
                                                <span className="bg-slate-700 text-green-500 text-xs font-bold px-2 py-1 rounded-full">
                                                    {salesCount} sales
                                                </span>

                                                {/* Rating badge: dark pill background with yellow star + number */}
                                                {lesson.averageRating != null && (
                                                    <div className="bg-slate-700 px-2 py-1 rounded-full flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                                                        <span className="text-yellow-400 font-bold text-xs">
                                                            {lesson.averageRating.toFixed(1)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>



                                        </div>









                                        <div className="mt-3 flex justify-between border-t border-slate-700 pt-3">
                                            <button onClick={() => handleViewStudents(lesson.id)} className="text-blue-400 hover:text-blue-300 p-1">
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => handleEdit(lesson)} className="text-yellow-400 hover:text-yellow-300 p-1">
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => handleArchive(lesson.id)} className="text-purple-400 hover:text-purple-300 p-1">
                                                <Archive className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => setConfirmDeleteId(lesson.id)} className="text-red-400 hover:text-red-300 p-1">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-slate-400">
                            <p>No lessons created yet</p>
                        </div>
                    )}
                </div>
            </div>

            {viewingStudents && (
                <Modal isOpen={!!viewingStudents} onClose={() => setViewingStudents(null)} title="Students">
                    <div className="space-y-2">
                        {viewingStudents.students.map((student, index) => (
                            <div key={index} className="text-white">{student}</div>
                        ))}
                    </div>
                </Modal>
            )}

            {confirmDeleteId && (
                <Modal isOpen={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)} title="Confirm Delete">
                    <div className="space-y-4">
                        <p className="text-white">Delete this lesson?</p>
                        <div className="flex justify-end gap-2">
                            <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
                            <Button variant="danger" onClick={() => handleDelete(confirmDeleteId)}>Delete</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// 'use client';

// import { useAppContext } from '../../context/AppContext';
// import { FileText, DollarSign, Plus, ShoppingBag, Eye, Trash2, Archive, Edit } from 'lucide-react';
// import { useState, useEffect, useMemo } from 'react';
// import StatCard from '../common/StatCard';
// import LessonForm from './LessonForm';
// import { Lesson } from '@/types';
// import Button from '../common/Button';
// import Modal from '../common/Modal';
// import { TeacherApiService } from '@/services/api/teacher-api.service';

// export default function TeacherDashboard() {
//     const { user } = useAppContext();
//     const [lessons, setLessons] = useState<Lesson[]>([]);
//     const [showForm, setShowForm] = useState(false);
//     const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
//     const [viewingStudents, setViewingStudents] = useState<{ lessonId: string, students: string[] } | null>(null);
//     const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

//     const teacherApi = new TeacherApiService();

//     // Fetch lessons from API and normalize price
//     useEffect(() => {
//         if (!user?.id) return;
//         teacherApi.getLessons()
//             .then(fetchedLessons => {
//                 console.log('Fetched lessons from API:', fetchedLessons);
//                 const lessonsWithNumericPrice = fetchedLessons.map(l => ({
//                     ...l,
//                     price: Number(l.price || 0) // Ensure numeric
//                 }));
//                 setLessons(lessonsWithNumericPrice);
//             })
//             .catch(err => {
//                 console.error('Failed to fetch lessons', err);
//                 setLessons([]); // fallback empty
//             });
//     }, [user?.id]);

//     const teacherLessons = useMemo(() => {
//         console.log('Filtered teacherLessons:');
//         return lessons;
//     }, [lessons, user]);

//     const getDemoSalesCount = (lessonId: string) => {
//         const base = parseInt(lessonId.replace(/\D/g, '')) || 1;
//         return (base % 4) + 2; // 2-5 sales demo
//     };

//     const totalSales = useMemo(() => {
//         return teacherLessons.reduce((sum, lesson) => sum + getDemoSalesCount(lesson.id), 0);
//     }, [teacherLessons]);

//     const totalEarnings = useMemo(() => {
//         return teacherLessons.reduce((sum, lesson) => sum + (lesson.price * getDemoSalesCount(lesson.id)), 0);
//     }, [teacherLessons]);

//     const handleSubmit = async (formData: Omit<Lesson, 'id' | 'teacherId' | 'teacherName' | 'createdAt'>) => {
//         if (!user) return;

//         try {
//             if (editingLesson) {
//                 const updated = await teacherApi.updateLesson(editingLesson.id, formData);
//                 updated.price = Number(updated.price || 0);
//                 setLessons(lessons.map(l => l.id === editingLesson.id ? updated : l));
//             } else {
//                 const created = await teacherApi.createLesson(formData);
//                 created.price = Number(created.price || 0);
//                 setLessons([created, ...lessons]);
//             }
//             setShowForm(false);
//             setEditingLesson(null);
//         } catch (err) {
//             console.error('Error saving lesson', err);
//         }
//     };

//     const handleEdit = (lesson: Lesson) => {
//         setEditingLesson(lesson);
//         setShowForm(true);
//     };

//     const handleDelete = async (lessonId: string) => {
//         try {
//             await teacherApi.deleteLesson(lessonId);
//             setLessons(lessons.filter(l => l.id !== lessonId));
//             setConfirmDeleteId(null);
//         } catch (err) {
//             console.error('Error deleting lesson', err);
//         }
//     };

//     const handleArchive = (lessonId: string) => {
//         console.log('Archiving lesson:', lessonId);
//     };

//     const handleViewStudents = (lessonId: string) => {
//         setViewingStudents({
//             lessonId,
//             students: [`Demo Student 1`, `Demo Student 2`]
//         });
//     };

//     const handleAddNew = () => {
//         setEditingLesson(null);
//         setShowForm(true);
//     };

//     if (showForm) {
//         return <LessonForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} initialData={editingLesson} />;
//     }

//     return (
//         <div className="relative">
//             {/* Fixed header section */}
//             <div className="fixed left-0 right-0 bg-slate-900/90 backdrop-blur-md z-20 p-6 border-b border-slate-700 -mt-8">
//                 <div className="max-w-7xl mx-auto">
//                     <div className="flex justify-between items-center mb-6">
//                         <h2 className="text-3xl font-bold text-white">Teacher Dashboard</h2>
//                         <Button onClick={handleAddNew}>
//                             <Plus className="h-5 w-5 mr-2" />
//                             Create New Lesson
//                         </Button>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <StatCard icon={FileText} title="Total Lessons" value={teacherLessons.length} />
//                         <StatCard icon={ShoppingBag} title="Total Sales" value={totalSales} />
//                         <StatCard icon={DollarSign} title="Total Earnings" value={`MWK ${totalEarnings.toFixed(2)}`} />
//                     </div>
//                 </div>
//             </div>

//             {/* Scrollable content section */}
//             <div className="pt-[220px]">
//                 <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mx-auto max-w-7xl -mt-8">
//                     <h3 className="text-xl font-bold text-white mb-4">My Published Lessons</h3>

//                     {teacherLessons.length > 0 ? (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {teacherLessons.map(lesson => {
//                                 const salesCount = getDemoSalesCount(lesson.id);
//                                 return (
//                                     <div key={lesson.id} className="relative bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-500 transition-colors">
//                                         <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
//                                             {salesCount} sales
//                                         </span>

//                                         <div className="space-y-2">
//                                             <h4 className="font-bold text-lg text-white">{lesson.title}</h4>
//                                             <p className="text-slate-300 text-sm line-clamp-2">{lesson.description}</p>
//                                             <div className="flex justify-between text-sm text-slate-400">
//                                                 <span>{lesson.subject}</span>
//                                                 <span>MWK {Number(lesson.price).toFixed(2)}</span>
//                                             </div>
//                                         </div>

//                                         <div className="mt-4 flex justify-between border-t border-slate-700 pt-3">
//                                             <button onClick={() => handleViewStudents(lesson.id)} className="text-blue-400 hover:text-blue-300 p-1">
//                                                 <Eye className="h-5 w-5" />
//                                             </button>
//                                             <button onClick={() => handleEdit(lesson)} className="text-yellow-400 hover:text-yellow-300 p-1">
//                                                 <Edit className="h-5 w-5" />
//                                             </button>
//                                             <button onClick={() => handleArchive(lesson.id)} className="text-purple-400 hover:text-purple-300 p-1">
//                                                 <Archive className="h-5 w-5" />
//                                             </button>
//                                             <button onClick={() => setConfirmDeleteId(lesson.id)} className="text-red-400 hover:text-red-300 p-1">
//                                                 <Trash2 className="h-5 w-5" />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     ) : (
//                         <div className="text-center py-16 text-slate-400">
//                             <p>No lessons created yet</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {viewingStudents && (
//                 <Modal isOpen={!!viewingStudents} onClose={() => setViewingStudents(null)} title="Students">
//                     <div className="space-y-2">
//                         {viewingStudents.students.map((student, index) => (
//                             <div key={index} className="text-white">{student}</div>
//                         ))}
//                     </div>
//                 </Modal>
//             )}

//             {confirmDeleteId && (
//                 <Modal isOpen={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)} title="Confirm Delete">
//                     <div className="space-y-4">
//                         <p className="text-white">Delete this lesson?</p>
//                         <div className="flex justify-end gap-2">
//                             <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
//                             <Button variant="danger" onClick={() => handleDelete(confirmDeleteId)}>Delete</Button>
//                         </div>
//                     </div>
//                 </Modal>
//             )}
//         </div>
//     );
// }

// // 'use client';
// // import { useAppContext } from '../../context/AppContext';
// // import { FileText, DollarSign, Plus, ShoppingBag, Eye, Trash2, Archive, Edit } from 'lucide-react';
// // import { useState, useEffect, useMemo } from 'react';
// // import StatCard from '../common/StatCard';
// // import LessonForm from './LessonForm';
// // import { Lesson } from '@/types';
// // import Button from '../common/Button';
// // import Modal from '../common/Modal';
// // import { TeacherApiService } from '@/services/api/teacher-api.service';

// // export default function TeacherDashboard() {
// //     const { user } = useAppContext();
// //     const [lessons, setLessons] = useState<Lesson[]>([]);
// //     const [showForm, setShowForm] = useState(false);
// //     const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
// //     const [viewingStudents, setViewingStudents] = useState<{ lessonId: string, students: string[] } | null>(null);
// //     const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

// //     const teacherApi = new TeacherApiService();

// //     // Fetch lessons from API and normalize price
// //     useEffect(() => {
// //         if (!user?.id) return;
// //         teacherApi.getLessons()
// //             .then(fetchedLessons => {
// //                 console.log('Fetched lessons from API:', fetchedLessons);
// //                 const lessonsWithNumericPrice = fetchedLessons.map(l => ({
// //                     ...l,
// //                     price: Number(l.price || 0) // Ensure numeric
// //                 }));
// //                 setLessons(lessonsWithNumericPrice);
// //             })
// //             .catch(err => {
// //                 console.error('Failed to fetch lessons', err);
// //                 setLessons([]); // fallback empty
// //             });
// //     }, [user?.id]);

// //     const teacherLessons = useMemo(() => {
// //         console.log('Filtered teacherLessons:');
// //         return lessons;
// //     }, [lessons, user]);

// //     const getDemoSalesCount = (lessonId: string) => {
// //         const base = parseInt(lessonId.replace(/\D/g, '')) || 1;
// //         return (base % 4) + 2; // 2-5 sales demo
// //     };

// //     const handleSubmit = async (formData: Omit<Lesson, 'id' | 'teacherId' | 'teacherName' | 'createdAt'>) => {
// //         if (!user) return;

// //         try {
// //             if (editingLesson) {
// //                 const updated = await teacherApi.updateLesson(editingLesson.id, formData);
// //                 updated.price = Number(updated.price || 0);
// //                 setLessons(lessons.map(l => l.id === editingLesson.id ? updated : l));
// //             } else {
// //                 const created = await teacherApi.createLesson(formData);
// //                 created.price = Number(created.price || 0);
// //                 setLessons([created, ...lessons]);
// //             }
// //             setShowForm(false);
// //             setEditingLesson(null);
// //         } catch (err) {
// //             console.error('Error saving lesson', err);
// //         }
// //     };

// //     const handleEdit = (lesson: Lesson) => {
// //         setEditingLesson(lesson);
// //         setShowForm(true);
// //     };

// //     const handleDelete = async (lessonId: string) => {
// //         try {
// //             await teacherApi.deleteLesson(lessonId);
// //             setLessons(lessons.filter(l => l.id !== lessonId));
// //             setConfirmDeleteId(null);
// //         } catch (err) {
// //             console.error('Error deleting lesson', err);
// //         }
// //     };

// //     const handleArchive = (lessonId: string) => {
// //         console.log('Archiving lesson:', lessonId);
// //     };

// //     const handleViewStudents = (lessonId: string) => {
// //         setViewingStudents({
// //             lessonId,
// //             students: [`Demo Student 1`, `Demo Student 2`]
// //         });
// //     };

// //     const handleAddNew = () => {
// //         setEditingLesson(null);
// //         setShowForm(true);
// //     };

// //     if (showForm) {
// //         return <LessonForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} initialData={editingLesson} />;
// //     }

// //     return (
// //         <div className="space-y-8">
// //             <div className="flex justify-between items-center">
// //                 <h2 className="text-3xl font-bold text-white">Teacher Dashboard</h2>
// //                 <Button onClick={handleAddNew}>
// //                     <Plus className="h-5 w-5 mr-2" />
// //                     Create New Lesson
// //                 </Button>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                 <StatCard icon={FileText} title="Total Lessons" value={teacherLessons.length} />
// //                 <StatCard icon={ShoppingBag} title="Total Sales" value={0} />
// //                 <StatCard icon={DollarSign} title="Total Earnings" value={`MWK 0`} />
// //             </div>

// //             <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
// //                 <h3 className="text-xl font-bold text-white mb-4">My Published Lessons</h3>

// //                 {teacherLessons.length > 0 ? (
// //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                         {teacherLessons.map(lesson => {
// //                             const salesCount = getDemoSalesCount(lesson.id);
// //                             return (
// //                                 <div key={lesson.id} className="relative bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-500 transition-colors">
// //                                     <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
// //                                         {salesCount} sales
// //                                     </span>

// //                                     <div className="space-y-2">
// //                                         <h4 className="font-bold text-lg text-white">{lesson.title}</h4>
// //                                         <p className="text-slate-300 text-sm line-clamp-2">{lesson.description}</p>
// //                                         <div className="flex justify-between text-sm text-slate-400">
// //                                             <span>{lesson.subject}</span>
// //                                             <span>MWK {Number(lesson.price).toFixed(2)}</span>
// //                                         </div>
// //                                     </div>

// //                                     <div className="mt-4 flex justify-between border-t border-slate-700 pt-3">
// //                                         <button onClick={() => handleViewStudents(lesson.id)} className="text-blue-400 hover:text-blue-300 p-1">
// //                                             <Eye className="h-5 w-5" />
// //                                         </button>
// //                                         <button onClick={() => handleEdit(lesson)} className="text-yellow-400 hover:text-yellow-300 p-1">
// //                                             <Edit className="h-5 w-5" />
// //                                         </button>
// //                                         <button onClick={() => handleArchive(lesson.id)} className="text-purple-400 hover:text-purple-300 p-1">
// //                                             <Archive className="h-5 w-5" />
// //                                         </button>
// //                                         <button onClick={() => setConfirmDeleteId(lesson.id)} className="text-red-400 hover:text-red-300 p-1">
// //                                             <Trash2 className="h-5 w-5" />
// //                                         </button>
// //                                     </div>
// //                                 </div>
// //                             );
// //                         })}
// //                     </div>
// //                 ) : (
// //                     <div className="text-center py-16 text-slate-400">
// //                         <p>No lessons created yet</p>
// //                     </div>
// //                 )}
// //             </div>

// //             {viewingStudents && (
// //                 <Modal isOpen={!!viewingStudents} onClose={() => setViewingStudents(null)} title="Students">
// //                     <div className="space-y-2">
// //                         {viewingStudents.students.map((student, index) => (
// //                             <div key={index} className="text-white">{student}</div>
// //                         ))}
// //                     </div>
// //                 </Modal>
// //             )}

// //             {confirmDeleteId && (
// //                 <Modal isOpen={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)} title="Confirm Delete">
// //                     <div className="space-y-4">
// //                         <p className="text-white">Delete this lesson?</p>
// //                         <div className="flex justify-end gap-2">
// //                             <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
// //                             <Button variant="danger" onClick={() => handleDelete(confirmDeleteId)}>Delete</Button>
// //                         </div>
// //                     </div>
// //                 </Modal>
// //             )}
// //         </div>
// //     );
// // }



// // 'use client';
// // import { useAppContext } from '../../context/AppContext';
// // import { FileText, DollarSign, Plus, ShoppingBag, Eye, Trash2, Archive, Edit } from 'lucide-react';
// // import { useState, useEffect, useMemo } from 'react';
// // import StatCard from '../common/StatCard';
// // import LessonForm from './LessonForm';
// // import { Lesson } from '@/types';
// // import Button from '../common/Button';
// // import Modal from '../common/Modal';
// // import { TeacherApiService } from '@/services/api/teacher-api.service';

// // export default function TeacherDashboard() {
// //     const { user } = useAppContext();
// //     const [lessons, setLessons] = useState<Lesson[]>([]);
// //     const [showForm, setShowForm] = useState(false);
// //     const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
// //     const [viewingStudents, setViewingStudents] = useState<{ lessonId: string, students: string[] } | null>(null);
// //     const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

// //     const teacherApi = new TeacherApiService();

// //     // Fetch lessons from API on load/user change
// //     // useEffect(() => {
// //     //     if (!user?.id) return;
// //     //     teacherApi.getLessons()
// //     //         .then(fetchedLessons => setLessons(fetchedLessons))
// //     //         .catch(err => {
// //     //             console.error('Failed to fetch lessons', err);
// //     //             setLessons([]); // fallback empty
// //     //         });
// //     // }, [user?.id]);

// //     useEffect(() => {
// //         if (!user?.id) return;
// //         teacherApi.getLessons()
// //             .then(fetchedLessons => {
// //                 console.log('Fetched lessons from API:', fetchedLessons); // <-- log here
// //                 setLessons(fetchedLessons);
// //             })
// //             .catch(err => {
// //                 console.error('Failed to fetch lessons', err);
// //                 setLessons([]); // fallback empty
// //             });
// //     }, [user?.id]);


// //     // Filter lessons for current teacher
// //     // const teacherLessons = useMemo(() => lessons.filter(l => l.teacherId === user?.id), [lessons, user]);
// //     const teacherLessons = useMemo(() => {
// //         // const filtered = lessons.filter(l => l.teacherId === user?.id);
// //         console.log('Filtered teacherLessons:'); // <-- log here
// //         return lessons;
// //     }, [lessons, user]);


// //     // Demo sales calculations (keep as is)
// //     // const demoTotalSales = teacherLessons.length * 3;
// //     // const demoActualEarnings = teacherLessons.reduce((sum, lesson) => sum + (lesson.price * 3), 0);

// //     const getDemoSalesCount = (lessonId: string) => {
// //         const base = parseInt(lessonId.replace(/\D/g, '')) || 1;
// //         return (base % 4) + 2; // 2-5 sales demo
// //     };

// //     // Real handlers with API calls:

// //     const handleSubmit = async (formData: Omit<Lesson, 'id' | 'teacherId' | 'teacherName' | 'createdAt'>) => {
// //         if (!user) return;

// //         try {
// //             if (editingLesson) {
// //                 // Update lesson via API
// //                 const updated = await teacherApi.updateLesson(editingLesson.id, formData);
// //                 setLessons(lessons.map(l => l.id === editingLesson.id ? updated : l));
// //             } else {
// //                 // Create lesson via API
// //                 const created = await teacherApi.createLesson(formData);
// //                 setLessons([created, ...lessons]);
// //             }
// //             setShowForm(false);
// //             setEditingLesson(null);
// //         } catch (err) {
// //             console.error('Error saving lesson', err);
// //             // Could show toast or error state here
// //         }
// //     };

// //     const handleEdit = (lesson: Lesson) => {
// //         setEditingLesson(lesson);
// //         setShowForm(true);
// //     };

// //     const handleDelete = async (lessonId: string) => {
// //         try {
// //             await teacherApi.deleteLesson(lessonId);
// //             setLessons(lessons.filter(l => l.id !== lessonId));
// //             setConfirmDeleteId(null);
// //         } catch (err) {
// //             console.error('Error deleting lesson', err);
// //         }
// //     };

// //     const handleArchive = (lessonId: string) => {
// //         console.log('Archiving lesson:', lessonId);
// //     };

// //     const handleViewStudents = (lessonId: string) => {
// //         // You can fetch real students here if you want:
// //         // teacherApi.getLessonStudents(lessonId).then(...).catch(...)
// //         // But keeping your demo static for now as you requested
// //         setViewingStudents({
// //             lessonId,
// //             students: [`Demo Student 1`, `Demo Student 2`]
// //         });
// //     };

// //     const handleAddNew = () => {
// //         setEditingLesson(null);
// //         setShowForm(true);
// //     };

// //     if (showForm) {
// //         return <LessonForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} initialData={editingLesson} />;
// //     }

// //     return (
// //         <div className="space-y-8">
// //             <div className="flex justify-between items-center">
// //                 <h2 className="text-3xl font-bold text-white">Teacher Dashboard</h2>
// //                 <Button onClick={handleAddNew}>
// //                     <Plus className="h-5 w-5 mr-2" />
// //                     Create New Lesson
// //                 </Button>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //                 <StatCard icon={FileText} title="Total Lessons" value={teacherLessons.length} />
// //                 <StatCard icon={ShoppingBag} title="Total Sales" value={0} />
// //                 <StatCard icon={DollarSign} title="Total Earnings" value={`MWK 0`} />
// //             </div>

// //             <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
// //                 <h3 className="text-xl font-bold text-white mb-4">My Published Lessons</h3>

// //                 {teacherLessons.length > 0 ? (
// //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                         {teacherLessons.map(lesson => {
// //                             const salesCount = getDemoSalesCount(lesson.id);
// //                             return (
// //                                 <div key={lesson.id} className="relative bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-500 transition-colors">
// //                                     <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
// //                                         {salesCount} sales
// //                                     </span>

// //                                     <div className="space-y-2">
// //                                         <h4 className="font-bold text-lg text-white">{lesson.title}</h4>
// //                                         <p className="text-slate-300 text-sm line-clamp-2">{lesson.description}</p>
// //                                         <div className="flex justify-between text-sm text-slate-400">
// //                                             <span>{lesson.subject}</span>
// //                                             <span>MWK {Number(lesson.price || 0).toFixed(2)}</span>

// //                                         </div>
// //                                     </div>

// //                                     <div className="mt-4 flex justify-between border-t border-slate-700 pt-3">
// //                                         <button onClick={() => handleViewStudents(lesson.id)} className="text-blue-400 hover:text-blue-300 p-1">
// //                                             <Eye className="h-5 w-5" />
// //                                         </button>
// //                                         <button onClick={() => handleEdit(lesson)} className="text-yellow-400 hover:text-yellow-300 p-1">
// //                                             <Edit className="h-5 w-5" />
// //                                         </button>
// //                                         <button onClick={() => handleArchive(lesson.id)} className="text-purple-400 hover:text-purple-300 p-1">
// //                                             <Archive className="h-5 w-5" />
// //                                         </button>
// //                                         <button onClick={() => setConfirmDeleteId(lesson.id)} className="text-red-400 hover:text-red-300 p-1">
// //                                             <Trash2 className="h-5 w-5" />
// //                                         </button>
// //                                     </div>
// //                                 </div>
// //                             );
// //                         })}
// //                     </div>
// //                 ) : (
// //                     <div className="text-center py-16 text-slate-400">
// //                         <p>No lessons created yet</p>
// //                     </div>
// //                 )}
// //             </div>

// //             {viewingStudents && (
// //                 <Modal isOpen={!!viewingStudents} onClose={() => setViewingStudents(null)} title="Students">
// //                     <div className="space-y-2">
// //                         {viewingStudents.students.map((student, index) => (
// //                             <div key={index} className="text-white">{student}</div>
// //                         ))}
// //                     </div>
// //                 </Modal>
// //             )}

// //             {confirmDeleteId && (
// //                 <Modal isOpen={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)} title="Confirm Delete">
// //                     <div className="space-y-4">
// //                         <p className="text-white">Delete this lesson?</p>
// //                         <div className="flex justify-end gap-2">
// //                             <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
// //                             <Button variant="danger" onClick={() => handleDelete(confirmDeleteId)}>Delete</Button>
// //                         </div>
// //                     </div>
// //                 </Modal>
// //             )}
// //         </div>
// //     );
// // }
