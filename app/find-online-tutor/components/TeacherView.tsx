'use client';

import { useState, useEffect } from 'react';
import { Star, ToggleRight, Edit, Users, DollarSign, Calendar, Save, XCircle } from 'lucide-react';
import React from 'react';
import { useAppContext } from '@/context/AppContext'; // ✅ USE THIS CONTEXT
import { TutorProfile, ProfileFormData } from '../data/tutors';
import { API_BASE_URL } from '@/services/api/api.constants';

// --- HELPER COMPONENTS (ProfileEditor, TeacherProfileCard, StatCard) ---

/**
 * ProfileEditor Component
 */
interface ProfileEditorProps {
    profile: Partial<TutorProfile>;
    onSave: (data: ProfileFormData) => void;
    onCancel: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave, onCancel }) => {
    const [title, setTitle] = useState(profile?.title || 'Mr.');
    const [name, setName] = useState(profile?.name || '');
    const [bio, setBio] = useState(profile?.bio || '');
    const [subjects, setSubjects] = useState(profile?.subjects?.join(', ') || '');
    const [monthlyRate, setMonthlyRate] = useState(profile?.monthlyRate || '');

    useEffect(() => {
        if (profile) {
            setTitle(profile.title || 'Mr.');
            setName(profile.name || '');
            setBio(profile.bio || '');
            setSubjects(profile.subjects?.join(', ') || '');
            setMonthlyRate(profile.monthlyRate || '');
        }
    }, [profile]);

    const handleSave = () => {
        if (!name || !bio || !subjects) {
            alert("Please fill in all fields.");
            return;
        }
        onSave({
            title,
            name,
            bio,
            subjects: subjects.split(',').map(s => s.trim()).filter(Boolean),
            monthlyRate: Number(monthlyRate),
        });
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">
                {profile?.bio ? 'Edit Your Public Profile' : 'Create Your Public Profile'}
            </h3>
            <p className="text-sm text-slate-400 mb-6">
                This information will be visible to students looking for a tutor.
            </p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                    <select
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option>Mr.</option>
                        <option>Mrs.</option>
                        <option>Ms.</option>
                        <option>Dr.</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-1">Description / Bio</label>
                    <textarea
                        id="bio"
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell students about your teaching style, experience, and what makes you a great tutor."
                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="subjects" className="block text-sm font-medium text-slate-300 mb-1">Subjects You Teach</label>
                    <input
                        type="text"
                        id="subjects"
                        value={subjects}
                        onChange={(e) => setSubjects(e.target.value)}
                        placeholder="e.g., Biology, Chemistry, Physics"
                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">Separate subjects with a comma.</p>
                </div>
                <div>
                    <label htmlFor="monthlyRate" className="block text-sm font-medium text-slate-300 mb-1">Your Monthly Rate (in MWK)</label>
                    <input
                        type="number"
                        id="monthlyRate"
                        value={monthlyRate}
                        onChange={(e) => setMonthlyRate(e.target.value)}
                        placeholder="e.g., 50000"
                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
                <button
                    onClick={handleSave}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
                    <Save className="h-4 w-4 mr-2" />
                    {profile?.bio ? 'Save Changes' : 'Create My Profile'}
                </button>
                {profile?.bio && (
                    <button
                        onClick={onCancel}
                        className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
};


/**
 * TeacherProfileCard Component
 */
interface TeacherProfileCardProps {
    tutor: TutorProfile;
    onEditRequest: () => void;
}

const TeacherProfileCard: React.FC<TeacherProfileCardProps> = ({ tutor, onEditRequest }) => {
    const nameParts = tutor.name.split(' ');
    const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : tutor.name;
    const fullAvatarUrl = tutor.avatar ? `${API_BASE_URL}${tutor.avatar}` : null;

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    {/* ✅ FIXED: This logic prevents broken images */}

                    {/* 👇 3. Use the new fullAvatarUrl variable */}
                    {fullAvatarUrl ? (
                        <img
                            src={fullAvatarUrl}
                            alt={tutor.name}
                            className="h-16 w-16 rounded-full object-cover flex-shrink-0 mr-4"
                        />
                    ) : (
                        <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center text-2xl font-bold flex-shrink-0 mr-4">
                            {/* {tutor.name.split(' ').map(n => n[0]).slice(0, 2).join('')} */}
                            {tutor.name.split(' ').pop()?.[0] || '?'}
                        </div>
                    )}
                    <div>
                        <h3 className="text-xl font-bold text-white">{`${tutor.title} ${surname}`}</h3>
                        <div className="flex items-center text-sm text-yellow-400 mt-1">
                            <Star className="h-4 w-4 fill-current mr-1" />
                            <span>{tutor.rating.toFixed(1)} ({tutor.reviews} reviews)</span>
                        </div>
                    </div>
                </div>
                <p className="text-slate-400 text-sm mb-4">{tutor.bio}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                    {tutor.subjects.map((subject: string) => (
                        <span key={subject} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">
                            {subject}
                        </span>
                    ))}
                </div>

                {tutor.monthlyRate ? (
                    <div className="border-t border-slate-700 pt-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            {/* <DollarSign className="h-5 w-5 text-green-400" /> */}
                            <span className="font-semibold text-white">
                                <span className="h-5 w-5 text-green-400">MWK </span>{tutor.monthlyRate.toLocaleString()}
                            </span>
                            <span className="text-slate-400">
                                monthly / subject
                            </span>
                        </div>
                    </div>
                ) : null} {/* If there's no rate, show nothing */}
                <button
                    onClick={onEditRequest}
                    className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 cursor-pointer  rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit My Public Profile
                </button>
            </div>
        </div>
    );
};


/**
 * StatCard Component
 */
interface StatCardProps {
    icon: React.ElementType;
    value: string | number;
    label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label }) => (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <Icon className="h-6 w-6 text-slate-400 mb-2" />
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
    </div>
);


// --- MAIN DASHBOARD COMPONENT ---

export default function TeacherTutorDashboard() {
    const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // ✅ FIXED: Get user and updateTutor from the single AppContext
    const { user, updateTutor } = useAppContext();

    const getProfileStorageKey = (userId: string | number) => `tutorProfileData_${userId}`;

    // useEffect(() => {
    //     if (user) {
    //         const storageKey = getProfileStorageKey(user.id);
    //         const savedProfile = localStorage.getItem(storageKey);

    //         if (savedProfile) {
    //             try {
    //                 const parsedProfile = JSON.parse(savedProfile);
    //                 setTutorProfile(parsedProfile);
    //                 setIsEditing(false);
    //             } catch (error) {
    //                 console.error("Failed to parse saved profile:", error);
    //                 setIsEditing(true);
    //             }
    //         } else {
    //             setIsEditing(true);
    //         }
    //     }
    // }, [user]);

    // ✅ THIS IS THE CORRECTED AND FINAL useEffect HOOK
    useEffect(() => {
        if (user) {
            const storageKey = getProfileStorageKey(user.id);
            const savedProfileJson = localStorage.getItem(storageKey);

            if (savedProfileJson) {
                try {
                    const savedProfile = JSON.parse(savedProfileJson);

                    // This synchronizes the avatar with the main user profile image.
                    // If you upload a new image on the Account page, it will be reflected here.
                    if (user.profileImageUrl && savedProfile.avatar !== user.profileImageUrl) {
                        savedProfile.avatar = user.profileImageUrl;
                        localStorage.setItem(storageKey, JSON.stringify(savedProfile)); // Keep localStorage in sync
                    }

                    setTutorProfile(savedProfile);
                    setIsEditing(false);
                } catch (error) {
                    console.error("Failed to parse saved profile:", error);
                    setIsEditing(true); // Go to edit mode if parsing fails
                }
            } else {
                // If no profile exists in storage, go to edit mode
                setIsEditing(true);
            }
        }
    }, [user]); // The effect re-runs whenever the main 'user' object changes

    const teacherData = {
        stats: { students: 15, earningsThisMonth: 150000, rating: 4.9 },
    };

    const handleProfileSave = (formData: ProfileFormData) => {
        if (!user) return;

        const newProfile: TutorProfile = {
            id: user.id,
            userId: user.id,
            ...formData,
            rating: 4.5,
            reviews: 0,
            isAvailableForNewStudents: true,
            avatar: user.profileImageUrl || ''
        };

        const storageKey = getProfileStorageKey(user.id);
        localStorage.setItem(storageKey, JSON.stringify(newProfile));

        setTutorProfile(newProfile);
        setIsEditing(false);
        updateTutor(newProfile); // This now calls the corrected function in AppContext
    };

    const handleAvailabilityToggle = () => {
        if (!tutorProfile || !user) return;

        const updatedProfile = { ...tutorProfile, isAvailableForNewStudents: !tutorProfile.isAvailableForNewStudents };
        const storageKey = getProfileStorageKey(user.id);
        localStorage.setItem(storageKey, JSON.stringify(updatedProfile));

        setTutorProfile(updatedProfile);
        updateTutor(updatedProfile);
    };

    const clearTemporaryData = () => {
        if (!user) return;
        const storageKey = getProfileStorageKey(user.id);
        localStorage.removeItem(storageKey);
        setTutorProfile(null);
        setIsEditing(true);
    };

    const initialProfileDataForEditor = tutorProfile || {
        name: user?.name || '',
        title: 'Mr.',
        bio: '',
        subjects: [],
        monthlyRate: null
    };


    return (
        <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold mb-4">My Tutoring Profile (Public View)</h2>
                    <div className="flex items-center gap-4 p-2 bg-slate-800 rounded-lg">
                        <span className={`font-semibold ${tutorProfile?.isAvailableForNewStudents ? 'text-green-400' : 'text-slate-400'}`}>
                            {tutorProfile?.isAvailableForNewStudents ? 'Available for new students' : 'Not currently available'}
                        </span>
                        <button
                            onClick={handleAvailabilityToggle}
                            disabled={!tutorProfile}
                            className="cursor-pointer disabled:cursor-not-allowed"
                        >
                            <ToggleRight className={`h-10 w-10 transition-colors ${tutorProfile?.isAvailableForNewStudents ? 'text-green-500' : 'text-slate-600 rotate-180'}`} />
                        </button>
                    </div>
                </div>

                <div className="mb-4 text-right">
                    <button
                        onClick={clearTemporaryData}
                        className="text-xs text-slate-400 hover:text-slate-300 underline"
                    >
                        Reset My Profile Data
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            {isEditing ? (
                                <ProfileEditor
                                    profile={initialProfileDataForEditor}
                                    onSave={handleProfileSave}
                                    onCancel={() => setIsEditing(false)}
                                />
                            ) : tutorProfile ? (
                                <TeacherProfileCard
                                    tutor={tutorProfile}
                                    onEditRequest={() => setIsEditing(true)}
                                />
                            ) : (
                                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center text-slate-400">
                                    {user ? 'Loading Profile...' : 'Authenticating user...'}
                                </div>
                            )}
                        </div>
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-3">
                            <h3 className="text-xl font-bold">Quick Actions</h3>
                            <button className="w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold">
                                <Calendar className="h-5 w-5" />Set My Availability
                            </button>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                            <h3 className="text-xl font-bold mb-4">My Stats</h3>
                            <div className="space-y-4">
                                <StatCard icon={Users} value={teacherData.stats.students} label="Active Students" />
                                <StatCard icon={DollarSign} value={`K${teacherData.stats.earningsThisMonth.toLocaleString()}`} label="Earnings this Month" />
                                <StatCard icon={Star} value={teacherData.stats.rating.toFixed(1)} label="Average Rating" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}


// // app/teacher-dashboard/page.tsx (Teacher Dashboard)
// 'use client';

// import { useState, useEffect } from 'react';
// import { Star, ToggleRight, Edit, Users, DollarSign, Calendar, Save, XCircle } from 'lucide-react';
// import React from 'react';
// // import { mockTutors, ProfileFormData, TutorProfile } from '../find-online-tutor/data/tutors';
// import { useTutorContext } from '@/context/TutorContext'; // NEW CODE: Import TutorContext
// import { mockTutors, ProfileFormData, TutorProfile } from '../data/tutors';

// // NEW CODE: Use the shared storage key
// const PROFILE_STORAGE_KEY = 'tutorProfileData';

// /**
//  * ProfileEditor Component
//  * A form for creating or editing the tutor's public profile.
//  */
// interface ProfileEditorProps {
//     profile: TutorProfile | null;
//     onSave: (data: ProfileFormData) => void;
//     onCancel: () => void;
// }

// const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave, onCancel }) => {
//     const [title, setTitle] = useState(profile?.title || 'Mr.');
//     const [name, setName] = useState(profile?.name || 'John Phiri');
//     const [bio, setBio] = useState(profile?.bio || '');
//     const [subjects, setSubjects] = useState(profile?.subjects?.join(', ') || '');

//     const handleSave = () => {
//         if (!name || !bio || !subjects) {
//             alert("Please fill in all fields.");
//             return;
//         }
//         onSave({
//             title,
//             name,
//             bio,
//             subjects: subjects.split(',').map(s => s.trim()).filter(Boolean),
//         });
//     };

//     return (
//         <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
//             <h3 className="text-xl font-bold text-white mb-4">
//                 {profile ? 'Edit Your Public Profile' : 'Create Your Public Profile'}
//             </h3>
//             <p className="text-sm text-slate-400 mb-6">
//                 This information will be visible to students looking for a tutor.
//             </p>
//             <div className="space-y-4">
//                 <div>
//                     <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Title</label>
//                     <select
//                         id="title"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     >
//                         <option>Mr.</option>
//                         <option>Mrs.</option>
//                         <option>Ms.</option>
//                         <option>Dr.</option>
//                     </select>
//                 </div>
//                 <div>
//                     <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
//                     <input
//                         type="text"
//                         id="name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-1">Description / Bio</label>
//                     <textarea
//                         id="bio"
//                         rows={4}
//                         value={bio}
//                         onChange={(e) => setBio(e.target.value)}
//                         placeholder="Tell students about your teaching style, experience, and what makes you a great tutor."
//                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="subjects" className="block text-sm font-medium text-slate-300 mb-1">Subjects You Teach</label>
//                     <input
//                         type="text"
//                         id="subjects"
//                         value={subjects}
//                         onChange={(e) => setSubjects(e.target.value)}
//                         placeholder="e.g., Biology, Chemistry, Physics"
//                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     />
//                     <p className="text-xs text-slate-500 mt-1">Separate subjects with a comma.</p>
//                 </div>
//             </div>
//             <div className="flex items-center gap-4 mt-6">
//                 <button
//                     onClick={handleSave}
//                     className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
//                     <Save className="h-4 w-4 mr-2" />
//                     {profile ? 'Save Changes' : 'Create My Profile'}
//                 </button>
//                 {profile && (
//                     <button
//                         onClick={onCancel}
//                         className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
//                         <XCircle className="h-4 w-4 mr-2" />
//                         Cancel
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// };

// /**
//  * TeacherProfileCard Component
//  * Displays the tutor's public profile information.
//  */
// interface TeacherProfileCardProps {
//     tutor: TutorProfile;
//     onEditRequest: () => void;
// }

// const TeacherProfileCard: React.FC<TeacherProfileCardProps> = ({ tutor, onEditRequest }) => {
//     const nameParts = tutor.name.split(' ');
//     const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : tutor.name;

//     return (
//         <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
//             <div className="p-6">
//                 <div className="flex items-center mb-4">
//                     <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center text-2xl font-bold flex-shrink-0 mr-4">
//                         {tutor.name.split(' ').pop()?.[0] || '?'}
//                     </div>
//                     <div>
//                         <h3 className="text-xl font-bold text-white">{`${tutor.title} ${surname}`}</h3>
//                         <div className="flex items-center text-sm text-yellow-400 mt-1">
//                             <Star className="h-4 w-4 fill-current mr-1" />
//                             <span>{tutor.rating.toFixed(1)} ({tutor.reviews} reviews)</span>
//                         </div>
//                     </div>
//                 </div>
//                 <p className="text-slate-400 text-sm mb-4">{tutor.bio}</p>
//                 <div className="flex flex-wrap gap-2 mb-6">
//                     {tutor.subjects.map((subject: string) => (
//                         <span key={subject} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">
//                             {subject}
//                         </span>
//                     ))}
//                 </div>
//                 <button
//                     onClick={onEditRequest}
//                     className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit My Public Profile
//                 </button>
//             </div>
//         </div>
//     );
// };

// /**
//  * StatCard Component
//  * A reusable card for displaying statistics.
//  */
// interface StatCardProps {
//     icon: React.ElementType;
//     value: string | number;
//     label: string;
// }

// const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label }) => (
//     <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
//         <Icon className="h-6 w-6 text-slate-400 mb-2" />
//         <p className="text-2xl font-bold text-white">{value}</p>
//         <p className="text-sm text-slate-400">{label}</p>
//     </div>
// );

// /**
//  * TeacherTutorDashboard Component
//  * The main dashboard page for the tutor.
//  */
// export default function TeacherTutorDashboard() {
//     const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
//     const [isEditing, setIsEditing] = useState(false);
//     // NEW CODE: Get updateTutor function from TutorContext
//     const { updateTutor } = useTutorContext();

//     useEffect(() => {
//         // Load profile data from localStorage on component mount
//         const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
//         if (savedProfile) {
//             try {
//                 const parsedProfile = JSON.parse(savedProfile);
//                 setTutorProfile(parsedProfile);
//             } catch (error) {
//                 console.error("Failed to parse saved profile:", error);
//                 // If parsing fails, start with a fresh profile
//                 setIsEditing(true);
//             }
//         } else {
//             // No saved profile, enter creation mode
//             setIsEditing(true);
//         }
//     }, []);

//     const teacherData = {
//         stats: { students: 15, earningsThisMonth: 150000, rating: 4.9 },
//     };

//     const handleProfileSave = (formData: ProfileFormData) => {
//         const newProfile: TutorProfile = {
//             ...mockTutors[0], // Base data like id, rating, etc.
//             ...formData, // Overwrite with new form data
//         };
//         setTutorProfile(newProfile);
//         setIsEditing(false);

//         // NEW CODE: Update tutor in the global context instead of localStorage directly
//         updateTutor(newProfile);
//     };

//     const handleAvailabilityToggle = () => {
//         if (!tutorProfile) return;

//         const updatedProfile = {
//             ...tutorProfile,
//             isAvailableForNewStudents: !tutorProfile.isAvailableForNewStudents,
//         };

//         setTutorProfile(updatedProfile);
//         // NEW CODE: Update tutor in the global context
//         updateTutor(updatedProfile);
//     };

//     // Function to clear temporary data (useful for testing or resetting)
//     const clearTemporaryData = () => {
//         localStorage.removeItem(PROFILE_STORAGE_KEY);
//         setTutorProfile(null);
//         setIsEditing(true);
//     };

//     return (
//         <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//             <div className="max-w-7xl mx-auto">
//                 <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
//                     <h2 className="text-2xl font-bold mb-4">My Tutoring Profile (Public View)</h2>
//                     <div className="flex items-center gap-4 p-2 bg-slate-800 rounded-lg">
//                         <span className={`font-semibold ${tutorProfile?.isAvailableForNewStudents ? 'text-green-400' : 'text-slate-400'}`}>
//                             {tutorProfile?.isAvailableForNewStudents ? 'Available for new students' : 'Not currently available'}
//                         </span>
//                         <button onClick={handleAvailabilityToggle}>
//                             <ToggleRight className={`h-10 w-10 transition-colors ${tutorProfile?.isAvailableForNewStudents ? 'text-green-500' : 'text-slate-600 rotate-180'}`} />
//                         </button>
//                     </div>
//                 </div>

//                 {/* Optional: Add a reset button for testing */}
//                 <div className="mb-4 text-right">
//                     <button
//                         onClick={clearTemporaryData}
//                         className="text-xs text-slate-400 hover:text-slate-300 underline"
//                     >
//                         Clear Temporary Data
//                     </button>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//                     <div className="lg:col-span-2 space-y-8">
//                         <div>
//                             {isEditing ? (
//                                 <ProfileEditor
//                                     profile={tutorProfile}
//                                     onSave={handleProfileSave}
//                                     onCancel={() => setIsEditing(false)}
//                                 />
//                             ) : tutorProfile ? (
//                                 <TeacherProfileCard
//                                     tutor={tutorProfile}
//                                     onEditRequest={() => setIsEditing(true)}
//                                 />
//                             ) : (
//                                 <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center text-slate-400">
//                                     Loading Profile Creator...
//                                 </div>
//                             )}
//                         </div>
//                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-3">
//                             <h3 className="text-xl font-bold">Quick Actions</h3>
//                             <button className="w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold">
//                                 <Calendar className="h-5 w-5" />Set My Availability
//                             </button>
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
//                     </div>
//                 </div>
//             </div>
//         </main>
//     );
// }

// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { Star, ToggleRight, Edit, Users, DollarSign, Calendar, Save, XCircle } from 'lucide-react';
// // import React from 'react';
// // import { mockTutors, ProfileFormData, TutorProfile } from '../data/tutors';

// // // Key for localStorage
// // const PROFILE_STORAGE_KEY = 'tutorProfileData';

// // /**
// //  * ProfileEditor Component
// //  * A form for creating or editing the tutor's public profile.
// //  */
// // interface ProfileEditorProps {
// //     profile: TutorProfile | null;
// //     onSave: (data: ProfileFormData) => void;
// //     onCancel: () => void;
// // }

// // const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave, onCancel }) => {
// //     const [title, setTitle] = useState(profile?.title || 'Mr.');
// //     const [name, setName] = useState(profile?.name || 'John Phiri');
// //     const [bio, setBio] = useState(profile?.bio || '');
// //     const [subjects, setSubjects] = useState(profile?.subjects?.join(', ') || '');

// //     const handleSave = () => {
// //         if (!name || !bio || !subjects) {
// //             alert("Please fill in all fields.");
// //             return;
// //         }
// //         onSave({
// //             title,
// //             name,
// //             bio,
// //             subjects: subjects.split(',').map(s => s.trim()).filter(Boolean),
// //         });
// //     };

// //     return (
// //         <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
// //             <h3 className="text-xl font-bold text-white mb-4">
// //                 {profile ? 'Edit Your Public Profile' : 'Create Your Public Profile'}
// //             </h3>
// //             <p className="text-sm text-slate-400 mb-6">
// //                 This information will be visible to students looking for a tutor.
// //             </p>
// //             <div className="space-y-4">
// //                 <div>
// //                     <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Title</label>
// //                     <select
// //                         id="title"
// //                         value={title}
// //                         onChange={(e) => setTitle(e.target.value)}
// //                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                     >
// //                         <option>Mr.</option>
// //                         <option>Mrs.</option>
// //                         <option>Ms.</option>
// //                         <option>Dr.</option>
// //                     </select>
// //                 </div>
// //                 <div>
// //                     <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
// //                     <input
// //                         type="text"
// //                         id="name"
// //                         value={name}
// //                         onChange={(e) => setName(e.target.value)}
// //                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                     />
// //                 </div>
// //                 <div>
// //                     <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-1">Description / Bio</label>
// //                     <textarea
// //                         id="bio"
// //                         rows={4}
// //                         value={bio}
// //                         onChange={(e) => setBio(e.target.value)}
// //                         placeholder="Tell students about your teaching style, experience, and what makes you a great tutor."
// //                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                     />
// //                 </div>
// //                 <div>
// //                     <label htmlFor="subjects" className="block text-sm font-medium text-slate-300 mb-1">Subjects You Teach</label>
// //                     <input
// //                         type="text"
// //                         id="subjects"
// //                         value={subjects}
// //                         onChange={(e) => setSubjects(e.target.value)}
// //                         placeholder="e.g., Biology, Chemistry, Physics"
// //                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                     />
// //                     <p className="text-xs text-slate-500 mt-1">Separate subjects with a comma.</p>
// //                 </div>
// //             </div>
// //             <div className="flex items-center gap-4 mt-6">
// //                 <button
// //                     onClick={handleSave}
// //                     className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
// //                     <Save className="h-4 w-4 mr-2" />
// //                     {profile ? 'Save Changes' : 'Create My Profile'}
// //                 </button>
// //                 {profile && (
// //                     <button
// //                         onClick={onCancel}
// //                         className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
// //                         <XCircle className="h-4 w-4 mr-2" />
// //                         Cancel
// //                     </button>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // /**
// //  * TeacherProfileCard Component
// //  * Displays the tutor's public profile information.
// //  */
// // interface TeacherProfileCardProps {
// //     tutor: TutorProfile;
// //     onEditRequest: () => void;
// // }

// // const TeacherProfileCard: React.FC<TeacherProfileCardProps> = ({ tutor, onEditRequest }) => {
// //     const nameParts = tutor.name.split(' ');
// //     const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : tutor.name;

// //     return (
// //         <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
// //             <div className="p-6">
// //                 <div className="flex items-center mb-4">
// //                     <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center text-2xl font-bold flex-shrink-0 mr-4">
// //                         {tutor.name.split(' ').pop()?.[0] || '?'}
// //                     </div>
// //                     <div>
// //                         <h3 className="text-xl font-bold text-white">{`${tutor.title} ${surname}`}</h3>
// //                         <div className="flex items-center text-sm text-yellow-400 mt-1">
// //                             <Star className="h-4 w-4 fill-current mr-1" />
// //                             <span>{tutor.rating.toFixed(1)} ({tutor.reviews} reviews)</span>
// //                         </div>
// //                     </div>
// //                 </div>
// //                 <p className="text-slate-400 text-sm mb-4">{tutor.bio}</p>
// //                 <div className="flex flex-wrap gap-2 mb-6">
// //                     {tutor.subjects.map((subject: string) => (
// //                         <span key={subject} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">
// //                             {subject}
// //                         </span>
// //                     ))}
// //                 </div>
// //                 <button
// //                     onClick={onEditRequest}
// //                     className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
// //                     <Edit className="h-4 w-4 mr-2" />
// //                     Edit My Public Profile
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // };

// // /**
// //  * StatCard Component
// //  * A reusable card for displaying statistics.
// //  */
// // interface StatCardProps {
// //     icon: React.ElementType;
// //     value: string | number;
// //     label: string;
// // }

// // const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label }) => (
// //     <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
// //         <Icon className="h-6 w-6 text-slate-400 mb-2" />
// //         <p className="text-2xl font-bold text-white">{value}</p>
// //         <p className="text-sm text-slate-400">{label}</p>
// //     </div>
// // );

// // /**
// //  * TeacherTutorDashboard Component
// //  * The main dashboard page for the tutor.
// //  */
// // export default function TeacherTutorDashboard() {
// //     const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
// //     const [isEditing, setIsEditing] = useState(false);

// //     useEffect(() => {
// //         // Load profile data from localStorage on component mount
// //         const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
// //         if (savedProfile) {
// //             try {
// //                 const parsedProfile = JSON.parse(savedProfile);
// //                 setTutorProfile(parsedProfile);
// //             } catch (error) {
// //                 console.error("Failed to parse saved profile:", error);
// //                 // If parsing fails, start with a fresh profile
// //                 setIsEditing(true);
// //             }
// //         } else {
// //             // No saved profile, enter creation mode
// //             setIsEditing(true);
// //         }
// //     }, []);

// //     const teacherData = {
// //         stats: { students: 15, earningsThisMonth: 150000, rating: 4.9 },
// //     };

// //     const handleProfileSave = (formData: ProfileFormData) => {
// //         const newProfile: TutorProfile = {
// //             ...mockTutors[0], // Base data like id, rating, etc.
// //             ...formData, // Overwrite with new form data
// //         };
// //         setTutorProfile(newProfile);
// //         setIsEditing(false);

// //         // Save to localStorage
// //         localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
// //     };

// //     const handleAvailabilityToggle = () => {
// //         if (!tutorProfile) return;

// //         const updatedProfile = {
// //             ...tutorProfile,
// //             isAvailableForNewStudents: !tutorProfile.isAvailableForNewStudents,
// //         };

// //         setTutorProfile(updatedProfile);
// //         // Save updated profile to localStorage
// //         localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
// //     };

// //     // Function to clear temporary data (useful for testing or resetting)
// //     const clearTemporaryData = () => {
// //         localStorage.removeItem(PROFILE_STORAGE_KEY);
// //         setTutorProfile(null);
// //         setIsEditing(true);
// //     };

// //     return (
// //         <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
// //             <div className="max-w-7xl mx-auto">
// //                 <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
// //                     <h2 className="text-2xl font-bold mb-4">My Tutoring Profile (Public View)</h2>
// //                     <div className="flex items-center gap-4 p-2 bg-slate-800 rounded-lg">
// //                         <span className={`font-semibold ${tutorProfile?.isAvailableForNewStudents ? 'text-green-400' : 'text-slate-400'}`}>
// //                             {tutorProfile?.isAvailableForNewStudents ? 'Available for new students' : 'Not currently available'}
// //                         </span>
// //                         <button onClick={handleAvailabilityToggle}>
// //                             <ToggleRight className={`h-10 w-10 transition-colors ${tutorProfile?.isAvailableForNewStudents ? 'text-green-500' : 'text-slate-600 rotate-180'}`} />
// //                         </button>
// //                     </div>
// //                 </div>

// //                 {/* Optional: Add a reset button for testing */}
// //                 <div className="mb-4 text-right">
// //                     <button
// //                         onClick={clearTemporaryData}
// //                         className="text-xs text-slate-400 hover:text-slate-300 underline"
// //                     >
// //                         Clear Temporary Data
// //                     </button>
// //                 </div>

// //                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
// //                     <div className="lg:col-span-2 space-y-8">
// //                         <div>
// //                             {isEditing ? (
// //                                 <ProfileEditor
// //                                     profile={tutorProfile}
// //                                     onSave={handleProfileSave}
// //                                     onCancel={() => setIsEditing(false)}
// //                                 />
// //                             ) : tutorProfile ? (
// //                                 <TeacherProfileCard
// //                                     tutor={tutorProfile}
// //                                     onEditRequest={() => setIsEditing(true)}
// //                                 />
// //                             ) : (
// //                                 <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center text-slate-400">
// //                                     Loading Profile Creator...
// //                                 </div>
// //                             )}
// //                         </div>
// //                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-3">
// //                             <h3 className="text-xl font-bold">Quick Actions</h3>
// //                             <button className="w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold">
// //                                 <Calendar className="h-5 w-5" />Set My Availability
// //                             </button>
// //                         </div>
// //                     </div>
// //                     <div className="space-y-6">
// //                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
// //                             <h3 className="text-xl font-bold mb-4">My Stats</h3>
// //                             <div className="space-y-4">
// //                                 <StatCard icon={Users} value={teacherData.stats.students} label="Active Students" />
// //                                 <StatCard icon={DollarSign} value={`K${teacherData.stats.earningsThisMonth.toLocaleString()}`} label="Earnings this Month" />
// //                                 <StatCard icon={Star} value={teacherData.stats.rating.toFixed(1)} label="Average Rating" />
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </main>
// //     );
// // }


// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { Star, ToggleRight, Edit, Users, DollarSign, Calendar, Save, XCircle } from 'lucide-react';
// // import React from 'react';
// // import { mockTutors, ProfileFormData, TutorProfile } from '../data/tutors';


// // /**
// //  * ProfileEditor Component
// //  * A form for creating or editing the tutor's public profile.
// //  */
// // interface ProfileEditorProps {
// //     profile: TutorProfile | null;
// //     onSave: (data: ProfileFormData) => void;
// //     onCancel: () => void;
// // }

// // const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave, onCancel }) => {
// //     const [title, setTitle] = useState(profile?.title || 'Mr.');
// //     const [name, setName] = useState(profile?.name || 'John Phiri'); // Pre-fill name from auth if possible
// //     const [bio, setBio] = useState(profile?.bio || '');
// //     const [subjects, setSubjects] = useState(profile?.subjects?.join(', ') || '');


// //     const handleSave = () => {
// //         if (!name || !bio || !subjects) {
// //             // In a real app, use a more robust validation and feedback system
// //             alert("Please fill in all fields.");
// //             return;
// //         }
// //         onSave({
// //             title,
// //             name,
// //             bio,
// //             // Split comma-separated string into an array of trimmed strings that are not empty
// //             subjects: subjects.split(',').map(s => s.trim()).filter(Boolean),
// //         });
// //     };

// //     return (
// //         <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
// //             <h3 className="text-xl font-bold text-white mb-4">
// //                 {profile ? 'Edit Your Public Profile' : 'Create Your Public Profile'}
// //             </h3>
// //             <p className="text-sm text-slate-400 mb-6">
// //                 This information will be visible to students looking for a tutor.
// //             </p>
// //             <div className="space-y-4">
// //                 {/* ADD THIS NEW DIV FOR THE TITLE DROPDOWN */}
// //                 <div>
// //                     <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Title</label>
// //                     <select
// //                         id="title"
// //                         value={title}
// //                         onChange={(e) => setTitle(e.target.value)}
// //                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                     >
// //                         <option>Mr.</option>
// //                         <option>Mrs.</option>
// //                         <option>Ms.</option>
// //                         <option>Dr.</option>
// //                     </select>
// //                 </div>
// //                 <div>
// //                     <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
// //                     <input
// //                         type="text"
// //                         id="name"
// //                         value={name}
// //                         onChange={(e) => setName(e.target.value)}
// //                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                     />
// //                 </div>
// //                 <div>
// //                     <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-1">Description / Bio</label>
// //                     <textarea
// //                         id="bio"
// //                         rows={4} // Correctly passed as a number
// //                         value={bio}
// //                         onChange={(e) => setBio(e.target.value)}
// //                         placeholder="Tell students about your teaching style, experience, and what makes you a great tutor."
// //                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                     />
// //                 </div>
// //                 <div>
// //                     <label htmlFor="subjects" className="block text-sm font-medium text-slate-300 mb-1">Subjects You Teach</label>
// //                     <input
// //                         type="text"
// //                         id="subjects"
// //                         value={subjects}
// //                         onChange={(e) => setSubjects(e.target.value)}
// //                         placeholder="e.g., Biology, Chemistry, Physics"
// //                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                     />
// //                     <p className="text-xs text-slate-500 mt-1">Separate subjects with a comma.</p>
// //                 </div>
// //             </div>
// //             <div className="flex items-center gap-4 mt-6">
// //                 <button
// //                     onClick={handleSave}
// //                     className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
// //                     <Save className="h-4 w-4 mr-2" />
// //                     {profile ? 'Save Changes' : 'Create My Profile'}
// //                 </button>
// //                 {profile && ( // Only show Cancel button if we are editing
// //                     <button
// //                         onClick={onCancel}
// //                         className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
// //                         <XCircle className="h-4 w-4 mr-2" />
// //                         Cancel
// //                     </button>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };


// // /**
// //  * TeacherProfileCard Component
// //  * Displays the tutor's public profile information.
// //  */
// // interface TeacherProfileCardProps {
// //     tutor: TutorProfile;
// //     onEditRequest: () => void;
// // }

// // const TeacherProfileCard: React.FC<TeacherProfileCardProps> = ({ tutor, onEditRequest }) => {
// //     const nameParts = tutor.name.split(' ');
// //     const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : tutor.name;

// //     return (
// //         <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
// //             <div className="p-6">
// //                 <div className="flex items-center mb-4">
// //                     <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center text-2xl font-bold flex-shrink-0 mr-4">
// //                         {/* {tutor.name.split(' ').map((n: string) => n[0]).join('')} */}
// //                         {tutor.name.split(' ').pop()?.[0] || '?'}
// //                     </div>
// //                     <div>
// //                         {/* <h3 className="text-xl font-bold text-white">{tutor.name}</h3> */}
// //                         <h3 className="text-xl font-bold text-white">{`${tutor.title} ${surname}`}</h3>
// //                         <div className="flex items-center text-sm text-yellow-400 mt-1">
// //                             <Star className="h-4 w-4 fill-current mr-1" />
// //                             <span>{tutor.rating.toFixed(1)} ({tutor.reviews} reviews)</span>
// //                         </div>
// //                     </div>
// //                 </div>
// //                 <p className="text-slate-400 text-sm mb-4">{tutor.bio}</p>
// //                 <div className="flex flex-wrap gap-2 mb-6">
// //                     {tutor.subjects.map((subject: string) => (
// //                         <span key={subject} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">
// //                             {subject}
// //                         </span>
// //                     ))}
// //                 </div>
// //                 <button
// //                     onClick={onEditRequest}
// //                     className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
// //                     <Edit className="h-4 w-4 mr-2" />
// //                     Edit My Public Profile
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // };

// // /**
// //  * StatCard Component
// //  * A reusable card for displaying statistics.
// //  */
// // interface StatCardProps {
// //     icon: React.ElementType;
// //     value: string | number;
// //     label: string;
// // }

// // const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label }) => (
// //     <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
// //         <Icon className="h-6 w-6 text-slate-400 mb-2" />
// //         <p className="text-2xl font-bold text-white">{value}</p>
// //         <p className="text-sm text-slate-400">{label}</p>
// //     </div>
// // );

// // /**
// //  * TeacherTutorDashboard Component
// //  * The main dashboard page for the tutor.
// //  */
// // export default function TeacherTutorDashboard() {
// //     // const [isAvailable, setIsAvailable] = useState(true);
// //     const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
// //     const [isEditing, setIsEditing] = useState(false);

// //     useEffect(() => {
// //         // Simulating fetching data. If no profile exists, enter creation mode.
// //         if (!tutorProfile) {
// //             setIsEditing(true);
// //         }
// //     }, [tutorProfile]);

// //     const teacherData = {
// //         stats: { students: 15, earningsThisMonth: 150000, rating: 4.9 },
// //     };

// //     const handleProfileSave = (formData: ProfileFormData) => {
// //         const newProfile: TutorProfile = {
// //             ...mockTutors[0], // Base data like id, rating, etc.
// //             ...formData, // Overwrite with new form data
// //         };
// //         setTutorProfile(newProfile);
// //         setIsEditing(false); // Switch back to view mode
// //     };

// //     // Inside TeacherTutorDashboard, near handleProfileSave
// //     const handleAvailabilityToggle = () => {
// //         // First, make sure there is a profile to update
// //         if (!tutorProfile) return;

// //         // Create a new updated profile object
// //         const updatedProfile = {
// //             ...tutorProfile,
// //             // Set the availability to the opposite of its current value
// //             isAvailableForNewStudents: !tutorProfile.isAvailableForNewStudents,
// //         };

// //         // Update the state with the new profile
// //         setTutorProfile(updatedProfile);

// //         // In a real app, you would also save this to your database here.
// //         // e.g., saveToDatabase(updatedProfile);
// //     };

// //     return (
// //         <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
// //             <div className="max-w-7xl mx-auto">
// //                 <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
// //                     {/* <h1 className="text-3xl font-bold">My Tutoring Dashboard</h1> */}
// //                     <h2 className="text-2xl font-bold mb-4">My Tutoring Profile (Public View)</h2>
// //                     <div className="flex items-center gap-4 p-2 bg-slate-800 rounded-lg">
// //                         {/* <span className={`font-semibold ${isAvailable ? 'text-green-400' : 'text-slate-400'}`}>
// //                             {isAvailable ? 'Available for new students' : 'Not currently available'}
// //                         </span> */}
// //                         <span className={`font-semibold ${tutorProfile?.isAvailableForNewStudents ? 'text-green-400' : 'text-slate-400'}`}>
// //                             {tutorProfile?.isAvailableForNewStudents ? 'Available for new students' : 'Not currently available'}
// //                         </span>

// //                         {/* <button onClick={() => setIsAvailable(!isAvailable)}>
// //                             <ToggleRight className={`h-10 w-10 transition-colors ${isAvailable ? 'text-green-500' : 'text-slate-600 rotate-180'}`} />
// //                         </button> */}
// //                         <button onClick={handleAvailabilityToggle}>
// //                             <ToggleRight className={`h-10 w-10 transition-colors ${tutorProfile?.isAvailableForNewStudents ? 'text-green-500' : 'text-slate-600 rotate-180'}`} />
// //                         </button>
// //                     </div>
// //                 </div>
// //                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
// //                     <div className="lg:col-span-2 space-y-8">
// //                         <div>

// //                             {isEditing ? (
// //                                 <ProfileEditor
// //                                     profile={tutorProfile}
// //                                     onSave={handleProfileSave}
// //                                     onCancel={() => setIsEditing(false)}
// //                                 />
// //                             ) : tutorProfile ? (
// //                                 <TeacherProfileCard
// //                                     tutor={tutorProfile}
// //                                     onEditRequest={() => setIsEditing(true)}
// //                                 />
// //                             ) : (
// //                                 // This fallback can show while the initial check runs
// //                                 <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center text-slate-400">
// //                                     Loading Profile Creator...
// //                                 </div>
// //                             )}
// //                         </div>
// //                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-3">
// //                             <h3 className="text-xl font-bold">Quick Actions</h3>
// //                             <button className="w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold">
// //                                 <Calendar className="h-5 w-5" />Set My Availability
// //                             </button>
// //                         </div>
// //                     </div>
// //                     <div className="space-y-6">
// //                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
// //                             <h3 className="text-xl font-bold mb-4">My Stats</h3>
// //                             <div className="space-y-4">
// //                                 <StatCard icon={Users} value={teacherData.stats.students} label="Active Students" />
// //                                 <StatCard icon={DollarSign} value={`K${teacherData.stats.earningsThisMonth.toLocaleString()}`} label="Earnings this Month" />
// //                                 <StatCard icon={Star} value={teacherData.stats.rating.toFixed(1)} label="Average Rating" />
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </main>
// //     );
// // }


// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { Star, ToggleRight, Edit, Users, DollarSign, Calendar, Save, XCircle } from 'lucide-react';
// // import React from 'react';
// // import { mockTutors, ProfileFormData, TutorProfile } from '../data/tutors';

// // // // --- TYPE DEFINITIONS ---
// // // // Defines the shape of the full tutor profile object
// // // interface TutorProfile {
// // //     id: string;
// // //     title: string;
// // //     name: string;
// // //     avatar: string;
// // //     rating: number;
// // //     reviews: number;
// // //     bio: string;
// // //     subjects: string[];
// // //     isAvailableForNewStudents: boolean;
// // // }

// // // // Defines the shape of the data coming from the editor form
// // // interface ProfileFormData {
// // //     title: string;
// // //     name: string;
// // //     bio: string;
// // //     subjects: string[];

// // // }

// // // // --- MOCK DATA ---
// // // const mockTutors: TutorProfile[] = [{
// // //     id: 't1',
// // //     title: 'Mr',
// // //     name: 'John Phiri',
// // //     avatar: 'JP',
// // //     rating: 4.8,
// // //     reviews: 120,
// // //     bio: 'Experienced and passionate Biology and Chemistry tutor with over 10 years of teaching experience. I focus on making complex topics easy to understand.',
// // //     subjects: ['Biology', 'Chemistry', 'Physics'],
// // //     isAvailableForNewStudents: true

// // // }];
// // // --- END MOCK DATA ---


// // /**
// //  * ProfileEditor Component
// //  * A form for creating or editing the tutor's public profile.
// //  */
// // interface ProfileEditorProps {
// //     profile: TutorProfile | null;
// //     onSave: (data: ProfileFormData) => void;
// //     onCancel: () => void;
// // }

// // const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave, onCancel }) => {
// //     const [title, setTitle] = useState(profile?.title || 'Mr.');
// //     const [name, setName] = useState(profile?.name || 'John Phiri'); // Pre-fill name from auth if possible
// //     const [bio, setBio] = useState(profile?.bio || '');
// //     const [subjects, setSubjects] = useState(profile?.subjects?.join(', ') || '');

// //     const handleSave = () => {
// //         if (!name || !bio || !subjects) {
// //             // In a real app, use a more robust validation and feedback system
// //             alert("Please fill in all fields.");
// //             return;
// //         }
// //         onSave({
// //             title,
// //             name,
// //             bio,
// //             // Split comma-separated string into an array of trimmed strings that are not empty
// //             subjects: subjects.split(',').map(s => s.trim()).filter(Boolean),
// //         });
// //     };

// //     return (
// //         <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
// //             <h3 className="text-xl font-bold text-white mb-4">
// //                 {profile ? 'Edit Your Public Profile' : 'Create Your Public Profile'}
// //             </h3>
// //             <p className="text-sm text-slate-400 mb-6">
// //                 This information will be visible to students looking for a tutor.
// //             </p>
// //             <div className="space-y-4">
// //                 {/* ADD THIS NEW DIV FOR THE TITLE DROPDOWN */}
// //                 <div>
// //                     <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Title</label>
// //                     <select
// //                         id="title"
// //                         value={title}
// //                         onChange={(e) => setTitle(e.target.value)}
// //                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                     >
// //                         <option>Mr.</option>
// //                         <option>Mrs.</option>
// //                         <option>Ms.</option>
// //                         <option>Dr.</option>
// //                     </select>
// //                 </div>
// //                 <div>
// //                     <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
// //                     <input
// //                         type="text"
// //                         id="name"
// //                         value={name}
// //                         onChange={(e) => setName(e.target.value)}
// //                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                     />
// //                 </div>
// //                 <div>
// //                     <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-1">Description / Bio</label>
// //                     <textarea
// //                         id="bio"
// //                         rows={4} // Correctly passed as a number
// //                         value={bio}
// //                         onChange={(e) => setBio(e.target.value)}
// //                         placeholder="Tell students about your teaching style, experience, and what makes you a great tutor."
// //                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                     />
// //                 </div>
// //                 <div>
// //                     <label htmlFor="subjects" className="block text-sm font-medium text-slate-300 mb-1">Subjects You Teach</label>
// //                     <input
// //                         type="text"
// //                         id="subjects"
// //                         value={subjects}
// //                         onChange={(e) => setSubjects(e.target.value)}
// //                         placeholder="e.g., Biology, Chemistry, Physics"
// //                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                     />
// //                     <p className="text-xs text-slate-500 mt-1">Separate subjects with a comma.</p>
// //                 </div>
// //             </div>
// //             <div className="flex items-center gap-4 mt-6">
// //                 <button
// //                     onClick={handleSave}
// //                     className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
// //                     <Save className="h-4 w-4 mr-2" />
// //                     {profile ? 'Save Changes' : 'Create My Profile'}
// //                 </button>
// //                 {profile && ( // Only show Cancel button if we are editing
// //                     <button
// //                         onClick={onCancel}
// //                         className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
// //                         <XCircle className="h-4 w-4 mr-2" />
// //                         Cancel
// //                     </button>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };


// // /**
// //  * TeacherProfileCard Component
// //  * Displays the tutor's public profile information.
// //  */
// // interface TeacherProfileCardProps {
// //     tutor: TutorProfile;
// //     onEditRequest: () => void;
// // }

// // const TeacherProfileCard: React.FC<TeacherProfileCardProps> = ({ tutor, onEditRequest }) => {
// //     const nameParts = tutor.name.split(' ');
// //     const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : tutor.name;

// //     return (
// //         <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
// //             <div className="p-6">
// //                 <div className="flex items-center mb-4">
// //                     <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center text-2xl font-bold flex-shrink-0 mr-4">
// //                         {/* {tutor.name.split(' ').map((n: string) => n[0]).join('')} */}
// //                         {tutor.name.split(' ').pop()?.[0] || '?'}
// //                     </div>
// //                     <div>
// //                         {/* <h3 className="text-xl font-bold text-white">{tutor.name}</h3> */}
// //                         <h3 className="text-xl font-bold text-white">{`${tutor.title} ${surname}`}</h3>
// //                         <div className="flex items-center text-sm text-yellow-400 mt-1">
// //                             <Star className="h-4 w-4 fill-current mr-1" />
// //                             <span>{tutor.rating.toFixed(1)} ({tutor.reviews} reviews)</span>
// //                         </div>
// //                     </div>
// //                 </div>
// //                 <p className="text-slate-400 text-sm mb-4">{tutor.bio}</p>
// //                 <div className="flex flex-wrap gap-2 mb-6">
// //                     {tutor.subjects.map((subject: string) => (
// //                         <span key={subject} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">
// //                             {subject}
// //                         </span>
// //                     ))}
// //                 </div>
// //                 <button
// //                     onClick={onEditRequest}
// //                     className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
// //                     <Edit className="h-4 w-4 mr-2" />
// //                     Edit My Public Profile
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // };

// // /**
// //  * StatCard Component
// //  * A reusable card for displaying statistics.
// //  */
// // interface StatCardProps {
// //     icon: React.ElementType;
// //     value: string | number;
// //     label: string;
// // }

// // const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label }) => (
// //     <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
// //         <Icon className="h-6 w-6 text-slate-400 mb-2" />
// //         <p className="text-2xl font-bold text-white">{value}</p>
// //         <p className="text-sm text-slate-400">{label}</p>
// //     </div>
// // );

// // /**
// //  * TeacherTutorDashboard Component
// //  * The main dashboard page for the tutor.
// //  */
// // export default function TeacherTutorDashboard() {
// //     // const [isAvailable, setIsAvailable] = useState(true);
// //     const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
// //     const [isEditing, setIsEditing] = useState(false);

// //     useEffect(() => {
// //         // Simulating fetching data. If no profile exists, enter creation mode.
// //         if (!tutorProfile) {
// //             setIsEditing(true);
// //         }
// //     }, [tutorProfile]);

// //     const teacherData = {
// //         stats: { students: 15, earningsThisMonth: 150000, rating: 4.9 },
// //     };

// //     const handleProfileSave = (formData: ProfileFormData) => {
// //         const newProfile: TutorProfile = {
// //             ...mockTutors[0], // Base data like id, rating, etc.
// //             ...formData, // Overwrite with new form data
// //         };
// //         setTutorProfile(newProfile);
// //         setIsEditing(false); // Switch back to view mode
// //     };

// //     // Inside TeacherTutorDashboard, near handleProfileSave
// //     const handleAvailabilityToggle = () => {
// //         // First, make sure there is a profile to update
// //         if (!tutorProfile) return;

// //         // Create a new updated profile object
// //         const updatedProfile = {
// //             ...tutorProfile,
// //             // Set the availability to the opposite of its current value
// //             isAvailableForNewStudents: !tutorProfile.isAvailableForNewStudents,
// //         };

// //         // Update the state with the new profile
// //         setTutorProfile(updatedProfile);

// //         // In a real app, you would also save this to your database here.
// //         // e.g., saveToDatabase(updatedProfile);
// //     };

// //     return (
// //         <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
// //             <div className="max-w-7xl mx-auto">
// //                 <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
// //                     {/* <h1 className="text-3xl font-bold">My Tutoring Dashboard</h1> */}
// //                     <h2 className="text-2xl font-bold mb-4">My Tutoring Profile (Public View)</h2>
// //                     <div className="flex items-center gap-4 p-2 bg-slate-800 rounded-lg">
// //                         {/* <span className={`font-semibold ${isAvailable ? 'text-green-400' : 'text-slate-400'}`}>
// //                             {isAvailable ? 'Available for new students' : 'Not currently available'}
// //                         </span> */}
// //                         <span className={`font-semibold ${tutorProfile?.isAvailableForNewStudents ? 'text-green-400' : 'text-slate-400'}`}>
// //                             {tutorProfile?.isAvailableForNewStudents ? 'Available for new students' : 'Not currently available'}
// //                         </span>

// //                         {/* <button onClick={() => setIsAvailable(!isAvailable)}>
// //                             <ToggleRight className={`h-10 w-10 transition-colors ${isAvailable ? 'text-green-500' : 'text-slate-600 rotate-180'}`} />
// //                         </button> */}
// //                         <button onClick={handleAvailabilityToggle}>
// //                             <ToggleRight className={`h-10 w-10 transition-colors ${tutorProfile?.isAvailableForNewStudents ? 'text-green-500' : 'text-slate-600 rotate-180'}`} />
// //                         </button>
// //                     </div>
// //                 </div>
// //                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
// //                     <div className="lg:col-span-2 space-y-8">
// //                         <div>

// //                             {isEditing ? (
// //                                 <ProfileEditor
// //                                     profile={tutorProfile}
// //                                     onSave={handleProfileSave}
// //                                     onCancel={() => setIsEditing(false)}
// //                                 />
// //                             ) : tutorProfile ? (
// //                                 <TeacherProfileCard
// //                                     tutor={tutorProfile}
// //                                     onEditRequest={() => setIsEditing(true)}
// //                                 />
// //                             ) : (
// //                                 // This fallback can show while the initial check runs
// //                                 <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center text-slate-400">
// //                                     Loading Profile Creator...
// //                                 </div>
// //                             )}
// //                         </div>
// //                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-3">
// //                             <h3 className="text-xl font-bold">Quick Actions</h3>
// //                             <button className="w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold">
// //                                 <Calendar className="h-5 w-5" />Set My Availability
// //                             </button>
// //                         </div>
// //                     </div>
// //                     <div className="space-y-6">
// //                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
// //                             <h3 className="text-xl font-bold mb-4">My Stats</h3>
// //                             <div className="space-y-4">
// //                                 <StatCard icon={Users} value={teacherData.stats.students} label="Active Students" />
// //                                 <StatCard icon={DollarSign} value={`K${teacherData.stats.earningsThisMonth.toLocaleString()}`} label="Earnings this Month" />
// //                                 <StatCard icon={Star} value={teacherData.stats.rating.toFixed(1)} label="Average Rating" />
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </main>
// //     );
// // }



// // // 'use client';

// // // import { useState } from 'react';
// // // import Link from 'next/link';
// // // import { Star, ToggleRight, Edit, Users, DollarSign, Calendar } from 'lucide-react';
// // // import { mockTutors } from '../data'; // <-- Import from the new data file

// // // const TeacherProfileCard = ({ tutor }: { tutor: typeof mockTutors[0] }) => (
// // //     <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
// // //         {/* ... content of TeacherProfileCard ... */}
// // //         <div className="p-6">
// // //             <div className="flex items-center mb-4">
// // //                 <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center text-2xl font-bold flex-shrink-0 mr-4">{tutor.avatar}</div>
// // //                 <div>
// // //                     <h3 className="text-xl font-bold text-white">{tutor.name}</h3>
// // //                     <div className="flex items-center text-sm text-yellow-400 mt-1"><Star className="h-4 w-4 fill-current mr-1" /><span>{tutor.rating.toFixed(1)} ({tutor.reviews} reviews)</span></div>
// // //                 </div>
// // //             </div>
// // //             <p className="text-slate-400 text-sm mb-4">{tutor.bio}</p>
// // //             <div className="flex flex-wrap gap-2 mb-6">{tutor.subjects.map(subject => (<span key={subject} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">{subject}</span>))}</div>
// // //             <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold shadow-lg transition flex items-center justify-center"><Edit className="h-4 w-4 mr-2" />Edit My Public Profile</button>
// // //         </div>
// // //     </div>
// // // );

// // // const StatCard = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string | number, label: string }) => (
// // //     <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
// // //         {/* ... content of StatCard ... */}
// // //         <Icon className="h-6 w-6 text-slate-400 mb-2" />
// // //         <p className="text-2xl font-bold text-white">{value}</p>
// // //         <p className="text-sm text-slate-400">{label}</p>
// // //     </div>
// // // );

// // // // This is your original teacher dashboard, now in its own file
// // // export default function TeacherTutorDashboard() {
// // //     const [isAvailable, setIsAvailable] = useState(true);
// // //     const teacherData = {
// // //         profile: mockTutors[0], // Using the first mock tutor for the example
// // //         stats: { students: 15, earningsThisMonth: 150000, rating: 4.9 },
// // //         // upcomingSessions: [
// // //         //     { id: 's1', studentName: 'Alice Phiri', subject: 'Biology', date: '02 Sep at 16:00' },
// // //         //     { id: 's2', studentName: 'Bob Banda', subject: 'Chemistry', date: '04 Sep at 10:00' },
// // //         // ]
// // //     };

// // //     return (
// // //         <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
// // //             <div className="max-w-7xl mx-auto">
// // //                 {/* ... all the JSX for the teacher dashboard ... */}
// // //                 <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
// // //                     {/* <h1 className="text-3xl font-bold">My Tutoring Dashboard</h1> */}
// // //                     <h2 className="text-2xl font-bold mb-4">My Tutoring Profile (Public View)</h2>
// // //                     <div className="flex items-center gap-4 p-2 bg-slate-800 rounded-lg">
// // //                         <span className={`font-semibold ${isAvailable ? 'text-green-400' : 'text-slate-400'}`}>{isAvailable ? 'Available for new students' : 'Not currently available'}</span>
// // //                         <button onClick={() => setIsAvailable(!isAvailable)}><ToggleRight className={`h-10 w-10 transition-colors ${isAvailable ? 'text-green-500' : 'text-slate-600 rotate-180'}`} /></button>
// // //                     </div>
// // //                 </div>
// // //                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
// // //                     <div className="lg:col-span-2 space-y-8">
// // //                         <div>
// // //                             {/* <h2 className="text-2xl font-bold mb-4">My Tutor Profile (Public View)</h2> */}
// // //                             <TeacherProfileCard tutor={teacherData.profile} />
// // //                         </div>
// // //                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-3">
// // //                             <h3 className="text-xl font-bold">Quick Actions</h3>
// // //                             <button className="w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold"><Calendar className="h-5 w-5" />Set My Availability</button>
// // //                         </div>
// // //                         {/* <div>
// // //                             <h2 className="text-2xl font-bold mb-4">Upcoming Sessions</h2>
// // //                             <div className="space-y-3">
// // //                                 {teacherData.upcomingSessions.map(session => (
// // //                                     <div key={session.id} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center">
// // //                                         <div><p className="font-semibold">{session.studentName} - {session.subject}</p><p className="text-sm text-slate-400">{session.date}</p></div>
// // //                                         <Link href="#" className="text-sm font-semibold text-blue-400 hover:underline">Session Details</Link>
// // //                                     </div>
// // //                                 ))}
// // //                             </div>
// // //                         </div> */}
// // //                     </div>
// // //                     <div className="space-y-6">
// // //                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
// // //                             <h3 className="text-xl font-bold mb-4">My Stats</h3>
// // //                             <div className="space-y-4">
// // //                                 <StatCard icon={Users} value={teacherData.stats.students} label="Active Students" />
// // //                                 <StatCard icon={DollarSign} value={`K${teacherData.stats.earningsThisMonth.toLocaleString()}`} label="Earnings this Month" />
// // //                                 <StatCard icon={Star} value={teacherData.stats.rating.toFixed(1)} label="Average Rating" />
// // //                             </div>
// // //                         </div>

// // //                     </div>
// // //                 </div>
// // //             </div>
// // //         </main>
// // //     );
// // // }



// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { Star, ToggleRight, Edit, Users, DollarSign, Calendar, Save, XCircle } from 'lucide-react';

// // // --- MOCK DATA ---
// // // In a real application, this would come from your backend or state management
// // const mockTutors = [{
// //     id: 't1',
// //     name: 'John Phiri',
// //     avatar: 'JP',
// //     rating: 4.8,
// //     reviews: 120,
// //     bio: 'Experienced and passionate Biology and Chemistry tutor with over 10 years of teaching experience. I focus on making complex topics easy to understand.',
// //     subjects: ['Biology', 'Chemistry', 'Physics'],
// // }];
// // // --- END MOCK DATA ---


// // /**
// //  * ProfileEditor Component
// //  * A form for creating or editing the tutor's public profile.
// //  */
// // const ProfileEditor = ({ profile, onSave, onCancel }) => {
// //     const [name, setName] = useState(profile?.name || 'John Phiri'); // Pre-fill name from auth if possible
// //     const [bio, setBio] = useState(profile?.bio || '');
// //     const [subjects, setSubjects] = useState(profile?.subjects?.join(', ') || '');

// //     const handleSave = () => {
// //         if (!name || !bio || !subjects) {
// //             // Simple validation
// //             alert("Please fill in all fields.");
// //             return;
// //         }
// //         onSave({
// //             name,
// //             bio,
// //             // Split comma-separated string into an array of trimmed strings
// //             subjects: subjects.split(',').map(s => s.trim()).filter(Boolean),
// //         });
// //     };

// //     return (
// //         <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6">
// //             <h3 className="text-xl font-bold text-white mb-4">
// //                 {profile ? 'Edit Your Public Profile' : 'Create Your Public Profile'}
// //             </h3>
// //             <p className="text-sm text-slate-400 mb-6">
// //                 This information will be visible to students looking for a tutor.
// //             </p>
// //             <div className="space-y-4">
// //                 <div>
// //                     <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
// //                     <input
// //                         type="text"
// //                         id="name"
// //                         value={name}
// //                         onChange={(e) => setName(e.target.value)}
// //                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                     />
// //                 </div>
// //                 <div>
// //                     <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-1">Description / Bio</label>
// //                     <textarea
// //                         id="bio"
// //                         rows="4"
// //                         value={bio}
// //                         onChange={(e) => setBio(e.target.value)}
// //                         placeholder="Tell students about your teaching style, experience, and what makes you a great tutor."
// //                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                     />
// //                 </div>
// //                 <div>
// //                     <label htmlFor="subjects" className="block text-sm font-medium text-slate-300 mb-1">Subjects You Teach</label>
// //                     <input
// //                         type="text"
// //                         id="subjects"
// //                         value={subjects}
// //                         onChange={(e) => setSubjects(e.target.value)}
// //                         placeholder="e.g., Biology, Chemistry, Physics"
// //                         className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
// //                     />
// //                      <p className="text-xs text-slate-500 mt-1">Separate subjects with a comma.</p>
// //                 </div>
// //             </div>
// //             <div className="flex items-center gap-4 mt-6">
// //                  <button
// //                     onClick={handleSave}
// //                     className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
// //                     <Save className="h-4 w-4 mr-2" />
// //                     {profile ? 'Save Changes' : 'Create My Profile'}
// //                 </button>
// //                 {profile && ( // Only show Cancel button if we are editing (i.e., a profile already exists)
// //                     <button
// //                         onClick={onCancel}
// //                         className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
// //                         <XCircle className="h-4 w-4 mr-2" />
// //                         Cancel
// //                     </button>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };


// // /**
// //  * TeacherProfileCard Component
// //  * Displays the tutor's public profile information.
// //  */
// // const TeacherProfileCard = ({ tutor, onEditRequest }) => (
// //     <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
// //         <div className="p-6">
// //             <div className="flex items-center mb-4">
// //                 <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center text-2xl font-bold flex-shrink-0 mr-4">
// //                     {tutor.name.split(' ').map(n => n[0]).join('')}
// //                 </div>
// //                 <div>
// //                     <h3 className="text-xl font-bold text-white">{tutor.name}</h3>
// //                     {/* Rating is displayed but not editable by the tutor */}
// //                     <div className="flex items-center text-sm text-yellow-400 mt-1">
// //                         <Star className="h-4 w-4 fill-current mr-1" />
// //                         <span>{tutor.rating.toFixed(1)} ({tutor.reviews} reviews)</span>
// //                     </div>
// //                 </div>
// //             </div>
// //             <p className="text-slate-400 text-sm mb-4">{tutor.bio}</p>
// //             <div className="flex flex-wrap gap-2 mb-6">
// //                 {tutor.subjects.map(subject => (
// //                     <span key={subject} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">
// //                         {subject}
// //                     </span>
// //                 ))}
// //             </div>
// //             <button
// //                 onClick={onEditRequest}
// //                 className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold shadow-lg transition flex items-center justify-center">
// //                 <Edit className="h-4 w-4 mr-2" />
// //                 Edit My Public Profile
// //             </button>
// //         </div>
// //     </div>
// // );

// // /**
// //  * StatCard Component
// //  * A reusable card for displaying statistics.
// //  */
// // const StatCard = ({ icon: Icon, value, label }) => (
// //     <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
// //         <Icon className="h-6 w-6 text-slate-400 mb-2" />
// //         <p className="text-2xl font-bold text-white">{value}</p>
// //         <p className="text-sm text-slate-400">{label}</p>
// //     </div>
// // );

// // /**
// //  * TeacherTutorDashboard Component
// //  * The main dashboard page for the tutor.
// //  */
// // export default function TeacherTutorDashboard() {
// //     const [isAvailable, setIsAvailable] = useState(true);
// //     // Profile state: null if not created, object if it exists.
// //     const [tutorProfile, setTutorProfile] = useState(null);
// //     // Editing state: true if in creation/edit mode.
// //     const [isEditing, setIsEditing] = useState(false);

// //     // Effect to determine initial state. In a real app, you'd fetch the profile.
// //     // If it's not found, you'd start in editing mode.
// //     useEffect(() => {
// //         // Simulating fetching data. Let's assume the tutor has no profile initially.
// //         if (!tutorProfile) {
// //             setIsEditing(true);
// //         }
// //     }, [tutorProfile]);


// //     const teacherData = {
// //         // Stats are separate from the public profile
// //         stats: { students: 15, earningsThisMonth: 150000, rating: 4.9 },
// //     };

// //     const handleProfileSave = (formData) => {
// //         // In a real app, you would save this data to your database.
// //         // Here, we'll just update the state.
// //         const newProfile = {
// //             // Merge new form data with some existing mock data (like rating)
// //             ...mockTutors[0],
// //             ...formData,
// //         };
// //         setTutorProfile(newProfile);
// //         setIsEditing(false); // Switch back to view mode after saving
// //     };


// //     return (
// //         <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
// //             <div className="max-w-7xl mx-auto">
// //                 <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
// //                     <h1 className="text-3xl font-bold">My Tutoring Dashboard</h1>
// //                     <div className="flex items-center gap-4 p-2 bg-slate-800 rounded-lg">
// //                         <span className={`font-semibold ${isAvailable ? 'text-green-400' : 'text-slate-400'}`}>
// //                             {isAvailable ? 'Available for new students' : 'Not currently available'}
// //                         </span>
// //                         <button onClick={() => setIsAvailable(!isAvailable)}>
// //                             <ToggleRight className={`h-10 w-10 transition-colors ${isAvailable ? 'text-green-500' : 'text-slate-600 rotate-180'}`} />
// //                         </button>
// //                     </div>
// //                 </div>
// //                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
// //                     <div className="lg:col-span-2 space-y-8">
// //                         <div>
// //                             <h2 className="text-2xl font-bold mb-4">My Tutoring Profile (Public View)</h2>
// //                             {isEditing ? (
// //                                 <ProfileEditor
// //                                     profile={tutorProfile}
// //                                     onSave={handleProfileSave}
// //                                     onCancel={() => setIsEditing(false)}
// //                                 />
// //                             ) : tutorProfile ? (
// //                                 <TeacherProfileCard
// //                                     tutor={tutorProfile}
// //                                     onEditRequest={() => setIsEditing(true)}
// //                                 />
// //                             ) : (
// //                                 // This is a fallback, but useEffect should handle it
// //                                 <p>Loading profile...</p>
// //                             )}
// //                         </div>
// //                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-3">
// //                             <h3 className="text-xl font-bold">Quick Actions</h3>
// //                             <button className="w-full flex items-center justify-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold">
// //                                 <Calendar className="h-5 w-5" />Set My Availability
// //                             </button>
// //                         </div>
// //                     </div>
// //                     <div className="space-y-6">
// //                         <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
// //                             <h3 className="text-xl font-bold mb-4">My Stats</h3>
// //                             <div className="space-y-4">
// //                                 <StatCard icon={Users} value={teacherData.stats.students} label="Active Students" />
// //                                 <StatCard icon={DollarSign} value={`K${teacherData.stats.earningsThisMonth.toLocaleString()}`} label="Earnings this Month" />
// //                                 <StatCard icon={Star} value={teacherData.stats.rating.toFixed(1)} label="Average Rating" />
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </main>
// //     );
// // }
