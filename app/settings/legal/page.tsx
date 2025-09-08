// pages/legal/index.tsx
import Header from '@/components/common/Header';
import Link from 'next/link';
import { FileText, Shield } from 'lucide-react';

export default function LegalHubPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 border-b-2 border-slate-700 pb-4">
                        Legal Information
                    </h1>
                    <p className="text-lg text-slate-300 mb-8">
                        Here you can find important legal documents that govern your use of our service. Please read them carefully.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link href="/settings/legal/terms" className="block p-6 bg-slate-800 hover:bg-slate-700/50 rounded-lg border border-slate-700 transition">
                            <FileText className="h-8 w-8 text-blue-400 mb-3" />
                            <h2 className="text-xl font-bold text-white">Terms of Service</h2>
                            <p className="text-slate-400 mt-2">The rules and guidelines for using our application.</p>
                        </Link>
                        <Link href="/settings/legal/privacy" className="block p-6 bg-slate-800 hover:bg-slate-700/50 rounded-lg border border-slate-700 transition">
                            <Shield className="h-8 w-8 text-blue-400 mb-3" />
                            <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
                            <p className="text-slate-400 mt-2">How we collect, use, and protect your data.</p>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}