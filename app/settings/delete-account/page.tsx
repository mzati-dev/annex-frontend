'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { userApiService } from '@/services/api/api';


export default function DeleteAccountPage() {
    const { user, logout } = useAppContext(); // Assuming logout is available from your context
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmation, setConfirmation] = useState('');

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. ✅ CONFIRMATION LOGIC NOW USES EMAIL
        if (confirmation !== user?.email) {
            setError(`Please type your email "${user?.email}" to confirm.`);
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            // Use your API service to make the call
            await userApiService.deleteAccount();

            // On success, log the user out and redirect
            if (logout) logout();
            window.location.replace('/');

        } catch (err: any) {
            setError(err.message || 'Failed to delete account.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (!user) {
        return <div className="min-h-screen bg-slate-900"></div>;
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Delete Account</h1>

                    <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-8 flex items-start space-x-3">
                        <AlertTriangle className="h-6 w-6 text-red-400 mt-1" />
                        <div>
                            <h2 className="font-bold text-lg text-red-300">This action is irreversible.</h2>
                            <p className="text-red-400 mt-1">
                                When you delete your account, all of your data will be permanently removed. This cannot be undone.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleDelete}>
                        {/* 2. ✅ LABEL AND DISPLAYED TEXT NOW USE EMAIL */}
                        <label htmlFor="confirmation" className="block font-semibold text-slate-300 mb-2">
                            To confirm, please type your email:
                            <span className="font-bold text-white ml-2">{user.email}</span>
                        </label>
                        <input
                            type="email"
                            id="confirmation"
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-md px-4 py-2 mb-6"
                            // 3. ✅ PLACEHOLDER NOW ASKS FOR EMAIL
                            placeholder="Type your email here"
                        />

                        <button
                            type="submit"
                            // 4. ✅ DISABLED LOGIC NOW USES EMAIL
                            disabled={isDeleting || confirmation !== user.email}
                            className="w-full bg-red-600 hover:bg-red-700 font-semibold py-3 px-5 rounded-md transition flex items-center justify-center disabled:bg-slate-500 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Deleting Account...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-5 w-5 mr-2" />
                                    Permanently Delete My Account
                                </>
                            )}
                        </button>
                        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                    </form>
                </div>
            </main>
        </>
    );
}


// // pages/settings/delete-account.tsx
// 'use client';

// import { useState } from 'react';
// import Header from '@/components/common/Header';
// import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
// import { useAppContext } from '@/context/AppContext';

// export default function DeleteAccountPage() {
//     const { user } = useAppContext();
//     const [isDeleting, setIsDeleting] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [confirmation, setConfirmation] = useState('');

//     const handleDelete = async (e: React.FormEvent) => {
//         e.preventDefault();

//         // This confirmation is a critical safety feature. It should be enabled.
//         // if (confirmation !== user?.username) {
//         //     setError(`Please type your username "${user?.username}" to confirm.`);
//         //     return;
//         // }

//         setIsDeleting(true);
//         setError(null);

//         try {
//             const response = await fetch('/api/user/delete-account', {
//                 method: 'DELETE',
//             });

//             if (!response.ok) {
//                 const data = await response.json();
//                 throw new Error(data.message || 'Failed to delete account.');
//             }

//             // On success, the session is destroyed. Redirect to the home page.
//             window.location.replace('/');

//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setIsDeleting(false);
//         }
//     };

//     if (!user) {
//         // You can add a proper loading component here
//         return <div className="min-h-screen bg-slate-900"></div>;
//     }

//     return (
//         <>
//             <Header />
//             <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//                 <div className="max-w-2xl mx-auto">
//                     <h1 className="text-4xl font-bold mb-4">Delete Account</h1>

//                     <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-8 flex items-start space-x-3">
//                         <AlertTriangle className="h-6 w-6 text-red-400 mt-1" />
//                         <div>
//                             <h2 className="font-bold text-lg text-red-300">This action is irreversible.</h2>
//                             <p className="text-red-400 mt-1">
//                                 When you delete your account, all of your data will be permanently removed. This cannot be undone.
//                             </p>
//                         </div>
//                     </div>

//                     <form onSubmit={handleDelete}>
//                         <label htmlFor="confirmation" className="block font-semibold text-slate-300 mb-2">
//                             To confirm, please type your username:
//                             {/* <span className="font-bold text-white">{user.username}</span> */}
//                         </label>
//                         <input
//                             type="text"
//                             id="confirmation"
//                             value={confirmation}
//                             onChange={(e) => setConfirmation(e.target.value)}
//                             className="w-full bg-slate-800 border border-slate-600 rounded-md px-4 py-2 mb-6"
//                             placeholder="Type username here"
//                         />

//                         <button
//                             type="submit"
//                             // disabled={isDeleting || confirmation !== user.username}
//                             className="w-full bg-red-600 hover:bg-red-700 font-semibold py-3 px-5 rounded-md transition flex items-center justify-center disabled:bg-slate-500 disabled:cursor-not-allowed"
//                         >
//                             {isDeleting ? (
//                                 <>
//                                     <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                                     Deleting Account...
//                                 </>
//                             ) : (
//                                 <>
//                                     <Trash2 className="h-5 w-5 mr-2" />
//                                     Permanently Delete My Account
//                                 </>
//                             )}
//                         </button>
//                         {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
//                     </form>
//                 </div>
//             </main>
//         </>
//     );
// }