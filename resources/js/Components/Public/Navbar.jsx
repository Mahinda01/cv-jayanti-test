import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [activeSection, setActiveSection] = useState('home');
    const [isOpen, setIsOpen] = useState(false);

    const navbarHeight = 78;

    const menus = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'Tentang' },
        { id: 'products', label: 'Produk' },
        { id: 'contact', label: 'Kontak' },
    ];

    function moveToSection(sectionId, historyMode = 'push') {
        const section = document.getElementById(sectionId);

        if (!section) {
            return;
        }

        const sectionPosition =
            section.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({
            top: sectionPosition,
            behavior: 'smooth',
        });

        setActiveSection(sectionId);

        if (historyMode === 'replace') {
            window.history.replaceState(null, '', `#${sectionId}`);
        } else {
            window.history.pushState(null, '', `#${sectionId}`);
        }
    }

    function scrollToSection(sectionId) {
        setIsOpen(false);

        if (window.location.pathname !== '/') {
            sessionStorage.setItem('targetSection', sectionId);
            window.location.href = '/';
            return;
        }

        moveToSection(sectionId);
    }

    useEffect(() => {
        if (window.location.pathname !== '/') {
            setActiveSection('');
            return;
        }

        const savedTarget = sessionStorage.getItem('targetSection');
        const hashTarget = window.location.hash.replace('#', '');
        const targetSection = savedTarget || hashTarget;

        let scrollTimer;

        if (targetSection && menus.some((menu) => menu.id === targetSection)) {
            sessionStorage.removeItem('targetSection');

            scrollTimer = setTimeout(() => {
                moveToSection(targetSection, 'replace');
            }, 150);
        }

        function handleScroll() {
            const scrollPosition = window.scrollY + navbarHeight + 80;

            menus.forEach((menu) => {
                const section = document.getElementById(menu.id);

                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;

                    if (
                        scrollPosition >= sectionTop &&
                        scrollPosition < sectionBottom
                    ) {
                        setActiveSection(menu.id);
                    }
                }
            });
        }

        handleScroll();

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(scrollTimer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur transition-colors duration-300 dark:border-[#131d31] dark:bg-[#1d293d]">
            <nav className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-7">
                <Logo />

                <div className="hidden items-center gap-9 md:flex">
                    {menus.map((menu) => (
                        <button
                            key={menu.id}
                            type="button"
                            onClick={() => scrollToSection(menu.id)}
                            className={`text-[15px] font-bold transition ${
                                activeSection === menu.id
                                    ? 'text-blue-600 dark:text-[#155dfc]'
                                    : 'text-slate-600 hover:text-blue-600 dark:text-white dark:hover:text-[#155dfc]'
                            }`}
                        >
                            {menu.label}
                        </button>
                    ))}

                    <ThemeToggle />

                    <Link
                        href="/login"
                        className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-700 dark:bg-[#155dfc] dark:text-white dark:shadow-[#155dfc]/25 dark:hover:bg-blue-600"
                    >
                        Login
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 dark:text-white dark:hover:bg-[#131d31] md:hidden"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {isOpen && (
                <div className="border-t border-slate-200 bg-white px-7 py-5 transition-colors duration-300 dark:border-[#131d31] dark:bg-[#1d293d] md:hidden">
                    <div className="flex flex-col gap-4">
                        {menus.map((menu) => (
                            <button
                                key={menu.id}
                                type="button"
                                onClick={() => scrollToSection(menu.id)}
                                className={`text-left text-base font-bold ${
                                    activeSection === menu.id
                                        ? 'text-blue-600 dark:text-[#155dfc]'
                                        : 'text-slate-600 dark:text-white'
                                }`}
                            >
                                {menu.label}
                            </button>
                        ))}

                        <div className="flex items-center justify-between pt-3">
                            <ThemeToggle />

                            <Link
                                href="/login"
                                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/30 dark:bg-[#155dfc] dark:text-white dark:shadow-[#155dfc]/25"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}