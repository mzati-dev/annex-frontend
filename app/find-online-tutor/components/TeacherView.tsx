'use client';

import { useState, useEffect } from 'react';
import { Star, ToggleRight, Edit, Users, DollarSign, Calendar, Save, XCircle } from 'lucide-react';
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { TutorProfile, ProfileFormData } from '../data/tutors';
import { API_BASE_URL } from '@/services/api/api.constants';


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


export default function TeacherTutorDashboard() {
    const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const { user, updateTutor } = useAppContext();
    const getProfileStorageKey = (userId: string | number) => `tutorProfileData_${userId}`;


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
