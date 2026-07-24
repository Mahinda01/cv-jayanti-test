import { router, usePage } from '@inertiajs/react';
import { Bell, Clock3, Package, ReceiptText } from 'lucide-react';
import { useState } from 'react';

export default function NotificationDropdown() {
    const page = usePage();
    const props = page?.props || {};

    const notifications = props.notifications || {
        count: 0,
        items: [],
    };

    const [open, setOpen] = useState(false);

    const items = Array.isArray(notifications.items)
        ? notifications.items
        : [];

    const count = Number(notifications.count || 0);

    const readNotification = (item) => {
        if (!item?.key || !item?.href) {
            return;
        }

        setOpen(false);

        router.post(
            route('notifications.read'),
            {
                notification_key: item.key,
                redirect_to: item.href,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const readAllNotifications = () => {
        const keys = items
            .map((item) => item.key)
            .filter((key) => key);

        if (keys.length === 0) {
            return;
        }

        router.post(
            route('notifications.read-all'),
            {
                notification_keys: keys,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                },
            },
        );
    };

    const getIcon = (type) => {
        if (type === 'danger') {
            return <ReceiptText size={15} />;
        }

        if (type === 'info') {
            return <Package size={15} />;
        }

        return <Clock3 size={15} />;
    };

    const getIconClass = (type) => {
        if (type === 'danger') {
            return 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400';
        }

        if (type === 'info') {
            return 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400';
        }

        return 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400';
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="relative p-1 text-slate-900 transition hover:scale-105 hover:text-slate-700 dark:text-[#60a5fa] dark:hover:text-[#93c5fd]"
                title="Notifikasi"
            >
                <Bell size={21} />

                {count > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-extrabold text-white">
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </button>

            {open && (
                <>
                    <button
                        type="button"
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setOpen(false)}
                    />

                    <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl transition-colors duration-300 ease-in-out dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3 transition-colors duration-300 ease-in-out dark:border-[#334155]">
                            <div>
                                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                    Notifikasi
                                </h2>

                                <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-gray-400">
                                    Piutang dan stok yang perlu diperhatikan
                                </p>
                            </div>

                            {items.length > 0 && (
                                <button
                                    type="button"
                                    onClick={readAllNotifications}
                                    className="shrink-0 text-[11px] font-extrabold text-[#155dfc] transition hover:text-blue-700 dark:text-[#60a5fa] dark:hover:text-[#93c5fd]"
                                >
                                    Baca semua
                                </button>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {items.length > 0 ? (
                                items.map((item, index) => (
                                    <button
                                        key={item.id || item.key || index}
                                        type="button"
                                        onClick={() => readNotification(item)}
                                        className="flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition-colors duration-300 ease-in-out last:border-b-0 hover:bg-slate-50 dark:border-[#334155] dark:hover:bg-[#131d31]"
                                    >
                                        <span
                                            className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${getIconClass(
                                                item.type,
                                            )}`}
                                        >
                                            {getIcon(item.type)}
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="block text-xs font-extrabold text-slate-900 dark:text-white">
                                                {item.title || 'Notifikasi'}
                                            </span>

                                            <span className="mt-0.5 block truncate text-[11px] font-semibold text-slate-600 dark:text-gray-300">
                                                {item.description || '-'}
                                            </span>

                                            <span className="mt-1 block text-[10px] font-bold text-slate-500 dark:text-gray-400">
                                                {item.meta || '-'}
                                            </span>
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-center">
                                    <p className="text-xs font-extrabold text-slate-700 dark:text-gray-200">
                                        Tidak ada notifikasi
                                    </p>

                                    <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-gray-400">
                                        Semua piutang dan stok masih aman.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}