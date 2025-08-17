'use client';

import { useAppContext } from '../../context/AppContext';
import { BookOpen, ShoppingCart, ChevronDown, ChevronUp, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header({ onCartClick }: { onCartClick?: () => void }) {
    const { user, logout, cart, searchTerm, setSearchTerm } = useAppContext();
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const isActive = (path: string) => pathname.startsWith(path);

    return (
        <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left - Logo */}
                    <div className="flex items-center">
                        <BookOpen className="h-8 w-8 text-blue-500" />
                        <h1 className="ml-3 text-xl font-bold text-white">Annex</h1>
                    </div>

                    {/* Center - Search bar (students and teachers) */}
                    {(user?.role === 'student' || user?.role === 'teacher') && (
                        <div className="flex-1 max-w-2xl mx-8 hidden md:block">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder={user.role === 'teacher' ? "Search by subject or form (e.g., 'Math' or 'Form 1')" : "Search lessons..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-md pl-9 pr-4 py-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Right - Cart and user info */}
                    {user && (
                        <div className="flex items-center space-x-4">
                            {/* Cart icon (students only) */}
                            {user.role === 'student' && onCartClick && (
                                <button onClick={onCartClick} className="relative text-slate-300 hover:text-white transition-colors">
                                    <ShoppingCart className="h-6 w-6" />
                                    {cart.length > 0 && (
                                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                            {cart.length}
                                        </span>
                                    )}
                                </button>
                            )}

                            {/* User dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
                                >
                                    <span className="font-semibold text-white">{user.name}</span>
                                    {isDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-slate-700">
                                        <div className="px-4 py-2 text-sm text-slate-300 border-b border-slate-700">
                                            <div className="text-xs text-blue-400 capitalize">{user.role}</div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Navigation */}
                {(user?.role === 'student' || user?.role === 'teacher') && (
                    <div className="flex md:hidden justify-center border-t border-slate-700 pt-2 pb-1 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
                        {/* Mobile Search */}
                        <div className="relative w-full max-w-md mb-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder={user.role === 'teacher' ? "Search your lessons..." : "Search lessons..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-md pl-9 pr-4 py-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {user.role === 'student' && (
                            <div className="flex items-center border border-slate-700 rounded-lg bg-slate-800/50 p-1 w-full max-w-md">
                                <Link
                                    href="/available-lessons"
                                    className={`flex-1 text-center px-3 py-1 text-sm rounded-md transition-colors ${isActive('/available-lessons') ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-slate-300 hover:text-white'}`}
                                >
                                    Available Lessons
                                </Link>
                                <Link
                                    href="/my-lessons"
                                    className={`flex-1 text-center px-3 py-1 text-sm rounded-md transition-colors ${isActive('/my-lessons') ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-slate-300 hover:text-white'}`}
                                >
                                    My Lessons
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}

// 'use client';

// import { useAppContext } from '../../context/AppContext';
// import { BookOpen, ShoppingCart, ChevronDown, ChevronUp, Search } from 'lucide-react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useState } from 'react';

// export default function Header({ onCartClick }: { onCartClick: () => void }) {
//     const { user, logout, cart, searchTerm, setSearchTerm } = useAppContext();
//     const pathname = usePathname();
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//     const isActive = (path: string) => pathname.startsWith(path);

//     return (
//         <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center h-16">
//                     {/* Left - Logo */}
//                     <div className="flex items-center">
//                         <BookOpen className="h-8 w-8 text-blue-500" />
//                         <h1 className="ml-3 text-xl font-bold text-white">Mzati Education Hub</h1>
//                     </div>

//                     {/* Center - Search bar (students only) */}
//                     {user?.role === 'student' && (
//                         <div className="flex-1 max-w-2xl mx-8 hidden md:block">
//                             <div className="relative w-full">
//                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search lessons..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="w-full bg-slate-700 border border-slate-600 rounded-md pl-9 pr-4 py-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     {/* Right - Cart and user info */}
//                     {user && (
//                         <div className="flex items-center space-x-4">
//                             {/* Cart icon (students only) */}
//                             {user.role === 'student' && (
//                                 <button onClick={onCartClick} className="relative text-slate-300 hover:text-white transition-colors">
//                                     <ShoppingCart className="h-6 w-6" />
//                                     {cart.length > 0 && (
//                                         <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
//                                             {cart.length}
//                                         </span>
//                                     )}
//                                 </button>
//                             )}

//                             {/* User dropdown */}
//                             <div className="relative">
//                                 <button
//                                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                                     className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
//                                 >
//                                     <span className="font-semibold text-white">{user.name}</span>
//                                     {isDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
//                                 </button>

//                                 {isDropdownOpen && (
//                                     <div className="absolute right-0 mt-2 w-40 bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-slate-700">
//                                         <div className="px-4 py-2 text-sm text-slate-300 border-b border-slate-700">
//                                             <div className="text-xs text-blue-400 capitalize">{user.role}</div>
//                                         </div>
//                                         <button
//                                             onClick={() => {
//                                                 logout();
//                                                 setIsDropdownOpen(false);
//                                             }}
//                                             className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
//                                         >
//                                             Logout
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Mobile Navigation */}
//                 {user?.role === 'student' && (
//                     <div className="flex md:hidden justify-center border-t border-slate-700 pt-2 pb-1 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
//                         {/* Mobile Search */}
//                         <div className="relative w-full max-w-md mb-2">
//                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
//                             <input
//                                 type="text"
//                                 placeholder="Search lessons..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full bg-slate-700 border border-slate-600 rounded-md pl-9 pr-4 py-1.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             />
//                         </div>

//                         <div className="flex items-center border border-slate-700 rounded-lg bg-slate-800/50 p-1 w-full max-w-md">
//                             <Link
//                                 href="/available-lessons"
//                                 className={`flex-1 text-center px-3 py-1 text-sm rounded-md transition-colors ${isActive('/available-lessons') ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-slate-300 hover:text-white'}`}
//                             >
//                                 Available Lessons
//                             </Link>
//                             <Link
//                                 href="/my-lessons"
//                                 className={`flex-1 text-center px-3 py-1 text-sm rounded-md transition-colors ${isActive('/my-lessons') ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-slate-300 hover:text-white'}`}
//                             >
//                                 My Lessons
//                             </Link>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </header>
//     );
// }

// 'use client';

// import { useAppContext } from '../../context/AppContext';
// import { BookOpen, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { useState } from 'react';

// export default function Header({ onCartClick }: { onCartClick: () => void }) {
//     const { user, logout, cart } = useAppContext();
//     const pathname = usePathname();
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//     const isActive = (path: string) => pathname.startsWith(path);

//     return (
//         <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center h-16">
//                     {/* Left side - Logo */}
//                     <div className="flex items-center">
//                         <BookOpen className="h-8 w-8 text-blue-500" />
//                         <h1 className="ml-3 text-xl font-bold text-white">Mzati Education Hub</h1>
//                     </div>

//                     {/* Center - Navigation Tabs (only for students) */}
//                     {user?.role === 'student' && (
//                         <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
//                             <div className="flex items-center border border-slate-700 rounded-lg bg-slate-800/50 p-1 mr-20">
//                                 <Link
//                                     href="/available-lessons"
//                                     className={`px-4 py-1 text-sm rounded-md transition-colors ${isActive('/available-lessons') ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-slate-300 hover:text-white'}`}
//                                 >
//                                     Available Lessons
//                                 </Link>
//                             </div>
//                             <div className="flex items-center border border-slate-700 rounded-lg bg-slate-800/50 p-1">
//                                 <Link
//                                     href="/my-lessons"
//                                     className={`px-4 py-1 text-sm rounded-md transition-colors ${isActive('/my-lessons') ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-slate-300 hover:text-white'}`}
//                                 >
//                                     My Lessons
//                                 </Link>
//                             </div>
//                         </div>
//                     )}

//                     {/* Right side - User info and actions */}
//                     {user && (
//                         <div className="flex items-center space-x-4">
//                             {user.role === 'student' && (
//                                 <button onClick={onCartClick} className="relative text-slate-300 hover:text-white transition-colors">
//                                     <ShoppingCart className="h-6 w-6" />
//                                     {cart.length > 0 && (
//                                         <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
//                                             {cart.length}
//                                         </span>
//                                     )}
//                                 </button>
//                             )}

//                             {/* User dropdown */}
//                             <div className="relative">
//                                 <button
//                                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                                     className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
//                                 >
//                                     <span className="font-semibold text-white">{user.name}</span>
//                                     {isDropdownOpen ? (
//                                         <ChevronUp className="h-4 w-4" />
//                                     ) : (
//                                         <ChevronDown className="h-4 w-4" />
//                                     )}
//                                 </button>

//                                 {isDropdownOpen && (
//                                     <div className="absolute right-0 mt-2 w-40 bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-slate-700">
//                                         <div className="px-4 py-2 text-sm text-slate-300 border-b border-slate-700">
//                                             <div className="text-xs text-blue-400 capitalize">{user.role}</div>
//                                         </div>
//                                         <button
//                                             onClick={() => {
//                                                 logout();
//                                                 setIsDropdownOpen(false);
//                                             }}
//                                             className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
//                                         >
//                                             Logout
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Mobile tabs for students */}
//                 {user?.role === 'student' && (
//                     <div className="flex md:hidden justify-center border-t border-slate-700 pt-2 pb-1 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
//                         <div className="flex items-center border border-slate-700 rounded-lg bg-slate-800/50 p-1 w-full max-w-md">
//                             <Link
//                                 href="/available-lessons"
//                                 className={`flex-1 text-center px-3 py-1 text-sm rounded-md transition-colors ${isActive('/available-lessons') ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-slate-300 hover:text-white'}`}
//                             >
//                                 Available Lessons
//                             </Link>
//                             <Link
//                                 href="/my-lessons"
//                                 className={`flex-1 text-center px-3 py-1 text-sm rounded-md transition-colors ${isActive('/my-lessons') ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-slate-300 hover:text-white'}`}
//                             >
//                                 My Lessons
//                             </Link>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </header>
//     );
// }

// 'use client';

// import { useAppContext } from '../../context/AppContext';
// import { BookOpen, ShoppingCart, LogOut } from 'lucide-react';
// import Button from './Button';

// export default function Header({ onCartClick }: { onCartClick: () => void }) {
//     const { user, logout, cart } = useAppContext();

//     return (
//         <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center h-16">
//                     <div className="flex items-center">
//                         <BookOpen className="h-8 w-8 text-blue-500" />
//                         <h1 className="ml-3 text-xl font-bold text-white">Mzati Education Hub</h1>
//                     </div>
//                     {user && (
//                         <div className="flex items-center space-x-4">
//                             <span className="text-slate-300 hidden sm:inline"><span className="font-semibold text-white">{user.name}</span></span>
//                             <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold capitalize border border-blue-500/30">{user.role}</span>
//                             {user.role === 'student' && (
//                                 <button onClick={onCartClick} className="relative text-slate-300 hover:text-white transition-colors">
//                                     <ShoppingCart className="h-6 w-6" />
//                                     {cart.length > 0 && (
//                                         <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
//                                             {cart.length}
//                                         </span>
//                                     )}
//                                 </button>
//                             )}
//                             <Button onClick={logout} variant="ghost" className="text-slate-400 hover:text-red-400">
//                                 <LogOut className="h-4 w-4 sm:mr-2" />
//                                 <span className="hidden sm:inline">Logout</span>
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </header>
//     );
// }