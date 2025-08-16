'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { BookOpen, GraduationCap } from 'lucide-react';
import LessonCard from '../common/LessonCard';
import StatCard from '../common/StatCard';
import FilterSelect from '../common/FilterSelect';
import LessonDetailView from './LessonDetailView';
import CartModal from '../common/CartModal';
import { Lesson } from '@/types';
import { StudentApiService } from '@/services/api/student-api.service';

export default function StudentDashboard() {
    const { searchTerm, addToCart } = useAppContext();

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [purchasedLessonIds, setPurchasedLessonIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedSubject, setSelectedSubject] = useState('All Subjects');
    const [selectedForm, setSelectedForm] = useState('All Forms');
    const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);
    const [activeTab, setActiveTab] = useState<'available' | 'myLessons'>('available');
    const [isCartOpen, setIsCartOpen] = useState(false);

    const studentService = useMemo(() => new StudentApiService(), []);

    // Fetch lessons and purchased lessons once on mount
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [available, purchased] = await Promise.all([
                    studentService.getAvailableLessons(),
                    studentService.getPurchasedLessons(),
                ]);
                // Sort available lessons by date (newest first)
                const sortedAvailable = [...available].sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setLessons(sortedAvailable);
                setPurchasedLessonIds(purchased.map((lesson) => lesson.id));
                setPurchasedLessonIds(purchased.map((lesson) => lesson.id));
            } catch (err) {
                console.error('Failed to load lessons:', err);
                setError('Failed to load lessons. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [studentService]);

    // Filter subjects and forms dynamically from lessons
    const subjects = useMemo(
        () => ['All Subjects', ...Array.from(new Set(lessons.map((l) => l.subject)))],
        [lessons]
    );

    const forms = useMemo(
        () => ['All Forms', ...Array.from(new Set(lessons.map((l) => l.form)))],
        [lessons]
    );

    // Filter lessons by search, subject, and form
    const filteredLessons = useMemo(() => {
        return lessons.filter((lesson) => {
            const matchesSearch =
                lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lesson.description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesSubject = selectedSubject === 'All Subjects' || lesson.subject === selectedSubject;
            const matchesForm = selectedForm === 'All Forms' || lesson.form === selectedForm;

            return matchesSearch && matchesSubject && matchesForm;
        });
    }, [lessons, searchTerm, selectedSubject, selectedForm]);

    // Split filtered lessons into available and purchased
    const availableLessons = useMemo(
        () => filteredLessons.filter((lesson) => !purchasedLessonIds.includes(lesson.id)),
        [filteredLessons, purchasedLessonIds]
    );

    const myLessons = useMemo(
        () => filteredLessons.filter((lesson) => purchasedLessonIds.includes(lesson.id)),
        [filteredLessons, purchasedLessonIds]
    );

    // ❌ DELETE this version (direct purchase on button click):
    // // Handler for buying a lesson immediately
    const handleBuyNow = async (lesson: Lesson) => {
        try {
            await studentService.purchaseLessons([{ lessonId: lesson.id }]);
            setPurchasedLessonIds((prev) => [...prev, lesson.id]);
            // Optionally show success notification here
        } catch (err) {
            console.error('Purchase failed:', err);
            // Optionally show error notification here
        }
    };

    // ✅ REPLACE WITH:
    // const handleBuyNow = (lesson: Lesson) => {
    //     addToCart(lesson);      // Uses existing cart system
    //     setIsCartOpen(true);    // Opens payment modal
    // };

    // Handler for adding a lesson to cart and opening cart modal
    const handleAddToCart = (lesson: Lesson) => {
        addToCart(lesson);
        setIsCartOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 text-white">
                Loading lessons...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-8">
                {error}
            </div>
        );
    }

    if (viewingLesson) {
        return <LessonDetailView lesson={viewingLesson} onBack={() => setViewingLesson(null)} />;
    }

    return (
        <div className="relative">
            {/* Cart Modal */}
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* Header with stats and filters */}
            <div className="fixed left-0 right-0 bg-slate-900/90 backdrop-blur-md z-20 p-6 border-b border-slate-700 -mt-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        icon={BookOpen}
                        title="Available Lessons"
                        value={availableLessons.length}
                        isActive={activeTab === 'available'}
                        onClick={() => setActiveTab('available')}
                    />
                    <StatCard
                        icon={GraduationCap}
                        title="My Lessons"
                        value={myLessons.length}
                        isActive={activeTab === 'myLessons'}
                        onClick={() => setActiveTab('myLessons')}
                    />
                    <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700 flex flex-col justify-between">
                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                            <FilterSelect value={selectedSubject} onChange={setSelectedSubject} options={subjects} />
                            <FilterSelect value={selectedForm} onChange={setSelectedForm} options={forms} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content with lesson cards */}
            <div className="pt-[180px]">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mx-auto max-w-7xl -mt-8">
                    {activeTab === 'available' ? (
                        <>
                            <h2 className="text-xl font-semibold mb-6 text-white">Available Lessons</h2>
                            {availableLessons.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {availableLessons.map((lesson) => (
                                        <LessonCard
                                            key={lesson.id}
                                            lesson={lesson}
                                            isPurchased={false}
                                            onView={setViewingLesson}
                                            onAddToCart={handleAddToCart}
                                            onBuyNow={handleBuyNow}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 text-slate-400">
                                    <p className="font-semibold">No available lessons found.</p>
                                    <p className="text-sm">Try adjusting your search filters.</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold mb-6 text-white">My Lessons</h2>
                            {myLessons.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {myLessons.map((lesson) => (
                                        <LessonCard
                                            key={lesson.id}
                                            lesson={lesson}
                                            isPurchased={true}
                                            onView={setViewingLesson}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 text-slate-400">
                                    <p className="font-semibold">You haven't purchased any lessons yet.</p>
                                    <p className="text-sm">Browse available lessons to get started.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}


// 'use client';

// import { useAppContext } from '../../context/AppContext';
// import { BookOpen, GraduationCap } from 'lucide-react';
// import { useState, useMemo } from 'react';
// import LessonCard from '../common/LessonCard';
// import StatCard from '../common/StatCard';
// import FilterSelect from '../common/FilterSelect';
// import LessonDetailView from './LessonDetailView';
// import { Lesson } from '@/types';
// import CartModal from '../common/CartModal';
// // import CartModal from './CartModal'; // ADDED: Import CartModal

// export default function StudentDashboard() {
//     const { lessons, purchasedLessonIds, searchTerm, addToCart } = useAppContext();
//     const [selectedSubject, setSelectedSubject] = useState('All Subjects');
//     const [selectedForm, setSelectedForm] = useState('All Forms');
//     const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);
//     const [activeTab, setActiveTab] = useState<'available' | 'myLessons'>('available');
//     const [isCartOpen, setIsCartOpen] = useState(false); // ADDED: State for cart modal visibility
//     const { user } = useAppContext();

//     const subjects = useMemo(() => ['All Subjects', ...new Set(lessons.map(l => l.subject))], [lessons]);
//     const forms = useMemo(() => ['All Forms', ...new Set(lessons.map(l => l.form))], [lessons]);

//     const filteredLessons = useMemo(() => {
//         return lessons.filter(lesson => {
//             const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
//             const matchesSubject = selectedSubject === 'All Subjects' || lesson.subject === selectedSubject;
//             const matchesForm = selectedForm === 'All Forms' || lesson.form === selectedForm;
//             return matchesSearch && matchesSubject && matchesForm;
//         });
//     }, [lessons, searchTerm, selectedSubject, selectedForm]);

//     const availableLessons = useMemo(() =>
//         filteredLessons.filter(lesson => !purchasedLessonIds.includes(lesson.id)),
//         [filteredLessons, purchasedLessonIds]
//     );

//     const myLessons = useMemo(() =>
//         filteredLessons.filter(lesson => purchasedLessonIds.includes(lesson.id)),
//         [filteredLessons, purchasedLessonIds]
//     );

//     // ADDED: Handler for Buy Now action
//     const handleBuyNow = (lesson: Lesson) => {
//         addToCart(lesson);
//         setIsCartOpen(true); // Open cart modal after adding
//     };

//     if (viewingLesson) {
//         return <LessonDetailView lesson={viewingLesson} onBack={() => setViewingLesson(null)} />;
//     }

//     return (
//         <div className="relative">
//             {/* ADDED: CartModal component */}
//             <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

//             {/* Fixed cards container */}
//             <div className="fixed left-0 right-0 bg-slate-900/90 backdrop-blur-md z-20 p-6 border-b border-slate-700 -mt-8">
//                 <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <StatCard
//                         icon={BookOpen}
//                         title="Available Lessons"
//                         value={availableLessons.length}
//                         isActive={activeTab === 'available'}
//                         onClick={() => setActiveTab('available')}
//                     />
//                     <StatCard
//                         icon={GraduationCap}
//                         title="My Lessons"
//                         value={myLessons.length}
//                         isActive={activeTab === 'myLessons'}
//                         onClick={() => setActiveTab('myLessons')}
//                     />
//                     <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700 flex flex-col justify-between">
//                         <div className="flex flex-col md:flex-row gap-4 mt-4">
//                             <FilterSelect value={selectedSubject} onChange={setSelectedSubject} options={subjects} />
//                             <FilterSelect value={selectedForm} onChange={setSelectedForm} options={forms} />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Scrollable content below fixed cards */}
//             <div className="pt-[180px]">
//                 <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mx-auto max-w-7xl -mt-8">
//                     {/* Tab content */}
//                     {activeTab === 'available' ? (
//                         <>
//                             <h2 className="text-xl font-semibold mb-6 text-white">Available Lessons</h2>
//                             {availableLessons.length > 0 ? (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                     {availableLessons.map(lesson => (
//                                         <LessonCard
//                                             key={lesson.id}
//                                             lesson={lesson}
//                                             isPurchased={false}
//                                             onView={setViewingLesson}
//                                             onAddToCart={addToCart} // ADDED: Pass addToCart handler
//                                             onBuyNow={handleBuyNow} // ADDED: Pass buyNow handler
//                                         />
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-16 text-slate-400">
//                                     <p className="font-semibold">No available lessons found.</p>
//                                     <p className="text-sm">Try adjusting your search filters.</p>
//                                 </div>
//                             )}
//                         </>
//                     ) : (
//                         <>
//                             <h2 className="text-xl font-semibold mb-6 text-white">My Lessons</h2>
//                             {myLessons.length > 0 ? (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                     {myLessons.map(lesson => (
//                                         <LessonCard
//                                             key={lesson.id}
//                                             lesson={lesson}
//                                             isPurchased={true}
//                                             onView={setViewingLesson}
//                                         />
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-16 text-slate-400">
//                                     <p className="font-semibold">You haven't purchased any lessons yet.</p>
//                                     <p className="text-sm">Browse available lessons to get started.</p>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // 'use client';

// // import { useAppContext } from '../../context/AppContext';
// // import { BookOpen, GraduationCap, DollarSign } from 'lucide-react';
// // import { useState, useMemo } from 'react';
// // import LessonCard from '../common/LessonCard';
// // import StatCard from '../common/StatCard';
// // import FilterSelect from '../common/FilterSelect';
// // import LessonDetailView from './LessonDetailView';
// // import { Lesson } from '@/types';

// // export default function StudentDashboard() {
// //     const { lessons, purchasedLessonIds, searchTerm } = useAppContext();
// //     const [selectedSubject, setSelectedSubject] = useState('All Subjects');
// //     const [selectedForm, setSelectedForm] = useState('All Forms');
// //     const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);
// //     const [activeTab, setActiveTab] = useState<'available' | 'myLessons'>('available');
// //     const { user } = useAppContext();
// //     const subjects = useMemo(() => ['All Subjects', ...new Set(lessons.map(l => l.subject))], [lessons]);
// //     const forms = useMemo(() => ['All Forms', ...new Set(lessons.map(l => l.form))], [lessons]);

// //     const filteredLessons = useMemo(() => {
// //         return lessons.filter(lesson => {
// //             const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //                 lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
// //             const matchesSubject = selectedSubject === 'All Subjects' || lesson.subject === selectedSubject;
// //             const matchesForm = selectedForm === 'All Forms' || lesson.form === selectedForm;
// //             return matchesSearch && matchesSubject && matchesForm;
// //         });
// //     }, [lessons, searchTerm, selectedSubject, selectedForm]);

// //     // Separate lessons into available and purchased
// //     const availableLessons = useMemo(() =>
// //         filteredLessons.filter(lesson => !purchasedLessonIds.includes(lesson.id)),
// //         [filteredLessons, purchasedLessonIds]
// //     );

// //     const myLessons = useMemo(() =>
// //         filteredLessons.filter(lesson => purchasedLessonIds.includes(lesson.id)),
// //         [filteredLessons, purchasedLessonIds]
// //     );

// //     if (viewingLesson) {
// //         return <LessonDetailView lesson={viewingLesson} onBack={() => setViewingLesson(null)} />;
// //     }

// //     return (
// //         <div className="relative">
// //             {/* Fixed cards container */}
// //             <div className="fixed left-0 right-0 bg-slate-900/90 backdrop-blur-md z-20 p-6 border-b border-slate-700 -mt-8">
// //                 <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
// //                     <StatCard
// //                         icon={BookOpen}
// //                         title="Available Lessons"
// //                         value={availableLessons.length}
// //                         isActive={activeTab === 'available'}
// //                         onClick={() => setActiveTab('available')}
// //                     />
// //                     <StatCard
// //                         icon={GraduationCap}
// //                         title="My Lessons"
// //                         value={myLessons.length}
// //                         isActive={activeTab === 'myLessons'}
// //                         onClick={() => setActiveTab('myLessons')}
// //                     />
// //                     <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700 flex flex-col justify-between">
// //                         <div className="flex flex-col md:flex-row gap-4 mt-4">
// //                             <FilterSelect value={selectedSubject} onChange={setSelectedSubject} options={subjects} />
// //                             <FilterSelect value={selectedForm} onChange={setSelectedForm} options={forms} />
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Scrollable content below fixed cards */}
// //             <div className="pt-[180px]">
// //                 <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mx-auto max-w-7xl -mt-8">
// //                     {/* Tab content */}
// //                     {activeTab === 'available' ? (
// //                         <>
// //                             <h2 className="text-xl font-semibold mb-6 text-white">Available Lessons</h2>
// //                             {availableLessons.length > 0 ? (
// //                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                                     {availableLessons.map(lesson => (
// //                                         <LessonCard
// //                                             key={lesson.id}
// //                                             lesson={lesson}
// //                                             isPurchased={false}
// //                                             onView={setViewingLesson}
// //                                         />
// //                                     ))}
// //                                 </div>
// //                             ) : (
// //                                 <div className="text-center py-16 text-slate-400">
// //                                     <p className="font-semibold">No available lessons found.</p>
// //                                     <p className="text-sm">Try adjusting your search filters.</p>
// //                                 </div>
// //                             )}
// //                         </>
// //                     ) : (
// //                         <>
// //                             <h2 className="text-xl font-semibold mb-6 text-white">My Lessons</h2>
// //                             {myLessons.length > 0 ? (
// //                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                                     {myLessons.map(lesson => (
// //                                         <LessonCard
// //                                             key={lesson.id}
// //                                             lesson={lesson}
// //                                             isPurchased={true}
// //                                             onView={setViewingLesson}
// //                                         />
// //                                     ))}
// //                                 </div>
// //                             ) : (
// //                                 <div className="text-center py-16 text-slate-400">
// //                                     <p className="font-semibold">You haven't purchased any lessons yet.</p>
// //                                     <p className="text-sm">Browse available lessons to get started.</p>
// //                                 </div>
// //                             )}
// //                         </>
// //                     )}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // 'use client';

// // import { useAppContext } from '../../context/AppContext';
// // import { BookOpen, GraduationCap, DollarSign } from 'lucide-react';
// // import { useState, useMemo } from 'react';
// // import LessonCard from '../common/LessonCard';
// // import StatCard from '../common/StatCard';
// // import FilterSelect from '../common/FilterSelect';
// // import LessonDetailView from './LessonDetailView';
// // import { Lesson } from '@/types';

// // export default function StudentDashboard() {
// //     const { lessons, purchasedLessonIds, searchTerm } = useAppContext();
// //     const [selectedSubject, setSelectedSubject] = useState('All Subjects');
// //     const [selectedForm, setSelectedForm] = useState('All Forms');
// //     const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);
// //     const { user } = useAppContext();
// //     const subjects = useMemo(() => ['All Subjects', ...new Set(lessons.map(l => l.subject))], [lessons]);
// //     const forms = useMemo(() => ['All Forms', ...new Set(lessons.map(l => l.form))], [lessons]);

// //     const filteredLessons = useMemo(() => {
// //         return lessons.filter(lesson => {
// //             const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //                 lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
// //             const matchesSubject = selectedSubject === 'All Subjects' || lesson.subject === selectedSubject;
// //             const matchesForm = selectedForm === 'All Forms' || lesson.form === selectedForm;
// //             return matchesSearch && matchesSubject && matchesForm;
// //         });
// //     }, [lessons, searchTerm, selectedSubject, selectedForm]);

// //     if (viewingLesson) {
// //         return <LessonDetailView lesson={viewingLesson} onBack={() => setViewingLesson(null)} />;
// //     }

// //     return (
// //         <div className="relative">
// //             {/* Fixed cards container (CHANGED from sticky to fixed) */}
// //             <div className="fixed left-0 right-0 bg-slate-900/90 backdrop-blur-md z-20 p-6 border-b border-slate-700 -mt-8">
// //                 <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
// //                     <StatCard icon={BookOpen} title="Available Lessons" value={lessons.length} />
// //                     <StatCard icon={GraduationCap} title="My Lessons" value={purchasedLessonIds.length} />
// //                     <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700 flex flex-col justify-between">
// //                         <div className="flex flex-col md:flex-row gap-4 mt-4">
// //                             <FilterSelect value={selectedSubject} onChange={setSelectedSubject} options={subjects} />
// //                             <FilterSelect value={selectedForm} onChange={setSelectedForm} options={forms} />
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Scrollable content below fixed cards (CHANGED: Added pt-[180px] to account for fixed cards height) */}
// //             <div className="pt-[180px]">
// //                 <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mx-auto max-w-7xl -mt-8">
// //                     {filteredLessons.length > 0 ? (
// //                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                             {filteredLessons.map(lesson => (
// //                                 <LessonCard
// //                                     key={lesson.id}
// //                                     lesson={lesson}
// //                                     isPurchased={purchasedLessonIds.includes(lesson.id)}
// //                                     onView={setViewingLesson}
// //                                 />
// //                             ))}
// //                         </div>
// //                     ) : (
// //                         <div className="text-center py-16 text-slate-400">
// //                             <p className="font-semibold">No lessons found.</p>
// //                             <p className="text-sm">Try adjusting your search filters.</p>
// //                         </div>
// //                     )}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

