'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import the router
import Header from '@/components/common/Header';
import { AuthApiService } from '@/services/auth.service';

export default function SecurityPage() {
    const router = useRouter(); // Initialize the router
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const authService = new AuthApiService();

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ message: '', type: '' });

        // Frontend validation
        if (newPassword !== confirmPassword) {
            setStatus({ message: "New passwords don't match.", type: 'error' });
            return;
        }
        if (newPassword.length < 8) {
            setStatus({ message: 'New password must be at least 8 characters.', type: 'error' });
            return;
        }

        setIsLoading(true); // Disable button
        try {
            await authService.changePassword({ currentPassword, newPassword });

            // --- THIS IS THE NEW SUCCESS LOGIC ---
            setStatus({ message: 'Password changed successfully! Redirecting...', type: 'success' });

            // Wait 2 seconds to allow the user to see the success message
            setTimeout(() => {
                router.push('/settings'); // Redirect to the main settings page
            }, 2000);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setStatus({ message: errorMessage, type: 'error' });
            setIsLoading(false); // Re-enable button on error
        }
    };

    const inputClasses = "w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Password & Security</h1>
                    <p className="text-slate-400 mb-8">Update your password here. Remember to choose a strong, unique password.</p>

                    <form onSubmit={handleChangePassword} className="space-y-6 bg-slate-800 p-8 rounded-lg border border-slate-700">
                        <div>
                            <label className="block mb-2 font-medium text-slate-300">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-slate-300">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-slate-300">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </div>

                        {status.message && (
                            <p className={`text-sm ${status.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                                {status.message}
                            </p>
                        )}

                        {/* --- THIS IS THE NEW BUTTONS SECTION --- */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                            <button
                                type="button" // Important: prevents form submission
                                onClick={() => router.push('/settings')}
                                className="w-full px-6 py-3 bg-slate-600 hover:bg-slate-500 rounded-lg font-semibold transition"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold shadow-lg transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Changing...' : 'Change Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}


// 'use client';

// import { useState } from 'react';
// import Header from '@/components/common/Header';
// import { AuthApiService } from '@/services/auth.service'; // Adjust path if needed

// export default function SecurityPage() {
//     const [currentPassword, setCurrentPassword] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [status, setStatus] = useState({ message: '', type: '' });
//     const authService = new AuthApiService();

//     const handleChangePassword = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setStatus({ message: '', type: '' });

//         // 1. Frontend validation
//         if (newPassword !== confirmPassword) {
//             setStatus({ message: "New passwords don't match.", type: 'error' });
//             return;
//         }
//         if (newPassword.length < 8) {
//             setStatus({ message: 'New password must be at least 8 characters.', type: 'error' });
//             return;
//         }

//         try {
//             // 2. Call the API service
//             await authService.changePassword({ currentPassword, newPassword });
//             setStatus({ message: 'Password changed successfully!', type: 'success' });
//             // Clear the form on success
//             setCurrentPassword('');
//             setNewPassword('');
//             setConfirmPassword('');
//         } catch (error) {
//             // 3. Handle errors from the backend
//             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
//             setStatus({ message: errorMessage, type: 'error' });
//         }
//     };

//     const inputClasses = "w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

//     return (
//         <>
//             <Header />
//             <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//                 <div className="max-w-2xl mx-auto">
//                     <h1 className="text-4xl font-bold mb-4">Password & Security</h1>
//                     <p className="text-slate-400 mb-8">Update your password here. Remember to choose a strong, unique password.</p>

//                     <form onSubmit={handleChangePassword} className="space-y-6 bg-slate-800 p-8 rounded-lg border border-slate-700">
//                         <div>
//                             <label className="block mb-2 font-medium text-slate-300">Current Password</label>
//                             <input
//                                 type="password"
//                                 value={currentPassword}
//                                 onChange={(e) => setCurrentPassword(e.target.value)}
//                                 className={inputClasses}
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label className="block mb-2 font-medium text-slate-300">New Password</label>
//                             <input
//                                 type="password"
//                                 value={newPassword}
//                                 onChange={(e) => setNewPassword(e.target.value)}
//                                 className={inputClasses}
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label className="block mb-2 font-medium text-slate-300">Confirm New Password</label>
//                             <input
//                                 type="password"
//                                 value={confirmPassword}
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 className={inputClasses}
//                                 required
//                             />
//                         </div>

//                         {status.message && (
//                             <p className={`text-sm ${status.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
//                                 {status.message}
//                             </p>
//                         )}

//                         <button
//                             type="submit"
//                             className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold shadow-lg transition"
//                         >
//                             Change Password
//                         </button>
//                     </form>
//                 </div>
//             </main>
//         </>
//     );
// }