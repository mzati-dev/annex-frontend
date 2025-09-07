// // app/find-online-tutor/page.tsx (Student Dashboard)
// 'use client';

// import { Star, MessageSquare, DollarSign } from 'lucide-react';
// import { useAppContext } from '@/context/AppContext';
// import { API_BASE_URL } from '@/services/api/api.constants';
// import { useState } from 'react';
// import ContactModal from './ContactModal';





// const TutorCard = ({ tutor }: { tutor: any }) => {
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const fullAvatarUrl = tutor.avatar ? `${API_BASE_URL}${tutor.avatar}` : null;

//     // 👇 1. Get the surname from the full name
//     const nameParts = tutor.name?.split(' ') || [];
//     const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : tutor.name;

//     return (
//         <>
//             <div className="bg-slate-800 border border-slate-700  flex rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
//                 <div className="p-6 flex flex-col h-full">
//                     <div className="flex items-center mb-4">
//                         {fullAvatarUrl ? (
//                             <img
//                                 src={fullAvatarUrl}
//                                 alt={tutor.name}
//                                 className="h-16 w-16 rounded-full object-cover flex-shrink-0 mr-4"
//                             />
//                         ) : (
//                             <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold flex-shrink-0 mr-4">
//                                 {tutor.name?.split(' ').pop()?.[0] || '?'}
//                             </div>
//                         )}

//                         <div>
//                             {/* 👇 2. Display the title and surname */}
//                             <h3 className="text-xl font-bold text-white">{`${tutor.title} ${surname}`}</h3>
//                             <div className="flex items-center text-sm text-yellow-400 mt-1">
//                                 <Star className="h-4 w-4 fill-current mr-1" />
//                                 <span>{tutor.rating.toFixed(1)} ({tutor.reviews} reviews)</span>
//                             </div>
//                         </div>
//                     </div>
//                     {/* Replace h-20 overflow-hidden with a class like line-clamp-3. */}
//                     <p className="text-slate-400 text-sm mb-4 line-clamp-3">{tutor.bio}</p>
//                     <div className='mt-auto'>
//                         <div className="flex flex-wrap gap-2 mb-6">
//                             {tutor.subjects.map((subject: string) => (
//                                 <span key={subject} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">{subject}</span>
//                             ))}
//                         </div>

//                         {/* 👇 THIS IS THE BLOCK YOU NEED TO ADD 👇 */}
//                         {tutor.monthlyRate ? (
//                             <div className="border-t border-slate-700 pt-4 my-4">
//                                 <div className="flex justify-center items-center gap-2 text-slate-300">
//                                     {/* <DollarSign className="h-5 w-5 text-green-400" /> */}
//                                     <span className="text-sm font-bold text-white">
//                                         <span className="h-5 w-5 text-green-400">MWK </span>{tutor.monthlyRate.toLocaleString()}
//                                     </span>
//                                     <span className="text-slate-400">monthly / subject</span>
//                                 </div>
//                             </div>
//                         ) : null}

//                         {/* 👇 3. (Optional) Update the button text */}
//                         <button
//                             onClick={() => setIsModalOpen(true)}
//                             className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer  rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
//                             <MessageSquare className="h-4 w-4 mr-2" />
//                             Contact {`${tutor.title} ${surname}`}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             {/* 👇 4. Conditionally render the modal */}
//             {isModalOpen && (
//                 <ContactModal
//                     tutor={tutor}
//                     onClose={() => setIsModalOpen(false)}
//                 />
//             )}
//         </>
//     );
// };

// app/find-online-tutor/page.tsx
'use client';

import { Star, MessageSquare, DollarSign } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { API_BASE_URL } from '@/services/api/api.constants';
import ChatScreen from '../../../components/communication/ChatScreen';


const TutorCard = ({ tutor }: { tutor: any }) => {
    const { openChatWithTutor } = useAppContext();

    const fullAvatarUrl = tutor.avatar ? `${API_BASE_URL}${tutor.avatar}` : null;
    const nameParts = tutor.name?.split(' ') || [];
    const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : tutor.name;

    const handleContactTutor = () => {
        console.log('Attempting to open chat for Tutor ID:', tutor.id);
        openChatWithTutor(tutor.id);
    };

    return (
        <>
            <div className="bg-slate-800 border border-slate-700 flex rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                        {fullAvatarUrl ? (
                            <img
                                src={fullAvatarUrl}
                                alt={tutor.name}
                                className="h-16 w-16 rounded-full object-cover flex-shrink-0 mr-4"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold flex-shrink-0 mr-4">
                                {tutor.name?.split(' ').pop()?.[0] || '?'}
                            </div>
                        )}

                        <div>
                            <h3 className="text-xl font-bold text-white">{`${tutor.title} ${surname}`}</h3>
                            <div className="flex items-center text-sm text-yellow-400 mt-1">
                                <Star className="h-4 w-4 fill-current mr-1" />
                                <span>{tutor.rating?.toFixed(1) || '0.0'} ({tutor.reviews || 0} reviews)</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">{tutor.bio}</p>

                    <div className='mt-auto'>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {tutor.subjects?.map((subject: string) => (
                                <span key={subject} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">
                                    {subject}
                                </span>
                            ))}
                        </div>

                        {tutor.monthlyRate && (
                            <div className="border-t border-slate-700 pt-4 my-4">
                                <div className="flex justify-center items-center gap-2 text-slate-300">
                                    <span className="text-sm font-bold text-white">
                                        <span className="h-5 w-5 text-green-400">MWK </span>
                                        {tutor.monthlyRate.toLocaleString()}
                                    </span>
                                    <span className="text-slate-400">monthly / subject</span>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleContactTutor}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-lg font-semibold shadow-lg transition flex items-center justify-center"
                        >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact {`${tutor.title} ${surname}`}
                        </button>
                    </div>
                </div>
            </div>


        </>
    );
};



export default function StudentTutorFinder() {
    const { searchTerm, isChatOpen, tutors, activeChatId, closeChat } = useAppContext(); // NEW CODE: Get tutors from context
    console.log('Context Active Chat ID:', activeChatId);
    const selectedTutor = tutors.find(tutor => tutor.id === activeChatId);
    console.log('Found Tutor Object:', selectedTutor);
    // NEW CODE: Use tutors from context instead of local state
    const filteredTutors = tutors.filter(tutor =>
        searchTerm === '' ||
        tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.subjects.some((subject: string) =>
            subject.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
            {isChatOpen && selectedTutor && (
                // <ChatScreen tutor={selectedTutor} onClose={closeChat} />
                // AFTER
                <ChatScreen onClose={closeChat} />
            )}
            <div className="max-w-7xl mx-auto">

                {/* --- SECTION 1: The header text --- */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Find Your Perfect Tutor</h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">Search for qualified tutors by subject and connect with them for online lessons.</p>
                </div>

                {/* --- SECTION 2: The grid of tutors --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredTutors.length > 0 ? (
                        filteredTutors.map(tutor => (
                            <TutorCard key={tutor.id} tutor={tutor} />
                        ))
                    ) : (
                        <p className="text-slate-400 col-span-full text-center">No tutors found for "{searchTerm}".</p>
                    )}
                </div>

                {/* --- SECTION 3: The "How It Works" section --- */}
                <div className="text-center mt-20 py-12 bg-slate-800/50 rounded-lg">
                    <h2 className="text-3xl font-bold mb-8">How It Works</h2>
                    <div className="flex flex-col md:flex-row justify-center gap-8 px-4">
                        <div className="flex-1 max-w-xs mx-auto">
                            <div className="text-3xl font-bold text-blue-400 mb-2">1.</div>
                            <h3 className="text-xl font-semibold mb-2">Search & Find</h3>
                            <p className="text-slate-400">Use the search bar to find tutors who specialize in the subject you need help with.</p>
                        </div>
                        <div className="flex-1 max-w-xs mx-auto">
                            <div className="text-3xl font-bold text-blue-400 mb-2">2.</div>
                            <h3 className="text-xl font-semibold mb-2">Contact & Schedule</h3>
                            <p className="text-slate-400">Use the contact button to message a tutor and arrange a time that works for both of you.</p>
                        </div>
                        <div className="flex-1 max-w-xs mx-auto">
                            <div className="text-3xl font-bold text-blue-400 mb-2">3.</div>
                            <h3 className="text-xl font-semibold mb-2">Start Learning</h3>
                            <p className="text-slate-400">Meet your tutor for your scheduled online session and start improving your skills.</p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}


// 'use client';

// import { Star, MessageSquare } from 'lucide-react';
// // import { mockTutors } from '../data';
// import { useAppContext } from '@/context/AppContext';
// import { mockTutors } from '../data/tutors';

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

// export default function StudentTutorFinder() {
//     const { searchTerm } = useAppContext();

//     const filteredTutors = mockTutors.filter(tutor =>
//         searchTerm === '' ||
//         tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         tutor.subjects.some(subject =>
//             subject.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//     );

//     return (
//         <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//             <div className="max-w-7xl mx-auto">

//                 {/* --- SECTION 1: The header text --- */}
//                 <div className="text-center mb-12">
//                     <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Find Your Perfect Tutor</h1>
//                     <p className="text-lg text-slate-400 max-w-2xl mx-auto">Search for qualified tutors by subject and connect with them for online lessons.</p>
//                 </div>

//                 {/* --- SECTION 2: The grid of tutors (This now goes here) --- */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                     {filteredTutors.length > 0 ? (
//                         filteredTutors.map(tutor => (
//                             <TutorCard key={tutor.id} tutor={tutor} />
//                         ))
//                     ) : (
//                         <p className="text-slate-400 col-span-full text-center">No tutors found for "{searchTerm}".</p>
//                     )}
//                 </div>

//                 {/* --- SECTION 3: The "How It Works" section (This now goes here) --- */}
//                 <div className="text-center mt-20 py-12 bg-slate-800/50 rounded-lg">
//                     <h2 className="text-3xl font-bold mb-8">How It Works</h2>
//                     <div className="flex flex-col md:flex-row justify-center gap-8 px-4">
//                         <div className="flex-1 max-w-xs mx-auto">
//                             <div className="text-3xl font-bold text-blue-400 mb-2">1.</div>
//                             <h3 className="text-xl font-semibold mb-2">Search & Find</h3>
//                             <p className="text-slate-400">Use the search bar to find tutors who specialize in the subject you need help with.</p>
//                         </div>
//                         <div className="flex-1 max-w-xs mx-auto">
//                             <div className="text-3xl font-bold text-blue-400 mb-2">2.</div>
//                             <h3 className="text-xl font-semibold mb-2">Contact & Schedule</h3>
//                             <p className="text-slate-400">Use the contact button to message a tutor and arrange a time that works for both of you.</p>
//                         </div>
//                         <div className="flex-1 max-w-xs mx-auto">
//                             <div className="text-3xl font-bold text-blue-400 mb-2">3.</div>
//                             <h3 className="text-xl font-semibold mb-2">Start Learning</h3>
//                             <p className="text-slate-400">Meet your tutor for your scheduled online session and start improving your skills.</p>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </main>
//     );
// }

// 'use client';

// import { Star, MessageSquare, Search, SlidersHorizontal } from 'lucide-react';
// import { mockTutors } from '../data'; // <-- Import from the new data file
// import { useAppContext } from '@/context/AppContext';
// // import { useAppContext } from '../../context/AppContext';

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

// // This is your original component, now cleanly in its own file
// export default function StudentTutorFinder() {
//     // --- MODIFICATION START ---
//     // ADDED: Get the global search term from the context
//     const { searchTerm } = useAppContext();

//     // ADDED: This logic filters tutors in real-time based on the search term
//     const filteredTutors = mockTutors.filter(tutor =>
//         searchTerm === '' ||
//         tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         tutor.subjects.some(subject =>
//             subject.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//     );
//     // --- MODIFICATION END ---
//     return (
//         <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//             <div className="max-w-7xl mx-auto">
//                 <div className="text-center mb-12">
//                     <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Find Your Perfect Tutor</h1>
//                     <p className="text-lg text-slate-400 max-w-2xl mx-auto">Search for qualified tutors by subject and connect with them for online lessons.</p>
//                     {/* <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
//                         <div className="relative flex-grow">
//                             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
//                             <input
//                                 type="text"
//                                 placeholder="Search by subject (e.g., 'Mathematics')"
//                                 className="w-full bg-slate-800 border border-slate-700 rounded-md pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             />
//                         </div>
//                         <button className="flex-shrink-0 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-5 rounded-md transition flex items-center justify-center">
//                             <SlidersHorizontal className="h-5 w-5 mr-2" />
//                             Filters
//                         </button>
//                     </div> */}

//                     {/* --- MODIFICATION START: The grid now uses the filtered list --- */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                         {filteredTutors.length > 0 ? (
//                             // MODIFIED: This now maps over 'filteredTutors' instead of 'mockTutors'
//                             filteredTutors.map(tutor => (
//                                 <TutorCard key={tutor.id} tutor={tutor} />
//                             ))
//                         ) : (
//                             // ADDED: A message to show when no tutors are found
//                             <p className="text-slate-400 col-span-full text-center">No tutors found for "{searchTerm}".</p>
//                         )}
//                     </div>
//                     {/* --- MODIFICATION END --- */}

//                 </div>
//                 {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                     {mockTutors.map(tutor => (
//                         <TutorCard key={tutor.id} tutor={tutor} />
//                     ))}
//                 </div> */}
//                 {/* ... "How It Works" section ... */}
//                 <div className="text-center mt-20 py-12 bg-slate-800/50 rounded-lg">
//                     <h2 className="text-3xl font-bold mb-8">How It Works</h2>
//                     <div className="flex flex-col md:flex-row justify-center gap-8 px-4">
//                         <div className="flex-1 max-w-xs mx-auto">
//                             <div className="text-3xl font-bold text-blue-400 mb-2">1.</div>
//                             <h3 className="text-xl font-semibold mb-2">Search & Find</h3>
//                             <p className="text-slate-400">Use the search bar to find tutors who specialize in the subject you need help with.</p>
//                         </div>
//                         <div className="flex-1 max-w-xs mx-auto">
//                             <div className="text-3xl font-bold text-blue-400 mb-2">2.</div>
//                             <h3 className="text-xl font-semibold mb-2">Contact & Schedule</h3>
//                             <p className="text-slate-400">Use the contact button to message a tutor and arrange a time that works for both of you.</p>
//                         </div>
//                         <div className="flex-1 max-w-xs mx-auto">
//                             <div className="text-3xl font-bold text-blue-400 mb-2">3.</div>
//                             <h3 className="text-xl font-semibold mb-2">Start Learning</h3>
//                             <p className="text-slate-400">Meet your tutor for your scheduled online session and start improving your skills.</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// }