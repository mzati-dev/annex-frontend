'use client';

import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Header from '@/components/common/Header';

// Import the new, separated components
import StudentTutorFinder from './components/StudentView';
import TeacherTutorDashboard from './components/TeacherView';

// The main export is now a clean switcher.
export default function FindTutorPage() {
    const { user } = useAppContext();

    // This security guard can remain here to protect the route
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) { window.location.replace('/'); }
        }, 100);
        return () => clearTimeout(timer);
    }, [user]);

    // A loading state while the user context is being checked
    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <p>Loading Page...</p>
            </div>
        );
    }

    return (
        <>
            <Header />
            {/* This is the core logic: 
              - If the user is a 'teacher', show the Teacher dashboard.
              - Otherwise (for 'student'), show the Student finder page.
            */}
            {user.role === 'teacher' ? <TeacherTutorDashboard /> : <StudentTutorFinder />}
        </>
    );
}


// 'use client';

// import { useEffect, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import Header from '@/components/common/Header';
// import { Search, Star, MessageSquare, SlidersHorizontal, ToggleRight, Calendar, DollarSign, Edit, Users } from 'lucide-react';
// import Link from 'next/link';

// // ====================================================================================
// // --- YOUR ORIGINAL CODE STARTS HERE (UNCHANGED) ---
// // ====================================================================================

// const mockTutors = [
//     {
//         id: 't1',
//         name: 'Mr. Phiri',
//         subjects: ['Biology', 'Chemistry'],
//         bio: 'Experienced science teacher with over 10 years of experience helping students excel in MSCE examinations.',
//         rating: 4.9,
//         reviews: 32,
//         avatar: 'P',
//     },
//     {
//         id: 't2',
//         name: 'Mrs. Banda',
//         subjects: ['Mathematics', 'Physics'],
//         bio: 'Passionate about making complex mathematical concepts easy to understand. Specializes in algebra and calculus.',
//         rating: 5.0,
//         reviews: 45,
//         avatar: 'B',
//     },
//     {
//         id: 't3',
//         name: 'Dr. Tembo',
//         subjects: ['English Literature', 'History'],
//         bio: 'University lecturer with a PhD in History, providing in-depth tutoring for arts and humanities subjects.',
//         rating: 4.8,
//         reviews: 28,
//         avatar: 'T',
//     },
//     {
//         id: 't4',
//         name: 'Ms. Moyo',
//         subjects: ['Geography', 'Agriculture'],
//         bio: 'A certified geographer dedicated to helping students understand the world around them.',
//         rating: 4.7,
//         reviews: 19,
//         avatar: 'M',
//     }
// ];

// const TutorCard = ({ tutor }: { tutor: typeof mockTutors[0] }) => (
//     <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
//         <div className="p-6">
//             <div className="flex items-center mb-4">
//                 <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold flex-shrink-0 mr-4">
//                     {tutor.avatar}
//                 </div>
//                 <div>
//                     <h3 className="text-xl font-bold text-white">{tutor.name}</h3>
//                     <div className="flex items-center text-sm text-yellow-400 mt-1">
//                         <Star className="h-4 w-4 fill-current mr-1" />
//                         <span>{tutor.rating.toFixed(1)} ({tutor.reviews} reviews)</span>
//                     </div>
//                 </div>
//             </div>
//             <p className="text-slate-400 text-sm mb-4 h-20 overflow-hidden">{tutor.bio}</p>
//             <div className="flex flex-wrap gap-2 mb-6">
//                 {tutor.subjects.map(subject => (
//                     <span key={subject} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">{subject}</span>
//                 ))}
//             </div>
//             <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
//                 <MessageSquare className="h-4 w-4 mr-2" />
//                 Contact {tutor.name}
//             </button>
//         </div>
//     </div>
// );

// // Your original component is now renamed to `StudentTutorFinder`
// const StudentTutorFinder = () => {
//     const { user } = useAppContext();

//     // Your original security guard remains here, protecting this view
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             if (!user || user.role !== 'student') {
//                 window.location.replace('/');
//             }
//         }, 100);
//         return () => clearTimeout(timer);
//     }, [user]);

//     if (!user) {
//         return (
//             <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
//                 <p>Loading...</p>
//             </div>
//         );
//     }

//     return (
//         <>
//             {/* The Header is now part of the main switch component */}
//             <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//                 <div className="max-w-7xl mx-auto">
//                     <div className="text-center mb-12">
//                         <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Find Your Perfect Tutor</h1>
//                         <p className="text-lg text-slate-400 max-w-2xl mx-auto">Search for qualified tutors by subject and connect with them for online lessons.</p>
//                         <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
//                             <div className="relative flex-grow">
//                                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search by subject (e.g., 'Mathematics')"
//                                     className="w-full bg-slate-800 border border-slate-700 rounded-md pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                 />
//                             </div>
//                             <button className="flex-shrink-0 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-5 rounded-md transition flex items-center justify-center">
//                                 <SlidersHorizontal className="h-5 w-5 mr-2" />
//                                 Filters
//                             </button>
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                         {mockTutors.map(tutor => (
//                             <TutorCard key={tutor.id} tutor={tutor} />
//                         ))}
//                     </div>
//                     <div className="text-center mt-20 py-12 bg-slate-800/50 rounded-lg">
//                         <h2 className="text-3xl font-bold mb-8">How It Works</h2>
//                         <div className="flex flex-col md:flex-row justify-center gap-8 px-4">
//                             <div className="flex-1 max-w-xs mx-auto">
//                                 <div className="text-3xl font-bold text-blue-400 mb-2">1.</div>
//                                 <h3 className="text-xl font-semibold mb-2">Search & Find</h3>
//                                 <p className="text-slate-400">Use the search bar to find tutors who specialize in the subject you need help with.</p>
//                             </div>
//                             <div className="flex-1 max-w-xs mx-auto">
//                                 <div className="text-3xl font-bold text-blue-400 mb-2">2.</div>
//                                 <h3 className="text-xl font-semibold mb-2">Contact & Schedule</h3>
//                                 <p className="text-slate-400">Use the contact button to message a tutor and arrange a time that works for both of you.</p>
//                             </div>
//                             <div className="flex-1 max-w-xs mx-auto">
//                                 <div className="text-3xl font-bold text-blue-400 mb-2">3.</div>
//                                 <h3 className="text-xl font-semibold mb-2">Start Learning</h3>
//                                 <p className="text-slate-400">Meet your tutor for your scheduled online session and start improving your skills.</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </>
//     );
// };

// // ====================================================================================
// // --- YOUR ORIGINAL CODE ENDS HERE ---
// // ====================================================================================


// // ====================================================================================
// // --- NEW CODE STARTS HERE (FOR TEACHER DASHBOARD & THE SWITCH) ---
// // ====================================================================================

// const TeacherProfileCard = ({ tutor }: { tutor: typeof mockTutors[0] }) => (
//     <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
//         <div className="p-6">
//             <div className="flex items-center mb-4">
//                 <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center text-2xl font-bold flex-shrink-0 mr-4">{tutor.avatar}</div>
//                 <div>
//                     <h3 className="text-xl font-bold text-white">{tutor.name}</h3>
//                     <div className="flex items-center text-sm text-yellow-400 mt-1"><Star className="h-4 w-4 fill-current mr-1" /><span>{tutor.rating.toFixed(1)} ({tutor.reviews} reviews)</span></div>
//                 </div>
//             </div>
//             <p className="text-slate-400 text-sm mb-4">{tutor.bio}</p>
//             <div className="flex flex-wrap gap-2 mb-6">{tutor.subjects.map(subject => (<span key={subject} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">{subject}</span>))}</div>
//             <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold shadow-lg transition flex items-center justify-center"><Edit className="h-4 w-4 mr-2" />Edit My Public Profile</button>
//         </div>
//     </div>
// );

// const StatCard = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string | number, label: string }) => (
//     <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
//         <Icon className="h-6 w-6 text-slate-400 mb-2" />
//         <p className="text-2xl font-bold text-white">{value}</p>
//         <p className="text-sm text-slate-400">{label}</p>
//     </div>
// );

// const TeacherTutorDashboard = () => {
//     const [isAvailable, setIsAvailable] = useState(true);
//     const teacherData = {
//         profile: mockTutors[0],
//         stats: { students: 15, earningsThisMonth: 150000, rating: 4.9 },
//         upcomingSessions: [
//             { id: 's1', studentName: 'Alice Phiri', subject: 'Biology', date: '02 Sep at 16:00' },
//             { id: 's2', studentName: 'Bob Banda', subject: 'Chemistry', date: '04 Sep at 10:00' },
//         ]
//     };

//     return (
//         <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//             <div className="max-w-7xl mx-auto">
//                 <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
//                     {/* <h1 className="text-3xl font-bold">My Tutoring Dashboard</h1> */}
//                     <h2 className="text-2xl font-bold mb-4">My Tutoring Profile (Public View)</h2>
//                     <div className="flex items-center gap-4 p-2 bg-slate-800 rounded-lg">
//                         <span className={`font-semibold ${isAvailable ? 'text-green-400' : 'text-slate-400'}`}>{isAvailable ? 'Available for new students' : 'Not currently available'}</span>
//                         <button onClick={() => setIsAvailable(!isAvailable)}><ToggleRight className={`h-10 w-10 transition-colors ${isAvailable ? 'text-green-500' : 'text-slate-600 rotate-180'}`} /></button>
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//                     <div className="lg:col-span-2 space-y-8">
//                         <div>
//                             {/* <h2 className="text-2xl font-bold mb-4">My Tutor Profile (Public View)</h2> */}
//                             <TeacherProfileCard tutor={teacherData.profile} />
//                         </div>
//                         <div>
//                             <h2 className="text-2xl font-bold mb-4">Upcoming Sessions</h2>
//                             <div className="space-y-3">
//                                 {teacherData.upcomingSessions.map(session => (
//                                     <div key={session.id} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
//                                         <div><p className="font-semibold">{session.studentName} - {session.subject}</p><p className="text-sm text-slate-400">{session.date}</p></div>
//                                         <Link href="#" className="text-sm font-semibold text-blue-400 hover:underline">Session Details</Link>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                     <div className="space-y-6">
//                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
//                             <h3 className="text-xl font-bold mb-4">My Stats</h3>
//                             <div className="space-y-4">
//                                 <StatCard icon={Users} value={teacherData.stats.students} label="Active Students" />
//                                 <StatCard icon={DollarSign} value={`K${teacherData.stats.earningsThisMonth.toLocaleString()}`} label="Earnings this Month" />
//                                 <StatCard icon={Star} value={teacherData.stats.rating.toFixed(1)} label="Average Rating" />
//                             </div>
//                         </div>
//                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-3">
//                             <h3 className="text-xl font-bold">Quick Actions</h3>
//                             <button className="w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold"><Calendar className="h-5 w-5" />Set My Availability</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// };


// // The main export is now the switch that decides which page to show.
// export default function FindTutorPage() {
//     const { user } = useAppContext();

//     // This general guard just ensures a user is logged in before deciding which view to show.
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             if (!user) { window.location.replace('/'); }
//         }, 100);
//         return () => clearTimeout(timer);
//     }, [user]);

//     if (!user) {
//         return (
//             <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
//                 <p>Loading Page...</p>
//             </div>
//         );
//     }

//     return (
//         <>
//             <Header />
//             {user.role === 'teacher' ? <TeacherTutorDashboard /> : <StudentTutorFinder />}
//         </>
//     );
// }


// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { useAppContext } from '../../context/AppContext';
// // // import Header from '../components/common/Header';
// // import { Search, Star, MessageSquare, SlidersHorizontal, ToggleRight, Calendar, DollarSign, Edit, Users } from 'lucide-react';
// // import Link from 'next/link';
// // import Header from '@/components/common/Header';

// // // --- MOCK DATA ---
// // const mockTutors = [
// //     { id: 't1', name: 'Mr. Phiri', subjects: ['Biology', 'Chemistry'], bio: 'Experienced science teacher...', rating: 4.9, reviews: 32, avatar: 'P' },
// //     { id: 't2', name: 'Mrs. Banda', subjects: ['Mathematics', 'Physics'], bio: 'Passionate about making complex concepts easy...', rating: 5.0, reviews: 45, avatar: 'B' },
// //     { id: 't3', name: 'Dr. Tembo', subjects: ['English Literature', 'History'], bio: 'University lecturer with a PhD...', rating: 4.8, reviews: 28, avatar: 'T' },
// // ];
// // const teacherData = {
// //     profile: mockTutors[0], // Assuming the logged-in teacher is Mr. Phiri
// //     stats: {
// //         students: 15,
// //         earningsThisMonth: 150000, // in MWK
// //         rating: 4.9,
// //     },
// //     upcomingSessions: [
// //         { id: 's1', studentName: 'Alice Phiri', subject: 'Biology', date: 'Tomorrow at 16:00' },
// //         { id: 's2', studentName: 'Bob Banda', subject: 'Chemistry', date: '3 September at 10:00' },
// //     ]
// // };

// // // --- REUSABLE COMPONENTS ---
// // const TutorCard = ({ tutor }: { tutor: typeof mockTutors[0] }) => (
// //     <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
// //         <div className="p-6">
// //             <div className="flex items-center mb-4">
// //                 <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold flex-shrink-0 mr-4">{tutor.avatar}</div>
// //                 <div>
// //                     <h3 className="text-xl font-bold text-white">{tutor.name}</h3>
// //                     <div className="flex items-center text-sm text-yellow-400 mt-1"><Star className="h-4 w-4 fill-current mr-1" /><span>{tutor.rating.toFixed(1)} ({tutor.reviews} reviews)</span></div>
// //                 </div>
// //             </div>
// //             <p className="text-slate-400 text-sm mb-4 h-20 overflow-hidden">{tutor.bio}</p>
// //             <div className="flex flex-wrap gap-2 mb-6">{tutor.subjects.map(subject => (<span key={subject} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">{subject}</span>))}</div>
// //             <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-lg transition flex items-center justify-center"><MessageSquare className="h-4 w-4 mr-2" />Contact {tutor.name}</button>
// //         </div>
// //     </div>
// // );

// // const StatCard = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string | number, label: string }) => (
// //     <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
// //         <Icon className="h-6 w-6 text-slate-400 mb-2" />
// //         <p className="text-2xl font-bold text-white">{value}</p>
// //         <p className="text-sm text-slate-400">{label}</p>
// //     </div>
// // );

// // // --- MAIN PAGE COMPONENT ---
// // export default function FindTutorPage() {
// //     const { user } = useAppContext();

// //     // UPDATED Security Guard: Now allows both students and teachers
// //     useEffect(() => {
// //         const timer = setTimeout(() => {
// //             if (!user) {
// //                 window.location.replace('/');
// //             }
// //         }, 100);
// //         return () => clearTimeout(timer);
// //     }, [user]);

// //     if (!user) {
// //         return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white"><p>Loading...</p></div>;
// //     }

// //     // This is the role-based switch:
// //     return (
// //         <>
// //             <Header />
// //             {user.role === 'teacher' ? <TeacherTutorDashboard /> : <StudentTutorFinder />}
// //         </>
// //     );
// // }

// // // --- STUDENT VIEW ---
// // const StudentTutorFinder = () => (
// //     <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
// //         <div className="max-w-7xl mx-auto">
// //             <div className="text-center mb-12">
// //                 <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Find Your Perfect Tutor</h1>
// //                 <p className="text-lg text-slate-400 max-w-2xl mx-auto">Search for qualified tutors and connect for online lessons.</p>
// //                 <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
// //                     <div className="relative flex-grow">
// //                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
// //                         <input type="text" placeholder="Search by subject (e.g., 'Mathematics')" className="w-full bg-slate-800 border border-slate-700 rounded-md pl-12 pr-4 py-3" />
// //                     </div>
// //                     <button className="flex-shrink-0 bg-slate-700 hover:bg-slate-600 font-semibold py-3 px-5 rounded-md flex items-center justify-center"><SlidersHorizontal className="h-5 w-5 mr-2" />Filters</button>
// //                 </div>
// //             </div>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
// //                 {mockTutors.map(tutor => <TutorCard key={tutor.id} tutor={tutor} />)}
// //             </div>
// //         </div>
// //     </main>
// // );

// // // --- TEACHER VIEW ---
// // const TeacherTutorDashboard = () => {
// //     const [isAvailable, setIsAvailable] = useState(true);
// //     return (
// //         <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
// //             <div className="max-w-7xl mx-auto">
// //                 <div className="flex justify-between items-center mb-8">
// //                     <h1 className="text-3xl font-bold">My Tutoring Dashboard</h1>
// //                     <div className="flex items-center gap-4">
// //                         <span className={`font-semibold ${isAvailable ? 'text-green-400' : 'text-slate-400'}`}>
// //                             {isAvailable ? 'Available for new students' : 'Not currently available'}
// //                         </span>
// //                         <button onClick={() => setIsAvailable(!isAvailable)}>
// //                             <ToggleRight className={`h-10 w-10 transition-colors ${isAvailable ? 'text-green-500' : 'text-slate-600 rotate-180'}`} />
// //                         </button>
// //                     </div>
// //                 </div>

// //                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
// //                     {/* Main Content */}
// //                     <div className="lg:col-span-2 space-y-8">
// //                         <div>
// //                             <h2 className="text-2xl font-bold mb-4">My Tutor Profile (Public View)</h2>
// //                             <TutorCard tutor={teacherData.profile} />
// //                         </div>
// //                         <div>
// //                             <h2 className="text-2xl font-bold mb-4">Upcoming Sessions</h2>
// //                             <div className="space-y-3">
// //                                 {teacherData.upcomingSessions.map(session => (
// //                                     <div key={session.id} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
// //                                         <div>
// //                                             <p className="font-semibold">{session.studentName} - {session.subject}</p>
// //                                             <p className="text-sm text-slate-400">{session.date}</p>
// //                                         </div>
// //                                         <Link href="#" className="text-sm font-semibold text-blue-400 hover:underline">Session Details</Link>
// //                                     </div>
// //                                 ))}
// //                             </div>
// //                         </div>
// //                     </div>

// //                     {/* Sidebar */}
// //                     <div className="space-y-6">
// //                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
// //                             <h3 className="text-xl font-bold mb-4">My Stats</h3>
// //                             <div className="space-y-4">
// //                                 <StatCard icon={Users} value={teacherData.stats.students} label="Active Students" />
// //                                 <StatCard icon={DollarSign} value={`K${teacherData.stats.earningsThisMonth.toLocaleString()}`} label="Earnings this Month" />
// //                                 <StatCard icon={Star} value={teacherData.stats.rating.toFixed(1)} label="Average Rating" />
// //                             </div>
// //                         </div>
// //                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-3">
// //                             <h3 className="text-xl font-bold">Quick Actions</h3>
// //                             <button className="w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold"><Edit className="h-5 w-5" />Edit My Tutor Profile</button>
// //                             <button className="w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold"><Calendar className="h-5 w-5" />Set My Availability</button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </main>
// //     );
// // };

// // 