import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LoginLayout({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode.toString());

        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className="flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 p-4 transition-colors duration-300 dark:from-slate-900 dark:to-slate-800">
            <div className="auth-card-enter relative flex h-[520px] w-[980px] overflow-hidden rounded-[24px] bg-white shadow-2xl dark:bg-slate-900">
                {children}

                <button
                    type="button"
                    onClick={() => setDarkMode(!darkMode)}
                    className="absolute right-5 top-5 z-20 rounded-xl bg-white p-3 text-slate-700 shadow-lg transition hover:bg-slate-100 dark:bg-slate-800 dark:text-yellow-400 dark:hover:bg-slate-700"
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
        </div>
    );
}