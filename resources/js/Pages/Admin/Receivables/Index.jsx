import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Eye, FileText, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Index({ receivables = [], customers = [], summary = {} }) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('Semua');
    const [source, setSource] = useState('Semua');

    const filteredReceivables = useMemo(() => {
        return receivables.filter((item) => {
            const keyword = search.toLowerCase();

            const matchSearch =
                item.customer_name?.toLowerCase().includes(keyword) ||
                item.number?.toLowerCase().includes(keyword) ||
                item.source_label?.toLowerCase().includes(keyword);

            const matchStatus = status === 'Semua' || item.status === status;
            const matchSource = source === 'Semua' || item.source_type === source;

            return matchSearch && matchStatus && matchSource;
        });
    }, [receivables, search, status, source]);

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
            <Head title="Piutang Pelanggan" />

            <div className="space-y-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Piutang Pelanggan
                        </h1>
                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                            Kelola piutang dari transaksi kredit dan piutang awal pelanggan.
                        </p>
                    </div>

                    <Link
                        href={route('admin.receivables.initial.create')}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155dfc] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
                    >
                        <Plus size={16} />
                        Tambah Piutang Awal
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <p className="text-sm font-bold text-slate-500 dark:text-gray-400">
                            Total Piutang
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-[#155dfc]">
                            {summary.total_receivable}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <p className="text-sm font-bold text-slate-500 dark:text-gray-400">
                            Pelanggan Berpiutang
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                            {summary.total_customer}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <p className="text-sm font-bold text-slate-500 dark:text-gray-400">
                            Jatuh Tempo
                        </p>
                        <p className="mt-2 text-2xl font-extrabold text-red-500">
                            {summary.total_overdue}
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_180px]">
                        <div className="relative">
                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari pelanggan, nomor transaksi, atau sumber piutang..."
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium outline-none focus:border-[#155dfc] dark:border-[#334155] dark:bg-[#131d31] dark:text-white"
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-[#155dfc] dark:border-[#334155] dark:bg-[#131d31] dark:text-white"
                        >
                            <option value="Semua">Semua Status</option>
                            <option value="Belum Lunas">Belum Lunas</option>
                            <option value="Jatuh Tempo">Jatuh Tempo</option>
                            <option value="Lunas">Lunas</option>
                        </select>

                        <select
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-[#155dfc] dark:border-[#334155] dark:bg-[#131d31] dark:text-white"
                        >
                            <option value="Semua">Semua Sumber</option>
                            <option value="sale">Penjualan Kredit</option>
                            <option value="initial">Piutang Awal</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-[#334155]">
                            <thead className="bg-slate-50 dark:bg-[#131d31]">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        Pelanggan
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        Sumber
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        Tanggal
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        Sisa Piutang
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 text-right text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200 dark:divide-[#334155]">
                                {filteredReceivables.map((item) => (
                                    <tr
                                        key={`${item.source_type}-${item.id}`}
                                        className="hover:bg-slate-50 dark:hover:bg-[#131d31]"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                                                {item.customer_name}
                                            </p>
                                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                                {item.customer_contact || '-'}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-sm font-bold text-slate-700 dark:text-gray-300">
                                                {item.source_label}
                                            </p>
                                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                                {item.number}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-sm font-bold text-slate-700 dark:text-gray-300">
                                                {item.transaction_date}
                                            </p>
                                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                                Jatuh tempo: {item.due_date}
                                            </p>
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

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={item.detail_url}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#155dfc] hover:bg-blue-100 dark:bg-[#131d31] dark:hover:bg-[#334155]"
                                                    title="Detail"
                                                >
                                                    <Eye size={16} />
                                                </Link>

                                                <Link
                                                    href={item.summary_url}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-400"
                                                    title="Rincian Piutang"
                                                >
                                                    <FileText size={16} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredReceivables.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-5 py-12 text-center text-sm font-bold text-slate-500 dark:text-gray-400"
                                        >
                                            Data piutang tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Rincian Piutang per Pelanggan
                    </h2>
                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {customers
                            .filter((customer) => Number(customer.total_receivable) > 0)
                            .map((customer) => (
                                <Link
                                    key={customer.id}
                                    href={customer.summary_url}
                                    className="rounded-xl border border-slate-200 p-4 transition hover:border-[#155dfc] hover:bg-blue-50 dark:border-[#334155] dark:hover:bg-[#131d31]"
                                >
                                    <p className="font-extrabold text-slate-900 dark:text-white">
                                        {customer.name}
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-[#155dfc]">
                                        {customer.total_receivable_text}
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                        {customer.receivable_status}
                                    </p>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}