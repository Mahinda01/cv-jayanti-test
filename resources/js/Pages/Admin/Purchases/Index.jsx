import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, PackagePlus, Plus, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function Index({ purchases = [] }) {
    const [openPurchase, setOpenPurchase] = useState(null);

    const cancelPurchase = (purchase) => {
        const reason = window.prompt(
            `Masukkan alasan pembatalan ${purchase.purchase_number}:`,
        );

        if (!reason) {
            return;
        }

        router.patch(route('admin.purchases.cancel', purchase.id), {
            cancel_reason: reason,
        });
    };

    return (
        <AdminLayout>
            <Head title="Transaksi Pembelian" />

            <div className="space-y-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Transaksi Pembelian
                        </h1>
                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                            Pencatatan barang masuk dan penambahan stok produk.
                        </p>
                    </div>

                    <Link
                        href={route('admin.purchases.create')}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155dfc] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 dark:shadow-[#155dfc]/20 dark:hover:bg-blue-600"
                    >
                        <Plus size={16} />
                        Tambah Pembelian
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-[#334155]">
                            <thead className="bg-slate-50 dark:bg-[#131d31]">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                                        No Pembelian
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                                        Tanggal
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                                        Supplier
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                                        Total
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 text-right text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200 dark:divide-[#334155]">
                                {purchases.map((purchase) => (
                                    <tr
                                        key={purchase.id}
                                        className="hover:bg-slate-50 dark:hover:bg-[#131d31]"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                                                {purchase.purchase_number}
                                            </p>
                                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                                {purchase.items_count} item
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-bold text-slate-700 dark:text-gray-300">
                                            {purchase.purchase_date}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-bold text-slate-700 dark:text-gray-300">
                                            {purchase.supplier}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-extrabold text-[#155dfc]">
                                            {purchase.total_amount_text}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                                                    purchase.status === 'Dibatalkan'
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                                                        : 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                                                }`}
                                            >
                                                {purchase.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setOpenPurchase(purchase)
                                                    }
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#155dfc] transition hover:bg-blue-100 dark:bg-[#131d31] dark:hover:bg-[#334155]"
                                                    title="Detail"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                {purchase.status !==
                                                    'Dibatalkan' && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            cancelPurchase(
                                                                purchase,
                                                            )
                                                        }
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                                                        title="Batalkan"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {purchases.length === 0 && (
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
                                                Belum ada transaksi pembelian.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {openPurchase && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                        <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-[#1d293d]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                        Detail Pembelian
                                    </h2>
                                    <p className="mt-1 text-sm font-bold text-slate-500 dark:text-gray-400">
                                        {openPurchase.purchase_number}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setOpenPurchase(null)}
                                    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-[#131d31] dark:text-gray-300"
                                >
                                    Tutup
                                </button>
                            </div>

                            <div className="mt-4 space-y-3">
                                {openPurchase.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-xl border border-slate-200 p-4 dark:border-[#334155]"
                                    >
                                        <p className="font-extrabold text-slate-900 dark:text-white">
                                            {item.product_name}
                                        </p>
                                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                                            {item.quantity} {item.product_unit} x{' '}
                                            {item.purchase_price_text}
                                        </p>
                                        <p className="mt-2 text-sm font-extrabold text-[#155dfc]">
                                            {item.subtotal_text}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-[#131d31]">
                                <p className="text-sm font-bold text-slate-500 dark:text-gray-400">
                                    Total Pembelian
                                </p>
                                <p className="mt-1 text-xl font-extrabold text-[#155dfc]">
                                    {openPurchase.total_amount_text}
                                </p>

                                {openPurchase.cancel_reason && (
                                    <p className="mt-3 text-sm font-medium text-red-500">
                                        Alasan batal:{' '}
                                        {openPurchase.cancel_reason}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}