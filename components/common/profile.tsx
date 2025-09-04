// 'use client';

// import { useEffect } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import { User, Mail, Phone, Cake, Users, LogOut, Edit } from 'lucide-react';
// import Header from './Header'; // This import is UNTOUCHED, as you requested.

// // This is a helper component to display each piece of user information consistently.
// const ProfileDetail = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
//     <div className="flex items-start py-4 border-b border-slate-700 last:border-b-0">
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
//     // Your commented-out lines remain untouched.
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
//                             <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold flex-shrink-0">
//                                 {user.name ? user.name.charAt(0).toUpperCase() : '?'}
//                             </div>
//                             <div className="text-center sm:text-left">
//                                 <h2 className="text-3xl font-bold">{user.name}</h2>
//                             </div>
//                         </div>

//                         {/* Profile Details Section */}
//                         <div className="p-8">
//                             <h3 className="text-xl font-semibold text-slate-200 mb-4">Personal Information</h3>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
//                                 <ProfileDetail icon={User} label="Full Name" value={user.name} />
//                                 <ProfileDetail icon={Mail} label="Email Address" value={user.email} />
//                                 <ProfileDetail icon={Phone} label="Phone Number" value={user.phone} />
//                                 {/* Your other commented-out lines are UNTOUCHED. */}
//                                 {/* <ProfileDetail icon={Cake} label="Date of Birth" value={formattedDob} />
//                                 <ProfileDetail icon={Users} label="Gender" value={formattedGender} /> */}
//                                 <ProfileDetail icon={Users} label="Role" value={formattedRole} />
//                             </div>
//                         </div>

//                         {/* Action Buttons Section */}
//                         <div className="p-6 bg-slate-900/50 border-t border-slate-700 flex flex-row justify-end">
//                             <button onClick={handleLogout} className="flex items-center justify-center px-6 py-3 border-2 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-semibold shadow-lg transition">
//                                 <LogOut className="h-5 w-5 mr-2" />
//                                 Logout
//                             </button>
//                             {/* The "Edit Profile" button has been removed from this section. */}
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
// // import Header from './Header'; // This import is UNTOUCHED, as you requested.

// // // This is a helper component to display each piece of user information consistently.
// // const ProfileDetail = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
// //     <div className="flex items-start py-4 border-b border-slate-700 last-border-b-0">
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
// //     // Your commented-out lines are UNTOUCHED.
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
// //                                 {/* CHANGE 1: The redundant email is confirmed removed as you requested. */}
// //                                 {/* <p className="text-slate-300">{user.email}</p> */}
// //                             </div>
// //                         </div>

// //                         {/* Profile Details Section */}
// //                         <div className="p-8">
// //                             <h3 className="text-xl font-semibold text-slate-200 mb-4">Personal Information</h3>
// //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
// //                                 <ProfileDetail icon={User} label="Full Name" value={user.name} />
// //                                 <ProfileDetail icon={Mail} label="Email Address" value={user.email} />

// //                                 {/* CHANGE 2: The phone number is now shown as you requested. */}
// //                                 <ProfileDetail icon={Phone} label="Phone Number" value={user.phone} />

// //                                 {/* Your other commented-out lines are UNTOUCHED. */}
// //                                 {/* <ProfileDetail icon={Cake} label="Date of Birth" value={formattedDob} />
// //                                 <ProfileDetail icon={Users} label="Gender" value={formattedGender} /> */}
// //                                 <ProfileDetail icon={Users} label="Role" value={formattedRole} />
// //                             </div>
// //                         </div>

// //                         {/* Action Buttons Section (Unchanged) */}
// //                         <div className="p-6 bg-slate-900/50 border-t border-slate-700 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
// //                             <button onClick={handleLogout} className="flex items-center justify-center px-6 py-3 border-2 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-semibold shadow-lg transition">
// //                                 <LogOut className="h-5 w-5 mr-2" />
// //                                 Logout
// //                             </button>
// //                             {/* <button className="flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition">
// //                                 <Edit className="h-5 w-5 mr-2" />
// //                                 Edit Profile
// //                             </button> */}
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
// // import Header from './Header';


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

// //     // This effect acts as a guard. If no user is logged in, it redirects to the homepage.
// //     useEffect(() => {
// //         // A small delay can prevent redirecting before the context has a chance to load the user.
// //         const timer = setTimeout(() => {
// //             if (!user) {
// //                 window.location.replace('/');
// //             }
// //         }, 100); // 100ms delay

// //         return () => clearTimeout(timer);
// //     }, [user]);

// //     const handleLogout = () => {
// //         logout();
// //         window.location.replace('/');
// //     };

// //     // While the user object is being loaded from context, show a loading state.
// //     // This also prevents the page from flashing before the redirect happens.
// //     if (!user) {
// //         return (
// //             <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
// //                 <p>Loading your profile...</p>
// //             </div>
// //         );
// //     }

// //     // Safely format user data for display, providing fallbacks.
// //     const formattedRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A';
// //     // const formattedGender = user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'N/A';
// //     // const formattedDob = user.dob ? new Date(user.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

// //     return (
// //         // Use a React Fragment <> to render the Header and the page content together.
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
// //                                 {/* <p className="text-slate-300">{user.email}</p> */}
// //                             </div>
// //                         </div>

// //                         {/* Profile Details Section */}
// //                         <div className="p-8">
// //                             <h3 className="text-xl font-semibold text-slate-200 mb-4">Personal Information</h3>
// //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
// //                                 <ProfileDetail icon={User} label="Full Name" value={user.name} />
// //                                 <ProfileDetail icon={Mail} label="Email Address" value={user.email} />
// //                                 {/* <ProfileDetail icon={Phone} label="Phone Number" value={user.phone} /> */}
// //                                 {/* <ProfileDetail icon={Cake} label="Date of Birth" value={formattedDob} />
// //                                <ProfileDetail icon={Users} label="Gender" value={formattedGender} /> */}
// //                                 <ProfileDetail icon={Users} label="Role" value={formattedRole} />
// //                             </div>
// //                         </div>

// //                         {/* Action Buttons Section */}
// //                         <div className="p-6 bg-slate-900/50 border-t border-slate-700 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
// //                             <button
// //                                 onClick={handleLogout}
// //                                 className="flex items-center justify-center px-6 py-3 border-2 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg font-semibold shadow-lg transition"
// //                             >
// //                                 <LogOut className="h-5 w-5 mr-2" />
// //                                 Logout
// //                             </button>
// //                             <button
// //                                 // This button can be wired up to a modal or new page later.
// //                                 className="flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition"
// //                             >
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

