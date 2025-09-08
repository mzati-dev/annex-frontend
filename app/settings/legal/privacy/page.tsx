// pages/legal/privacy.tsx
import Header from '@/components/common/Header';

export default function PrivacyPolicyPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 border-b-2 border-slate-700 pb-4">
                        Privacy Policy
                    </h1>
                    <div className="space-y-6 text-slate-300">
                        <p className="text-sm text-slate-500">Last updated: September 7, 2025</p>
                        <p>Your privacy is important to us. It is Annex's policy to respect your privacy regarding any information we may collect from you through our app.</p>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">1. Information We Collect</h2>
                            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. The types of information we collect include: name, email address, payment information, and user-generated content.</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">2. How We Use Your Information</h2>
                            <p>We use the information we collect in various ways, including to: provide, operate, and maintain our application; improve, personalize, and expand our application; understand and analyze how you use our application; and process your transactions.</p>
                        </div>

                        <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-4 my-8">
                            <p className="font-bold text-yellow-300">⚠️ Disclaimer</p>
                            <p className="text-yellow-400">This is a template and not legal advice. I must consult with a legal professional to draft a comprehensive Privacy Policy compliant with regulations like GDPR, CCPA, etc.</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}