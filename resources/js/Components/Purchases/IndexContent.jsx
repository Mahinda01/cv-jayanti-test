import { confirmStatus } from '@/lib/sweetAlert';
import {
    Head,
    Link,
    router,
    usePage,
} from '@inertiajs/react';
import {
    Eye,
    PackagePlus,
    Plus,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

export default function IndexContent({
    Layout,
    purchases = [],
    routePrefix,
}) {
    const { props } = usePage();

    const successMessage = props.flash?.success;
    const errorMessage = props.flash?.error;

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] =
        useState('Semua');
    const [currentPage, setCurrentPage] = useState(1);
    const [openPurchase, setOpenPurchase] =
        useState(null);

    const purchasesPerPage = 10;

    const filteredPurchases = purchases.filter(
        (purchase) => {
            const keyword = search.trim().toLowerCase();

            const matchSearch =
                String(
                    purchase.purchase_number || '',
                )
                    .toLowerCase()
                    .includes(keyword) ||
                String(purchase.supplier || '')
                    .toLowerCase()
                    .includes(keyword) ||
                String(purchase.purchase_date || '')
                    .toLowerCase()
                    .includes(keyword) ||
                String(purchase.created_by || '')
                    .toLowerCase()
                    .includes(keyword);

            const matchStatus =
                statusFilter === 'Semua' ||
                purchase.status === statusFilter;

            return matchSearch && matchStatus;
        },
    );

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredPurchases.length /
                purchasesPerPage,
        ),
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages,
    );

    const startIndex =
        (safeCurrentPage - 1) * purchasesPerPage;

    const currentPurchases =
        filteredPurchases.slice(
            startIndex,
            startIndex + purchasesPerPage,
        );

    const cancelPurchase = async (purchase) => {
        const reason = window.prompt(
            `Masukkan alasan pembatalan ${purchase.purchase_number}:`,
        );

        if (reason === null) {
            return;
        }

        if (reason.trim() === '') {
            window.alert(
                'Alasan pembatalan wajib diisi.',
            );

            return;
        }

        const confirmed = await confirmStatus({
            title: 'Batalkan transaksi pembelian?',
            text: `Alasan pembatalan: ${reason.trim()}`,
            confirmButtonText: 'Ya, Batalkan',
        });

        if (!confirmed) {
            return;
        }

        router.patch(
            route(
                `${routePrefix}.purchases.cancel`,
                purchase.id,
            ),
            {
                cancel_reason: reason.trim(),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpenPurchase(null);
                },
            },
        );
    };

    const selectClass =
        'h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:focus:ring-[#155dfc]/20';

    return (
        <Layout
            showSearch={true}
            searchValue={search}
            onSearchChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
            }}
            searchPlaceholder="Cari nomor pembelian, supplier, tanggal, atau pencatat..."
        >
            <Head title="Transaksi Pembelian" />

            <div className="space-y-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Transaksi Pembelian
                        </h1>
                    </div>

                    <Link
                        href={route(
                            `${routePrefix}.purchases.create`,
                        )}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155dfc] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 dark:shadow-[#155dfc]/20 dark:hover:bg-blue-600"
                    >
                        <Plus size={16} />
                        Tambah Pembelian
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
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(
                                e.target.value,
                            );
                            setCurrentPage(1);
                        }}
                        className={selectClass}
                    >
                        <option value="Semua">
                            Semua Status Pembelian
                        </option>

                        <option value="Selesai">
                            Selesai
                        </option>

                        <option value="Dibatalkan">
                            Dibatalkan
                        </option>
                    </select>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left">
                            <thead className="bg-slate-50 dark:bg-[#131d31]">
                                <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wide text-slate-600 dark:border-[#334155] dark:text-gray-400">
                                    <th className="px-4 py-3">
                                        No. Pembelian
                                    </th>

                                    <th className="px-4 py-3">
                                        Tanggal
                                    </th>

                                    <th className="px-4 py-3">
                                        Supplier
                                    </th>

                                    <th className="px-4 py-3 text-right">
                                        Total
                                    </th>

                                    <th className="px-4 py-3 text-center">
                                        Status
                                    </th>

                                    <th className="px-4 py-3 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentPurchases.length >
                                0 ? (
                                    currentPurchases.map(
                                        (purchase) => {
                                            const cancelled =
                                                purchase.status ===
                                                'Dibatalkan';

                                            return (
                                                <tr
                                                    key={
                                                        purchase.id
                                                    }
                                                    className={`border-b border-slate-100 transition last:border-b-0 dark:border-[#334155] ${
                                                        cancelled
                                                            ? 'bg-slate-100 dark:bg-[#182235]'
                                                            : 'bg-white hover:bg-slate-50 dark:bg-[#1d293d] dark:hover:bg-[#131d31]'
                                                    }`}
                                                >
                                                    <td className="px-4 py-3">
                                                        <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                                                            {
                                                                purchase.purchase_number
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                                            {
                                                                purchase.items_count
                                                            }{' '}
                                                            item
                                                        </p>
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3 text-xs font-bold text-slate-700 dark:text-gray-300">
                                                        {
                                                            purchase.purchase_date
                                                        }
                                                    </td>

                                                    <td className="px-4 py-3 text-xs font-bold text-slate-700 dark:text-gray-300">
                                                        {
                                                            purchase.supplier
                                                        }
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3 text-right text-xs font-extrabold text-[#155dfc]">
                                                        {
                                                            purchase.total_amount_text
                                                        }
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3 text-center">
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                                                                cancelled
                                                                    ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                                                                    : 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                                                            }`}
                                                        >
                                                            {
                                                                purchase.status
                                                            }
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setOpenPurchase(
                                                                        purchase,
                                                                    )
                                                                }
                                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#155dfc] transition hover:bg-blue-100 dark:bg-[#131d31] dark:hover:bg-[#334155]"
                                                                title="Lihat detail"
                                                            >
                                                                <Eye
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                            </button>

                                                            {!cancelled && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        cancelPurchase(
                                                                            purchase,
                                                                        )
                                                                    }
                                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                                                                    title="Batalkan pembelian"
                                                                >
                                                                    <XCircle
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-5 py-12 text-center"
                                        >
                                            <PackagePlus
                                                size={42}
                                                className="mx-auto text-slate-300 dark:text-gray-600"
                                            />

                                            <p className="mt-3 text-sm font-bold text-slate-500 dark:text-gray-400">
                                                Transaksi pembelian
                                                tidak ditemukan.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 dark:border-[#334155] sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
                            Menampilkan{' '}
                            <span className="font-extrabold text-slate-700 dark:text-white">
                                {
                                    filteredPurchases.length
                                }
                            </span>{' '}
                            transaksi pembelian
                        </p>

                        {filteredPurchases.length > 0 &&
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
                                            safeCurrentPage === 1
                                        }
                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#334155] dark:text-gray-300 dark:hover:bg-[#131d31]"
                                    >
                                        Sebelumnya
                                    </button>

                                    <span className="text-xs font-bold text-slate-600 dark:text-gray-300">
                                        {safeCurrentPage} /{' '}
                                        {totalPages}
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

                {openPurchase && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                        <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-[#1d293d]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                        Detail Pembelian
                                    </h2>

                                    <p className="mt-1 text-sm font-bold text-slate-500 dark:text-gray-400">
                                        {
                                            openPurchase.purchase_number
                                        }
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenPurchase(null)
                                    }
                                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-[#131d31] dark:text-gray-300"
                                >
                                    Tutup
                                </button>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 text-sm dark:bg-[#131d31] sm:grid-cols-2">
                                <div>
                                    <p className="font-medium text-slate-500 dark:text-gray-400">
                                        Tanggal
                                    </p>

                                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
                                        {
                                            openPurchase.purchase_date
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium text-slate-500 dark:text-gray-400">
                                        Supplier
                                    </p>

                                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
                                        {
                                            openPurchase.supplier
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium text-slate-500 dark:text-gray-400">
                                        Dicatat oleh
                                    </p>

                                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
                                        {
                                            openPurchase.created_by
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium text-slate-500 dark:text-gray-400">
                                        Status
                                    </p>

                                    <p className="mt-1 font-bold text-slate-900 dark:text-white">
                                        {
                                            openPurchase.status
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                {openPurchase.items.map(
                                    (item) => (
                                        <div
                                            key={item.id}
                                            className="rounded-xl border border-slate-200 p-4 dark:border-[#334155]"
                                        >
                                            <p className="font-extrabold text-slate-900 dark:text-white">
                                                {
                                                    item.product_name
                                                }
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                                                {item.quantity}{' '}
                                                {
                                                    item.product_unit
                                                }{' '}
                                                ×{' '}
                                                {
                                                    item.purchase_price_text
                                                }
                                            </p>

                                            <p className="mt-2 text-sm font-extrabold text-[#155dfc]">
                                                {
                                                    item.subtotal_text
                                                }
                                            </p>
                                        </div>
                                    ),
                                )}
                            </div>

                            <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-[#131d31]">
                                <p className="text-sm font-bold text-slate-500 dark:text-gray-400">
                                    Total Pembelian
                                </p>

                                <p className="mt-1 text-xl font-extrabold text-[#155dfc]">
                                    {
                                        openPurchase.total_amount_text
                                    }
                                </p>

                                {openPurchase.note && (
                                    <div className="mt-4">
                                        <p className="text-xs font-bold uppercase text-slate-500 dark:text-gray-400">
                                            Catatan
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-slate-700 dark:text-gray-300">
                                            {
                                                openPurchase.note
                                            }
                                        </p>
                                    </div>
                                )}

                                {openPurchase.cancel_reason && (
                                    <div className="mt-4 rounded-lg bg-red-50 p-3 dark:bg-red-500/10">
                                        <p className="text-sm font-bold text-red-600 dark:text-red-400">
                                            Alasan pembatalan
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">
                                            {
                                                openPurchase.cancel_reason
                                            }
                                        </p>

                                        {openPurchase.cancelled_by && (
                                            <p className="mt-2 text-xs font-medium text-red-500">
                                                Dibatalkan oleh{' '}
                                                {
                                                    openPurchase.cancelled_by
                                                }
                                                {openPurchase.cancelled_at
                                                    ? ` pada ${openPurchase.cancelled_at}`
                                                    : ''}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}