import { Banknote, FileText, ShoppingCart, TrendingUp } from 'lucide-react';

export default function FinancialReport({ report }) {
    const summary = report.summary || {};
    const rows = report.rows || [];

    return (
        <div className="space-y-4">
            <ReportTitle icon={Banknote} title="Laporan Keuangan" />

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <SummaryBox
                    title="Total Penjualan"
                    value={summary.total_sales || 'Rp 0'}
                    color="blue"
                    icon={ShoppingCart}
                />

                <SummaryBox
                    title="Pemasukan Diterima"
                    value={summary.total_income || 'Rp 0'}
                    color="green"
                    icon={Banknote}
                />

                <SummaryBox
                    title="Estimasi Modal"
                    value={summary.product_cost || 'Rp 0'}
                    color="yellow"
                    icon={FileText}
                />

                <SummaryBox
                    title="Laba Kotor"
                    value={summary.gross_profit || 'Rp 0'}
                    color="green"
                    icon={TrendingUp}
                />
            </div>

            <FinancialExplanation />

            <TableWrapper>
                <table className="w-full min-w-[820px] text-left">
                    <thead>
                        <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wide text-slate-600 dark:border-[#334155] dark:text-gray-400 print:text-black">
                            <th className="w-16 px-3 py-2.5">No</th>
                            <th className="px-3 py-2.5">Komponen</th>
                            <th className="px-3 py-2.5">Jumlah</th>
                            <th className="px-3 py-2.5">Keterangan</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-[#334155] print:divide-slate-200">
                        {rows.length > 0 ? (
                            rows.map((row, index) => (
                                <tr
                                    key={row.name}
                                    className="text-[12px] font-semibold text-slate-700 dark:text-gray-200 print:text-black"
                                >
                                    <td className="px-3 py-2.5 font-extrabold text-slate-900 dark:text-white print:text-black">
                                        {index + 1}
                                    </td>

                                    <td className="px-3 py-2.5 font-extrabold text-slate-900 dark:text-white print:text-black">
                                        {row.name}
                                    </td>

                                    <td className="px-3 py-2.5 font-extrabold text-[#155dfc] dark:text-[#60a5fa] print:text-black">
                                        {row.amount}
                                    </td>

                                    <td className="px-3 py-2.5">
                                        {row.description}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <EmptyRow colSpan={4} />
                        )}
                    </tbody>
                </table>
            </TableWrapper>
        </div>
    );
}

function FinancialExplanation() {
    return (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-xs font-semibold text-slate-700 dark:border-[#155dfc]/30 dark:bg-[#155dfc]/10 dark:text-gray-200 print:border-slate-300 print:bg-white print:text-black">
            <h3 className="mb-3 text-base font-extrabold text-slate-900 dark:text-white print:text-black">
                Penjelasan Laporan Keuangan:
            </h3>

            <div className="space-y-1.5 leading-relaxed">
                <p>
                    <span className="font-extrabold">Total Penjualan:</span>{' '}
                    Total nilai seluruh transaksi penjualan aktif pada periode
                    laporan, baik tunai, transfer, maupun kredit.
                </p>

                <p>
                    <span className="font-extrabold">
                        Estimasi Modal Produk Terjual:
                    </span>{' '}
                    Total modal berdasarkan harga beli produk dan jumlah produk
                    yang terjual pada periode laporan.
                </p>

                <p>
                    <span className="font-extrabold">
                        Laba Kotor Penjualan:
                    </span>{' '}
                    Selisih antara total penjualan dan estimasi modal produk
                    terjual.
                </p>

                <p>
                    <span className="font-extrabold">
                        Pemasukan Diterima:
                    </span>{' '}
                    Total pembayaran yang benar-benar sudah diterima, baik dari
                    transaksi tunai, transfer, pembayaran awal kredit, maupun
                    pembayaran piutang.
                </p>

                <p>
                    <span className="font-extrabold">
                        Sisa Piutang Berjalan:
                    </span>{' '}
                    Total sisa pembayaran dari transaksi kredit yang belum
                    lunas.
                </p>
            </div>
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