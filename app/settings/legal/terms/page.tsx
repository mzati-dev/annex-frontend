// pages/legal/terms.tsx
import Header from '@/components/common/Header';

export default function TermsPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 border-b-2 border-slate-700 pb-4">
                        Terms of Service
                    </h1>
                    <div className="space-y-6 text-slate-300">
                        <p className="text-sm text-slate-500">Last updated: September 7, 2025</p>
                        <p>Welcome to Annex! These terms and conditions outline the rules and regulations for the use of our application. By accessing this app, we assume you accept these terms and conditions.</p>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">1. User Accounts</h2>
                            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">2. Intellectual Property</h2>
                            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Mzatinova and its licensors.</p>
                        </div>

                        <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-4 my-8">
                            <p className="font-bold text-yellow-300">⚠️ Disclaimer</p>
                            <p className="text-yellow-400">This is a template and not legal advice. I must consult with a legal professional to create a Terms of Service agreement appropriate for 0ur business.</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}