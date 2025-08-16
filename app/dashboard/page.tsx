'use client';

import { useAppContext } from '../../context/AppContext';
import Header from '../../components/common/Header';
import CartModal from '../../components/common/CartModal';
import StudentDashboard from '../../components/dashboard/StudentDashboard';
import TeacherDashboard from '../../components/dashboard/TeacherDashboard';
import { useState } from 'react';

export default function Dashboard() {
    const { user } = useAppContext();
    const [isCartOpen, setCartOpen] = useState(false);

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <Header onCartClick={() => setCartOpen(true)} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {user.role === 'student' ? <StudentDashboard /> : <TeacherDashboard />}
            </main>
            <CartModal isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
        </div>
    );
}