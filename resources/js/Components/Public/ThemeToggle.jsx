import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        }
    }, []);

    const handleToggleTheme = () => {
        const darkActive = document.documentElement.classList.contains('dark');

        if (darkActive) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <button
            type="button"
            onClick={handleToggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-slate-100 dark:hover:bg-slate-800"
        >
            {isDark ? (
                <Sun size={22} strokeWidth={2.4} className="text-yellow-400" />
            ) : (
                <Moon
                    size={21}
                    strokeWidth={2.4}
                    className="text-slate-700 dark:text-slate-300"
                />
            )}
        </button>
    );
}