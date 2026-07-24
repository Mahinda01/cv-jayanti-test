import NotificationDropdown from '@/Components/Shared/NotificationDropdown';
import { CalendarDays, Moon, Search, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function StaffTopbar({
    showSearch = false,
    searchValue = '',
    onSearchChange = () => {},
    searchPlaceholder = 'Cari data...',
}) {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return (
            localStorage.getItem('theme') === 'dark' ||
            document.documentElement.classList.contains('dark')
        );
    });

    const today = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => {
        document.documentElement.classList.add('theme-changing');

        setIsDark((current) => !current);

        setTimeout(() => {
            document.documentElement.classList.remove('theme-changing');
        }, 400);
    };

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white dark:border-[#334155] dark:bg-[#1d293d]">
            <div className="flex min-h-[64px] items-center justify-between gap-4 px-6">
                <div className="flex min-w-0 flex-1 items-center gap-5">
                    <h1 className="shrink-0 text-[19px] font-extrabold text-slate-900 dark:text-white">
                        Dashboard Staff
                    </h1>

                    {showSearch && (
                        <div className="relative hidden min-w-0 flex-1 max-w-[760px] lg:block">
                            <Search
                                size={17}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                            />

                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) =>
                                    onSearchChange(e.target.value)
                                }
                                placeholder={searchPlaceholder}
                                className="h-10 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#314158] dark:text-white dark:placeholder:text-slate-400 dark:focus:ring-[#155dfc]/20"
                            />
                        </div>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-5">
                    <div className="hidden items-center gap-3 md:flex">
                        <CalendarDays
                            size={19}
                            className="text-slate-900 dark:text-[#60a5fa]"
                        />

                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {today}
                        </span>
                    </div>

                    <NotificationDropdown />
                </div>
            </div>
        </header>
    );
}