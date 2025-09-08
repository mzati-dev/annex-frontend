'use client';

import { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Header from '@/components/common/Header';
import StudentTutorFinder from './components/StudentView';
import TeacherTutorDashboard from './components/TeacherView';


export default function FindTutorPage() {
    const { user } = useAppContext();


    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) { window.location.replace('/'); }
        }, 100);
        return () => clearTimeout(timer);
    }, [user]);


    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
                <p>Loading Page...</p>
            </div>
        );
    }

    return (
        <>
            <Header />
            {/* This is the core logic: 
              - If the user is a 'teacher', show the Teacher dashboard.
              - Otherwise (for 'student'), show the Student finder page.
            */}
            {user.role === 'teacher' ? <TeacherTutorDashboard /> : <StudentTutorFinder />}
        </>
    );
}


