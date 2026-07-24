import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Banknote,
    BarChart3,
    CreditCard,
    DollarSign,
    Package,
    ReceiptText,
    TrendingUp,
    Users,
} from 'lucide-react';

function formatNumber(value) {
    return new Intl.NumberFormat('id-ID').format(Number(value || 0));
}

function formatMoney(value) {
    if (typeof value === 'string') {
        return value;
    }

    return `Rp ${formatNumber(value)}`;
}

function SummaryCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconClass,
    valueClass = 'text-slate-900 dark:text-white',
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[12px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                        {title}
                    </p>

                    <h2
                        className={`mt-2 truncate text-[22px] font-extrabold leading-tight ${valueClass}`}
                    >
                        {value}
                    </h2>

                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                        {subtitle}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon size={22} strokeWidth={2.1} />
                </div>
            </div>
        </div>
    );
}

export default function Dashboard({
    summary = {},
    salesChart = [],
    lowStockProducts = [],
    recentSales = [],
}) {
    const totalProducts = summary.total_products || 0;
    const totalCategories = summary.total_categories || 0;
    const totalCustomers = summary.total_customers || 0;

    const salesThisMonth =
        summary.sales_this_month_text || summary.sales_this_month || 0;

    const salesThisMonthCount = summary.sales_this_month_count || 0;

    const totalReceivable =
        summary.total_receivable_text || summary.total_receivable || 0;

    const totalReceivableCount = summary.total_receivable_count || 0;

    const notDueReceivable =
        summary.not_due_receivable_text || summary.not_due_receivable || 0;

    const notDueReceivableCount = summary.not_due_receivable_count || 0;

    const overdueReceivable =
        summary.overdue_receivable_text || summary.overdue_receivable || 0;

    const overdueReceivableCount = summary.overdue_receivable_count || 0;

    const paymentReceived =
        summary.payment_received_this_month_text ||
        summary.payment_received_this_month ||
        0;

    const paymentReceivedCount =
        summary.payment_received_this_month_count || 0;

    const firstCards = [
        {
            title: 'Total Produk',
            value: formatNumber(totalProducts),
            subtitle: `${formatNumber(totalCategories)} kategori`,
            icon: Package,
            iconClass:
                'bg-blue-100 text-[#155dfc] dark:bg-[#155dfc]/15 dark:text-[#60a5fa]',
        },
        {
            title: 'Total Pelanggan',
            value: formatNumber(totalCustomers),
            subtitle: 'Pelanggan aktif',
            icon: Users,
            iconClass:
                'bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400',
        },
        {
            title: 'Penjualan Bulan Ini',
            value: formatMoney(salesThisMonth),
            subtitle: `${formatNumber(salesThisMonthCount)} transaksi`,
            icon: DollarSign,
            iconClass:
                'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
        },
        {
            title: 'Total Piutang',
            value: formatMoney(totalReceivable),
            subtitle: `${formatNumber(totalReceivableCount)} invoice`,
            icon: CreditCard,
            iconClass:
                'bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400',
        },
    ];

    const secondCards = [
        {
            title: 'Piutang Belum Jatuh Tempo',
            value: formatMoney(notDueReceivable),
            subtitle: `${formatNumber(notDueReceivableCount)} invoice`,
            icon: TrendingUp,
            iconClass:
                'bg-blue-100 text-[#155dfc] dark:bg-[#155dfc]/15 dark:text-[#60a5fa]',
            valueClass: 'text-[#155dfc] dark:text-[#60a5fa]',
        },
        {
            title: 'Piutang Jatuh Tempo',
            value: formatMoney(overdueReceivable),
            subtitle: `${formatNumber(overdueReceivableCount)} invoice perlu tindak lanjut`,
            icon: AlertTriangle,
            iconClass:
                'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
            valueClass: 'text-orange-600 dark:text-orange-400',
        },
        {
            title: 'Pembayaran Diterima Bulan Ini',
            value: formatMoney(paymentReceived),
            subtitle: `${formatNumber(paymentReceivedCount)} pembayaran piutang`,
            icon: Banknote,
            iconClass:
                'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
            valueClass: 'text-emerald-600 dark:text-emerald-400',
        },
    ];

    const chartAmount = (item) => {
        return Number(item.amount || item.total || item.value || 0);
    };

    const chartLabel = (item) => {
        return item.label || item.date_text || item.date || '-';
    };

    const maxChartAmount = Math.max(
        1,
        ...salesChart.map((item) => chartAmount(item)),
    );

    const paymentStatusClass = (status) => {
        if (status === 'Lunas') {
            return 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400';
        }

        if (status === 'Belum Lunas') {
            return 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400';
        }

        return 'bg-slate-100 text-slate-700 dark:bg-[#314158] dark:text-slate-200';
    };

    const stockStatusClass = (product) => {
        if (Number(product.stock || 0) <= 0) {
            return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
        }

        return 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400';
    };

    const stockStatusText = (product) => {
        if (Number(product.stock || 0) <= 0) {
            return 'Habis';
        }

        return 'Stok Menipis';
    };

    return (
        <AdminLayout>
            <Head title="Dashboard Admin" />

            <div className="space-y-3">
                <div className="rounded-2xl bg-[#155dfc] p-3.5 text-white shadow-sm">
                    <h1 className="text-lg font-extrabold">
                        Selamat datang, Administrator
                    </h1>

                    <p className="mt-0.5 text-xs font-medium text-blue-100">
                        Ringkasan aktivitas bisnis CV Jayanti Muliatama.
                    </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {firstCards.map((card) => (
                        <SummaryCard key={card.title} {...card} />
                    ))}
                </div>

                <div className="grid gap-3 xl:grid-cols-3">
                    {secondCards.map((card) => (
                        <SummaryCard key={card.title} {...card} />
                    ))}
                </div>

                <div className="grid gap-3 xl:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    Grafik Penjualan 7 Hari Terakhir
                                </h2>

                                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                                    Ringkasan nilai penjualan harian.
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#155dfc] dark:bg-[#155dfc]/15 dark:text-[#60a5fa]">
                                <BarChart3 size={21} />
                            </div>
                        </div>

                        {salesChart.length > 0 ? (
                            <div className="rounded-xl border border-slate-200 px-4 py-4 dark:border-[#334155]">
                                <div className="flex h-[145px] items-end gap-3">
                                    {salesChart.map((item, index) => {
                                        const height = Math.max(
                                            8,
                                            Math.round(
                                                (chartAmount(item) /
                                                    maxChartAmount) *
                                                    120,
                                            ),
                                        );

                                        return (
                                            <div
                                                key={index}
                                                className="flex min-w-0 flex-1 flex-col items-center gap-2"
                                            >
                                                <div className="flex h-[120px] w-full items-end justify-center">
                                                    <div
                                                        className="w-full max-w-[38px] rounded-t-xl bg-[#155dfc]"
                                                        style={{
                                                            height: `${height}px`,
                                                        }}
                                                    />
                                                </div>

                                                <p className="w-full truncate text-center text-[11px] font-bold text-slate-500 dark:text-gray-400">
                                                    {chartLabel(item)}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-[185px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 text-center dark:border-[#334155]">
                                <BarChart3
                                    size={34}
                                    className="text-slate-400 dark:text-gray-500"
                                />

                                <p className="mt-3 text-sm font-bold text-slate-500 dark:text-gray-400">
                                    Belum ada data grafik penjualan.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    Produk Stok Menipis
                                </h2>

                                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                                    Produk yang sudah mencapai batas minimum.
                                </p>
                            </div>

                            <Link
                                href={route('admin.products.index')}
                                className="rounded-xl bg-[#155dfc] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
                            >
                                Lihat Produk
                            </Link>
                        </div>

                        {lowStockProducts.length > 0 ? (
                            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#334155]">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500 dark:bg-[#131d31] dark:text-gray-400">
                                        <tr>
                                            <th className="px-4 py-3">Produk</th>
                                            <th className="px-4 py-3">Stok</th>
                                            <th className="px-4 py-3">Minimum</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-200 dark:divide-[#334155]">
                                        {lowStockProducts.map((product) => (
                                            <tr
                                                key={product.id}
                                                className="text-slate-700 dark:text-gray-200"
                                            >
                                                <td className="px-4 py-3 font-bold">
                                                    {product.name}
                                                </td>

                                                <td className="px-4 py-3 text-slate-500 dark:text-gray-400">
                                                    {product.stock} {product.unit}
                                                </td>

                                                <td className="px-4 py-3 text-slate-500 dark:text-gray-400">
                                                    {product.minimum_stock}{' '}
                                                    {product.unit}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-bold ${stockStatusClass(
                                                            product,
                                                        )}`}
                                                    >
                                                        {stockStatusText(product)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex h-[185px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 text-center dark:border-[#334155]">
                                <Package
                                    size={34}
                                    className="text-slate-400 dark:text-gray-500"
                                />

                                <p className="mt-3 text-sm font-bold text-slate-500 dark:text-gray-400">
                                    Tidak ada produk stok menipis.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                Transaksi Terbaru
                            </h2>

                            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                                Riwayat transaksi penjualan terakhir.
                            </p>
                        </div>

                        <Link
                            href={route('admin.sales.index')}
                            className="rounded-xl bg-[#155dfc] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-blue-700"
                        >
                            Lihat Semua
                        </Link>
                    </div>

                    {recentSales.length > 0 ? (
                        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-[#334155]">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500 dark:bg-[#131d31] dark:text-gray-400">
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
                                                {sale.customer_name || 'Umum'}
                                            </td>

                                            <td className="px-4 py-3">
                                                {sale.sale_date}
                                            </td>

                                            <td className="px-4 py-3 font-bold">
                                                {sale.total_amount_text ||
                                                    formatMoney(
                                                        sale.total_amount,
                                                    )}
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
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 py-8 text-center dark:border-[#334155]">
                            <ReceiptText
                                size={34}
                                className="text-slate-400 dark:text-gray-500"
                            />

                            <p className="mt-3 text-sm font-bold text-slate-500 dark:text-gray-400">
                                Belum ada transaksi terbaru.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}