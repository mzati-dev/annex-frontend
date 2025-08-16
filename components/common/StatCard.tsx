import { ReactNode } from 'react';

// CHANGED: Updated the prop types to include isActive and onClick
interface StatCardProps {
    icon: React.ElementType;
    title: string;
    value: string | number;
    isActive?: boolean;
    onClick?: () => void;
}

export default function StatCard({
    icon: Icon,
    title,
    value,
    isActive = false,  // CHANGED: Added with default value
    onClick           // CHANGED: Added onClick handler
}: StatCardProps) {
    return (
        // CHANGED: Added onClick handler and dynamic classes based on isActive
        <div
            className={`
                rounded-lg p-5 border 
                ${isActive
                    ? 'bg-blue-600/20 border-blue-500 cursor-default'
                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/60 cursor-pointer'
                }
                transition-colors
            `}
            onClick={onClick}
        >
            <div className="flex items-center mb-2">
                {/* CHANGED: Dynamic icon color based on active state */}
                <Icon className={`h-5 w-5 mr-2 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <h3 className={`text-md font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {title}
                </h3>
            </div>
            {/* CHANGED: Dynamic text color based on active state */}
            <p className={`text-3xl font-bold ${isActive ? 'text-white' : 'text-white'}`}>
                {value}
            </p>
        </div>
    );
}
// import { ReactNode } from 'react';

// export default function StatCard({ icon: Icon, title, value }: { icon: React.ElementType; title: string; value: string | number }) {
//     return (
//         <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5">
//             <div className="flex items-center mb-2">
//                 <Icon className="h-5 w-5 text-slate-400 mr-2" />
//                 <h3 className="text-md font-semibold text-slate-300">{title}</h3>
//             </div>
//             <p className="text-3xl font-bold text-white">{value}</p>
//         </div>
//     );
// }