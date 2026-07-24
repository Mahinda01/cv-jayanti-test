import { Banknote, CreditCard, FileText } from 'lucide-react';

export default function ReceivableReport({
    report,
    statusValue = 'Semua',
}) {
    const receivables = report.receivables || [];

    const filteredReceivables = receivables.filter((item) => {
        return (
            statusValue === 'Semua' ||
            item.receivable_status === statusValue
        );
    });

    const summary = {
        receivable_count: filteredReceivables.length,
        total_receivable: totalMoney(
            filteredReceivables.reduce(
                (total, item) => total + Number(item.remaining_amount || 0),
                0,
            ),
        ),
        not_due_count: filteredReceivables.filter(
            (item) => item.receivable_status === 'Belum Lunas',
        ).length,
        overdue_count: filteredReceivables.filter(
            (item) => item.receivable_status === 'Jatuh Tempo',
        ).length,
    };

    const getStatusBadgeClass = (status) => {
        if (status === 'Belum Lunas') {
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
        }

        if (status === 'Jatuh Tempo') {
            return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
        }

        return 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400';
    };

    return (
        <div className="space-y-4">
            <ReportTitle icon={CreditCard} title="Laporan Piutang" />

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <SummaryBox
                    title="Jumlah Data"
                    value={summary.receivable_count}
                    description="Data piutang pada periode laporan"
                    color="blue"
                    icon={CreditCard}
                />

                <SummaryBox
                    title="Total Sisa Piutang"
                    value={summary.total_receivable}
                    description="Total tagihan yang belum lunas"
                    color="yellow"
                    icon={Banknote}
                />

                <SummaryBox
                    title="Belum Jatuh Tempo"
                    value={summary.not_due_count}
                    description="Belum melewati batas bayar"
                    color="green"
                    icon={FileText}
                />

                <SummaryBox
                    title="Jatuh Tempo"
                    value={summary.overdue_count}
                    description="Sudah melewati batas bayar"
                    color="red"
                    icon={FileText}
                />
            </div>

            <TableWrapper>
                <table className="w-full min-w-[1120px] text-left">
                    <thead>
                        <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wide text-slate-600 dark:border-[#334155] dark:text-gray-400 print:text-black">
                            <th className="px-3 py-2.5">Invoice</th>
                            <th className="px-3 py-2.5">Kode</th>
                            <th className="px-3 py-2.5">Pelanggan</th>
                            <th className="px-3 py-2.5">Kontak</th>
                            <th className="px-3 py-2.5">Tanggal</th>
                            <th className="px-3 py-2.5">Jatuh Tempo</th>
                            <th className="px-3 py-2.5">Total</th>
                            <th className="px-3 py-2.5">Dibayar</th>
                            <th className="px-3 py-2.5">Sisa</th>
                            <th className="px-3 py-2.5">Status</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-[#334155] print:divide-slate-200">
                        {filteredReceivables.length > 0 ? (
                            filteredReceivables.map((item) => (
                                <tr
                                    key={item.id}
                                    className="text-[12px] font-semibold text-slate-700 dark:text-gray-200 print:text-black"
                                >
                                    <td className="px-3 py-2.5 font-extrabold text-slate-900 dark:text-white print:text-black">
                                        {item.invoice_number}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {item.customer_code}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {item.customer_name}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {item.customer_contact}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {item.sale_date}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {item.due_date}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {item.total_amount_text}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {item.paid_amount_text}
                                    </td>

                                    <td className="px-3 py-2.5 font-extrabold text-red-600 dark:text-red-400 print:text-black">
                                        {item.remaining_amount_text}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        <span
                                            className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${getStatusBadgeClass(
                                                item.receivable_status,
                                            )}`}
                                        >
                                            {item.receivable_status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <EmptyRow colSpan={10} />
                        )}
                    </tbody>
                </table>
            </TableWrapper>
        </div>
    );
}

function totalMoney(value) {
    return 'Rp ' + new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 0,
    }).format(value || 0);
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

function SummaryBox({ title, value, description, color, icon: Icon }) {
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
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 print:text-slate-700">
                        {title}
                    </p>

                    <p className="mt-2 text-xl font-extrabold">{value}</p>

                    <p className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-gray-400 print:text-slate-700">
                        {description}
                    </p>
                </div>

                <Icon size={18} className="shrink-0 print:hidden" />
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