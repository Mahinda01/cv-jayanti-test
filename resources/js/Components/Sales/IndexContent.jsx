import { inputReason, showInfo } from '@/lib/sweetAlert';
import {
    Head,
    Link,
    router,
    usePage,
} from '@inertiajs/react';
import {
    Ban,
    MoreVertical,
    Plus,
    Printer,
} from 'lucide-react';
import { useState } from 'react';

export default function IndexContent({
    Layout,
    sales = [],
    routePrefix,
}) {
    const { props } = usePage();

    const successMessage = props.flash?.success;
    const errorMessage =
        props.flash?.error ||
        props.errors?.cancel_reason;

    const [search, setSearch] = useState('');
    const [paymentStatus, setPaymentStatus] =
        useState('Aktif');
    const [paymentMethod, setPaymentMethod] =
        useState('Semua');
    const [dateFilter, setDateFilter] =
        useState('');
    const [openMenu, setOpenMenu] =
        useState(null);
    const [currentPage, setCurrentPage] =
        useState(1);

    const salesPerPage = 10;

    const inputClass =
        'h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:focus:ring-[#155dfc]/20';

    const filteredSales = sales.filter((sale) => {
        const keyword = search
            .trim()
            .toLowerCase();

        const invoice = String(
            sale.invoice_number || '',
        ).toLowerCase();

        const customer = String(
            sale.customer_name || '',
        ).toLowerCase();

        const user = String(
            sale.user_name || '',
        ).toLowerCase();

        const status =
            sale.transaction_status ===
            'Dibatalkan'
                ? 'Dibatalkan'
                : sale.payment_status;

        const matchSearch =
            invoice.includes(keyword) ||
            customer.includes(keyword) ||
            user.includes(keyword);

        const matchStatus =
            paymentStatus === 'Semua' ||
            (paymentStatus === 'Aktif' &&
                sale.transaction_status !==
                    'Dibatalkan') ||
            status === paymentStatus;

        const matchMethod =
            paymentMethod === 'Semua' ||
            sale.payment_method ===
                paymentMethod;

        const matchDate =
            dateFilter === '' ||
            sale.sale_date_raw === dateFilter;

        return (
            matchSearch &&
            matchStatus &&
            matchMethod &&
            matchDate
        );
    });

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredSales.length / salesPerPage,
        ),
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages,
    );

    const startIndex =
        (safeCurrentPage - 1) * salesPerPage;

    const currentSales = filteredSales.slice(
        startIndex,
        startIndex + salesPerPage,
    );

    const activeMenuSale = openMenu
        ? sales.find(
              (sale) =>
                  Number(sale.id) ===
                  Number(openMenu.id),
          )
        : null;

    const changeFilter = (
        setter,
        value,
    ) => {
        setter(value);
        setCurrentPage(1);
        setOpenMenu(null);
    };

    const openActionMenu = (
        event,
        sale,
    ) => {
        if (openMenu?.id === sale.id) {
            setOpenMenu(null);
            return;
        }

        const button =
            event.currentTarget;

        const position =
            button.getBoundingClientRect();

        const menuWidth = 176;
        const menuHeight = 140;

        const top =
            position.bottom +
                menuHeight +
                8 >
            window.innerHeight
                ? Math.max(
                      12,
                      position.top -
                          menuHeight -
                          8,
                  )
                : position.bottom + 8;

        const left = Math.max(
            12,
            Math.min(
                position.right - menuWidth,
                window.innerWidth -
                    menuWidth -
                    12,
            ),
        );

        setOpenMenu({
            id: sale.id,
            top,
            left,
        });
    };

    const cancelSale = async (sale) => {
        setOpenMenu(null);

        if (
            !sale ||
            sale.transaction_status ===
                'Dibatalkan'
        ) {
            return;
        }

        const reason = await inputReason({
            title: 'Batalkan transaksi?',
            inputPlaceholder:
                'Tulis alasan pembatalan...',
            confirmButtonText:
                'Batalkan Transaksi',
        });

        if (!reason?.trim()) {
            return;
        }

        router.patch(
            route(
                `${routePrefix}.sales.cancel`,
                sale.id,
            ),
            {
                cancel_reason:
                    reason.trim(),
            },
            {
                preserveScroll: true,
            },
        );
    };

    const showCancelDetail = (sale) => {
        setOpenMenu(null);

        const details = [
            sale.cancel_reason ||
                'Alasan pembatalan belum tersedia.',
            sale.cancelled_by
                ? `Dibatalkan oleh: ${sale.cancelled_by}`
                : null,
            sale.cancelled_at
                ? `Waktu pembatalan: ${sale.cancelled_at}`
                : null,
        ]
            .filter(Boolean)
            .join('\n');

        showInfo({
            title: 'Detail Pembatalan',
            text: details,
            confirmButtonText: 'Tutup',
        });
    };

    const getStatusLabel = (sale) => {
        if (
            sale.transaction_status ===
            'Dibatalkan'
        ) {
            return 'Dibatalkan';
        }

        return sale.payment_status;
    };

    const getStatusClass = (sale) => {
        if (
            sale.transaction_status ===
            'Dibatalkan'
        ) {
            return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
        }

        if (
            sale.payment_status === 'Lunas'
        ) {
            return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
        }

        return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400';
    };

    const getMethodClass = (method) => {
        if (method === 'Kredit') {
            return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400';
        }

        if (method === 'Transfer') {
            return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400';
        }

        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
    };

    const cannotCancel = (sale) => {
        return (
            sale.transaction_status ===
                'Dibatalkan' ||
            Number(
                sale.payments_count || 0,
            ) > 0
        );
    };

    return (
        <Layout
            showSearch={true}
            searchValue={search}
            onSearchChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
                setOpenMenu(null);
            }}
            searchPlaceholder="Cari invoice, pelanggan, atau petugas..."
        >
            <Head title="Transaksi Penjualan" />

            <div className="space-y-3">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Transaksi Penjualan
                        </h1>

                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                            Kelola transaksi penjualan,
                            pembayaran, dan bon pelanggan.
                        </p>
                    </div>

                    <Link
                        href={route(
                            `${routePrefix}.sales.create`,
                        )}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155dfc] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 dark:shadow-[#155dfc]/20 dark:hover:bg-blue-600"
                    >
                        <Plus size={17} />
                        Transaksi Baru
                    </Link>
                </div>

                {successMessage && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                        {errorMessage}
                    </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <select
                            value={paymentStatus}
                            onChange={(e) =>
                                changeFilter(
                                    setPaymentStatus,
                                    e.target.value,
                                )
                            }
                            className={inputClass}
                        >
                            <option value="Aktif">
                                Transaksi Aktif
                            </option>

                            <option value="Semua">
                                Semua Status
                            </option>

                            <option value="Lunas">
                                Lunas
                            </option>

                            <option value="Belum Lunas">
                                Belum Lunas
                            </option>

                            <option value="Dibatalkan">
                                Dibatalkan
                            </option>
                        </select>

                        <select
                            value={paymentMethod}
                            onChange={(e) =>
                                changeFilter(
                                    setPaymentMethod,
                                    e.target.value,
                                )
                            }
                            className={inputClass}
                        >
                            <option value="Semua">
                                Semua Metode Pembayaran
                            </option>

                            <option value="Tunai">
                                Tunai
                            </option>

                            <option value="Transfer">
                                Transfer
                            </option>

                            <option value="Kredit">
                                Kredit
                            </option>
                        </select>

                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) =>
                                changeFilter(
                                    setDateFilter,
                                    e.target.value,
                                )
                            }
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1120px] text-left">
                            <thead className="bg-slate-50 dark:bg-[#131d31]">
                                <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wide text-slate-600 dark:border-[#334155] dark:text-gray-400">
                                    <th className="whitespace-nowrap px-4 py-3">
                                        No. Invoice
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-center">
                                        Tanggal
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3">
                                        Pelanggan
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-right">
                                        Total Transaksi
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-center">
                                        Metode Pembayaran
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-center">
                                        Status Pembayaran
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3">
                                        Dibuat Oleh
                                    </th>

                                    <th className="whitespace-nowrap px-4 py-3 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentSales.length >
                                0 ? (
                                    currentSales.map(
                                        (sale) => {
                                            const isCancelled =
                                                sale.transaction_status ===
                                                'Dibatalkan';

                                            return (
                                                <tr
                                                    key={
                                                        sale.id
                                                    }
                                                    className={`border-b border-slate-100 transition last:border-b-0 dark:border-[#334155] ${
                                                        isCancelled
                                                            ? 'bg-slate-100 dark:bg-[#182235]'
                                                            : 'bg-white hover:bg-slate-50 dark:bg-[#1d293d] dark:hover:bg-[#131d31]'
                                                    }`}
                                                >
                                                    <td className="whitespace-nowrap px-4 py-3">
                                                        <p
                                                            className={`text-xs font-extrabold ${
                                                                isCancelled
                                                                    ? 'text-slate-500 dark:text-gray-400'
                                                                    : 'text-slate-900 dark:text-white'
                                                            }`}
                                                        >
                                                            {
                                                                sale.invoice_number
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-gray-400">
                                                            {
                                                                sale.items_count
                                                            }{' '}
                                                            item
                                                        </p>
                                                    </td>

                                                    <td
                                                        className={`whitespace-nowrap px-4 py-3 text-center text-xs font-semibold ${
                                                            isCancelled
                                                                ? 'text-slate-500 dark:text-gray-500'
                                                                : 'text-slate-600 dark:text-gray-300'
                                                        }`}
                                                    >
                                                        {
                                                            sale.sale_date
                                                        }
                                                    </td>

                                                    <td
                                                        className={`px-4 py-3 text-xs font-semibold ${
                                                            isCancelled
                                                                ? 'text-slate-500 dark:text-gray-500'
                                                                : 'text-slate-600 dark:text-gray-300'
                                                        }`}
                                                    >
                                                        {
                                                            sale.customer_name
                                                        }
                                                    </td>

                                                    <td
                                                        className={`whitespace-nowrap px-4 py-3 text-right text-xs font-extrabold ${
                                                            isCancelled
                                                                ? 'text-slate-500 dark:text-gray-400'
                                                                : 'text-slate-900 dark:text-white'
                                                        }`}
                                                    >
                                                        {
                                                            sale.total_amount_text
                                                        }
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3 text-center">
                                                        <span
                                                            className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${getMethodClass(
                                                                sale.payment_method,
                                                            )}`}
                                                        >
                                                            {
                                                                sale.payment_method
                                                            }
                                                        </span>
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3 text-center">
                                                        <span
                                                            className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${getStatusClass(
                                                                sale,
                                                            )}`}
                                                        >
                                                            {getStatusLabel(
                                                                sale,
                                                            )}
                                                        </span>
                                                    </td>

                                                    <td
                                                        className={`whitespace-nowrap px-4 py-3 text-xs font-semibold ${
                                                            isCancelled
                                                                ? 'text-slate-500 dark:text-gray-500'
                                                                : 'text-slate-600 dark:text-gray-300'
                                                        }`}
                                                    >
                                                        {
                                                            sale.user_name
                                                        }
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <Link
                                                                href={route(
                                                                    `${routePrefix}.sales.bon`,
                                                                    sale.id,
                                                                )}
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#155dfc] transition hover:bg-blue-50 dark:text-[#60a5fa] dark:hover:bg-[#131d31]"
                                                                title="Lihat bon"
                                                            >
                                                                <Printer
                                                                    size={
                                                                        17
                                                                    }
                                                                />
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                onClick={(
                                                                    event,
                                                                ) =>
                                                                    openActionMenu(
                                                                        event,
                                                                        sale,
                                                                    )
                                                                }
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-[#131d31]"
                                                                title="Menu tindakan"
                                                            >
                                                                <MoreVertical
                                                                    size={
                                                                        17
                                                                    }
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-4 py-12 text-center"
                                        >
                                            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                                                Transaksi
                                                tidak
                                                ditemukan
                                            </h2>

                                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                                Coba ubah
                                                pencarian atau
                                                filter
                                                transaksi.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 dark:border-[#334155] md:flex-row md:items-center md:justify-between">
                        <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
                            Menampilkan{' '}
                            <span className="font-extrabold text-slate-700 dark:text-white">
                                {
                                    filteredSales.length
                                }
                            </span>{' '}
                            transaksi
                        </p>

                        {filteredSales.length >
                            0 &&
                            totalPages > 1 && (
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.max(
                                                    safeCurrentPage -
                                                        1,
                                                    1,
                                                ),
                                            )
                                        }
                                        disabled={
                                            safeCurrentPage ===
                                            1
                                        }
                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#334155] dark:text-gray-300 dark:hover:bg-[#131d31]"
                                    >
                                        Sebelumnya
                                    </button>

                                    <span className="text-xs font-bold text-slate-600 dark:text-gray-300">
                                        {
                                            safeCurrentPage
                                        }{' '}
                                        / {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.min(
                                                    safeCurrentPage +
                                                        1,
                                                    totalPages,
                                                ),
                                            )
                                        }
                                        disabled={
                                            safeCurrentPage ===
                                            totalPages
                                        }
                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#334155] dark:text-gray-300 dark:hover:bg-[#131d31]"
                                    >
                                        Selanjutnya
                                    </button>
                                </div>
                            )}
                    </div>
                </div>

                {openMenu &&
                    activeMenuSale && (
                        <>
                            <button
                                type="button"
                                className="fixed inset-0 z-40 cursor-default"
                                onClick={() =>
                                    setOpenMenu(
                                        null,
                                    )
                                }
                            />

                            <div
                                className="fixed z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-[#334155] dark:bg-[#1d293d]"
                                style={{
                                    top: openMenu.top,
                                    left: openMenu.left,
                                }}
                            >
                                <Link
                                    href={route(
                                        `${routePrefix}.sales.bon`,
                                        activeMenuSale.id,
                                    )}
                                    className="block px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:text-gray-200 dark:hover:bg-[#131d31]"
                                >
                                    Lihat Bon
                                </Link>

                                {activeMenuSale.transaction_status ===
                                'Dibatalkan' ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            showCancelDetail(
                                                activeMenuSale,
                                            )
                                        }
                                        className="block w-full px-4 py-2.5 text-left text-xs font-bold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                    >
                                        Detail
                                        Pembatalan
                                    </button>
                                ) : cannotCancel(
                                      activeMenuSale,
                                  ) ? (
                                    <button
                                        type="button"
                                        disabled
                                        title="Transaksi sudah memiliki pembayaran piutang aktif"
                                        className="flex w-full cursor-not-allowed items-center gap-2 bg-slate-100 px-4 py-2.5 text-left text-xs font-bold text-slate-400 dark:bg-[#131d31] dark:text-gray-500"
                                    >
                                        <Ban
                                            size={
                                                15
                                            }
                                        />
                                        Batalkan
                                        Transaksi
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            cancelSale(
                                                activeMenuSale,
                                            )
                                        }
                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-bold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                    >
                                        <Ban
                                            size={
                                                15
                                            }
                                        />
                                        Batalkan
                                        Transaksi
                                    </button>
                                )}
                            </div>
                        </>
                    )}
            </div>
        </Layout>
    );
}