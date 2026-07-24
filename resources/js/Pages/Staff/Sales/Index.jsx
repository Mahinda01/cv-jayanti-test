import StaffLayout from '@/Layouts/StaffLayout';
import { inputReason, showInfo } from '@/lib/sweetAlert';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Ban, MoreVertical, Plus, Printer } from 'lucide-react';
import { useState } from 'react';

export default function Index({ sales = [] }) {
    const { props } = usePage();
    const successMessage = props.flash?.success;

    const [search, setSearch] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('Aktif');
    const [paymentMethod, setPaymentMethod] = useState('Semua');
    const [dateFilter, setDateFilter] = useState('');
    const [openMenu, setOpenMenu] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const salesPerPage = 10;

    const smoothClass = 'transition-colors duration-300 ease-in-out';

    const inputClass =
        'h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none transition-colors duration-300 ease-in-out focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:focus:ring-[#155dfc]/20';

    const filteredSales = sales.filter((sale) => {
        const keyword = search.toLowerCase();

        const invoice = String(sale.invoice_number || '').toLowerCase();
        const customer = String(sale.customer_name || '').toLowerCase();
        const user = String(sale.user_name || '').toLowerCase();

        const status =
            sale.transaction_status === 'Dibatalkan'
                ? 'Dibatalkan'
                : sale.payment_status;

        const matchSearch =
            invoice.includes(keyword) ||
            customer.includes(keyword) ||
            user.includes(keyword);

        const matchStatus =
            paymentStatus === 'Semua' ||
            (paymentStatus === 'Aktif' &&
                sale.transaction_status !== 'Dibatalkan') ||
            status === paymentStatus;

        const matchMethod =
            paymentMethod === 'Semua' || sale.payment_method === paymentMethod;

        const matchDate =
            dateFilter === '' || sale.sale_date_raw === dateFilter;

        return matchSearch && matchStatus && matchMethod && matchDate;
    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredSales.length / salesPerPage),
    );

    const startIndex = (currentPage - 1) * salesPerPage;

    const currentSales = filteredSales.slice(
        startIndex,
        startIndex + salesPerPage,
    );

    const activeMenuSale = openMenu
        ? sales.find((sale) => sale.id === openMenu.id)
        : null;

    const resetPage = (callback) => {
        setCurrentPage(1);
        callback();
    };

    const openActionMenu = (event, sale) => {
        const button = event.currentTarget;
        const position = button.getBoundingClientRect();

        if (openMenu?.id === sale.id) {
            setOpenMenu(null);
            return;
        }

        setOpenMenu({
            id: sale.id,
            top: position.bottom + 8,
            left: position.right - 176,
        });
    };

    const cancelSale = async (sale) => {
        setOpenMenu(null);

        if (!sale || sale.transaction_status === 'Dibatalkan') {
            return;
        }
const reason = await inputReason({
            title: 'Batalkan transaksi?',
            inputPlaceholder: 'Tulis alasan pembatalan...',
            confirmButtonText: 'Batalkan',
        });

        if (!reason) {
            return;
        }

        router.patch(
            route('staff.sales.cancel', sale.id),
            {
                cancel_reason: reason.trim(),
            },
            {
                preserveScroll: true,
            },
        );
    };

    const showCancelDetail = (sale) => {
        setOpenMenu(null);

        showInfo({
            title: 'Alasan Pembatalan',
            text: sale.cancel_reason || 'Alasan pembatalan belum tersedia.',
            confirmButtonText: 'Tutup',
        });
    };

    const getStatusLabel = (sale) => {
        if (sale.transaction_status === 'Dibatalkan') {
            return 'Dibatalkan';
        }

        return sale.payment_status;
    };

    const getStatusClass = (sale) => {
        if (sale.transaction_status === 'Dibatalkan') {
            return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
        }

        if (sale.payment_status === 'Lunas') {
            return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
        }

        return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400';
    };

    const getMethodClass = (method) => {
        if (method === 'Kredit') {
            return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400';
        }

        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
    };

    const cannotCancel = (sale) => {
        return (
            sale.transaction_status === 'Dibatalkan' ||
            (sale.payment_method === 'Kredit' &&
                Number(sale.payments_count || 0) > 0)
        );
    };

    return (
        <StaffLayout
            showSearch={true}
            searchValue={search}
            onSearchChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
            }}
            searchPlaceholder="Cari invoice, pelanggan, atau petugas..."
        >
            <Head title="Transaksi Penjualan" />

            <div className={`space-y-3 ${smoothClass}`}>
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-extrabold text-slate-900 transition-colors duration-300 ease-in-out dark:text-white">
                        Transaksi Penjualan
                    </h1>

                    <Link
                        href={route('staff.sales.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#155dfc] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-colors duration-300 ease-in-out hover:bg-blue-700 dark:bg-[#155dfc] dark:shadow-[#155dfc]/20 dark:hover:bg-blue-600"
                    >
                        <Plus size={17} />
                        Transaksi Baru
                    </Link>
                </div>

                {successMessage && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition-colors duration-300 ease-in-out dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400">
                        {successMessage}
                    </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm transition-colors duration-300 ease-in-out dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <select
                            value={paymentStatus}
                            onChange={(e) =>
                                resetPage(() =>
                                    setPaymentStatus(e.target.value),
                                )
                            }
                            className={inputClass}
                        >
                            <option value="Aktif">Transaksi Aktif</option>
                            <option value="Semua">Semua Status</option>
                            <option value="Lunas">Lunas</option>
                            <option value="Belum Lunas">Belum Lunas</option>
                            <option value="Dibatalkan">Dibatalkan</option>
                        </select>

                        <select
                            value={paymentMethod}
                            onChange={(e) =>
                                resetPage(() =>
                                    setPaymentMethod(e.target.value),
                                )
                            }
                            className={inputClass}
                        >
                            <option value="Semua">
                                Semua Metode Pembayaran
                            </option>
                            <option value="Tunai">Tunai</option>
                            <option value="Transfer">Transfer</option>
                            <option value="Kredit">Kredit</option>
                        </select>

                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) =>
                                resetPage(() => setDateFilter(e.target.value))
                            }
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 ease-in-out dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1120px] text-left">
                            <thead className="bg-slate-50 transition-colors duration-300 ease-in-out dark:bg-[#131d31]">
                                <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wide text-slate-600 transition-colors duration-300 ease-in-out dark:border-[#334155] dark:text-gray-400">
                                    <th className="whitespace-nowrap px-4 py-3 text-left">
                                        No. Invoice
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-center">
                                        Tanggal
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left">
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
                                    <th className="whitespace-nowrap px-4 py-3 text-left">
                                        Dibuat Oleh
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentSales.length > 0 ? (
                                    currentSales.map((sale) => {
                                        const isCancelled =
                                            sale.transaction_status ===
                                            'Dibatalkan';

                                        const rowClass = isCancelled
                                            ? 'bg-slate-100 text-slate-500 dark:bg-[#182235]'
                                            : 'bg-white hover:bg-slate-50 dark:bg-[#1d293d] dark:hover:bg-[#131d31]';

                                        const mainTextClass = isCancelled
                                            ? 'text-slate-500 dark:text-gray-400'
                                            : 'text-slate-900 dark:text-white';

                                        const secondaryTextClass = isCancelled
                                            ? 'text-slate-500 dark:text-gray-500'
                                            : 'text-slate-600 dark:text-gray-300';

                                        return (
                                            <tr
                                                key={sale.id}
                                                className={`border-b border-slate-100 transition-colors duration-300 ease-in-out last:border-b-0 dark:border-[#334155] ${rowClass}`}
                                            >
                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-xs font-extrabold transition-colors duration-300 ease-in-out ${mainTextClass}`}
                                                >
                                                    {sale.invoice_number}
                                                </td>

                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-center text-xs font-semibold transition-colors duration-300 ease-in-out ${secondaryTextClass}`}
                                                >
                                                    {sale.sale_date}
                                                </td>

                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-xs font-semibold transition-colors duration-300 ease-in-out ${secondaryTextClass}`}
                                                >
                                                    {sale.customer_name}
                                                </td>

                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-right text-xs font-extrabold transition-colors duration-300 ease-in-out ${mainTextClass}`}
                                                >
                                                    {sale.total_amount_text}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-center">
                                                    <span
                                                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold transition-colors duration-300 ease-in-out ${getMethodClass(
                                                            sale.payment_method,
                                                        )}`}
                                                    >
                                                        {sale.payment_method}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-center">
                                                    <span
                                                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold transition-colors duration-300 ease-in-out ${getStatusClass(
                                                            sale,
                                                        )}`}
                                                    >
                                                        {getStatusLabel(sale)}
                                                    </span>
                                                </td>

                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-xs font-semibold transition-colors duration-300 ease-in-out ${secondaryTextClass}`}
                                                >
                                                    {sale.user_name}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <Link
                                                            href={route(
                                                                'staff.sales.bon',
                                                                sale.id,
                                                            )}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#155dfc] transition-colors duration-300 ease-in-out hover:bg-blue-50 dark:text-[#3B82F6] dark:hover:bg-[#131d31]"
                                                            title="Cetak Bon"
                                                        >
                                                            <Printer size={17} />
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={(event) =>
                                                                openActionMenu(
                                                                    event,
                                                                    sale,
                                                                )
                                                            }
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors duration-300 ease-in-out hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-[#131d31]"
                                                            title="Menu"
                                                        >
                                                            <MoreVertical
                                                                size={17}
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-4 py-10 text-center"
                                        >
                                            <h2 className="text-base font-extrabold text-slate-900 transition-colors duration-300 ease-in-out dark:text-white">
                                                Transaksi tidak ditemukan
                                            </h2>

                                            <p className="mt-1 text-xs font-medium text-slate-500 transition-colors duration-300 ease-in-out dark:text-gray-400">
                                                Coba ubah pencarian atau filter transaksi.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 transition-colors duration-300 ease-in-out dark:border-[#334155] md:flex-row md:items-center md:justify-between">
                        <p className="text-xs font-medium text-slate-500 transition-colors duration-300 ease-in-out dark:text-gray-400">
                            Menampilkan{' '}
                            <span className="font-extrabold text-slate-700 transition-colors duration-300 ease-in-out dark:text-white">
                                {filteredSales.length}
                            </span>{' '}
                            transaksi
                        </p>

                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.max(page - 1, 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors duration-300 ease-in-out hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#334155] dark:text-gray-300 dark:hover:bg-[#131d31]"
                                >
                                    Sebelumnya
                                </button>

                                <span className="text-xs font-bold text-slate-600 dark:text-gray-300">
                                    {currentPage} / {totalPages}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.min(page + 1, totalPages),
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors duration-300 ease-in-out hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#334155] dark:text-gray-300 dark:hover:bg-[#131d31]"
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {openMenu && activeMenuSale && (
                    <>
                        <button
                            type="button"
                            className="fixed inset-0 z-40 cursor-default"
                            onClick={() => setOpenMenu(null)}
                        />

                        <div
                            className="fixed z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl transition-colors duration-300 ease-in-out dark:border-[#334155] dark:bg-[#1d293d]"
                            style={{
                                top: openMenu.top,
                                left: openMenu.left,
                            }}
                        >
                            <Link
                                href={route(
                                    'staff.sales.bon',
                                    activeMenuSale.id,
                                )}
                                className="block px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors duration-300 ease-in-out hover:bg-slate-50 dark:text-gray-200 dark:hover:bg-[#131d31]"
                            >
                                Lihat Bon
                            </Link>

                            {activeMenuSale.transaction_status ===
                            'Dibatalkan' ? (
                                <button
                                    type="button"
                                    onClick={() =>
                                        showCancelDetail(activeMenuSale)
                                    }
                                    className="block w-full whitespace-nowrap px-4 py-2.5 text-left text-xs font-bold text-red-600 transition-colors duration-300 ease-in-out hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                >
                                    Alasan
                                </button>
                            ) : cannotCancel(activeMenuSale) ? (
                                <button
                                    type="button"
                                    disabled
                                    title="Transaksi kredit yang sudah memiliki pembayaran piutang tidak dapat dibatalkan"
                                    className="flex w-full cursor-not-allowed items-center gap-2 bg-slate-100 px-4 py-2.5 text-left text-xs font-bold text-slate-400 transition-colors duration-300 ease-in-out dark:bg-[#131d31] dark:text-gray-500"
                                >
                                    <Ban size={15} />
                                    Batalkan Transaksi
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() =>
                                        cancelSale(activeMenuSale)
                                    }
                                    title="Batalkan Transaksi"
                                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-bold text-red-600 transition-colors duration-300 ease-in-out hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                                >
                                    <Ban size={15} />
                                    Batalkan Transaksi
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </StaffLayout>
    );
}