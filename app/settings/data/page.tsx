// pages/settings/data.tsx
'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import { Download, Loader2 } from 'lucide-react';
import { userApiService } from '@/services/api/api';
// ✅ 1. Import the userApiService you created
// import { userApiService } from '@/services/api/user-api.service';

export default function ManageDataPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDownload = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // ✅ 2. Call your new service method instead of the old 'fetch'
            const response = await userApiService.downloadUserData();

            // The rest of your logic below is already correct and does not need to be changed.

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'my-data.json';
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Manage Your Data</h1>
                    <p className="text-slate-400 mb-8">
                        You have the right to access your personal information. Click the button below to download an archive of all data associated with your account.
                    </p>

                    <button
                        onClick={handleDownload}
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-3 px-5 rounded-md transition flex items-center justify-center disabled:bg-slate-500 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Preparing your data...
                            </>
                        ) : (
                            <>
                                <Download className="h-5 w-5 mr-2" />
                                Download My Data Archive
                            </>
                        )}
                    </button>
                    {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                </div>
            </main>
        </>
    );
}



// // pages/settings/data.tsx
// 'use client';

// import { useState } from 'react';
// import Header from '@/components/common/Header';
// import { Download, Loader2 } from 'lucide-react';

// export default function ManageDataPage() {
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const handleDownload = async () => {
//         setIsLoading(true);
//         setError(null);

//         try {
//             // Call your backend API endpoint
//             const response = await fetch('/api/user/download-data');

//             if (!response.ok) {
//                 throw new Error('Failed to download data. Please try again later.');
//             }

//             // Create a blob from the JSON response
//             const blob = await response.blob();
//             // Create a temporary URL to trigger the download
//             const url = window.URL.createObjectURL(blob);

//             const a = document.createElement('a');
//             a.href = url;
//             a.download = 'my-data.json'; // The default filename for the download
//             document.body.appendChild(a);
//             a.click();

//             // Clean up by removing the temporary link and URL
//             a.remove();
//             window.URL.revokeObjectURL(url);

//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <>
//             <Header />
//             <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
//                 <div className="max-w-2xl mx-auto">
//                     <h1 className="text-4xl font-bold mb-4">Manage Your Data</h1>
//                     <p className="text-slate-400 mb-8">
//                         You have the right to access your personal information. Click the button below to download an archive of all data associated with your account.
//                     </p>

//                     <button
//                         onClick={handleDownload}
//                         disabled={isLoading}
//                         className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-3 px-5 rounded-md transition flex items-center justify-center disabled:bg-slate-500 disabled:cursor-not-allowed"
//                     >
//                         {isLoading ? (
//                             <>
//                                 <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                                 Preparing your data...
//                             </>
//                         ) : (
//                             <>
//                                 <Download className="h-5 w-5 mr-2" />
//                                 Download My Data Archive
//                             </>
//                         )}
//                     </button>
//                     {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
//                 </div>
//             </main>
//         </>
//     );
// }