'use client';

import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
// import Header from '../components/common/Header';
import {
    BookOpen, BarChart, Users, Bell, Calendar, ChevronRight, PlusCircle,
    MessageSquare, CheckSquare, Edit, Upload, Send, Users2, PieChart, MessageCircle,
    Video, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/common/Header';

// --- COMPREHENSIVE MOCK DATA FOR A DYNAMIC LMS ---
const mockLmsData = {
    teacher: {
        id: 't1',
        courses: [
            { id: 'c1', title: 'MSCE Biology Revision', students: 120, code: 'BIO-2025' },
            { id: 'c2', title: 'Advanced Mathematics - Form 4', students: 85, code: 'MTH-ADV4' },
        ],
        // <-- ADDED UPCOMING SESSIONS FOR THE TEACHER
        upcomingSessions: [
            { id: 'sess1', studentName: 'Alice Phiri', subject: 'MSCE Biology Revision', date: '02 Sep at 16:00' },
            { id: 'sess2', studentName: 'Charlie Tembo', subject: 'Advanced Mathematics', date: '04 Sep at 10:00' },
        ],
        students: [{ id: 's1', name: 'Alice Phiri' }, { id: 's2', name: 'Bob Banda' }, { id: 's3', name: 'Charlie Tembo' }],

        assignments: [
            { id: 'as1', title: 'Essay: The Cell Nucleus', course: 'MSCE Biology', graded: 110, total: 120, type: 'Written' },
            { id: 'as2', title: 'Algebra Test 3', course: 'Advanced Mathematics', graded: 50, total: 85, type: 'Written' },
        ],
        performance: { classAverage: 'B+', topPerformer: 'Alice Phiri', recentFeedback: 25 }
    },
    student: {
        id: 's1',
        courses: [
            { id: 'c1', title: 'MSCE Biology Revision', teacher: 'Mr. Phiri', progress: 60 },
            { id: 'c3', title: 'Intro to Physical Geography', teacher: 'Ms. Moyo', progress: 85 },
        ],
        // <-- ADDED UPCOMING SESSIONS FOR THE STUDENT
        upcomingSessions: [
            { id: 'sess1', teacherName: 'Mr. Phiri', subject: 'MSCE Biology Revision', date: '02 Sep at 16:00' },
            { id: 'sess3', teacherName: 'Ms. Moyo', subject: 'Intro to Physical Geography', date: '03 Sep at 11:00' },
        ],
        assignments: [
            { id: 'as1', title: 'Essay: The Cell Nucleus', course: 'MSCE Biology', dueDate: '5 Sep 2025', status: 'Submitted', type: 'Written' },
            { id: 'as3', title: 'Discussion: Climate Impact', course: 'Intro to Geography', dueDate: '8 Sep 2025', status: 'Not Submitted', type: 'Discussion' },
            { id: 'as4', title: 'Journal Entry Week 2', course: 'MSCE Biology', dueDate: '10 Sep 2025', status: 'Not Submitted', type: 'Journal' },
        ],
        feedback: [
            { id: 'f1', from: 'Mr. Phiri', content: 'Excellent work on your essay! Your analysis was very insightful.' },
        ],
        performance: { overallGrade: 'A-', attendance: '95%', rank: '3rd' },
        groups: [{ id: 'g1', name: 'Biology Study Group' }, { id: 'g2', name: 'Geography Masters' }]
    }
};

// --- REUSABLE UI COMPONENTS ---
const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div><h2 className="text-2xl font-bold mb-4">{title}</h2>{children}</div>
);

const CourseCard = ({ course, role }: { course: any, role: 'student' | 'teacher' }) => (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden group">
        <div className="p-5">
            <h3 className="text-lg font-bold text-white truncate">{course.title}</h3>
            <p className="text-sm text-slate-400">{role === 'student' ? `Taught by ${course.teacher}` : `${course.students} students | Code: `}<span className="font-mono bg-slate-700 px-1.5 py-0.5 rounded">{course.code}</span></p>
            {role === 'student' &&
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-300 mb-1"><span>Progress</span><span>{course.progress}%</span></div>
                    <div className="w-full bg-slate-700 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div></div>
                </div>
            }
        </div>
        <Link href={`/lms-dashboard/courses/${course.id}`} className="flex items-center justify-between font-semibold bg-slate-700/50 group-hover:bg-blue-600 px-5 py-3 transition-colors">
            {role === 'student' ? 'Go to Course' : 'Manage Course'} <ChevronRight className="h-5 w-5" />
        </Link>
    </div>
);

const QuickActionButton = ({ icon: Icon, label, href }: { icon: React.ElementType, label: string, href: string }) => (
    <Link href={href} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors">
        <Icon className="h-8 w-8 text-blue-400 mb-2" /><span className="font-semibold text-white">{label}</span>
    </Link>
);

// <-- NEW REUSABLE COMPONENT FOR UPCOMING SESSIONS
const UpcomingSessions = ({ sessions, role }: { sessions: any[], role: 'student' | 'teacher' }) => (
    <Section title="Upcoming Sessions">
        <div className="space-y-3">
            {sessions.length > 0 ? sessions.map(session => (
                <div key={session.id} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-semibold">
                            {role === 'teacher' ? session.studentName : session.teacherName} - {session.subject}
                        </p>
                        <p className="text-sm text-slate-400 flex items-center mt-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            {session.date}
                        </p>
                    </div>
                    <Link href={`/lms-dashboard/sessions/${session.id}`} className="text-sm font-semibold text-blue-400 hover:underline">
                        Session Details
                    </Link>
                </div>
            )) : (
                <p className="text-slate-400">No upcoming sessions scheduled.</p>
            )}
        </div>
    </Section>
);

const AITutorPanel = () => {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [isAsking, setIsAsking] = useState(false);

    const handleAsk = () => {
        if (!question.trim()) return;
        setIsAsking(true);
        setResponse('');
        // This simulates a call to an AI service
        setTimeout(() => {
            setResponse(`Of course! Let's break down the process of photosynthesis. It is the process used by plants, algae, and certain bacteria to harness energy from sunlight and turn it into chemical energy, which they use as food.`);
            setIsAsking(false);
        }, 2000);
    };

    return (
        <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center mb-3">
                <Sparkles className="h-6 w-6 mr-2 text-yellow-300" />
                <h3 className="text-xl font-bold">Annex AI Tutor</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">Stuck on a problem? Ask me anything about your subjects.</p>
            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Explain the process of photosynthesis..."
                className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-sm h-24 mb-2 resize-none"
            />
            <button
                onClick={handleAsk}
                disabled={isAsking}
                className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                {isAsking ? 'Thinking...' : 'Ask AI Tutor'}
            </button>
            {isAsking && <p className="text-sm text-center mt-2 text-slate-400">Generating an answer for you...</p>}
            {response && (
                <div className="mt-4 border-t border-slate-700 pt-3">
                    <p className="text-sm text-slate-300">{response}</p>
                </div>
            )}
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
export default function LmsDashboardPage() {
    const { user } = useAppContext();
    useEffect(() => {
        const timer = setTimeout(() => { if (!user) { window.location.replace('/'); } }, 100);
        return () => clearTimeout(timer);
    }, [user]);

    if (!user) {
        return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white"><p>Loading LMS Dashboard...</p></div>;
    }

    return (<><Header />{user.role === 'teacher' ? <TeacherLMSDashboard /> : <StudentLMSDashboard />}</>);
}


// --- STUDENT DASHBOARD ---
const StudentLMSDashboard = () => {
    const data = mockLmsData.student;
    return (
        <main className="bg-slate-900 text-white p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <Section title="My Courses">
                            <div className="space-y-4">{data.courses.map(c => <CourseCard key={c.id} course={c} role="student" />)}</div>
                            <div className="mt-6 flex gap-2"><input type="text" placeholder="Enter class code or invitation link..." className="flex-grow bg-slate-800 border border-slate-700 rounded-md px-4 py-2" /><button className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg">Join</button></div>
                        </Section>
                        {/* I ADDED IT RIGHT HERE 👇 */}
                        <UpcomingSessions sessions={data.upcomingSessions} role="student" />
                        <Section title="My Assignments">
                            {data.assignments.map(a => (<div key={a.id} className="bg-slate-800 p-4 rounded-lg mb-2 flex justify-between items-center"><div className="flex-grow"><p className="font-semibold">{a.title} <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full ml-2">{a.type}</span></p><p className="text-sm text-slate-400">{a.course} - Due: {a.dueDate}</p></div><button className={`font-semibold py-1 px-3 rounded-md text-sm ${a.status === 'Submitted' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{a.status === 'Submitted' ? 'View' : 'Submit'}</button></div>))}
                        </Section>
                    </div>
                    <div className="space-y-6">
                        <AITutorPanel />

                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                            <h3 className="text-xl font-bold mb-3 flex items-center"><PieChart className="h-5 w-5 mr-2 text-blue-400" />Performance Dashboard</h3>
                            <p>Overall Grade: <span className="font-bold text-lg">{data.performance.overallGrade}</span></p>
                            <p>Attendance: <span className="font-bold">{data.performance.attendance}</span></p>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                            <h3 className="text-xl font-bold mb-3"><MessageCircle className="h-5 w-5 mr-2 inline text-blue-400" />Feedback Dashboard</h3>
                            {data.feedback.map(f => (<div key={f.id} className="text-sm border-l-2 border-slate-600 pl-3 mb-2"><p className="italic">"{f.content}"</p><p className="text-xs text-slate-500">- {f.from}</p></div>))}
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                            <h3 className="text-xl font-bold mb-3"><Users2 className="h-5 w-5 mr-2 inline text-blue-400" />Study Groups & Forums</h3>
                            {data.groups.map(g => <p key={g.id}>{g.name}</p>)}
                            <button className="text-sm font-semibold text-blue-400 hover:underline mt-2">Join a Discussion Forum</button>
                        </div>
                        <button className="w-full bg-slate-700 hover:bg-slate-600 p-3 rounded-lg font-semibold flex items-center justify-center"><MessageSquare className="h-5 w-5 mr-2" />Message a Teacher</button>
                    </div>
                </div>
            </div>
        </main>
    );
};

// --- TEACHER DASHBOARD ---
const TeacherLMSDashboard = () => {
    const data = mockLmsData.teacher;
    return (
        <main className="bg-slate-900 text-white p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <QuickActionButton icon={PlusCircle} label="Create Class" href="#" />
                    <QuickActionButton icon={Edit} label="Create Assignment" href="#" />
                    <QuickActionButton icon={Upload} label="Upload Lessons" href="#" />
                    <QuickActionButton icon={Calendar} label="Schedule Classes" href="#" />
                    <QuickActionButton icon={Video} label="Start Live Session" href="#" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <Section title="Manage Classes">
                            <div className="space-y-4">{data.courses.map(course => <CourseCard key={course.id} course={course} role="teacher" />)}</div>
                        </Section>
                        {/* I ADDED IT RIGHT HERE 👇 */}
                        <UpcomingSessions sessions={data.upcomingSessions} role="teacher" />
                        <Section title="Grade Assignments">
                            {data.assignments.map(a => (<div key={a.id} className="bg-slate-800 p-4 rounded-lg mb-2 flex justify-between items-center"><div><p className="font-semibold">{a.title}</p><p className="text-sm text-slate-400">{a.course}</p></div><Link href="#" className="font-semibold bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg text-sm">Grade ({a.graded}/{a.total})</Link></div>))}
                        </Section>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                            <h3 className="text-xl font-bold mb-3">Performance Dashboard</h3>
                            <p>Class Average: <span className="font-bold text-lg">{data.performance.classAverage}</span></p>
                            <p>Top Student: <span className="font-bold">{data.performance.topPerformer}</span></p>
                            <p>Feedback Sent: <span className="font-bold">{data.performance.recentFeedback}</span></p>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                            <h3 className="text-xl font-bold mb-3">My Students</h3>
                            <div className="max-h-24 overflow-y-auto">{data.students.map(s => <p key={s.id}>{s.name}</p>)}</div>
                            <Link href="#" className="text-sm font-semibold text-blue-400 hover:underline mt-2 block">Manage All Students</Link>
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                            <h3 className="text-xl font-bold mb-3">Send Message / Feedback</h3>
                            <textarea placeholder="Send feedback to a student or a message to a group..." className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-sm h-20 mb-2"></textarea>
                            <button className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg w-full">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

// 'use client';

// import React, { useEffect } from 'react';
// import { useAppContext } from '../../context/AppContext';
// // import Header from '../components/common/Header';
// import {
//     BookOpen, BarChart, Users, Bell, Calendar, ChevronRight, PlusCircle,
//     MessageSquare, CheckSquare, Edit, Upload, Send, Users2, PieChart, MessageCircle,
//     Video
// } from 'lucide-react';
// import Link from 'next/link';
// import Header from '@/components/common/Header';

// // --- COMPREHENSIVE MOCK DATA FOR A DYNAMIC LMS ---
// const mockLmsData = {
//     teacher: {
//         courses: [
//             { id: 'c1', title: 'MSCE Biology Revision', students: 120, code: 'BIO-2025' },
//             { id: 'c2', title: 'Advanced Mathematics - Form 4', students: 85, code: 'MTH-ADV4' },
//         ],
//         students: [{ id: 's1', name: 'Alice Phiri' }, { id: 's2', name: 'Bob Banda' }, { id: 's3', name: 'Charlie Tembo' }],
//         assignments: [
//             { id: 'as1', title: 'Essay: The Cell Nucleus', course: 'MSCE Biology', graded: 110, total: 120, type: 'Written' },
//             { id: 'as2', title: 'Algebra Test 3', course: 'Advanced Mathematics', graded: 50, total: 85, type: 'Written' },
//         ],
//         performance: { classAverage: 'B+', topPerformer: 'Alice Phiri', recentFeedback: 25 }
//     },
//     student: {
//         courses: [
//             { id: 'c1', title: 'MSCE Biology Revision', teacher: 'Mr. Phiri', progress: 60 },
//             { id: 'c3', title: 'Intro to Physical Geography', teacher: 'Ms. Moyo', progress: 85 },
//         ],
//         assignments: [
//             { id: 'as1', title: 'Essay: The Cell Nucleus', course: 'MSCE Biology', dueDate: '5 Sep 2025', status: 'Submitted', type: 'Written' },
//             { id: 'as3', title: 'Discussion: Climate Impact', course: 'Intro to Geography', dueDate: '8 Sep 2025', status: 'Not Submitted', type: 'Discussion' },
//             { id: 'as4', title: 'Journal Entry Week 2', course: 'MSCE Biology', dueDate: '10 Sep 2025', status: 'Not Submitted', type: 'Journal' },
//         ],
//         feedback: [
//             { id: 'f1', from: 'Mr. Phiri', content: 'Excellent work on your essay! Your analysis was very insightful.' },
//         ],
//         performance: { overallGrade: 'A-', attendance: '95%', rank: '3rd' },
//         groups: [{ id: 'g1', name: 'Biology Study Group' }, { id: 'g2', name: 'Geography Masters' }]
//     }
// };

// // --- REUSABLE UI COMPONENTS ---
// const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
//     <div><h2 className="text-2xl font-bold mb-4">{title}</h2>{children}</div>
// );

// const CourseCard = ({ course, role }: { course: any, role: 'student' | 'teacher' }) => (
//     <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden group">
//         <div className="p-5">
//             <h3 className="text-lg font-bold text-white truncate">{course.title}</h3>
//             <p className="text-sm text-slate-400">{role === 'student' ? `Taught by ${course.teacher}` : `${course.students} students | Code: `}<span className="font-mono bg-slate-700 px-1.5 py-0.5 rounded">{course.code}</span></p>
//             {role === 'student' &&
//                 <div className="mt-4">
//                     <div className="flex justify-between text-xs text-slate-300 mb-1"><span>Progress</span><span>{course.progress}%</span></div>
//                     <div className="w-full bg-slate-700 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div></div>
//                 </div>
//             }
//         </div>
//         <Link href={`/lms-dashboard/courses/${course.id}`} className="flex items-center justify-between font-semibold bg-slate-700/50 group-hover:bg-blue-600 px-5 py-3 transition-colors">
//             {role === 'student' ? 'Go to Course' : 'Manage Course'} <ChevronRight className="h-5 w-5" />
//         </Link>
//     </div>
// );

// const QuickActionButton = ({ icon: Icon, label, href }: { icon: React.ElementType, label: string, href: string }) => (
//     <Link href={href} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors">
//         <Icon className="h-8 w-8 text-blue-400 mb-2" /><span className="font-semibold text-white">{label}</span>
//     </Link>
// );

// // --- MAIN PAGE COMPONENT ---
// export default function LmsDashboardPage() {
//     const { user } = useAppContext();
//     useEffect(() => {
//         const timer = setTimeout(() => { if (!user) { window.location.replace('/'); } }, 100);
//         return () => clearTimeout(timer);
//     }, [user]);

//     if (!user) {
//         return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white"><p>Loading LMS Dashboard...</p></div>;
//     }

//     return (<><Header />{user.role === 'teacher' ? <TeacherLMSDashboard /> : <StudentLMSDashboard />}</>);
// }

// // --- STUDENT DASHBOARD ---
// const StudentLMSDashboard = () => {
//     const data = mockLmsData.student;
//     return (
//         <main className="bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//             <div className="max-w-7xl mx-auto">
//                 {/* <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1> */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//                     <div className="lg:col-span-2 space-y-8">
//                         <Section title="My Courses">
//                             <div className="space-y-4">{data.courses.map(c => <CourseCard key={c.id} course={c} role="student" />)}</div>
//                             <div className="mt-6 flex gap-2"><input type="text" placeholder="Enter class code or invitation link..." className="flex-grow bg-slate-800 border border-slate-700 rounded-md px-4 py-2" /><button className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg">Join</button></div>
//                         </Section>
//                         <Section title="My Assignments">
//                             {data.assignments.map(a => (<div key={a.id} className="bg-slate-800 p-4 rounded-lg mb-2 flex justify-between items-center"><div className="flex-grow"><p className="font-semibold">{a.title} <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full ml-2">{a.type}</span></p><p className="text-sm text-slate-400">{a.course} - Due: {a.dueDate}</p></div><button className={`font-semibold py-1 px-3 rounded-md text-sm ${a.status === 'Submitted' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{a.status === 'Submitted' ? 'View' : 'Submit'}</button></div>))}
//                         </Section>
//                     </div>
//                     <div className="space-y-6">
//                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
//                             <h3 className="text-xl font-bold mb-3 flex items-center"><PieChart className="h-5 w-5 mr-2 text-blue-400" />Performance Dashboard</h3>
//                             <p>Overall Grade: <span className="font-bold text-lg">{data.performance.overallGrade}</span></p>
//                             <p>Attendance: <span className="font-bold">{data.performance.attendance}</span></p>
//                         </div>
//                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
//                             <h3 className="text-xl font-bold mb-3"><MessageCircle className="h-5 w-5 mr-2 inline text-blue-400" />Feedback Dashboard</h3>
//                             {data.feedback.map(f => (<div key={f.id} className="text-sm border-l-2 border-slate-600 pl-3 mb-2"><p className="italic">"{f.content}"</p><p className="text-xs text-slate-500">- {f.from}</p></div>))}
//                         </div>
//                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
//                             <h3 className="text-xl font-bold mb-3"><Users2 className="h-5 w-5 mr-2 inline text-blue-400" />Study Groups & Forums</h3>
//                             {data.groups.map(g => <p key={g.id}>{g.name}</p>)}
//                             <button className="text-sm font-semibold text-blue-400 hover:underline mt-2">Join a Discussion Forum</button>
//                         </div>
//                         <button className="w-full bg-slate-700 hover:bg-slate-600 p-3 rounded-lg font-semibold flex items-center justify-center"><MessageSquare className="h-5 w-5 mr-2" />Message a Teacher</button>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// };

// // --- TEACHER DASHBOARD ---
// const TeacherLMSDashboard = () => {
//     const data = mockLmsData.teacher;
//     return (
//         <main className="bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//             <div className="max-w-7xl mx-auto">
//                 {/* <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1> */}
//                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
//                     <QuickActionButton icon={PlusCircle} label="Create Class" href="#" />
//                     <QuickActionButton icon={Edit} label="Create Assignment" href="#" />
//                     <QuickActionButton icon={Upload} label="Upload Lessons" href="#" />
//                     <QuickActionButton icon={Calendar} label="Schedule Classes" href="#" />
//                     <QuickActionButton icon={Video} label="Start Live Session" href="#" />
//                 </div>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//                     <div className="lg:col-span-2 space-y-8">
//                         <Section title="Manage Classes">
//                             <div className="space-y-4">{data.courses.map(course => <CourseCard key={course.id} course={course} role="teacher" />)}</div>
//                         </Section>
//                         <Section title="Grade Assignments">
//                             {data.assignments.map(a => (<div key={a.id} className="bg-slate-800 p-4 rounded-lg mb-2 flex justify-between items-center"><div><p className="font-semibold">{a.title}</p><p className="text-sm text-slate-400">{a.course}</p></div><Link href="#" className="font-semibold bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg text-sm">Grade ({a.graded}/{a.total})</Link></div>))}
//                         </Section>
//                     </div>
//                     <div className="space-y-6">
//                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
//                             <h3 className="text-xl font-bold mb-3">Performance Dashboard</h3>
//                             <p>Class Average: <span className="font-bold text-lg">{data.performance.classAverage}</span></p>
//                             <p>Top Student: <span className="font-bold">{data.performance.topPerformer}</span></p>
//                             <p>Feedback Sent: <span className="font-bold">{data.performance.recentFeedback}</span></p>
//                         </div>
//                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
//                             <h3 className="text-xl font-bold mb-3">My Students</h3>
//                             <div className="max-h-24 overflow-y-auto">{data.students.map(s => <p key={s.id}>{s.name}</p>)}</div>
//                             <Link href="#" className="text-sm font-semibold text-blue-400 hover:underline mt-2 block">Manage All Students</Link>
//                         </div>
//                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
//                             <h3 className="text-xl font-bold mb-3">Send Message / Feedback</h3>
//                             <textarea placeholder="Send feedback to a student or a message to a group..." className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-sm h-20 mb-2"></textarea>
//                             <button className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg w-full">Send</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// };

// 'use client';

// import React, { useEffect } from 'react';
// import { useAppContext } from '../../context/AppContext';
// // import Header from '../components/common/Header';
// import {
//     BookOpen, BarChart, Users, Bell, Calendar, ChevronRight, PlayCircle, PlusCircle,
//     MessageSquare, CheckSquare, Edit, Trash2, Link as LinkIcon, Upload, Send, Users2
// } from 'lucide-react';
// import Link from 'next/link';
// import Header from '@/components/common/Header';

// // --- COMPREHENSIVE MOCK DATA FOR A DYNAMIC LMS ---
// const mockLmsData = {
//     teacher: {
//         id: 't1',
//         courses: [
//             { id: 'c1', title: 'MSCE Biology Revision', students: 120, code: 'BIO-2025' },
//             { id: 'c2', title: 'Advanced Mathematics - Form 4', students: 85, code: 'MTH-ADV4' },
//         ],
//         students: [{ id: 's1', name: 'Alice Phiri' }, { id: 's2', name: 'Bob Banda' }, { id: 's3', name: 'Charlie Tembo' }],
//         assignments: [
//             { id: 'as1', title: 'Essay: The Cell Nucleus', course: 'MSCE Biology', graded: 110, total: 120 },
//             { id: 'as2', title: 'Algebra Test 3', course: 'Advanced Mathematics', graded: 50, total: 85 },
//         ],
//         announcements: [{ id: 'a1', content: 'Term 3 examination timetable has been released.', date: '30 August 2025' }]
//     },
//     student: {
//         id: 's1',
//         courses: [
//             { id: 'c1', title: 'MSCE Biology Revision', teacher: 'Mr. Phiri', progress: 60, nextLesson: 'Module 8: The Human Eye' },
//             { id: 'c3', title: 'Intro to Physical Geography', teacher: 'Ms. Moyo', progress: 85, nextLesson: 'Module 12: Climate Change' },
//         ],
//         assignments: [
//             { id: 'as1', title: 'Essay: The Cell Nucleus', course: 'MSCE Biology', dueDate: '5 September 2025', status: 'Submitted', type: 'Written' },
//             { id: 'as3', title: 'Discussion: Climate Impact', course: 'Intro to Physical Geography', dueDate: '8 September 2025', status: 'Not Submitted', type: 'Discussion' },
//             { id: 'as4', title: 'Journal Entry Week 2', course: 'MSCE Biology', dueDate: '10 September 2025', status: 'Not Submitted', type: 'Journal' },
//         ],
//         grades: [{ course: 'MSCE Biology Revision', grade: 'A' }, { course: 'History', grade: 'B+' }],
//         groups: [{ id: 'g1', name: 'Biology Study Group' }, { id: 'g2', name: 'Geography Masters' }]
//     }
// };

// // --- REUSABLE UI COMPONENTS ---
// const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
//     <div>
//         <h2 className="text-2xl font-bold mb-4">{title}</h2>
//         {children}
//     </div>
// );

// const CourseCard = ({ course, role }: { course: any, role: 'student' | 'teacher' }) => (
//     <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden group">
//         <div className="p-5">
//             <h3 className="text-lg font-bold text-white truncate">{course.title}</h3>
//             {role === 'student' ? (
//                 <p className="text-sm text-slate-400">Taught by {course.teacher}</p>
//             ) : (
//                 <p className="text-sm text-slate-400">{course.students} students | Code: <span className="font-mono bg-slate-700 px-1.5 py-0.5 rounded">{course.code}</span></p>
//             )}
//             {role === 'student' &&
//                 <div className="mt-4">
//                     <div className="flex justify-between text-xs text-slate-300 mb-1"><span>Progress</span><span>{course.progress}%</span></div>
//                     <div className="w-full bg-slate-700 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div></div>
//                 </div>
//             }
//         </div>
//         <Link href={`/lms-dashboard/courses/${course.id}`} className="flex items-center justify-between font-semibold bg-slate-700/50 group-hover:bg-blue-600 px-5 py-3 transition-colors">
//             {role === 'student' ? 'Go to Course' : 'Manage Course'}
//             <ChevronRight className="h-5 w-5" />
//         </Link>
//     </div>
// );

// const QuickActionButton = ({ icon: Icon, label, href }: { icon: React.ElementType, label: string, href: string }) => (
//     <Link href={href} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors">
//         <Icon className="h-8 w-8 text-blue-400 mb-2" />
//         <span className="font-semibold text-white">{label}</span>
//     </Link>
// );

// // --- MAIN PAGE COMPONENT ---
// export default function EduspaceLMSPage() {
//     const { user } = useAppContext();
//     useEffect(() => {
//         const timer = setTimeout(() => { if (!user) { window.location.replace('/'); } }, 100);
//         return () => clearTimeout(timer);
//     }, [user]);

//     if (!user) {
//         return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white"><p>Loading LMS Dashboard...</p></div>;
//     }

//     return (
//         <>
//             <Header />
//             {user.role === 'teacher' ? <TeacherLMSDashboard /> : <StudentLMSDashboard />}
//         </>
//     );
// }

// // --- STUDENT DASHBOARD ---
// const StudentLMSDashboard = () => {
//     const { user } = useAppContext();
//     const data = mockLmsData.student;
//     return (
//         <main className="bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//             <div className="max-w-7xl mx-auto">
//                 <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//                     <div className="lg:col-span-2 space-y-8">
//                         <Section title="My Courses">
//                             <div className="space-y-4">
//                                 {data.courses.map(course => <CourseCard key={course.id} course={course} role="student" />)}
//                             </div>
//                             <div className="mt-6 flex gap-2">
//                                 <input type="text" placeholder="Enter class code or invitation link..." className="flex-grow bg-slate-800 border border-slate-700 rounded-md px-4 py-2" />
//                                 <button className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg">Join</button>
//                             </div>
//                         </Section>
//                         <Section title="My Assignments">
//                             {data.assignments.map(a => (
//                                 <div key={a.id} className="bg-slate-800 p-4 rounded-lg mb-2 flex justify-between items-center">
//                                     <div>
//                                         <p className="font-semibold">{a.title} <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full">{a.type}</span></p>
//                                         <p className="text-sm text-slate-400">{a.course} - Due: {a.dueDate}</p>
//                                     </div>
//                                     <button className={`font-semibold py-1 px-3 rounded-md text-sm ${a.status === 'Submitted' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
//                                         {a.status === 'Submitted' ? 'View' : 'Submit'}
//                                     </button>
//                                 </div>
//                             ))}
//                         </Section>
//                     </div>
//                     <div className="space-y-6">
//                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
//                             <h3 className="text-xl font-bold mb-3">Performance & Feedback</h3>
//                             {data.grades.map(g => <p key={g.course}>{g.course}: <span className="font-bold">{g.grade}</span></p>)}
//                             <Link href="#" className="text-sm font-semibold text-blue-400 hover:underline mt-2 block">View Detailed Feedback</Link>
//                         </div>
//                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
//                             <h3 className="text-xl font-bold mb-3">Communication</h3>
//                             <button className="w-full text-left p-2 rounded hover:bg-slate-700">Message a Teacher</button>
//                             <button className="w-full text-left p-2 rounded hover:bg-slate-700">Discussion Forums</button>
//                         </div>
//                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
//                             <h3 className="text-xl font-bold mb-3">Study Groups</h3>
//                             {data.groups.map(g => <p key={g.id}>{g.name}</p>)}
//                             <button className="text-sm font-semibold text-blue-400 hover:underline mt-2">Find or Create a Group</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// };

// // --- TEACHER DASHBOARD ---
// const TeacherLMSDashboard = () => {
//     const { user } = useAppContext();
//     const data = mockLmsData.teacher;
//     return (
//         <main className="bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//             <div className="max-w-7xl mx-auto">
//                 <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//                     <QuickActionButton icon={PlusCircle} label="New Course" href="#" />
//                     <QuickActionButton icon={Edit} label="New Assignment" href="#" />
//                     <QuickActionButton icon={Upload} label="Upload Lesson" href="#" />
//                     <QuickActionButton icon={Calendar} label="Schedule Class" href="#" />
//                 </div>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//                     <div className="lg:col-span-2 space-y-8">
//                         <Section title="My Courses">
//                             <div className="space-y-4">{data.courses.map(course => <CourseCard key={course.id} course={course} role="teacher" />)}</div>
//                         </Section>
//                         <Section title="Assignment Grading">
//                             {data.assignments.map(a => (
//                                 <div key={a.id} className="bg-slate-800 p-4 rounded-lg mb-2 flex justify-between items-center">
//                                     <div>
//                                         <p className="font-semibold">{a.title}</p>
//                                         <p className="text-sm text-slate-400">{a.course}</p>
//                                     </div>
//                                     <Link href="#" className="font-semibold bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg text-sm">
//                                         Grade ({a.graded}/{a.total})
//                                     </Link>
//                                 </div>
//                             ))}
//                         </Section>
//                     </div>
//                     <div className="space-y-6">
//                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
//                             <h3 className="text-xl font-bold mb-3">My Students</h3>
//                             {data.students.map(s => <p key={s.id}>{s.name}</p>)}
//                             <Link href="#" className="text-sm font-semibold text-blue-400 hover:underline mt-2 block">Manage Students</Link>
//                         </div>
//                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
//                             <h3 className="text-xl font-bold mb-3">Send Message / Feedback</h3>
//                             <textarea placeholder="Type a message to a student or group..." className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-sm h-20 mb-2"></textarea>
//                             <button className="bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg w-full">Send</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// };
