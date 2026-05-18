export default function PublicLayout({ children }) {
    return (
        <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
            {children}
        </div>
    );
}