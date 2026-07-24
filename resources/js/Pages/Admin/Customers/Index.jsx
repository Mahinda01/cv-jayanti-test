import AdminLayout from '@/Layouts/AdminLayout';
import { confirmStatus } from '@/lib/sweetAlert';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Index({ customers = [] }) {
    const { props } = usePage();
    const successMessage = props.flash?.success;

    const [search, setSearch] = useState('');
    const [receivableFilter, setReceivableFilter] = useState('Semua');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [currentPage, setCurrentPage] = useState(1);

    const customersPerPage = 10;

    const smoothClass = 'transition-colors duration-300 ease-in-out';

    const selectClass =
        'h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none transition-colors duration-300 ease-in-out focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:focus:ring-[#155dfc]/20';

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value || 0);
    };

    const getReceivableStatusClass = (status) => {
        if (status === 'Tidak Ada Piutang') {
            return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
        }

        if (status === 'Belum Lunas') {
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
        }

        if (status === 'Jatuh Tempo') {
            return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
        }

        return 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300';
    };

    const filteredCustomers = customers.filter((customer) => {
        const customerCode = String(customer.code || '').toLowerCase();
        const customerName = String(customer.name || '').toLowerCase();
        const customerContact = String(customer.contact || '').toLowerCase();
        const keyword = search.toLowerCase();

        const matchSearch =
            customerCode.includes(keyword) ||
            customerName.includes(keyword) ||
            customerContact.includes(keyword);

        const matchReceivable =
            receivableFilter === 'Semua' ||
            customer.receivable_status === receivableFilter;

        const matchStatus =
            statusFilter === 'Semua' ||
            (statusFilter === 'Aktif' && customer.is_active) ||
            (statusFilter === 'Tidak Aktif' && !customer.is_active);

        return matchSearch && matchReceivable && matchStatus;
    });

    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
    const startIndex = (currentPage - 1) * customersPerPage;

    const currentCustomers = filteredCustomers.slice(
        startIndex,
        startIndex + customersPerPage,
    );

    const resetPage = (callback) => {
        setCurrentPage(1);
        callback();
    };

    const changeStatus = async (customer) => {
        const title = customer.is_active
            ? 'Nonaktifkan pelanggan ini?'
            : 'Aktifkan pelanggan ini?';

        const text = customer.is_active
            ? 'Pelanggan akan berubah menjadi tidak aktif.'
            : 'Pelanggan akan kembali menjadi aktif.';

        const confirmButtonText = customer.is_active
            ? 'Ya, Nonaktifkan'
            : 'Ya, Aktifkan';

        const confirmed = await confirmStatus({
            title,
            text,
            confirmButtonText,
        });

        if (!confirmed) {
            return;
        }

        router.patch(
            route('admin.customers.toggle-status', customer.id),
            {},
            {
                preserveScroll: true,
            },
        );
    };
    return (
        <AdminLayout
            showSearch={true}
            searchValue={search}
            onSearchChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
            }}
            searchPlaceholder="Cari kode, nama, atau kontak pelanggan..."
        >
            <Head title="Data Pelanggan" />

            <div className={`space-y-3 ${smoothClass}`}>
                <div className="flex items-center justify-between">
                    <h1
                        className={`text-xl font-extrabold text-slate-900 dark:text-white ${smoothClass}`}
                    >
                        Data Pelanggan
                    </h1>

                    <Link
                        href={route('admin.customers.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#155dfc] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-colors duration-300 ease-in-out hover:bg-blue-700 dark:bg-[#155dfc] dark:shadow-[#155dfc]/20 dark:hover:bg-blue-600"
                    >
                        <Plus size={17} />
                        Tambah Pelanggan
                    </Link>
                </div>

                {successMessage && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition-colors duration-300 ease-in-out dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400">
                        {successMessage}
                    </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm transition-colors duration-300 ease-in-out dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <select
                            value={receivableFilter}
                            onChange={(e) =>
                                resetPage(() =>
                                    setReceivableFilter(e.target.value),
                                )
                            }
                            className={selectClass}
                        >
                            <option value="Semua">Semua Status Piutang</option>
                            <option value="Tidak Ada Piutang">
                                Tidak Ada Piutang
                            </option>
                            <option value="Belum Lunas">Belum Lunas</option>
                            <option value="Jatuh Tempo">Jatuh Tempo</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                resetPage(() =>
                                    setStatusFilter(e.target.value),
                                )
                            }
                            className={selectClass}
                        >
                            <option value="Semua">Semua Status Pelanggan</option>
                            <option value="Aktif">Aktif</option>
                            <option value="Tidak Aktif">Tidak Aktif</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 ease-in-out dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px] text-left">
                            <thead className="bg-slate-50 transition-colors duration-300 ease-in-out dark:bg-[#131d31]">
                                <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wide text-slate-600 transition-colors duration-300 ease-in-out dark:border-[#334155] dark:text-gray-400">
                                    <th className="whitespace-nowrap px-4 py-3 text-center">
                                        Kode
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left">
                                        Nama Pelanggan
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left">
                                        Kontak
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left">
                                        Alamat
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-right">
                                        Total Piutang
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-center">
                                        Status Piutang
                                    </th>
                                    <th className="w-[170px] whitespace-nowrap px-4 py-3 text-center">
                                        Status Pelanggan
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentCustomers.length > 0 ? (
                                    currentCustomers.map((customer) => {
                                        const rowClass = customer.is_active
                                            ? 'border-l-4 border-l-transparent bg-white hover:bg-slate-50 dark:bg-[#1d293d] dark:hover:bg-[#131d31]'
                                            : 'border-l-4 border-l-slate-400 bg-slate-100 hover:bg-slate-200 dark:border-l-slate-300/50 dark:bg-[#182235] dark:hover:bg-[#1d293d]';

                                        const mainTextClass = customer.is_active
                                            ? 'text-slate-900 dark:text-white'
                                            : 'text-slate-600 dark:text-gray-300';

                                        const secondaryTextClass =
                                            customer.is_active
                                                ? 'text-slate-600 dark:text-gray-300'
                                                : 'text-slate-500 dark:text-gray-400';

                                        return (
                                            <tr
                                                key={customer.id}
                                                className={`border-b border-slate-100 transition-colors duration-300 ease-in-out last:border-b-0 dark:border-[#334155] ${rowClass}`}
                                            >
                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-center text-xs font-extrabold transition-colors duration-300 ease-in-out ${mainTextClass}`}
                                                >
                                                    {customer.code}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-left">
                                                    <span
                                                        className={`text-xs font-extrabold transition-colors duration-300 ease-in-out ${mainTextClass}`}
                                                    >
                                                        {customer.name}
                                                    </span>
                                                </td>

                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-left text-xs font-semibold transition-colors duration-300 ease-in-out ${secondaryTextClass}`}
                                                >
                                                    {customer.contact || '-'}
                                                </td>

                                                <td
                                                    className={`max-w-[280px] truncate whitespace-nowrap px-4 py-3 text-left text-xs font-semibold transition-colors duration-300 ease-in-out ${secondaryTextClass}`}
                                                >
                                                    {customer.address || '-'}
                                                </td>

                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-right text-xs font-extrabold transition-colors duration-300 ease-in-out ${mainTextClass}`}
                                                >
                                                    {formatCurrency(
                                                        customer.total_receivable,
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-center">
                                                    <span
                                                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold transition-colors duration-300 ease-in-out ${getReceivableStatusClass(
                                                            customer.receivable_status,
                                                        )}`}
                                                    >
                                                        {
                                                            customer.receivable_status
                                                        }
                                                    </span>
                                                </td>

                                                <td className="w-[170px] whitespace-nowrap px-4 py-3">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                changeStatus(
                                                                    customer,
                                                                )
                                                            }
                                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ease-in-out ${
                                                                customer.is_active
                                                                    ? 'bg-[#155dfc]'
                                                                    : 'bg-slate-400 dark:bg-[#334155]'
                                                            }`}
                                                            title={
                                                                customer.is_active
                                                                    ? 'Nonaktifkan pelanggan'
                                                                    : 'Aktifkan pelanggan'
                                                            }
                                                        >
                                                            <span
                                                                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
                                                                    customer.is_active
                                                                        ? 'translate-x-4'
                                                                        : 'translate-x-1'
                                                                }`}
                                                            />
                                                        </button>

                                                        <span
                                                            className={`text-xs font-extrabold ${
                                                                customer.is_active
                                                                    ? 'text-[#155dfc] dark:text-[#60a5fa]'
                                                                    : 'text-slate-500 dark:text-gray-400'
                                                            }`}
                                                        >
                                                            {customer.is_active
                                                                ? 'Aktif'
                                                                : 'Tidak Aktif'}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <div className="flex justify-center">
                                                        <Link
                                                            href={route(
                                                                'admin.customers.edit',
                                                                customer.id,
                                                            )}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#155dfc] transition-colors duration-300 ease-in-out hover:bg-blue-50 dark:text-[#3B82F6] dark:hover:bg-[#131d31]"
                                                            title="Edit Pelanggan"
                                                        >
                                                            <Edit size={17} />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-4 py-10 text-center"
                                        >
                                            <h2 className="text-base font-extrabold text-slate-900 transition-colors duration-300 ease-in-out dark:text-white">
                                                Pelanggan tidak ditemukan
                                            </h2>

                                            <p className="mt-1 text-xs font-medium text-slate-500 transition-colors duration-300 ease-in-out dark:text-gray-400">
                                                Coba ubah pencarian atau filter pelanggan.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 transition-colors duration-300 ease-in-out dark:border-[#334155] md:flex-row md:items-center md:justify-between">
                        <p className="text-xs font-medium text-slate-500 transition-colors duration-300 ease-in-out dark:text-gray-400">
                            Menampilkan{' '}
                            <span className="font-extrabold text-slate-700 transition-colors duration-300 ease-in-out dark:text-white">
                                {filteredCustomers.length}
                            </span>{' '}
                            pelanggan
                        </p>

                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.max(page - 1, 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors duration-300 ease-in-out hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#334155] dark:text-gray-300 dark:hover:bg-[#131d31]"
                                >
                                    Sebelumnya
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1,
                                ).map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => setCurrentPage(page)}
                                        className={`h-8 w-8 rounded-lg text-xs font-extrabold transition-colors duration-300 ease-in-out ${
                                            currentPage === page
                                                ? 'bg-[#155dfc] text-white'
                                                : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-[#334155] dark:text-gray-300 dark:hover:bg-[#131d31]'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((page) =>
                                            Math.min(page + 1, totalPages),
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition-colors duration-300 ease-in-out hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#334155] dark:text-gray-300 dark:hover:bg-[#131d31]"
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}