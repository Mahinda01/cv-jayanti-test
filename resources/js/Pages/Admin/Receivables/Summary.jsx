import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download, MessageCircle } from 'lucide-react';

export default function Summary({
    customer,
    receivables = [],
    summary = {},
    pdf_url,
    whatsapp_url,
}) {
    const openWhatsapp = () => {
        if (!whatsapp_url) {
            alert('Nomor WhatsApp pelanggan belum tersedia.');
            return;
        }

        window.open(whatsapp_url, '_blank');
    };

    const statusClass = (value) => {
        if (value === 'Lunas') {
            return 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400';
        }

        if (value === 'Jatuh Tempo') {
            return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
        }

        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400';
    };

    return (
        <AdminLayout>
            <Head title="Rincian Piutang Pelanggan" />

            <div className="space-y-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Rincian Piutang Pelanggan
                        </h1>
                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                            {customer.name}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={route('admin.receivables.index')}
                            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-[#155dfc] hover:bg-blue-50 dark:border-[#155dfc]/40 dark:bg-[#1d293d]"
                        >
                            <ArrowLeft size={16} />
                            Kembali
                        </Link>

                        <a
                            href={pdf_url}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#155dfc] px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                        >
                            <Download size={16} />
                            Unduh PDF
                        </a>

                        <button
                            type="button"
                            onClick={openWhatsapp}
                            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
                        >
                            <MessageCircle size={16} />
                            Bagikan WhatsApp
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                Pelanggan
                            </p>
                            <p className="mt-1 text-lg font-extrabold text-slate-900 dark:text-white">
                                {customer.name}
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                                {customer.contact || '-'}
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                                {customer.address || '-'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <SummaryBox label="Total Tagihan" value={summary.total_amount_text} />
                            <SummaryBox label="Total Dibayar" value={summary.paid_amount_text} />
                            <SummaryBox label="Sisa Piutang" value={summary.remaining_amount_text} highlight />
                            <SummaryBox label="Status" value={summary.status} />
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-[#334155]">
                            <thead className="bg-slate-50 dark:bg-[#131d31]">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        Sumber
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        No Transaksi / Bon
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        Tanggal
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        Sisa
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200 dark:divide-[#334155]">
                                {receivables.map((item) => (
                                    <tr key={`${item.source_type}-${item.id}`}>
                                        <td className="px-5 py-4 text-sm font-bold text-slate-700 dark:text-gray-300">
                                            {item.source_label}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-bold text-slate-700 dark:text-gray-300">
                                            {item.number}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-bold text-slate-700 dark:text-gray-300">
                                            {item.transaction_date}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-extrabold text-[#155dfc]">
                                            {item.remaining_amount_text}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusClass(
                                                    item.status,
                                                )}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {receivables.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-5 py-10 text-center text-sm font-bold text-slate-500 dark:text-gray-400"
                                        >
                                            Tidak ada piutang aktif untuk pelanggan ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm font-medium text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-300">
                    Unduh PDF terlebih dahulu, lalu klik Bagikan WhatsApp. Sistem akan membuka WhatsApp dengan pesan otomatis, kemudian admin dapat melampirkan file PDF yang sudah diunduh.
                </div>
            </div>
        </AdminLayout>
    );
}

function SummaryBox({ label, value, highlight = false }) {
    return (
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-[#131d31]">
            <p className="text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                {label}
            </p>
            <p
                className={`mt-1 text-sm font-extrabold ${
                    highlight ? 'text-[#155dfc]' : 'text-slate-900 dark:text-white'
                }`}
            >
                {value}
            </p>
        </div>
    );
}