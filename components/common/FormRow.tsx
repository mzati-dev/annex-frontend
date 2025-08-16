export default function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
            {children}
        </div>
    );
}