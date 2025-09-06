'use client';

import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { User, Mail, Phone, Edit, Users, CalendarDays, PersonStanding } from 'lucide-react';
import Header from '@/components/common/Header';
import { userApiService } from '@/services/api/api';
import { API_BASE_URL } from '@/services/api/api.constants';


// Typed helper component
const ProfileDetail = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | undefined }) => (
    <div className="flex items-start py-4 border-b border-slate-700 last:border-b-0">
        <Icon className="h-6 w-6 text-slate-400 mt-1 mr-4 flex-shrink-0" />
        <div className="flex-grow">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="text-lg text-white font-medium">{value || 'Not provided'}</p>
        </div>
    </div>
);

export default function AccountPage() {
    const { user, setUser } = useAppContext();

    // --- START OF FIXES ---
    // 1. Explicitly type the state hooks to allow for 'File | null' and 'string | null'
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [status, setStatus] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name,
        phone: user?.phone || '',
        dob: user?.dob ? user.dob.slice(0, 10) : '',
        gender: user?.gender || '',
    });

    // REPLACE your old handleProfileUpdate function with this one

    const handleProfileUpdate = async () => {
        if (!user) return; // Guard against null user

        // 1. We still do this check to make sure the name is not empty.
        if (!formData.name) {
            setStatus('Name cannot be empty.');
            return; // Stop the function
        }

        // 2. THIS IS THE FIX: Create a new object that matches the required type.
        const payload = {
            name: formData.name, // After the check above, TypeScript knows this is a string.
            phone: formData.phone,
            dob: formData.dob,
            gender: formData.gender,
        };

        setStatus('Saving...');
        try {
            // 3. We send the new, safe 'payload' object to the API function.
            const updatedProfile = await userApiService.updateProfile(payload);

            if (setUser) {
                setUser({ ...user, ...updatedProfile });
            }

            setStatus('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setStatus(error instanceof Error ? error.message : 'Failed to update profile.');
        }
    };




    // 2. Add the correct event type for the 'e' parameter
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
            setStatus('');
        }
    };
    // --- END OF FIXES ---

    const handleUpload = async () => {
        if (!selectedFile) {
            setStatus('Please select a file first.');
            return;
        }
        setStatus('Uploading...');
        try {
            const responseUser = await userApiService.uploadAvatar(selectedFile);
            const updatedUser = { ...user, ...responseUser };
            if (setUser) setUser(updatedUser);
            setStatus('Upload successful!');
            setImagePreview(null);
            setSelectedFile(null);
        } catch (error) {
            console.error('Error uploading image:', error);
            setStatus(error instanceof Error ? error.message : 'Error uploading image.');
        }
    };

    useEffect(() => {
        if (!user) {
            // A short delay to prevent flickering on fast reloads
            const timer = setTimeout(() => window.location.replace('/'), 100);
            return () => clearTimeout(timer);
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <p>Loading your profile...</p>
            </div>
        );
    }

    const fullProfileImageUrl = user.profileImageUrl
        ? `${API_BASE_URL}${user.profileImageUrl}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff`;

    const formattedRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A';

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">My Account</h1>
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8 bg-slate-800/50 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="flex-shrink-0">
                                <img
                                    src={imagePreview || fullProfileImageUrl}
                                    alt="Profile"
                                    className="h-24 w-24 rounded-full object-cover border-4 border-slate-700"
                                />
                            </div>
                            <div className="flex-grow text-center sm:text-left">
                                <h2 className="text-3xl font-bold">{user.name}</h2>
                                <p className="text-slate-300">{user.email}</p>
                                <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept="image/png, image/jpeg"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer w-full sm:w-auto text-center px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-md transition"
                                    >
                                        Choose File
                                    </label>
                                    {selectedFile && (
                                        <button
                                            onClick={handleUpload}
                                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md font-semibold transition"
                                        >
                                            Upload Picture
                                        </button>
                                    )}
                                </div>
                                {status && <p className="mt-2 text-sm text-center sm:text-left">{status}</p>}
                            </div>
                        </div>

                        <div className="p-8">
                            <h3 className="text-xl font-semibold text-slate-200 mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                {isEditing ? (
                                    <>
                                        <div className="py-4 border-b border-slate-700">
                                            <label className="text-sm text-slte-400">Full Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-slate-700 p-2 rounded mt-1 text-white"
                                            />
                                        </div>

                                        <div className="py-4 border-b border-slate-700">
                                            <label className="text-sm text-slte-400">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-slate-700 p-2 rounded mt-1 text-white"
                                            />
                                        </div>

                                        <div className="py-4 border-b border-slate-700">
                                            <label className="text-sm text-slte-400">Date of Birth</label>
                                            <input
                                                type="date"
                                                value={formData.dob}
                                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                                className="w-full bg-slate-700 p-2 rounded mt-1 text-white"
                                            />
                                        </div>

                                        <div className="py-4 border-b border-slate-700">
                                            <label className="text-sm text-slte-400">Gender</label>
                                            <select

                                                value={formData.gender}
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                                className="w-full bg-slate-700 p-2 rounded mt-1 text-white"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="prefer-not-to-say">Prefer not to say</option>
                                            </select>
                                        </div>

                                    </>
                                ) : (
                                    <>
                                        <ProfileDetail icon={User} label="Full Name" value={user.name} />
                                        <ProfileDetail icon={Phone} label="Phone Number" value={user.phone} />
                                        <ProfileDetail icon={CalendarDays} label="Date of Birth" value={user.dob?.slice(0, 10)} />
                                        <ProfileDetail icon={PersonStanding} label="Gender" value={user.gender} />
                                    </>
                                )}

                                <ProfileDetail icon={Mail} label="Email Address" value={user.email} />

                                <ProfileDetail icon={Users} label="Role" value={formattedRole} />

                            </div>
                        </div>

                        <div className="p-6 bg-slate-900/50 border-t border-slate-700 flex justify-end">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleProfileUpdate}
                                        className="flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition"
                                    >
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition"
                                >
                                    <Edit className="h-5 w-5 mr-2" />
                                    Edit Profile
                                </button>
                            )}


                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

// 'use client';

// import { useEffect, useState } from 'react'; // MODIFICATION: Added useState
// import { useAppContext } from '../../context/AppContext';
// import { User, Mail, Phone, Cake, Users, LogOut, Edit } from 'lucide-react';
// import Header from '@/components/common/Header';
// import { userApiService } from '@/services/api/api';

// // This is a helper component to display each piece of user information consistently.
// const ProfileDetail = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
//     <div className="flex items-start py-4 border-b border-slate-700 last-border-b-0">
//         <Icon className="h-6 w-6 text-slate-400 mt-1 mr-4 flex-shrink-0" />
//         <div className="flex-grow">
//             <p className="text-sm text-slate-400">{label}</p>
//             <p className="text-lg text-white font-medium">{value || 'Not provided'}</p>
//         </div>
//     </div>
// );

// export default function AccountPage() {
//     // MODIFICATION 1: Use setUser from context and add state for uploads
//     const { user, logout, setUser } = useAppContext();
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [imagePreview, setImagePreview] = useState<string | null>(null);
//     const [status, setStatus] = useState('');


//     useEffect(() => {
//         const timer = setTimeout(() => {
//             if (!user) {
//                 window.location.replace('/');
//             }
//         }, 100);
//         return () => clearTimeout(timer);
//     }, [user]);

//     // MODIFICATION 2: Add handler functions for image upload
//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setSelectedFile(file);
//             setImagePreview(URL.createObjectURL(file));
//         }
//     };

//     // const handleUpload = async () => {
//     //     if (!selectedFile) {
//     //         setStatus('Please select a file first.');
//     //         return;
//     //     }

//     //     setStatus('Uploading...');
//     //     const formData = new FormData();
//     //     formData.append('profileImage', selectedFile);

//     //     try {
//     //         const response = await fetch('/api/user/upload-avatar', {
//     //             method: 'POST',
//     //             body: formData,
//     //         });

//     //         if (!response.ok) throw new Error('Upload failed');

//     //         const updatedUser = await response.json();

//     //         // This updates the user state globally
//     //         if (setUser) setUser(updatedUser);

//     //         setStatus('Upload successful!');
//     //         setImagePreview(null);
//     //         setSelectedFile(null);

//     //     } catch (error) {
//     //         console.error('Error uploading image:', error);
//     //         setStatus('Error uploading image.');
//     //     }
//     // };


//     // if (!user) {
//     //     return (
//     //         <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
//     //             <p>Loading your profile...</p>
//     //         </div>
//     //     );
//     // }

//     // Handle the upload process by calling the API service
//     const handleUpload = async () => {
//         if (!selectedFile) {
//             setStatus('Please select a file first.');
//             return;
//         }

//         setStatus('Uploading...');

//         try {
//             // All the complex fetch logic is now hidden in the service
//             const responseUser = await userApiService.uploadAvatar(selectedFile);

//             // Create a new user object merging the existing one with the response
//             const updatedUser = { ...user, ...responseUser };

//             // Update the global user state with the full user object from the API
//             if (setUser) setUser(updatedUser);

//             setStatus('Upload successful!');
//             setImagePreview(null);
//             setSelectedFile(null);

//         } catch (error) {
//             console.error('Error uploading image:', error);
//             setStatus(error instanceof Error ? error.message : 'Error uploading image.');
//         }
//     };

//     // Loading state while user data is being fetched
//     if (!user) {
//         return (
//             <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
//                 <p>Loading your profile...</p>
//             </div>
//         );
//     }

//     const formattedRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A';



//     return (
//         <>
//             <Header />
//             <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//                 <div className="max-w-4xl mx-auto">
//                     <h1 className="text-4xl font-bold mb-8">My Account</h1>
//                     <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">

//                         {/* MODIFICATION 3: The Profile Header now includes the upload UI */}
//                         <div className="p-8 bg-slate-800/50 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">

//                             {/* The image and upload controls are here */}
//                             <div className="flex-shrink-0">
//                                 <img
//                                     src={imagePreview || user.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff`}
//                                     alt="Profile"
//                                     className="h-24 w-24 rounded-full object-cover border-4 border-slate-700"
//                                 />
//                             </div>

//                             <div className="flex-grow text-center sm:text-left">
//                                 <h2 className="text-3xl font-bold">{user.name}</h2>
//                                 <p className="text-slate-300">{user.email}</p>

//                                 {/* File Input and Upload Button */}
//                                 <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
//                                     <input
//                                         type="file"
//                                         id="file-upload"
//                                         accept="image/png, image/jpeg"
//                                         onChange={handleImageChange}
//                                         className="hidden" // The input is hidden and triggered by the label
//                                     />
//                                     <label
//                                         htmlFor="file-upload"
//                                         className="cursor-pointer w-full sm:w-auto text-center px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-md transition"
//                                     >
//                                         Choose File
//                                     </label>

//                                     {selectedFile && (
//                                         <button
//                                             onClick={handleUpload}
//                                             className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md font-semibold transition"
//                                         >
//                                             Upload Picture
//                                         </button>
//                                     )}
//                                 </div>
//                                 {status && <p className="mt-2 text-sm text-center sm:text-left">{status}</p>}
//                             </div>
//                         </div>

//                         {/* Profile Details Section (This remains the same) */}
//                         <div className="p-8">
//                             <h3 className="text-xl font-semibold text-slate-200 mb-4">Personal Information</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
//                                 <ProfileDetail icon={User} label="Full Name" value={user.name} />
//                                 <ProfileDetail icon={Mail} label="Email Address" value={user.email} />
//                                 <ProfileDetail icon={Phone} label="Phone Number" value={user.phone} />
//                                 <ProfileDetail icon={Users} label="Role" value={formattedRole} />
//                             </div>
//                         </div>

//                         {/* Action Buttons Section */}
//                         <div className="p-6 bg-slate-900/50 border-t border-slate-700 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
//                             <button className="flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition">
//                                 <Edit className="h-5 w-5 mr-2" />
//                                 Edit Profile
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </>
//     );
// }

// 'use client';

// import { useEffect } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { User, Mail, Phone, Cake, Users, LogOut, Edit } from 'lucide-react';
// import Header from '@/components/common/Header';
// // import Header from './Header'; // This import is UNTOUCHED, as you requested.

// // This is a helper component to display each piece of user information consistently.
// const ProfileDetail = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
//     <div className="flex items-start py-4 border-b border-slate-700 last-border-b-0">
//         <Icon className="h-6 w-6 text-slate-400 mt-1 mr-4 flex-shrink-0" />
//         <div className="flex-grow">
//             <p className="text-sm text-slate-400">{label}</p>
//             <p className="text-lg text-white font-medium">{value || 'Not provided'}</p>
//         </div>
//     </div>
// );

// export default function AccountPage() {
//     const { user, logout } = useAppContext();

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             if (!user) {
//                 window.location.replace('/');
//             }
//         }, 100);
//         return () => clearTimeout(timer);
//     }, [user]);

//     const handleLogout = () => {
//         logout();
//         window.location.replace('/');
//     };

//     if (!user) {
//         return (
//             <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
//                 <p>Loading your profile...</p>
//             </div>
//         );
//     }

//     const formattedRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A';
//     // Your commented-out lines are UNTOUCHED.
//     // const formattedGender = user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A';
//     // const formattedDob = user.dob ? new Date(user.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

//     return (
//         <>
//             <Header />
//             <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//                 <div className="max-w-4xl mx-auto">
//                     <h1 className="text-4xl font-bold mb-8">My Account</h1>
//                     <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
//                         {/* Profile Header Section */}
//                         <div className="p-8 bg-slate-800/50 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
//                             {/* <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold flex-shrink-0">
//                                 {user.name ? user.name.charAt(0).toUpperCase() : '?'}
//                             </div> */}
//                             <div className="text-center sm:text-left">
//                                 {/* <h2 className="text-3xl font-bold">{user.name}</h2> */}
//                                 {/* CHANGE 1: The redundant email is confirmed removed as you requested. */}
//                                 {/* <p className="text-slate-300">{user.email}</p> */}
//                             </div>
//                         </div>

//                         {/* Profile Details Section */}
//                         <div className="p-8">
//                             <h3 className="text-xl font-semibold text-slate-200 mb-4">Personal Information</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
//                                 <ProfileDetail icon={User} label="Full Name" value={user.name} />
//                                 <ProfileDetail icon={Mail} label="Email Address" value={user.email} />

//                                 {/* CHANGE 2: The phone number is now shown as you requested. */}
//                                 <ProfileDetail icon={Phone} label="Phone Number" value={user.phone} />

//                                 {/* Your other commented-out lines are UNTOUCHED. */}
//                                 {/* <ProfileDetail icon={Cake} label="Date of Birth" value={formattedDob} />
//                                 <ProfileDetail icon={Users} label="Gender" value={formattedGender} /> */}
//                                 <ProfileDetail icon={Users} label="Role" value={formattedRole} />
//                             </div>
//                         </div>

//                         {/* Action Buttons Section (Unchanged) */}
//                         <div className="p-6 bg-slate-900/50 border-t border-slate-700 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
//                             {/* <button onClick={handleLogout} className="flex items-center justify-center px-6 py-3 border-2 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-semibold shadow-lg transition">
//                                 <LogOut className="h-5 w-5 mr-2" />
//                                 Logout
//                             </button> */}
//                             <button className="flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition">
//                                 <Edit className="h-5 w-5 mr-2" />
//                                 Edit Profile
//                             </button>
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
// // import { User, Mail, Phone, Cake, Users, LogOut, Edit } from 'lucide-react';
// // import Header from '@/components/common/Header';


// // // This is a helper component to display each piece of user information consistently.
// // const ProfileDetail = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
// //     <div className="flex items-start py-4 border-b border-slate-700 last:border-b-0">
// //         <Icon className="h-6 w-6 text-slate-400 mt-1 mr-4 flex-shrink-0" />
// //         <div className="flex-grow">
// //             <p className="text-sm text-slate-400">{label}</p>
// //             <p className="text-lg text-white font-medium">{value || 'Not provided'}</p>
// //         </div>
// //     </div>
// // );

// // export default function AccountPage() {
// //     const { user, logout } = useAppContext();

// //     useEffect(() => {
// //         const timer = setTimeout(() => {
// //             if (!user) {
// //                 window.location.replace('/');
// //             }
// //         }, 100);
// //         return () => clearTimeout(timer);
// //     }, [user]);

// //     const handleLogout = () => {
// //         logout();
// //         window.location.replace('/');
// //     };

// //     if (!user) {
// //         return (
// //             <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
// //                 <p>Loading your profile...</p>
// //             </div>
// //         );
// //     }

// //     const formattedRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A';
// //     // Your commented-out lines remain untouched.
// //     // const formattedGender = user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A';
// //     // const formattedDob = user.dob ? new Date(user.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

// //     return (
// //         <>
// //             <Header />
// //             <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
// //                 <div className="max-w-4xl mx-auto">
// //                     <h1 className="text-4xl font-bold mb-8">My Account</h1>
// //                     <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
// //                         {/* Profile Header Section */}
// //                         <div className="p-8 bg-slate-800/50 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
// //                             <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold flex-shrink-0">
// //                                 {user.name ? user.name.charAt(0).toUpperCase() : '?'}
// //                             </div>
// //                             <div className="text-center sm:text-left">
// //                                 <h2 className="text-3xl font-bold">{user.name}</h2>
// //                             </div>
// //                         </div>

// //                         {/* Profile Details Section */}
// //                         <div className="p-8">
// //                             <h3 className="text-xl font-semibold text-slate-200 mb-4">Personal Information</h3>
// //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
// //                                 <ProfileDetail icon={User} label="Full Name" value={user.name} />
// //                                 <ProfileDetail icon={Mail} label="Email Address" value={user.email} />
// //                                 <ProfileDetail icon={Phone} label="Phone Number" value={user.phone} />
// //                                 {/* Your other commented-out lines are UNTOUCHED. */}
// //                                 {/* <ProfileDetail icon={Cake} label="Date of Birth" value={formattedDob} />
// //                                 <ProfileDetail icon={Users} label="Gender" value={formattedGender} /> */}
// //                                 <ProfileDetail icon={Users} label="Role" value={formattedRole} />
// //                             </div>
// //                         </div>

// //                         {/* Action Buttons Section */}
// //                         <div className="p-6 bg-slate-900/50 border-t border-slate-700 flex flex-row justify-end">
// //                             <button onClick={handleLogout} className="flex items-center justify-center px-6 py-3 border-2 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-semibold shadow-lg transition">
// //                                 <LogOut className="h-5 w-5 mr-2" />
// //                                 Logout
// //                             </button>
// //                             {/* The "Edit Profile" button has been removed from this section. */}
// //                         </div>
// //                     </div>
// //                 </div>
// //             </main>
// //         </>
// //     );
// // }

// // 'use client';

// // import { useEffect } from 'react';
// // import { useAppContext } from '../../context/AppContext';
// // import { User, Mail, Phone, Cake, Users, LogOut, Edit } from 'lucide-react';
// // import Header from '@/components/common/Header';
// // // CORRECTED IMPORT: This path works because of the new file structure.
// // // import Header from '../components/common/Header';

// // // This is a helper component to display each piece of user information consistently.
// // const ProfileDetail = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
// //     <div className="flex items-start py-4 border-b border-slate-700 last:border-b-0">
// //         <Icon className="h-6 w-6 text-slate-400 mt-1 mr-4 flex-shrink-0" />
// //         <div className="flex-grow">
// //             <p className="text-sm text-slate-400">{label}</p>
// //             <p className="text-lg text-white font-medium">{value || 'Not provided'}</p>
// //         </div>
// //     </div>
// // );

// // export default function AccountPage() {
// //     const { user, logout } = useAppContext();

// //     useEffect(() => {
// //         const timer = setTimeout(() => {
// //             if (!user) {
// //                 window.location.replace('/');
// //             }
// //         }, 100);
// //         return () => clearTimeout(timer);
// //     }, [user]);

// //     const handleLogout = () => {
// //         logout();
// //         window.location.replace('/');
// //     };

// //     if (!user) {
// //         return (
// //             <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
// //                 <p>Loading your profile...</p>
// //             </div>
// //         );
// //     }

// //     const formattedRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A';
// //     // const formattedGender = user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A';
// //     // const formattedDob = user.dob ? new Date(user.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

// //     return (
// //         <>
// //             <Header />
// //             <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
// //                 <div className="max-w-4xl mx-auto">
// //                     <h1 className="text-4xl font-bold mb-8">My Account</h1>
// //                     <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
// //                         <div className="p-8 bg-slate-800/50 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
// //                             <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold flex-shrink-0">
// //                                 {user.name ? user.name.charAt(0).toUpperCase() : '?'}
// //                             </div>
// //                             <div className="text-center sm:text-left">
// //                                 <h2 className="text-3xl font-bold">{user.name}</h2>
// //                                 <p className="text-slate-300">{user.email}</p>
// //                             </div>
// //                         </div>
// //                         <div className="p-8">
// //                             <h3 className="text-xl font-semibold text-slate-200 mb-4">Personal Information</h3>
// //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
// //                                 <ProfileDetail icon={User} label="Full Name" value={user.name} />
// //                                 <ProfileDetail icon={Mail} label="Email Address" value={user.email} />
// //                                 <ProfileDetail icon={Phone} label="Phone Number" value={user.phone} />
// //                                 {/* <ProfileDetail icon={Cake} label="Date of Birth" value={formattedDob} />
// //                                 <ProfileDetail icon={Users} label="Gender" value={formattedGender} /> */}
// //                                 <ProfileDetail icon={Users} label="Role" value={formattedRole} />
// //                             </div>
// //                         </div>
// //                         <div className="p-6 bg-slate-900/50 border-t border-slate-700 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
// //                             <button onClick={handleLogout} className="flex items-center justify-center px-6 py-3 border-2 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-semibold shadow-lg transition">
// //                                 <LogOut className="h-5 w-5 mr-2" />
// //                                 Logout
// //                             </button>
// //                             <button className="flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition">
// //                                 <Edit className="h-5 w-5 mr-2" />
// //                                 Edit Profile
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </main>
// //         </>
// //     );
// // }