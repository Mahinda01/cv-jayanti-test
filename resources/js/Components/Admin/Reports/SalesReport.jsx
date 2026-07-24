import {
    Banknote,
    CreditCard,
    FileText,
    ShoppingCart,
    TrendingUp,
} from 'lucide-react';

export default function SalesReport({ report }) {
    const summary = report.summary || {};
    const sales = report.sales || [];

    const getStatusBadgeClass = (status) => {
        if (status === 'Lunas') {
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400';
        }

        if (status === 'Belum Lunas') {
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
        }

        return 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400';
    };

    return (
        <div className="space-y-4">
            <ReportTitle icon={FileText} title="Laporan Penjualan" />

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <SummaryBox
                    title="Total Transaksi"
                    value={summary.transaction_count || 0}
                    color="blue"
                    icon={ShoppingCart}
                />

                <SummaryBox
                    title="Total Penjualan"
                    value={summary.total_sales || 'Rp 0'}
                    color="green"
                    icon={Banknote}
                />

                <SummaryBox
                    title="Total Dibayar"
                    value={summary.total_paid || 'Rp 0'}
                    color="green"
                    icon={TrendingUp}
                />

                <SummaryBox
                    title="Total Piutang"
                    value={summary.total_remaining || 'Rp 0'}
                    color="yellow"
                    icon={CreditCard}
                />
            </div>

            <TableWrapper>
                <table className="w-full min-w-[1000px] text-left">
                    <thead>
                        <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wide text-slate-600 dark:border-[#334155] dark:text-gray-400 print:text-black">
                            <th className="px-3 py-2.5">Tanggal</th>
                            <th className="px-3 py-2.5">No. Invoice</th>
                            <th className="px-3 py-2.5">Pelanggan</th>
                            <th className="px-3 py-2.5">Total Transaksi</th>
                            <th className="px-3 py-2.5">Metode Pembayaran</th>
                            <th className="px-3 py-2.5">Status Pembayaran</th>
                            <th className="px-3 py-2.5">Dibuat Oleh</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-[#334155] print:divide-slate-200">
                        {sales.length > 0 ? (
                            sales.map((sale) => (
                                <tr
                                    key={sale.id}
                                    className="text-[12px] font-semibold text-slate-700 dark:text-gray-200 print:text-black"
                                >
                                    <td className="px-3 py-2.5">
                                        {sale.sale_date}
                                    </td>

                                    <td className="px-3 py-2.5 font-extrabold text-slate-900 dark:text-white print:text-black">
                                        {sale.invoice_number}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {sale.customer_name}
                                    </td>

                                    <td className="px-3 py-2.5 font-extrabold text-slate-900 dark:text-white print:text-black">
                                        {sale.total_amount_text}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {sale.payment_method}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        <span
                                            className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${getStatusBadgeClass(
                                                sale.payment_status,
                                            )}`}
                                        >
                                            {sale.payment_status}
                                        </span>
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {sale.created_by}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <EmptyRow colSpan={7} />
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