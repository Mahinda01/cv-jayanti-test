import { Link, router, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    LogOut,
    Package,
    ShoppingCart,
    Truck,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function StaffSidebar() {
    const { url, props } = usePage();

    const currentPath = url.split('?')[0].split('#')[0];

    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return localStorage.getItem('staffSidebarCollapsed') === 'true';
    });

    const user = props.auth?.user;

    const menuItems = [
        {
            label: 'Dashboard',
            href: '/staff/dashboard',
            icon: LayoutDashboard,
        },
        {
            label: 'Data Produk',
            href: '/staff/produk',
            icon: Package,
        },
        {
            label: 'Data Pelanggan',
            href: '/staff/pelanggan',
            icon: Users,
        },
        {
            label: 'Transaksi Pembelian',
            href: '/staff/pembelian',
            icon: Truck,
        },
        {
            label: 'Transaksi Penjualan',
            href: '/staff/transaksi',
            icon: ShoppingCart,
        },
    ];

    useEffect(() => {
        localStorage.setItem(
            'staffSidebarCollapsed',
            isCollapsed,
        );
    }, [isCollapsed]);

    const toggleSidebar = () => {
        setIsCollapsed((current) => !current);
    };

    const logout = () => {
        router.post(route('logout'));
    };

    const isMenuActive = (href) => {
        return (
            currentPath === href ||
            currentPath.startsWith(`${href}/`)
        );
    };

    return (
        <aside
            className={`sticky top-0 z-40 flex h-screen flex-shrink-0 flex-col overflow-visible border-r border-slate-200 bg-white transition-all duration-300 dark:border-[#334155] dark:bg-[#1d293d] ${
                isCollapsed ? 'w-[92px]' : 'w-[255px]'
            }`}
        >
            <button
                type="button"
                onClick={toggleSidebar}
                className="absolute -right-3.5 top-8 z-[70] flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-blue-50 hover:text-[#155dfc] dark:border-[#334155] dark:bg-[#131d31] dark:text-gray-300 dark:hover:bg-[#1d293d] dark:hover:text-[#60a5fa]"
                title={
                    isCollapsed
                        ? 'Tampilkan sidebar'
                        : 'Sembunyikan sidebar'
                }
            >
                {isCollapsed ? (
                    <ChevronRight size={14} />
                ) : (
                    <ChevronLeft size={14} />
                )}
            </button>

            <div
                className={`flex h-[64px] items-center px-4 ${
                    isCollapsed
                        ? 'justify-center'
                        : 'gap-2 pr-8'
                }`}
            >
                <div className="site-logo flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                    <img
                        src="/images/logo/logo-cv-jayanti.png"
                        alt="Logo CV Jayanti Muliatama"
                        className="h-full w-full object-contain"
                    />
                </div>

                {!isCollapsed && (
                    <div className="min-w-0 leading-none">
                        <h1 className="truncate text-[14px] font-extrabold leading-tight text-slate-900 dark:text-white">
                            CV Jayanti Muliatama
                        </h1>

                        <p className="mt-0.5 truncate text-[12px] font-medium leading-tight text-slate-500 dark:text-gray-400">
                            Hydraulic Solutions
                        </p>
                    </div>
                )}
            </div>

            <nav className="mt-3 space-y-1.5 px-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isMenuActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center rounded-xl text-[13px] font-bold transition ${
                                isCollapsed
                                    ? 'mx-auto h-10 w-12 justify-center px-0'
                                    : 'h-10 gap-3 px-3'
                            } ${
                                isActive
                                    ? 'bg-[#155dfc] text-white shadow-md shadow-blue-600/20 dark:shadow-[#155dfc]/20'
                                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-gray-300 dark:hover:bg-[#131d31] dark:hover:text-white'
                            }`}
                            title={
                                isCollapsed ? item.label : ''
                            }
                        >
                            <Icon
                                size={20}
                                strokeWidth={2.1}
                                className="flex-shrink-0"
                            />

                            {!isCollapsed && (
                                <span className="truncate">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t border-slate-200 p-4 dark:border-[#334155]">
                <div
                    className={`flex items-center ${
                        isCollapsed
                            ? 'justify-center'
                            : 'justify-between gap-3'
                    }`}
                >
                    <div
                        className={`flex items-center ${
                            isCollapsed
                                ? 'justify-center'
                                : 'gap-3'
                        }`}
                    >
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#155dfc] text-sm font-extrabold text-white">
                            {user?.name
                                ? user.name
                                      .charAt(0)
                                      .toUpperCase()
                                : 'S'}
                        </div>

                        {!isCollapsed && (
                            <div className="min-w-0">
                                <p className="truncate text-[13px] font-extrabold leading-tight text-slate-900 dark:text-white">
                                    {user?.name || 'Staff'}
                                </p>

                                <p className="mt-0.5 truncate text-[12px] font-medium leading-tight text-slate-500 dark:text-gray-400">
                                    Staff
                                </p>
                            </div>
                        )}
                    </div>

                    {!isCollapsed && (
                        <button
                            type="button"
                            onClick={logout}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                            title="Logout"
                        >
                            <LogOut size={19} />
                        </button>
                    )}
                </div>

                {isCollapsed && (
                    <button
                        type="button"
                        onClick={logout}
                        className="mt-4 flex h-9 w-full items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        title="Logout"
                    >
                        <LogOut size={19} />
                    </button>
                )}
            </div>
        </aside>
    );
}