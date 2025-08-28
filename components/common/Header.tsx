'use client';

import { useAppContext } from '../../context/AppContext';
import { BookOpen, ShoppingCart, ChevronDown, ChevronUp, Search, ExternalLink, FileText, Compass } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header({ onCartClick }: { onCartClick?: () => void }) {
    const { user, logout, cart, searchTerm, setSearchTerm } = useAppContext();
    const pathname = usePathname();
    const [isExploreDropdownOpen, setIsExploreDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const isActive = (path: string) => pathname.startsWith(path);

    return (
        <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left - Logo */}
                    <div className="flex items-center">
                        <BookOpen className="h-8 w-8 text-blue-500" />
                        <h1 className="ml-3 text-xl font-bold text-white">Annex</h1>

                        {/* Explore Dropdown */}
                        <div
                            // MODIFICATION: Added padding-top to bridge the gap
                            className="relative ml-15 hidden md:block pt-2"
                            onMouseLeave={() => setIsExploreDropdownOpen(false)}
                        >
                            <button
                                onMouseEnter={() => setIsExploreDropdownOpen(true)}
                                className="flex items-center text-slate-300 hover:text-white transition-colors"
                            >
                                <Compass className="h-5 w-5 mr-1" />
                                <span>Explore</span>
                                {isExploreDropdownOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                            </button>

                            {isExploreDropdownOpen && (
                                <div
                                    // MODIFICATION: Removed margin-top (mt-2)
                                    className="absolute left-0 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-slate-700"
                                    onClick={() => setIsExploreDropdownOpen(false)}
                                >
                                    <a
                                        href="YOUR_LMS_URL"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Eduspace LMS
                                    </a>
                                    {user?.role === 'student' && (
                                        <a
                                            href="/find-online-tutor"
                                            className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                        >
                                            <Compass className="h-4 w-4 mr-2" />
                                            Find online tutor
                                        </a>
                                    )}
                                    <a
                                        href="/other-feature"
                                        className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        Resources
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Center - Search bar (students and teachers) - UNCHANGED */}
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
                            {/* Cart icon (students only) - UNCHANGED */}
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

                            {/* User Dropdown */}
                            <div
                                // MODIFICATION: Added padding-top to bridge the gap
                                className="relative pt-2"
                                onMouseLeave={() => setIsUserDropdownOpen(false)}
                            >
                                <button
                                    onMouseEnter={() => setIsUserDropdownOpen(true)}
                                    className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
                                >
                                    <span className="font-semibold text-white">{user.name}</span>
                                    {isUserDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </button>

                                {isUserDropdownOpen && (
                                    <div
                                        // MODIFICATION: Removed margin-top (mt-2)
                                        className="absolute right-0 w-40 bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-slate-700"
                                        onClick={() => setIsUserDropdownOpen(false)}
                                    >
                                        <div className="px-4 py-2 text-sm text-slate-300 border-b border-slate-700">
                                            <div className="text-xs text-blue-400 capitalize">{user.role}</div>
                                        </div>

                                        {/* Profile link */}
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                                        >
                                            Profile
                                        </Link>

                                        {/* Settings link */}
                                        <Link
                                            href="/settings"
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                                        >
                                            Settings
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                                        >
                                            Help & Support
                                        </Link>

                                        <button
                                            onClick={() => {
                                                logout();
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Navigation - UNCHANGED */}
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

