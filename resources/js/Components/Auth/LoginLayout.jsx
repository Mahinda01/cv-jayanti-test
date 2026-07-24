import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LoginLayout({ children }) {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <div className="flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 p-4 transition-colors duration-300 dark:from-[#131d31] dark:to-[#1d293d]">
            <div className="auth-card-enter relative flex h-[520px] w-[980px] overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-200/70 transition-colors duration-300 dark:border-2 dark:border-[#334155] dark:bg-[#1d293d] dark:shadow-none dark:ring-1 dark:ring-white/5">
                {children}

                <button
                    type="button"
                    onClick={() => setIsDark(!isDark)}
                    className="absolute right-5 top-5 z-20 rounded-xl bg-white p-3 text-slate-700 shadow-lg transition hover:bg-slate-100 dark:bg-[#203a65] dark:text-yellow-400 dark:hover:bg-[#14316b]"
                    aria-label="Toggle dark mode"
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
        </div>
    );
}