import { Link } from '@inertiajs/react';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import Logo from '@/Components/Public/Logo';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode.toString());

        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const scrollToSection = (id) => {
        if (window.location.pathname !== '/') {
            window.location.href = `/#${id}`;
            return;
        }

        const element = document.getElementById(id);

        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <nav
            className={`fixed top-0 z-50 w-full bg-white transition-all duration-300 dark:bg-slate-800 ${
                scrolled ? 'shadow-lg' : 'shadow-sm'
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <button
                        type="button"
                        onClick={() => scrollToSection('home')}
                        className="shrink-0"
                    >
                        <Logo />
                    </button>

                    <div className="hidden items-center space-x-8 md:flex">
                        <button
                            type="button"
                            onClick={() => scrollToSection('home')}
                            className="text-base font-medium text-gray-700 transition-colors duration-300 hover:scale-105 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            Home
                        </button>

                        <button
                            type="button"
                            onClick={() => scrollToSection('about')}
                            className="text-base font-medium text-gray-700 transition-colors duration-300 hover:scale-105 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            Tentang
                        </button>

                        <button
                            type="button"
                            onClick={() => scrollToSection('products')}
                            className="text-base font-medium text-gray-700 transition-colors duration-300 hover:scale-105 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            Produk
                        </button>

                        <button
                            type="button"
                            onClick={() => scrollToSection('contact')}
                            className="text-base font-medium text-gray-700 transition-colors duration-300 hover:scale-105 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            Kontak
                        </button>

                        <button
                            type="button"
                            onClick={() => setDarkMode(!darkMode)}
                            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <Sun size={20} className="text-yellow-400" />
                            ) : (
                                <Moon size={20} className="text-gray-700" />
                            )}
                        </button>

                        <Link
                            href="/login/admin"
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-base font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}