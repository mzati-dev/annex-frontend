'use client';

import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
// import Header from '../components/common/Header';
// Added new icons for the new settings
import { Bell, ShieldCheck, ChevronRight, UserCircle, CreditCard, Palette, Globe } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/common/Header';

// A new component to create titled sections for better organization
const SettingsCategory = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h2 className="text-xl font-bold mb-4 border-l-4 border-blue-500 pl-3">{title}</h2>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

// Reusable component for each setting item (Unchanged)
const SettingItem = ({ icon: Icon, title, description, href }: { icon: React.ElementType, title: string, description: string, href: string }) => (
    <Link
        href={href}
        className="flex items-center w-full text-left p-4 bg-slate-800 hover:bg-slate-700/50 transition-colors rounded-lg border border-slate-700/50"
    >
        <div className="p-3 bg-slate-700 rounded-full mr-4">
            <Icon className="h-6 w-6 text-blue-400" />
        </div>
        <div className="flex-grow">
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-500" />
    </Link>
);

export default function SettingsPage() {
    const { user } = useAppContext();

    // Security Guard: Redirects if user is not logged in.
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) {
                window.location.replace('/');
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <p>Loading settings...</p>
            </div>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-10">Settings</h1>
                    <>
                        <div className="space-y-12">
                            {/* Account Settings */}
                            <SettingsCategory title="Account">
                                <SettingItem
                                    icon={UserCircle}
                                    title="Edit Profile"
                                    description="Update your name, bio, and personal information."
                                    href="/account" // Links to the existing account page
                                />
                                <SettingItem
                                    icon={ShieldCheck}
                                    title="Password & Security"
                                    description="Change your password and manage account security."
                                    href="/settings/security"
                                />
                            </SettingsCategory>

                            {/* Teacher-Only Settings */}
                            {user.role === 'teacher' && (
                                <SettingsCategory title="Payments">
                                    <SettingItem
                                        icon={CreditCard}
                                        title="Payout Details"
                                        description="Manage your bank or mobile money details for receiving payments."
                                        href="/settings/payouts"
                                    />
                                </SettingsCategory>
                            )}

                            {/* Application Settings */}
                            <SettingsCategory title="Application">
                                <SettingItem
                                    icon={Bell}
                                    title="Notifications"
                                    description="Manage your email and push notification preferences."
                                    href="/settings/notifications"
                                />
                                <SettingItem
                                    icon={Palette}
                                    title="Theme & Appearance"
                                    description="Customize the look and feel of the application."
                                    href="/settings/appearance"
                                />
                                <SettingItem
                                    icon={Globe}
                                    title="Language & Region"
                                    description="Set your preferred language and region."
                                    href="/settings/language"
                                />
                            </SettingsCategory>
                        </div>
                    </>
                </div>
            </main>
        </>
    );
}



// 'use client';

// import { useEffect } from 'react';
// import { useAppContext } from '../../context/AppContext';
// // import Header from '../components/common/Header';
// import { Bell, ShieldCheck, ChevronRight } from 'lucide-react';
// import Header from '@/components/common/Header';

// // Reusable component for each setting item
// const SettingItem = ({ icon: Icon, title, description, onClick }: { icon: React.ElementType, title: string, description: string, onClick?: () => void }) => (
//     <button
//         onClick={onClick}
//         className="flex items-center w-full text-left p-4 bg-slate-800 hover:bg-slate-700/50 transition-colors rounded-lg"
//     >
//         <div className="p-3 bg-slate-700 rounded-full mr-4">
//             <Icon className="h-6 w-6 text-blue-400" />
//         </div>
//         <div className="flex-grow">
//             <h3 className="font-semibold text-white">{title}</h3>
//             <p className="text-sm text-slate-400">{description}</p>
//         </div>
//         <ChevronRight className="h-5 w-5 text-slate-500" />
//     </button>
// );

// export default function SettingsPage() {
//     const { user } = useAppContext();

//     // Security Guard: Redirects if user is not logged in.
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             if (!user) {
//                 window.location.replace('/');
//             }
//         }, 100);
//         return () => clearTimeout(timer);
//     }, [user]);

//     // Show a loading state until the user context is confirmed.
//     if (!user) {
//         return (
//             <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
//                 <p>Loading settings...</p>
//             </div>
//         );
//     }

//     return (
//         <>
//             <Header />
//             <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//                 <div className="max-w-4xl mx-auto">
//                     <h1 className="text-4xl font-bold mb-8">Settings</h1>
//                     <div className="space-y-4">
//                         <SettingItem
//                             icon={ShieldCheck}
//                             title="Password & Security"
//                             description="Change your password and manage account security."
//                             onClick={() => alert('Navigate to password change page.')}
//                         />
//                         <SettingItem
//                             icon={Bell}
//                             title="Notifications"
//                             description="Manage your email and push notification preferences."
//                             onClick={() => alert('Navigate to notification settings.')}
//                         />
//                     </div>
//                 </div>
//             </main>
//         </>
//     );
// }
