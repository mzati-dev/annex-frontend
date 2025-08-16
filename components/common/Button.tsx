// components/common/Button.tsx
'use client';

import { ReactNode } from 'react';

interface ButtonProps {
    onClick?: () => void;
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    className?: string;
    type?: 'button' | 'submit';
    disabled?: boolean;
}

export default function Button({
    onClick,
    children,
    variant = 'primary',
    className = '',
    type = 'button',
    disabled = false
}: ButtonProps) {
    const baseClasses = "px-4 py-2 rounded-md font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-md hover:shadow-lg',
        secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-600',
        ghost: 'bg-transparent text-slate-300 hover:bg-slate-700 hover:text-white',
        danger: 'bg-red-600 text-white hover:bg-red-500',
        outline: 'bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-700',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            {children}
        </button>
    );
}