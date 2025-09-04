'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
// import Header from '../components/common/Header';
// CHANGE 1: Imported a new icon for the upload tool
import { FileText, Book, Youtube, PenSquare, FilePlus2, Download, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/common/Header';

// --- MOCK DATA ---
const mockData = {
    books: [
        { id: 'b1', title: 'Complete Guide to MSCE Biology', author: 'Dr. A. Banda' },
        { id: 'b2', title: 'Fundamentals of Algebra', author: 'Prof. L. Tembo' },
    ],
    pastPapers: [
        { id: 'p1', title: '2024 MSCE Mathematics Paper 1', subject: 'Mathematics' },
        { id: 'p2', title: '2023 MSCE Physical Science Paper 2', subject: 'Physics' },
    ],
    tutorials: [
        { id: 'tu1', title: 'How to Solve Stoichiometry Problems', subject: 'Chemistry' },
        { id: 'tu2', title: 'Analyzing Shakespearean Sonnets', subject: 'English' },
    ],
    // CHANGE 2: Added mock data for the new Syllabi category
    syllabi: [
        { id: 's1', title: 'Senior Secondary Biology Syllabus', subject: 'Biology' },
        { id: 's2', title: 'Senior Secondary Physics Syllabus', subject: 'Physics' },
    ],
};

// CHANGE 3: Added 'syllabi' to our list of resource categories
type ResourceCategory = 'all' | 'books' | 'pastPapers' | 'tutorials' | 'syllabi';

// --- REUSABLE COMPONENTS (No changes needed here) ---

const ResourceCard = ({ icon: Icon, title, subtitle }: { icon: React.ElementType, title: string, subtitle: string }) => (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center gap-4 transform hover:-translate-y-1 transition-transform duration-300">
        <Icon className="h-8 w-8 text-blue-400 flex-shrink-0" />
        <div className="flex-grow">
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
            <Download className="h-5 w-5" />
        </button>
    </div>
);

const TeacherToolCard = ({ icon: Icon, title, description, href, ctaText = "Create New", className = "bg-green-600 hover:bg-green-700" }: { icon: React.ElementType, title: string, description: string, href: string, ctaText?: string, className?: string }) => (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col">
        <div className="flex items-center mb-3">
            <Icon className="h-7 w-7 text-green-400 mr-3" />
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-slate-400 flex-grow mb-4">{description}</p>
        <Link href={href} className={`mt-auto text-center text-white font-bold py-2 px-4 rounded-lg transition-colors ${className}`}>
            {ctaText}
        </Link>
    </div>
);


// --- MAIN PAGE COMPONENT ---

export default function ResourcesPage() {
    const { user } = useAppContext();
    const [activeTab, setActiveTab] = useState<ResourceCategory>('all');

    // Security Guard
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) { window.location.replace('/'); }
        }, 100);
        return () => clearTimeout(timer);
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <p>Loading resources...</p>
            </div>
        );
    }

    const resourcesToShow = () => {
        switch (activeTab) {
            case 'books': return mockData.books.map(item => <ResourceCard key={item.id} icon={Book} title={item.title} subtitle={item.author} />);
            case 'pastPapers': return mockData.pastPapers.map(item => <ResourceCard key={item.id} icon={FileText} title={item.title} subtitle={item.subject} />);
            case 'tutorials': return mockData.tutorials.map(item => <ResourceCard key={item.id} icon={Youtube} title={item.title} subtitle={item.subject} />);
            // CHANGE 4: Added the display logic for the Syllabi tab
            case 'syllabi': return mockData.syllabi.map(item => <ResourceCard key={item.id} icon={Book} title={item.title} subtitle={item.subject} />);
            default: return [
                ...mockData.books.map(item => <ResourceCard key={item.id} icon={Book} title={item.title} subtitle={item.author} />),
                ...mockData.pastPapers.map(item => <ResourceCard key={item.id} icon={FileText} title={item.title} subtitle={item.subject} />),
                ...mockData.tutorials.map(item => <ResourceCard key={item.id} icon={Youtube} title={item.title} subtitle={item.subject} />),
                // CHANGE 5: Added Syllabi to the 'All Resources' view
                ...mockData.syllabi.map(item => <ResourceCard key={item.id} icon={Book} title={item.title} subtitle={item.subject} />),
            ];
        }
    };

    const TabButton = ({ tab, label }: { tab: ResourceCategory, label: string }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
        >
            {label}
        </button>
    );

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">Online Libra</h1>
                    <p className="text-slate-400 mb-10">Your central library for all educational materials and teaching tools.</p>

                    {/* Teacher-Only Tools Section */}
                    {user.role === 'teacher' && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-4 border-l-4 border-green-500 pl-3">Teacher Toolkit</h2>
                            {/* CHANGE 6: Changed grid to 3 columns to accommodate the new tool */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <TeacherToolCard
                                    icon={PenSquare}
                                    title="Lesson Plan Creator"
                                    description="Use our template to build and manage your lesson plans."
                                    href="/resources/create-lesson-plan"
                                />
                                <TeacherToolCard
                                    icon={FilePlus2}
                                    title="Scheme of Work Generator"
                                    description="Design your termly schemes of work with our intuitive tool."
                                    href="/resources/create-scheme-of-work"
                                />
                                {/* CHANGE 7: Added the new "Upload Resource" tool for teachers */}
                                <TeacherToolCard
                                    icon={UploadCloud}
                                    title="Upload Resource"
                                    description="Share your own books, papers, or tutorials with the community."
                                    href="/resources/upload"
                                    ctaText="Upload Now"
                                    className="bg-purple-600 hover:bg-purple-700"
                                />
                            </div>
                        </div>
                    )}

                    {/* Shared Resources Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 border-l-4 border-blue-500 pl-3">Shared Library</h2>

                        {/* Tab Navigation */}
                        <div className="flex flex-wrap gap-2 border-b border-slate-700 mb-6 pb-2">
                            <TabButton tab="all" label="All Resources" />
                            <TabButton tab="books" label="Books" />
                            <TabButton tab="pastPapers" label="Past Papers" />
                            <TabButton tab="tutorials" label="Tutorials" />
                            {/* CHANGE 8: Added the new Syllabi tab button */}
                            <TabButton tab="syllabi" label="Syllabi" />
                        </div>

                        {/* Resource Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {resourcesToShow()}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// // import Header from '../components/common/Header';
// import { FileText, Book, Youtube, PenSquare, FilePlus2, Download } from 'lucide-react';
// import Link from 'next/link';
// import Header from '@/components/common/Header';

// // --- MOCK DATA (In a real app, this comes from an API) ---
// const mockData = {
//     books: [
//         { id: 'b1', title: 'Complete Guide to MSCE Biology', author: 'Dr. A. Banda' },
//         { id: 'b2', title: 'Fundamentals of Algebra', author: 'Prof. L. Tembo' },
//     ],
//     pastPapers: [
//         { id: 'p1', title: '2024 MSCE Mathematics Paper 1', subject: 'Mathematics' },
//         { id: 'p2', title: '2023 MSCE Physical Science Paper 2', subject: 'Physics' },
//     ],
//     tutorials: [
//         { id: 'tu1', title: 'How to Solve Stoichiometry Problems', subject: 'Chemistry' },
//         { id: 'tu2', title: 'Analyzing Shakespearean Sonnets', subject: 'English' },
//     ],
// };

// type ResourceCategory = 'all' | 'books' | 'pastPapers' | 'tutorials' | 'Syllabi';

// // --- REUSABLE COMPONENTS ---

// // Card for a single resource item (Book, Paper, etc.)
// const ResourceCard = ({ icon: Icon, title, subtitle }: { icon: React.ElementType, title: string, subtitle: string }) => (
//     <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center gap-4 transform hover:-translate-y-1 transition-transform duration-300">
//         <Icon className="h-8 w-8 text-blue-400 flex-shrink-0" />
//         <div className="flex-grow">
//             <h4 className="font-semibold text-white">{title}</h4>
//             <p className="text-sm text-slate-400">{subtitle}</p>
//         </div>
//         <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full">
//             <Download className="h-5 w-5" />
//         </button>
//     </div>
// );

// // Special card for teacher-specific creation tools
// const TeacherToolCard = ({ icon: Icon, title, description, href }: { icon: React.ElementType, title: string, description: string, href: string }) => (
//     <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col">
//         <div className="flex items-center mb-3">
//             <Icon className="h-7 w-7 text-green-400 mr-3" />
//             <h3 className="text-xl font-bold text-white">{title}</h3>
//         </div>
//         <p className="text-slate-400 flex-grow mb-4">{description}</p>
//         <Link href={href} className="mt-auto text-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
//             Create New
//         </Link>
//     </div>
// );


// // --- MAIN PAGE COMPONENT ---

// export default function ResourcesPage() {
//     const { user } = useAppContext();
//     const [activeTab, setActiveTab] = useState<ResourceCategory>('all');

//     // Security Guard
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             if (!user) { window.location.replace('/'); }
//         }, 100);
//         return () => clearTimeout(timer);
//     }, [user]);

//     if (!user) {
//         return (
//             <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
//                 <p>Loading resources...</p>
//             </div>
//         );
//     }

//     const resourcesToShow = () => {
//         switch (activeTab) {
//             case 'books': return mockData.books.map(item => <ResourceCard key={item.id} icon={Book} title={item.title} subtitle={item.author} />);
//             case 'pastPapers': return mockData.pastPapers.map(item => <ResourceCard key={item.id} icon={FileText} title={item.title} subtitle={item.subject} />);
//             case 'tutorials': return mockData.tutorials.map(item => <ResourceCard key={item.id} icon={Youtube} title={item.title} subtitle={item.subject} />);
//             default: return [
//                 ...mockData.books.map(item => <ResourceCard key={item.id} icon={Book} title={item.title} subtitle={item.author} />),
//                 ...mockData.pastPapers.map(item => <ResourceCard key={item.id} icon={FileText} title={item.title} subtitle={item.subject} />),
//                 ...mockData.tutorials.map(item => <ResourceCard key={item.id} icon={Youtube} title={item.title} subtitle={item.subject} />),
//             ];
//         }
//     };

//     const TabButton = ({ tab, label }: { tab: ResourceCategory, label: string }) => (
//         <button
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 rounded-md font-semibold transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
//         >
//             {label}
//         </button>
//     );

//     return (
//         <>
//             <Header />
//             <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//                 <div className="max-w-7xl mx-auto">
//                     <h1 className="text-4xl font-bold mb-2">Resources Hub</h1>
//                     <p className="text-slate-400 mb-10">Your central library for all educational materials and teaching tools.</p>

//                     {/* Teacher-Only Tools Section */}
//                     {user.role === 'teacher' && (
//                         <div className="mb-12">
//                             <h2 className="text-2xl font-bold mb-4 border-l-4 border-green-500 pl-3">Teacher Toolkit</h2>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <TeacherToolCard
//                                     icon={PenSquare}
//                                     title="Lesson Plan Creator"
//                                     description="Use our template to build, save, and manage your lesson plans directly on the platform."
//                                     href="/resources/create-lesson-plan"
//                                 />
//                                 <TeacherToolCard
//                                     icon={FilePlus2}
//                                     title="Scheme of Work Generator"
//                                     description="Design your termly schemes of work with our intuitive tool, aligning with curriculum standards."
//                                     href="/resources/create-scheme-of-work"
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     {/* Shared Resources Section */}
//                     <div>
//                         <h2 className="text-2xl font-bold mb-4 border-l-4 border-blue-500 pl-3">Shared Library</h2>

//                         {/* Tab Navigation */}
//                         <div className="flex space-x-2 border-b border-slate-700 mb-6">
//                             <TabButton tab="all" label="All Resources" />
//                             <TabButton tab="books" label="Books" />
//                             <TabButton tab="pastPapers" label="Past Papers" />
//                             <TabButton tab="tutorials" label="Tutorials" />
//                         </div>

//                         {/* Resource Grid */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {resourcesToShow()}
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
// // import { FileText, Download, Book, Youtube } from 'lucide-react';
// // import Header from '@/components/common/Header';

// // // Mock data for resources. In a real app, this would come from an API.
// // const mockResources = {
// //     pastPapers: [
// //         { title: '2023 MSCE Biology Paper 1', subject: 'Biology', year: 2023, url: '#' },
// //         { title: '2023 MSCE Mathematics Paper 2', subject: 'Mathematics', year: 2023, url: '#' },
// //         { title: '2022 MSCE English Paper 1', subject: 'English', year: 2022, url: '#' },
// //     ],
// //     syllabi: [
// //         { title: 'Senior Secondary Biology Syllabus', subject: 'Biology', url: '#' },
// //         { title: 'Senior Secondary Physics Syllabus', subject: 'Physics', url: '#' },
// //     ],
// //     videoTutorials: [
// //         { title: 'Solving Quadratic Equations', subject: 'Mathematics', platform: 'YouTube', url: '#' },
// //         { title: 'The Process of Photosynthesis', subject: 'Biology', platform: 'YouTube', url: '#' },
// //     ],
// // };

// // // Reusable component for displaying a single resource item
// // const ResourceItem = ({ icon: Icon, title, subtitle, url }: { icon: React.ElementType, title: string, subtitle: string, url: string }) => (
// //     <a
// //         href={url}
// //         target="_blank"
// //         rel="noopener noreferrer"
// //         className="flex items-center p-4 bg-slate-800 hover:bg-slate-700/50 transition-colors rounded-lg border border-slate-700"
// //     >
// //         <Icon className="h-6 w-6 text-blue-400 flex-shrink-0 mr-4" />
// //         <div className="flex-grow">
// //             <h4 className="font-semibold text-white">{title}</h4>
// //             <p className="text-sm text-slate-400">{subtitle}</p>
// //         </div>
// //         <Download className="h-5 w-5 text-slate-500" />
// //     </a>
// // );

// // // Reusable component for a category of resources
// // const ResourceCategory = ({ title, children }: { title: string, children: React.ReactNode }) => (
// //     <div>
// //         <h2 className="text-2xl font-bold mb-4">{title}</h2>
// //         <div className="space-y-3">
// //             {children}
// //         </div>
// //     </div>
// // );

// // export default function ResourcesPage() {
// //     const { user } = useAppContext();

// //     // Security Guard: Redirects if user is not logged in.
// //     useEffect(() => {
// //         const timer = setTimeout(() => {
// //             if (!user) {
// //                 window.location.replace('/');
// //             }
// //         }, 100);
// //         return () => clearTimeout(timer);
// //     }, [user]);

// //     if (!user) {
// //         return (
// //             <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
// //                 <p>Loading resources...</p>
// //             </div>
// //         );
// //     }

// //     return (
// //         <>
// //             <Header />
// //             <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
// //                 <div className="max-w-4xl mx-auto">
// //                     <h1 className="text-4xl font-bold mb-2">Educational Resources</h1>
// //                     <p className="text-slate-400 mb-10">Access syllabi, past papers, and other essential learning materials.</p>

// //                     <div className="space-y-12">
// //                         {/* Past Papers Section */}
// //                         <ResourceCategory title="Past Examination Papers">
// //                             {mockResources.pastPapers.map(paper => (
// //                                 <ResourceItem key={paper.title} icon={FileText} title={paper.title} subtitle={`${paper.subject} - ${paper.year}`} url={paper.url} />
// //                             ))}
// //                         </ResourceCategory>

// //                         {/* Syllabi Section */}
// //                         <ResourceCategory title="Curriculum Syllabi">
// //                             {mockResources.syllabi.map(syllabus => (
// //                                 <ResourceItem key={syllabus.title} icon={Book} title={syllabus.title} subtitle={syllabus.subject} url={syllabus.url} />
// //                             ))}
// //                         </ResourceCategory>

// //                         {/* Video Tutorials Section */}
// //                         <ResourceCategory title="Video Tutorials">
// //                             {mockResources.videoTutorials.map(video => (
// //                                 <ResourceItem key={video.title} icon={Youtube} title={video.title} subtitle={`${video.subject} on ${video.platform}`} url={video.url} />
// //                             ))}
// //                         </ResourceCategory>
// //                     </div>
// //                 </div>
// //             </main>
// //         </>
// //     );
// // }
