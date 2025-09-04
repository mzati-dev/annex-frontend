'use client';

import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
// import Header from '../components/common/Header';
import { BookCopy, BarChart, Users, ChevronRight, CheckSquare, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/common/Header';

// Reusable component for feature cards, with role-specific colors
const FeatureCard = ({ icon: Icon, title, description, color }: { icon: React.ElementType, title: string, description: string, color: string }) => (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 h-full">
        <Icon className={`h-8 w-8 ${color} mb-3`} />
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </div>
);

export default function EduspaceLMSPage() {
    const { user } = useAppContext();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) { window.location.replace('/'); }
        }, 100);
        return () => clearTimeout(timer);
    }, [user]);

    if (!user) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white"><p>Loading...</p></div>;
    }

    // Features now change based on the user's role
    const features = user.role === 'teacher' ? [
        { icon: BookCopy, title: 'Dynamic Course Creation', description: 'Generate class codes, upload lessons, and schedule your classes with ease.' },
        { icon: CheckSquare, title: 'Intelligent Assessment Tools', description: 'Create, distribute, and grade written, discussion, and journal assignments.' },
        { icon: BarChart, title: 'Student Performance Analytics', description: 'Visualize student progress, manage your classes, and provide targeted feedback.' }
    ] : [
        { icon: Users, title: 'Collaborative Study Groups', description: 'Join public study forums or create private groups with classmates to learn together.' },
        { icon: MessageSquare, title: 'Direct Teacher Communication', description: 'Submit assignments directly, ask questions, and receive personalized feedback.' },
        { icon: BarChart, title: 'Track Your Performance', description: 'Monitor your grades, review feedback, and see your progress across all joined classes.' }
    ];

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="text-center border-b border-slate-800 pb-16">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Welcome to Eduspace LMS</h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
                            A powerful, integrated Learning Management System designed for modern education in Malawi.
                        </p>
                        <Link
                            href="/lms-dashboard"
                            className="mt-8 inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-lg transition"
                        >
                            Explore Your LMS Dashboard
                            <ChevronRight className="h-5 w-5 ml-2" />
                        </Link>
                    </div>
                    <div className="py-16">
                        <h2 className="text-3xl font-bold text-center mb-10">
                            Key Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map(feature => (
                                <FeatureCard key={feature.title} {...feature} color={user.role === 'teacher' ? 'text-green-400' : 'text-blue-400'} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}


// 'use client';

// import { useEffect } from 'react';
// import { useAppContext } from '../../context/AppContext';
// // import Header from '../components/common/Header'; // Corrected the import path
// import { BookCopy, BarChart, Users, Video, ChevronRight } from 'lucide-react';
// import Header from '@/components/common/Header';

// // Mock data for display purposes
// const mockCourses = [
//     { title: "MSCE Biology Revision", students: 120, modules: 15 },
//     { title: "Advanced Mathematics - Form 4", students: 85, modules: 22 },
//     { title: "Introduction to Physical Geography", students: 150, modules: 18 },
// ];

// // Reusable component for feature cards
// const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
//     <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
//         <Icon className="h-8 w-8 text-blue-400 mb-3" />
//         <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
//         <p className="text-slate-400">{description}</p>
//     </div>
// );

// export default function EduspaceLMSPage() {
//     // CHANGE 1: Get the 'user' object from the context.
//     const { user } = useAppContext();

//     // CHANGE 2: The security guard now correctly checks for the 'user' object.
//     useEffect(() => {
//         // A small delay gives the context a moment to load the user state.
//         const timer = setTimeout(() => {
//             if (!user) {
//                 window.location.replace('/');
//             }
//         }, 100);
//         return () => clearTimeout(timer);
//     }, [user]); // The check now runs whenever the 'user' object changes.

//     // CHANGE 3: The loading state now correctly checks for the 'user' object.
//     if (!user) {
//         return (
//             <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
//                 <p>Loading...</p>
//             </div>
//         );
//     }

//     return (
//         <>
//             <Header />
//             <main className="min-h-screen bg-slate-900 text-white">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

//                     {/* Hero Section */}
//                     <div className="text-center border-b border-slate-800 pb-16">
//                         <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Welcome to Eduspace LMS</h1>
//                         <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
//                             A powerful, integrated Learning Management System designed for modern education in Malawi. Manage courses, track student progress, and deliver engaging content seamlessly.
//                         </p>
//                         <a
//                             href="YOUR_LMS_URL" // Important: Update this with the actual URL
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="mt-8 inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-lg transition"
//                         >
//                             Explore the LMS Dashboard
//                             <ChevronRight className="h-5 w-5 ml-2" />
//                         </a>
//                     </div>

//                     {/* Features Grid */}
//                     <div className="py-16">
//                         <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                             <FeatureCard
//                                 icon={BookCopy}
//                                 title="Comprehensive Course Management"
//                                 description="Easily create, organize, and deliver rich course content with videos, documents, and quizzes."
//                             />
//                             <FeatureCard
//                                 icon={BarChart}
//                                 title="Advanced Analytics"
//                                 description="Track student engagement, completion rates, and assessment scores with powerful, easy-to-read reports."
//                             />
//                             <FeatureCard
//                                 icon={Users}
//                                 title="Collaborative Learning Tools"
//                                 description="Foster a community of learning with integrated forums, messaging, and group project capabilities."
//                             />
//                         </div>
//                     </div>

//                     {/* Mock Dashboard Preview */}
//                     <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700">
//                         <h2 className="text-3xl font-bold text-center mb-10">Your Courses at a Glance</h2>
//                         <div className="space-y-4 max-w-2xl mx-auto">
//                             {mockCourses.map((course) => (
//                                 <div key={course.title} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
//                                     <div>
//                                         <h4 className="font-semibold text-white">{course.title}</h4>
//                                         <p className="text-sm text-slate-400">{course.students} Students | {course.modules} Modules</p>
//                                     </div>
//                                     <Video className="h-6 w-6 text-slate-500" />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </>
//     );
// }




// // 'use client';

// // import { useEffect } from 'react';
// // import { useAppContext } from '../../context/AppContext';
// // // import Header from '../components/common/Header';
// // import { BookCopy, BarChart, Users, Video, ChevronRight } from 'lucide-react';
// // import Header from '@/components/common/Header';

// // // Mock data for display purposes
// // const mockCourses = [
// //     { title: "MSCE Biology Revision", students: 120, modules: 15 },
// //     { title: "Advanced Mathematics - Form 4", students: 85, modules: 22 },
// //     { title: "Introduction to Physical Geography", students: 150, modules: 18 },
// // ];

// // // Reusable component for feature cards
// // const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
// //     <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
// //         <Icon className="h-8 w-8 text-blue-400 mb-3" />
// //         <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
// //         <p className="text-slate-400">{description}</p>
// //     </div>
// // );


// // export default function EduspaceLMSPage() {
// //     // const { user, isLoading } = useAppContext();

// //     // Security Guard: Redirects if user is not logged in.
// //     useEffect(() => {
// //         if (!Users) {
// //             window.location.replace('/');
// //         }
// //     }, [Users]);

// //     if (!Users) {
// //         return (
// //             <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
// //                 <p>Loading...</p>
// //             </div>
// //         );
// //     }

// //     return (
// //         <>
// //             <Header />
// //             <main className="min-h-screen bg-slate-900 text-white">
// //                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

// //                     {/* Hero Section */}
// //                     <div className="text-center border-b border-slate-800 pb-16">
// //                         <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Welcome to Eduspace LMS</h1>
// //                         <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
// //                             A powerful, integrated Learning Management System designed for modern education in Malawi. Manage courses, track student progress, and deliver engaging content seamlessly.
// //                         </p>
// //                         <a
// //                             href="YOUR_LMS_URL" // Important: Update this with the actual URL
// //                             target="_blank"
// //                             rel="noopener noreferrer"
// //                             className="mt-8 inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-lg transition"
// //                         >
// //                             Explore the LMS Dashboard
// //                             <ChevronRight className="h-5 w-5 ml-2" />
// //                         </a>
// //                     </div>

// //                     {/* Features Grid */}
// //                     <div className="py-16">
// //                         <h2 className="text-3xl font-bold text-center mb-10">Key Features</h2>
// //                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //                             <FeatureCard
// //                                 icon={BookCopy}
// //                                 title="Comprehensive Course Management"
// //                                 description="Easily create, organize, and deliver rich course content with videos, documents, and quizzes."
// //                             />
// //                             <FeatureCard
// //                                 icon={BarChart}
// //                                 title="Advanced Analytics"
// //                                 description="Track student engagement, completion rates, and assessment scores with powerful, easy-to-read reports."
// //                             />
// //                             <FeatureCard
// //                                 icon={Users}
// //                                 title="Collaborative Learning Tools"
// //                                 description="Foster a community of learning with integrated forums, messaging, and group project capabilities."
// //                             />
// //                         </div>
// //                     </div>

// //                     {/* Mock Dashboard Preview */}
// //                     <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700">
// //                         <h2 className="text-3xl font-bold text-center mb-10">Your Courses at a Glance</h2>
// //                         <div className="space-y-4 max-w-2xl mx-auto">
// //                             {mockCourses.map((course) => (
// //                                 <div key={course.title} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
// //                                     <div>
// //                                         <h4 className="font-semibold text-white">{course.title}</h4>
// //                                         <p className="text-sm text-slate-400">{course.students} Students | {course.modules} Modules</p>
// //                                     </div>
// //                                     <Video className="h-6 w-6 text-slate-500" />
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 </div>
// //             </main>
// //         </>
// //     );
// // }