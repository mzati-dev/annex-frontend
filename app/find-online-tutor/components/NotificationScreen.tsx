'use client';

import { useState } from 'react';
import { X, Bell, DollarSign, CalendarCheck, BookOpen, CheckCircle } from 'lucide-react';

// --- MOCK DATA ---
// In a real app, this data would come from your API
const initialNotifications = [
    {
        id: 1,
        type: 'sale',
        title: 'New Lesson Sale!',
        description: "Congratulations! A student has purchased your lesson 'Introduction to Algebra'.",
        timestamp: '5 minutes ago',
        isRead: false,
    },
    {
        id: 2,
        type: 'booking_confirmation',
        title: 'Booking Confirmed',
        description: 'Your tutoring session with Mark Johnson for Sept 8th, 2025 at 3:00 PM is confirmed.',
        timestamp: '1 hour ago',
        isRead: false,
    },
    {
        id: 3,
        type: 'new_content',
        title: 'New Content Available',
        description: "Teacher Emily Carter, whom you follow, has uploaded a new lesson: 'Advanced Calculus'.",
        timestamp: '3 hours ago',
        isRead: true,
    },
    {
        id: 4,
        type: 'profile_update',
        title: 'Profile is Live',
        description: 'Your public tutor profile is now live and visible to all students.',
        timestamp: 'Yesterday',
        isRead: true,
    },
    {
        id: 5,
        type: 'booking_request',
        title: 'New Tutoring Request',
        description: 'You have a new tutoring request from Sarah Lee. Please respond within 24 hours.',
        timestamp: 'Yesterday',
        isRead: true,
    },
    {
        id: 6,
        type: 'sale',
        title: 'New Lesson Sale!',
        description: "Another sale! A student purchased your lesson 'World History: The Romans'.",
        timestamp: '2 days ago',
        isRead: true,
    },
];

// Helper to map notification types to icons and colors
const notificationConfig = {
    sale: { icon: DollarSign, color: 'text-green-400' },
    booking_confirmation: { icon: CalendarCheck, color: 'text-blue-400' },
    booking_request: { icon: CalendarCheck, color: 'text-yellow-400' },
    new_content: { icon: BookOpen, color: 'text-purple-400' },
    profile_update: { icon: CheckCircle, color: 'text-teal-400' },
    default: { icon: Bell, color: 'text-slate-400' },
};

// --- NOTIFICATION SCREEN COMPONENT ---
export default function NotificationScreen({ onClose }: { onClose: () => void }) {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

    const markAsRead = (id: number) => {
        setNotifications(
            notifications.map(n => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const filteredNotifications = notifications.filter(n =>
        activeTab === 'unread' ? !n.isRead : true
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 font-sans">
            <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg h-[70vh] flex flex-col animate-fade-in-up">
                {/* Header */}
                <header className="p-4 flex justify-between items-center border-b border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <Bell className="text-blue-400" />
                        <h2 className="text-xl font-bold text-white">Notifications</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </header>

                {/* Tabs & Actions */}
                <div className="p-4 flex justify-between items-center border-b border-slate-700 flex-shrink-0">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-3 py-1 text-sm rounded-md transition ${activeTab === 'all' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setActiveTab('unread')}
                            className={`px-3 py-1 text-sm rounded-md transition ${activeTab === 'unread' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'}`}
                        >
                            Unread
                        </button>
                    </div>
                    <button onClick={markAllAsRead} className="text-sm text-blue-400 hover:text-blue-300 transition">
                        Mark all as read
                    </button>
                </div>

                {/* Notification List */}
                <div className="overflow-y-auto flex-grow">
                    {filteredNotifications.length > 0 ? (
                        <ul className="divide-y divide-slate-700">
                            {filteredNotifications.map(n => {
                                const config = notificationConfig[n.type as keyof typeof notificationConfig] || notificationConfig.default;
                                const Icon = config.icon;
                                return (
                                    <li
                                        key={n.id}
                                        onClick={() => markAsRead(n.id)}
                                        className={`flex items-start p-4 gap-4 cursor-pointer transition-colors ${!n.isRead ? 'bg-slate-900/50' : ''} hover:bg-slate-700/50`}
                                    >
                                        {!n.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0 animate-pulse"></div>}
                                        <div className={`flex-shrink-0 mt-1 ${n.isRead ? 'ml-4' : ''}`}>
                                            <Icon className={`h-6 w-6 ${config.color}`} />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-white">{n.title}</p>
                                            <p className="text-sm text-slate-300">{n.description}</p>
                                            <p className="text-xs text-slate-400 mt-1">{n.timestamp}</p>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
                            <Bell className="h-12 w-12 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-300">All caught up!</h3>
                            <p className="text-sm">You have no new notifications.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}