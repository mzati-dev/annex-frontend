// app/settings/about/page.tsx
import Header from '@/components/common/Header';
import { BookOpen, PenSquare } from 'lucide-react';

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-5xl font-extrabold mb-2">About Annex</h1>
                        <p className="text-xl text-slate-400">Your Knowledge Marketplace</p>
                    </div>

                    <div className="space-y-10 text-slate-300 text-lg">

                        <div>
                            <h2 className="text-3xl font-bold text-white mb-3">Our Mission</h2>
                            <p>
                                Our mission is to create a vibrant digital marketplace that connects students with the knowledge they need to excel and empowers educators to turn their expertise into impact. We are dedicated to making high-quality educational resources accessible to everyone in Malawi, from secondary school to university and beyond.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-white mb-3">What is Annex?</h2>
                            <p className="mb-6">
                                Annex is a knowledge marketplace designed for both students and educators. It's a platform where learning materials are shared, knowledge is exchanged, and educational goals are achieved.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* For Students Card */}
                                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                                    <div className="flex items-center mb-3">
                                        <BookOpen className="h-7 w-7 text-blue-400 mr-3" />
                                        <h3 className="text-2xl font-bold text-white">For Students</h3>
                                    </div>
                                    <p className="text-slate-400">Unlock your potential by purchasing detailed lessons from expert teachers or find the perfect online tutor for personalized, one-on-one help.</p>
                                </div>
                                {/* For Teachers Card */}
                                <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                                    <div className="flex items-center mb-3">
                                        <PenSquare className="h-7 w-7 text-blue-400 mr-3" />
                                        <h3 className="text-2xl font-bold text-white">For Teachers & Tutors</h3>
                                    </div>
                                    <p className="text-slate-400">Monetize your expertise by creating and selling your lessons to a broad audience of students, or offer your services as an online tutor.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-white mb-3">Who We Are</h2>
                            <p>
                                We are a passionate team of developers, educators, and designers based right here in Zomba, dedicated to building a seamless and trustworthy platform for educational exchange that empowers our community.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-white mb-3">Application Information</h2>
                            <ul className="list-none !p-0 mt-4 bg-slate-800/50 rounded-lg border border-slate-700 divide-y divide-slate-700">
                                <li className="flex justify-between p-4">
                                    <span className="font-semibold">Version</span>
                                    <span>1.0.0</span>
                                </li>
                                <li className="flex justify-between p-4">
                                    <span className="font-semibold">Last Updated</span>
                                    <span>September 7, 2025</span>
                                </li>
                                <li className="flex justify-between p-4">
                                    <span className="font-semibold">Contact</span>
                                    <a href="mailto:support@annexapp.com" className="text-blue-400 hover:underline">support@annexapp.com</a>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </main>
        </>
    );
}

// // pages/about.tsx
// import Header from '@/components/common/Header';

// export default function AboutPage() {
//     return (
//         <>
//             <Header />
//             <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//                 <div className="max-w-4xl mx-auto">
//                     <h1 className="text-4xl font-bold mb-8 border-b-2 border-slate-700 pb-4">
//                         About Annex
//                     </h1>
//                     <div className="space-y-6 text-slate-300">
//                         <div>
//                             <h2 className="text-2xl font-bold text-white mb-2">Our Mission</h2>
//                             <p>
//                                 Our mission is to make high-quality education accessible to everyone in Malawi and beyond. We believe that learning should be engaging, collaborative, and tailored to individual needs.
//                             </p>
//                         </div>
//                         <div>
//                             <h2 className="text-2xl font-bold text-white mb-2">Who We Are</h2>
//                             <p>
//                                 We are a passionate team of developers, educators, and designers based right here in Lilongwe, dedicated to building tools that empower both teachers and students.
//                             </p>
//                         </div>
//                         <div>
//                             <h2 className="text-2xl font-bold text-white mb-2">Application Information</h2>
//                             <ul className="list-none !p-0 mt-4 bg-slate-800/50 rounded-lg border border-slate-700 divide-y divide-slate-700">
//                                 <li className="flex justify-between p-4">
//                                     <span className="font-semibold">Version</span>
//                                     <span>1.0.0</span>
//                                 </li>
//                                 <li className="flex justify-between p-4">
//                                     <span className="font-semibold">Last Updated</span>
//                                     <span>September 7, 2025</span>
//                                 </li>
//                                 <li className="flex justify-between p-4">
//                                     <span className="font-semibold">Contact</span>
//                                     <a href="mailto:support@yourapp.com" className="text-blue-400 hover:underline">support@yourapp.com</a>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </>
//     );
// }