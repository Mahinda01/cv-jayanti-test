import { FileText, Package, TrendingUp } from 'lucide-react';

export default function StockReport({
    report,
    searchValue = '',
    statusValue = 'Semua',
}) {
    const products = report.products || [];

    const filteredProducts = products.filter((product) => {
        const keyword = searchValue.toLowerCase();

        const matchSearch =
            keyword === '' ||
            String(product.code || '').toLowerCase().includes(keyword) ||
            String(product.name || '').toLowerCase().includes(keyword) ||
            String(product.category || '').toLowerCase().includes(keyword) ||
            String(product.location || '').toLowerCase().includes(keyword);

        const matchStatus =
            statusValue === 'Semua' || product.stock_status === statusValue;

        return matchSearch && matchStatus;
    });

    const summary = {
        total_products: filteredProducts.length,
        active_products: filteredProducts.filter((product) => product.is_active)
            .length,
        low_stock_products: filteredProducts.filter(
            (product) => product.stock_status === 'Menipis',
        ).length,
        empty_stock_products: filteredProducts.filter(
            (product) => product.stock_status === 'Habis',
        ).length,
    };

    const getStockBadgeClass = (status) => {
        if (status === 'Aman') {
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400';
        }

        if (status === 'Menipis') {
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
        }

        if (status === 'Habis') {
            return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
        }

        return 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400';
    };

    const getProductBadgeClass = (status) => {
        if (status === 'Aktif') {
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400';
        }

        return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
    };

    return (
        <div className="space-y-4">
            <ReportTitle icon={Package} title="Laporan Stok" />

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <SummaryBox
                    title="Total Produk"
                    value={summary.total_products}
                    color="blue"
                    icon={Package}
                />

                <SummaryBox
                    title="Produk Aktif"
                    value={summary.active_products}
                    color="green"
                    icon={TrendingUp}
                />

                <SummaryBox
                    title="Stok Menipis"
                    value={summary.low_stock_products}
                    color="yellow"
                    icon={FileText}
                />

                <SummaryBox
                    title="Stok Habis"
                    value={summary.empty_stock_products}
                    color="red"
                    icon={FileText}
                />
            </div>

            <TableWrapper>
                <table className="w-full min-w-[1000px] text-left">
                    <thead>
                        <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wide text-slate-600 dark:border-[#334155] dark:text-gray-400 print:text-black">
                            <th className="px-3 py-2.5">Kode</th>
                            <th className="px-3 py-2.5">Nama Produk</th>
                            <th className="px-3 py-2.5">Kategori</th>
                            <th className="px-3 py-2.5">Stok</th>
                            <th className="px-3 py-2.5">Minimum</th>
                            <th className="px-3 py-2.5">Satuan</th>
                            <th className="px-3 py-2.5">Lokasi</th>
                            <th className="px-3 py-2.5">Status Stok</th>
                            <th className="px-3 py-2.5">Status Produk</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-[#334155] print:divide-slate-200">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <tr
                                    key={product.id}
                                    className="text-[12px] font-semibold text-slate-700 dark:text-gray-200 print:text-black"
                                >
                                    <td className="px-3 py-2.5 font-extrabold text-slate-900 dark:text-white print:text-black">
                                        {product.code}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {product.name}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {product.category}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {product.stock}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {product.minimum_stock}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {product.unit}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {product.location}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        <span
                                            className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${getStockBadgeClass(
                                                product.stock_status,
                                            )}`}
                                        >
                                            {product.stock_status}
                                        </span>
                                    </td>

                                    <td className="px-3 py-2.5">
                                        <span
                                            className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${getProductBadgeClass(
                                                product.product_status,
                                            )}`}
                                        >
                                            {product.product_status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <EmptyRow colSpan={9} />
                        )}
                    </tbody>
                </table>
            </TableWrapper>
        </div>
    );
}

function ReportTitle({ icon: Icon, title }) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-[#155dfc] dark:bg-[#155dfc]/10 dark:text-[#60a5fa] print:hidden">
                <Icon size={20} />
            </div>

            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white print:text-black">
                {title}
            </h2>
        </div>
    );
}

function SummaryBox({ title, value, color, icon: Icon }) {
    const colorClass = {
        blue: 'border-blue-200 bg-blue-50 text-slate-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-white',
        green: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400',
        yellow: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400',
        red: 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400',
    };

    return (
        <div
            className={`rounded-2xl border p-4 shadow-sm print:border-slate-300 print:bg-white print:text-black ${
                colorClass[color] || colorClass.blue
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 print:text-slate-700">
                        {title}
                    </p>

                    <p className="mt-2 text-xl font-extrabold">{value}</p>
                </div>

                <Icon size={18} className="print:hidden" />
            </div>
        </div>
    );
}

function TableWrapper({ children }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-[#334155] print:border-slate-300">
            <div className="overflow-x-auto">{children}</div>
        </div>
    );
}

function EmptyRow({ colSpan }) {
    return (
        <tr>
            <td
                colSpan={colSpan}
                className="px-3 py-8 text-center text-sm font-bold text-slate-500 dark:text-gray-400 print:text-slate-700"
            >
                Tidak ada data laporan.
            </td>
        </tr>
    );
}