import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Box,
    Package,
    Plus,
    ReceiptText,
    ShoppingCart,
    UserPlus,
    Users,
} from 'lucide-react';

export default function Dashboard({
    summary = {},
    lowStockProducts = [],
    recentSales = [],
    user = {},
}) {
    const paymentStatusClass = (status) => {
        if (status === 'Lunas') {
            return 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400';
        }

        if (status === 'Belum Lunas') {
            return 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400';
        }

        return 'bg-slate-100 text-slate-700 dark:bg-[#314158] dark:text-slate-200';
    };

    const stockStatusClass = (stock, minimumStock) => {
        if (Number(stock) <= Number(minimumStock)) {
            return 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400';
        }

        return 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400';
    };

    return (
        <StaffLayout>
            <Head title="Dashboard Staff" />

            <div className="space-y-2.5">
                <section className="rounded-[20px] bg-[#155dfc] px-6 py-4 text-white shadow-sm">
                    <h1 className="text-lg font-extrabold">
                        Selamat datang, {user?.name || 'Staff Operasional'}
                    </h1>

                    <p className="mt-1.5 text-sm font-medium text-blue-100">
                        Berikut ringkasan aktivitas operasional hari ini
                    </p>
                </section>

                <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                                    Transaksi Hari Ini
                                </p>

                                <h2 className="mt-1.5 text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {summary.today_sales_count || 0}
                                </h2>

                                <p className="mt-1 text-sm font-semibold text-[#155dfc] dark:text-[#60a5fa]">
                                    Transaksi
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-[#155dfc] dark:bg-[#155dfc]/15 dark:text-[#60a5fa]">
                                <ShoppingCart size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                                    Produk Aktif
                                </p>

                                <h2 className="mt-1.5 text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {summary.total_products || 0}
                                </h2>

                                <p className="mt-1 text-sm font-semibold text-purple-600 dark:text-purple-400">
                                    Produk
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
                                <Box size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                                    Pelanggan Aktif
                                </p>

                                <h2 className="mt-1.5 text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {summary.total_customers || 0}
                                </h2>

                                <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                    Pelanggan
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                                <Users size={22} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                                    Produk Stok Menipis
                                </p>

                                <h2 className="mt-1.5 text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {summary.low_stock_count || 0}
                                </h2>

                                <p className="mt-1 text-sm font-semibold text-orange-600 dark:text-orange-400">
                                    Produk
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                                <AlertTriangle size={22} />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        Aksi Cepat
                    </h2>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                        <Link
                            href={route('staff.sales.create')}
                            className="group rounded-2xl border-2 border-[#155dfc] bg-white p-4 transition hover:-translate-y-0.5 hover:bg-blue-50 dark:bg-[#1d293d] dark:hover:bg-[#131d31]"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-[#155dfc] dark:bg-[#155dfc]/15 dark:text-[#60a5fa]">
                                <Plus size={24} />
                            </div>

                            <h3 className="mt-4 text-lg font-extrabold text-slate-900 dark:text-white">
                                Transaksi Baru
                            </h3>

                            <p className="mt-2 text-sm font-semibold leading-5 text-slate-500 dark:text-gray-400">
                                Catat transaksi penjualan dan buat bon digital
                            </p>
                        </Link>

                        <Link
                            href={route('staff.customers.create')}
                            className="group rounded-2xl border-2 border-emerald-600 bg-white p-4 transition hover:-translate-y-0.5 hover:bg-emerald-50 dark:bg-[#1d293d] dark:hover:bg-[#131d31]"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                                <UserPlus size={24} />
                            </div>

                            <h3 className="mt-4 text-lg font-extrabold text-slate-900 dark:text-white">
                                Tambah Pelanggan
                            </h3>

                            <p className="mt-2 text-sm font-semibold leading-5 text-slate-500 dark:text-gray-400">
                                Tambahkan data pelanggan baru
                            </p>
                        </Link>

                        <Link
                            href={route('staff.products.create')}
                            className="group rounded-2xl border-2 border-purple-600 bg-white p-4 transition hover:-translate-y-0.5 hover:bg-purple-50 dark:bg-[#1d293d] dark:hover:bg-[#131d31]"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
                                <Package size={24} />
                            </div>

                            <h3 className="mt-4 text-lg font-extrabold text-slate-900 dark:text-white">
                                Tambah Produk
                            </h3>

                            <p className="mt-2 text-sm font-semibold leading-5 text-slate-500 dark:text-gray-400">
                                Tambahkan data produk baru jika diperlukan
                            </p>
                        </Link>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                            Peringatan Minimum Safety Stock
                        </h2>

                        <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">
                            {summary.low_stock_count || 0} Produk
                        </span>
                    </div>

                    {lowStockProducts.length > 0 ? (
                        <div className="overflow-hidden rounded-xl">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500 dark:bg-[#131d31] dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3">Nama Produk</th>
                                        <th className="px-4 py-3">Stok Saat Ini</th>
                                        <th className="px-4 py-3">Minimum Stock</th>
                                        <th className="px-4 py-3">Status Stok</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200 dark:divide-[#334155]">
                                    {lowStockProducts.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="text-slate-700 dark:text-gray-200"
                                        >
                                            <td className="px-4 py-3 font-extrabold">
                                                {product.name}
                                            </td>

                                            <td className="px-4 py-3 font-medium text-slate-500 dark:text-gray-400">
                                                {product.stock} {product.unit}
                                            </td>

                                            <td className="px-4 py-3 font-medium text-slate-500 dark:text-gray-400">
                                                {product.minimum_stock} {product.unit}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold ${stockStatusClass(
                                                        product.stock,
                                                        product.minimum_stock,
                                                    )}`}
                                                >
                                                    Stok Menipis
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 py-8 text-center dark:border-[#334155]">
                            <p className="text-sm font-bold text-slate-500 dark:text-gray-400">
                                Belum ada produk yang mencapai minimum safety stock.
                            </p>
                        </div>
                    )}
                </section>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                Transaksi Terbaru
                            </h2>

                            <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                                Riwayat transaksi penjualan terakhir.
                            </p>
                        </div>

                        <Link
                            href={route('staff.sales.index')}
                            className="rounded-xl bg-[#155dfc] px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                            Lihat Semua
                        </Link>
                    </div>

                    {recentSales.length > 0 ? (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#334155]">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-[#131d31] dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3">Invoice</th>
                                        <th className="px-4 py-3">Pelanggan</th>
                                        <th className="px-4 py-3">Tanggal</th>
                                        <th className="px-4 py-3">Total</th>
                                        <th className="px-4 py-3">Metode</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200 dark:divide-[#334155]">
                                    {recentSales.map((sale) => (
                                        <tr
                                            key={sale.id}
                                            className="text-slate-700 dark:text-gray-200"
                                        >
                                            <td className="px-4 py-3 font-bold">
                                                {sale.invoice_number}
                                            </td>

                                            <td className="px-4 py-3">
                                                {sale.customer_name}
                                            </td>

                                            <td className="px-4 py-3">
                                                {sale.sale_date}
                                            </td>

                                            <td className="px-4 py-3 font-bold">
                                                {sale.total_amount_text}
                                            </td>

                                            <td className="px-4 py-3">
                                                {sale.payment_method}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold ${paymentStatusClass(
                                                        sale.payment_status,
                                                    )}`}
                                                >
                                                    {sale.payment_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-10 text-center dark:border-[#334155]">
                            <ReceiptText
                                size={38}
                                className="text-slate-400 dark:text-gray-500"
                            />

                            <p className="mt-3 text-sm font-bold text-slate-600 dark:text-gray-300">
                                Belum ada transaksi terbaru.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </StaffLayout>
    );
}