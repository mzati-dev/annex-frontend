'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, GraduationCap, Briefcase, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { AuthApiService } from '@/services/auth.service';
import { UserProfile } from '@/types';

type AuthView = 'login' | 'signup' | 'forgotPassword' | 'none';
type SignupStage = 'role-selection' | 'form';

export default function App() {
    const [authView, setAuthView] = useState<AuthView>('none');
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        password: '',
        confirmPassword: ''
    });
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [forgotEmail, setForgotEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
    const [signupStage, setSignupStage] = useState<SignupStage>('role-selection');
    const [loading, setLoading] = useState(true);
    const [loginLoading, setLoginLoading] = useState(false);
    const { login, user } = useAppContext();
    const authService = new AuthApiService();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !user) {
            authService.getProfile()
                .then(profile => {
                    login(profile);
                    router.replace('/dashboard');
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setLoading(false);
                });
        } else if (user) {
            router.replace('/dashboard');
        } else {
            setLoading(false);
        }
    }, [user]);


    // Utility function to handle errors
    const getErrorMessage = (error: unknown): string => {
        if (error instanceof Error) return error.message;
        if (typeof error === 'string') return error;
        return 'An unexpected error occurred';
    };


    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (signupData.password !== signupData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        try {
            const response = await authService.register({
                ...signupData,
                role: selectedRole
            });

            // ✅ Go back to the login view instead of dashboard
            setAuthView('login');
            setSignupStage('role-selection');

            // Optionally clear signup form
            setSignupData({
                name: '',
                email: '',
                phone: '',
                dob: '',
                gender: '',
                password: '',
                confirmPassword: ''
            });

        } catch (error) {
            alert(getErrorMessage(error));
        }
    };


    // const handleSignupSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (signupData.password !== signupData.confirmPassword) {
    //         alert("Passwords don't match!");
    //         return;
    //     }

    //     try {
    //         const response = await authService.register({
    //             ...signupData,
    //             role: selectedRole
    //         });
    //         localStorage.setItem('token', response.token);
    //         login(response.user);
    //         router.replace('/dashboard'); // ✅ go straight to dashboard
    //     } catch (error) {
    //         alert(getErrorMessage(error));
    //     }
    // };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);
        try {
            const response = await authService.login(loginData.email, loginData.password);
            localStorage.setItem('token', response.token);
            login(response.user);
            router.replace('/dashboard'); // ✅ go straight to dashboard
        } catch (error) {
            alert(getErrorMessage(error));
        }
    };

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authService.forgotPassword(forgotEmail);
            alert(`Password reset link sent to ${forgotEmail}`);
            setAuthView('login');
        } catch (error) {
            alert(getErrorMessage(error));
        }
        finally {
            setLoginLoading(false);
        }
    };

    const sharedInputClasses = "w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

    const renderAuthContent = () => {
        switch (authView) {
            case 'forgotPassword':
                return (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-center mb-2 text-white">Reset Password</h2>
                        <p className="text-slate-300 text-center mb-6">Enter your email to receive instructions.</p>
                        <form onSubmit={handleForgotSubmit} className="space-y-4">
                            <input
                                type="email"
                                placeholder="Email"
                                value={forgotEmail}
                                onChange={e => setForgotEmail(e.target.value)}
                                className={sharedInputClasses}
                                required
                            />
                            <button type="submit" className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition">
                                Send Reset Link
                            </button>
                            <button
                                type="button"
                                onClick={() => setAuthView('login')}
                                className="w-full px-8 py-3 border-2 border-blue-500 hover:bg-blue-500/20 rounded-lg font-semibold shadow-lg transition"
                            >
                                Back to Login
                            </button>
                        </form>
                    </div>
                );
            case 'login':
                return (
                    <>
                        <div className="flex justify-center mb-6 border-b border-slate-700">
                            <button
                                onClick={() => setAuthView('login')}
                                className={`px-6 py-2 text-lg font-semibold transition-colors ${authView === 'login' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-300'}`}
                            >
                                Login
                            </button>
                            <button onClick={() => setAuthView('signup')}>Sign Up</button>
                        </div>
                        <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
                            <input
                                type="email"
                                placeholder="Email"
                                value={loginData.email}
                                onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                                className={sharedInputClasses}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                                className={sharedInputClasses}
                                required
                            />
                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={() => setAuthView('forgotPassword')}
                                    className="text-sm text-blue-400 hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            {/* <button type="submit" className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition">
                                Login
                            </button> */}
                            <button
                                type="submit"
                                className={`w-full px-8 py-3 rounded-lg font-semibold shadow-lg transition
        ${loginLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                disabled={loginLoading}
                            >
                                {loginLoading ? 'Logging in...' : 'Login'}
                            </button>

                        </form>
                    </>
                );
            case 'signup':
                if (signupStage === 'role-selection') {
                    return (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-center mb-6 text-white">Select Your Role</h2>
                            <div className="space-y-4 mb-6">
                                <label className="flex items-center space-x-3 p-4 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800 transition">
                                    <input
                                        type="radio"
                                        name="role"
                                        checked={selectedRole === 'student'}
                                        onChange={() => setSelectedRole('student')}
                                        className="h-5 w-5 text-blue-500"
                                    />
                                    <div className="flex items-center">
                                        <GraduationCap className="h-6 w-6 mr-2" />
                                        <span className="font-medium">Student</span>
                                    </div>
                                </label>
                                <label className="flex items-center space-x-3 p-4 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800 transition">
                                    <input
                                        type="radio"
                                        name="role"
                                        checked={selectedRole === 'teacher'}
                                        onChange={() => setSelectedRole('teacher')}
                                        className="h-5 w-5 text-blue-500"
                                    />
                                    <div className="flex items-center">
                                        <Briefcase className="h-6 w-6 mr-2" />
                                        <span className="font-medium">Teacher</span>
                                    </div>
                                </label>
                            </div>
                            <button
                                onClick={() => setSignupStage('form')}
                                className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition"
                            >
                                Continue
                            </button>
                        </div>
                    );
                } else {
                    return (
                        <div className="flex flex-col h-full">
                            <div className="flex justify-center mb-4 border-b border-slate-700">
                                <button onClick={() => setAuthView('login')}>Login</button>
                                <button
                                    onClick={() => setAuthView('signup')}
                                    className={`px-6 py-2 text-lg font-semibold transition-colors ${authView === 'signup' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-300'}`}
                                >
                                    Sign Up
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <form onSubmit={handleSignupSubmit} className="space-y-4 pb-4">
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={signupData.name}
                                        onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                                        className={sharedInputClasses}
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={signupData.email}
                                        onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                                        className={sharedInputClasses}
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={signupData.phone}
                                        onChange={e => setSignupData({ ...signupData, phone: e.target.value })}
                                        className={sharedInputClasses}
                                        required
                                    />
                                    <input
                                        type="date"
                                        value={signupData.dob}
                                        onChange={e => setSignupData({ ...signupData, dob: e.target.value })}
                                        className={sharedInputClasses}
                                        required
                                    />
                                    <select
                                        value={signupData.gender}
                                        onChange={e => setSignupData({ ...signupData, gender: e.target.value })}
                                        className={sharedInputClasses}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                    </select>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={signupData.password}
                                        onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                                        className={sharedInputClasses}
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={signupData.confirmPassword}
                                        onChange={e => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                        className={sharedInputClasses}
                                        required
                                    />
                                </form>
                            </div>
                            <button
                                type="submit"
                                onClick={handleSignupSubmit}
                                className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition mt-4"
                            >
                                Create Account
                            </button>
                        </div>
                    );
                }
            default:
                return null;
        }
    };

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 text-white">
            <h1 className="text-5xl font-extrabold mb-6 text-center drop-shadow-lg">
                Welcome to <span className="text-blue-400">Annex</span>
            </h1>
            <span className="font-bold text-blue-300">Your knowledge marketplace</span>
            <p className="max-w-xl text-center text-lg mb-10 leading-relaxed drop-shadow-md text-slate-300">

                Annex is the marketplace where students unlock knowledge and educators turn expertise into impact, from secondary school to university and beyond.
            </p>

            <div className="flex space-x-6">
                <button
                    onClick={() => setAuthView('login')}
                    className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition"
                >
                    Log In
                </button>
                <button
                    onClick={() => {
                        setAuthView('signup');
                        setSignupStage('role-selection');
                    }}
                    className="px-8 py-3 border-2 border-blue-500 hover:bg-blue-500 hover:text-white rounded-lg font-semibold shadow-lg transition"
                >
                    Sign Up
                </button>
            </div>

            {authView !== 'none' && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <div className="relative w-full max-w-md bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl p-6 animate-fade-in max-h-[90vh] flex flex-col">
                        <button
                            onClick={() => {
                                setAuthView('none');
                                setSignupStage('role-selection');
                            }}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Close"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="text-center mb-4">
                            <BookOpen className="h-10 w-10 text-blue-400 mx-auto mb-2" />
                            <h1 className="text-2xl font-bold">Annex</h1>
                            <p className="text-slate-300 text-sm">Your knowledge marketplace</p>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {renderAuthContent()}
                        </div>
                    </div>
                </div>
            )}

            <footer className="mt-20 text-sm text-slate-400 opacity-80">
                © {new Date().getFullYear()} Annex. All rights reserved.
            </footer>
        </main>
    );
}


// 'use client';

// import { useState } from 'react';
// import { BookOpen, GraduationCap, Briefcase, X } from 'lucide-react';
// import { useAppContext } from '@/context/AppContext';
// import { UserProfile } from '@/types';
// import { AuthApiService } from '@/services/auth.service';

// type AuthView = 'login' | 'signup' | 'forgotPassword' | 'none';
// type SignupStage = 'role-selection' | 'form';

// export default function App() {
//     const [authView, setAuthView] = useState<AuthView>('none');
//     const [signupData, setSignupData] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         dob: '',
//         gender: '',
//         password: '',
//         confirmPassword: ''
//     });
//     const [loginData, setLoginData] = useState({ email: '', password: '' });
//     const [forgotEmail, setForgotEmail] = useState('');
//     const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
//     const [signupStage, setSignupStage] = useState<SignupStage>('role-selection');
//     const { login } = useAppContext();
//     const authService = new AuthApiService();

//     // const handleSignupSubmit = (e: React.FormEvent) => {
//     //     e.preventDefault();
//     //     if (signupData.password !== signupData.confirmPassword) {
//     //         alert("Passwords don't match!");
//     //         return;
//     //     }
//     //     console.log('Registered:', { ...signupData, role: selectedRole });
//     //     localStorage.setItem('userData', JSON.stringify({
//     //         ...signupData,
//     //         role: selectedRole
//     //     }));
//     //     setAuthView('login');
//     //     setSignupStage('role-selection');
//     // };

//     // Utility function to handle errors
//     const getErrorMessage = (error: unknown): string => {
//         if (error instanceof Error) return error.message;
//         if (typeof error === 'string') return error;
//         return 'An unexpected error occurred';
//     };

//     const handleSignupSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (signupData.password !== signupData.confirmPassword) {
//             alert("Passwords don't match!");
//             return;
//         }

//         try {
//             const response = await authService.register({
//                 ...signupData,
//                 role: selectedRole
//             });
//             localStorage.setItem('token', response.token);
//             login(response.user);
//             setAuthView('none');
//         } catch (error) {
//             alert(getErrorMessage(error));
//         }
//     };

//     // const handleLoginSubmit = (e: React.FormEvent) => {
//     //     e.preventDefault();
//     //     const storedUser = localStorage.getItem('userData');
//     //     let user: UserProfile;

//     //     if (storedUser) {
//     //         const { name, email, role } = JSON.parse(storedUser);
//     //         user = {
//     //             id: 'u' + Date.now(),
//     //             name,
//     //             email,
//     //             role
//     //         };
//     //     } else {
//     //         user = {
//     //             id: 'u' + Date.now(),
//     //             name: 'Demo User',
//     //             email: loginData.email,
//     //             role: selectedRole
//     //         };
//     //     }

//     //     login(user);
//     // };


//     const handleLoginSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             const response = await authService.login(loginData.email, loginData.password);
//             console.log("Login successful, response:", response);
//             localStorage.setItem('token', response.token);
//             login(response.user);
//             setAuthView('none');
//         } catch (error) {
//             alert(getErrorMessage(error));
//         }
//     };


//     // const handleForgotSubmit = (e: React.FormEvent) => {
//     //     e.preventDefault();
//     //     console.log(`Password reset link sent to ${forgotEmail}`);
//     //     setAuthView('login');
//     // };

//     const handleForgotSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             await authService.forgotPassword(forgotEmail);
//             alert(`Password reset link sent to ${forgotEmail}`);
//             setAuthView('login');
//         } catch (error) {
//             alert(getErrorMessage(error));
//         }
//     };

//     const sharedInputClasses = "w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

//     const renderAuthContent = () => {
//         switch (authView) {
//             case 'forgotPassword':
//                 return (
//                     <div className="animate-fade-in">
//                         <h2 className="text-2xl font-bold text-center mb-2 text-white">Reset Password</h2>
//                         <p className="text-slate-300 text-center mb-6">Enter your email to receive instructions.</p>
//                         <form onSubmit={handleForgotSubmit} className="space-y-4">
//                             <input
//                                 type="email"
//                                 placeholder="Email"
//                                 value={forgotEmail}
//                                 onChange={e => setForgotEmail(e.target.value)}
//                                 className={sharedInputClasses}
//                                 required
//                             />
//                             <button
//                                 type="submit"
//                                 className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition"
//                             >
//                                 Send Reset Link
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={() => setAuthView('login')}
//                                 className="w-full px-8 py-3 border-2 border-blue-500 hover:bg-blue-500/20 rounded-lg font-semibold shadow-lg transition"
//                             >
//                                 Back to Login
//                             </button>
//                         </form>
//                     </div>
//                 );
//             case 'login':
//                 return (
//                     <>
//                         <div className="flex justify-center mb-6 border-b border-slate-700">
//                             <button
//                                 onClick={() => setAuthView('login')}
//                                 className={`px-6 py-2 text-lg font-semibold transition-colors ${authView === 'login' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-300'}`}
//                             >
//                                 Login
//                             </button>
//                             <button
//                                 onClick={() => setAuthView('signup')}
//                             // className={`px-6 py-2 text-lg font-semibold transition-colors ${authView === 'signup' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-300'}`}
//                             >
//                                 Sign Up
//                             </button>
//                         </div>
//                         <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
//                             <input
//                                 type="email"
//                                 placeholder="Email"
//                                 value={loginData.email}
//                                 onChange={e => setLoginData({ ...loginData, email: e.target.value })}
//                                 className={sharedInputClasses}
//                                 required
//                             />
//                             <input
//                                 type="password"
//                                 placeholder="Password"
//                                 value={loginData.password}
//                                 onChange={e => setLoginData({ ...loginData, password: e.target.value })}
//                                 className={sharedInputClasses}
//                                 required
//                             />
//                             <div className="text-right">
//                                 <button
//                                     type="button"
//                                     onClick={() => setAuthView('forgotPassword')}
//                                     className="text-sm text-blue-400 hover:underline"
//                                 >
//                                     Forgot Password?
//                                 </button>
//                             </div>
//                             <button
//                                 type="submit"
//                                 className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition"
//                             >
//                                 Login
//                             </button>
//                         </form>
//                     </>
//                 );
//             case 'signup':
//                 if (signupStage === 'role-selection') {
//                     return (
//                         <div className="animate-fade-in">
//                             <h2 className="text-2xl font-bold text-center mb-6 text-white">Select Your Role</h2>
//                             <div className="space-y-4 mb-6">
//                                 <label className="flex items-center space-x-3 p-4 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800 transition">
//                                     <input
//                                         type="radio"
//                                         name="role"
//                                         checked={selectedRole === 'student'}
//                                         onChange={() => setSelectedRole('student')}
//                                         className="h-5 w-5 text-blue-500"
//                                     />
//                                     <div className="flex items-center">
//                                         <GraduationCap className="h-6 w-6 mr-2" />
//                                         <span className="font-medium">Student</span>
//                                     </div>
//                                 </label>
//                                 <label className="flex items-center space-x-3 p-4 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800 transition">
//                                     <input
//                                         type="radio"
//                                         name="role"
//                                         checked={selectedRole === 'teacher'}
//                                         onChange={() => setSelectedRole('teacher')}
//                                         className="h-5 w-5 text-blue-500"
//                                     />
//                                     <div className="flex items-center">
//                                         <Briefcase className="h-6 w-6 mr-2" />
//                                         <span className="font-medium">Teacher</span>
//                                     </div>
//                                 </label>
//                             </div>
//                             <button
//                                 onClick={() => setSignupStage('form')}
//                                 className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition"
//                             >
//                                 Continue
//                             </button>
//                         </div>
//                     );
//                 } else {
//                     return (
//                         <div className="flex flex-col h-full">
//                             <div className="flex justify-center mb-4 border-b border-slate-700">
//                                 <button
//                                     onClick={() => setAuthView('login')}
//                                 // className={`px-6 py-2 text-lg font-semibold transition-colors ${authView === 'login' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-300'}`}
//                                 >
//                                     Login
//                                 </button>
//                                 <button
//                                     onClick={() => setAuthView('signup')}
//                                     className={`px-6 py-2 text-lg font-semibold transition-colors ${authView === 'signup' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-300'}`}
//                                 >
//                                     Sign Up
//                                 </button>
//                             </div>
//                             <div className="flex-1 overflow-y-auto">
//                                 <form onSubmit={handleSignupSubmit} className="space-y-4 pb-4">
//                                     <input
//                                         type="text"
//                                         placeholder="Full Name"
//                                         value={signupData.name}
//                                         onChange={e => setSignupData({ ...signupData, name: e.target.value })}
//                                         className={sharedInputClasses}
//                                         required
//                                     />
//                                     <input
//                                         type="email"
//                                         placeholder="Email"
//                                         value={signupData.email}
//                                         onChange={e => setSignupData({ ...signupData, email: e.target.value })}
//                                         className={sharedInputClasses}
//                                         required
//                                     />
//                                     <input
//                                         type="tel"
//                                         placeholder="Phone Number"
//                                         value={signupData.phone}
//                                         onChange={e => setSignupData({ ...signupData, phone: e.target.value })}
//                                         className={sharedInputClasses}
//                                         required
//                                     />
//                                     <input
//                                         type="date"
//                                         placeholder="Date of Birth"
//                                         value={signupData.dob}
//                                         onChange={e => setSignupData({ ...signupData, dob: e.target.value })}
//                                         className={sharedInputClasses}
//                                         required
//                                     />
//                                     <select
//                                         value={signupData.gender}
//                                         onChange={e => setSignupData({ ...signupData, gender: e.target.value })}
//                                         className={sharedInputClasses}
//                                         required
//                                     >
//                                         <option value="">Select Gender</option>
//                                         <option value="male">Male</option>
//                                         <option value="female">Female</option>
//                                         <option value="other">Other</option>
//                                         <option value="prefer-not-to-say">Prefer not to say</option>
//                                     </select>
//                                     <input
//                                         type="password"
//                                         placeholder="Password"
//                                         value={signupData.password}
//                                         onChange={e => setSignupData({ ...signupData, password: e.target.value })}
//                                         className={sharedInputClasses}
//                                         required
//                                     />
//                                     <input
//                                         type="password"
//                                         placeholder="Confirm Password"
//                                         value={signupData.confirmPassword}
//                                         onChange={e => setSignupData({ ...signupData, confirmPassword: e.target.value })}
//                                         className={sharedInputClasses}
//                                         required
//                                     />
//                                 </form>
//                             </div>
//                             <button
//                                 type="submit"
//                                 onClick={handleSignupSubmit}
//                                 className="w-full px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition mt-4"
//                             >
//                                 Create Account
//                             </button>
//                         </div>
//                     );
//                 }
//             default:
//                 return null;
//         }
//     };

//     return (
//         <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 text-white">
//             <h1 className="text-5xl font-extrabold mb-6 text-center drop-shadow-lg">
//                 Welcome to <span className="text-blue-400">Mzatinova Demia</span>
//             </h1>
//             <p className="max-w-xl text-center text-lg mb-10 leading-relaxed drop-shadow-md text-slate-300">
//                 Empowering secondary education learners and teachers with quality resources, interactive lessons, and a supportive community.
//             </p>

//             <div className="flex space-x-6">
//                 <button
//                     onClick={() => setAuthView('login')}
//                     className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold shadow-lg transition"
//                 >
//                     Log In
//                 </button>
//                 <button
//                     onClick={() => {
//                         setAuthView('signup');
//                         setSignupStage('role-selection');
//                     }}
//                     className="px-8 py-3 border-2 border-blue-500 hover:bg-blue-500 hover:text-white rounded-lg font-semibold shadow-lg transition"
//                 >
//                     Sign Up
//                 </button>
//             </div>

//             {authView !== 'none' && (
//                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
//                     <div className="relative w-full max-w-md bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl p-6 animate-fade-in max-h-[90vh] flex flex-col">
//                         <button
//                             onClick={() => {
//                                 setAuthView('none');
//                                 setSignupStage('role-selection');
//                             }}
//                             className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             aria-label="Close"
//                         >
//                             <X className="h-6 w-6" />
//                         </button>

//                         <div className="text-center mb-4">
//                             <BookOpen className="h-10 w-10 text-blue-400 mx-auto mb-2" />
//                             <h1 className="text-2xl font-bold">Mzatinova Demia</h1>
//                             <p className="text-slate-300 text-sm">Learn and teach secondary education subjects</p>
//                         </div>
//                         <div className="flex-1 overflow-y-auto">
//                             {renderAuthContent()}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <footer className="mt-20 text-sm text-slate-400 opacity-80">
//                 © {new Date().getFullYear()} Mzatinova Demia. All rights reserved.
//             </footer>
//         </main>
//     );
// }

