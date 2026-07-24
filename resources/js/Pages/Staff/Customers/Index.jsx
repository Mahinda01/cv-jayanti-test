import StaffLayout from '@/Layouts/StaffLayout';
import { confirmStatus } from '@/lib/sweetAlert';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Index({ customers = [] }) {
    const { props } = usePage();
    const successMessage = props.flash?.success;

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [currentPage, setCurrentPage] = useState(1);

    const customersPerPage = 10;

    const smoothClass = 'transition-colors duration-300 ease-in-out';

    const selectClass =
        'h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none transition-colors duration-300 ease-in-out focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:focus:ring-[#155dfc]/20';

    const filteredCustomers = customers.filter((customer) => {
        const customerCode = String(customer.code || '').toLowerCase();
        const customerName = String(customer.name || '').toLowerCase();
        const customerContact = String(customer.contact || '').toLowerCase();
        const customerAddress = String(customer.address || '').toLowerCase();
        const keyword = search.toLowerCase();

        const matchSearch =
            customerCode.includes(keyword) ||
            customerName.includes(keyword) ||
            customerContact.includes(keyword) ||
            customerAddress.includes(keyword);

        const matchStatus =
            statusFilter === 'Semua' ||
            (statusFilter === 'Aktif' && customer.is_active) ||
            (statusFilter === 'Tidak Aktif' && !customer.is_active);

        return matchSearch && matchStatus;
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

    const changeStatus = (customer) => {
        const message = customer.is_active
            ? 'Nonaktifkan pelanggan ini?'
            : 'Aktifkan pelanggan ini?';

        if (confirm(message)) {
            router.patch(route('staff.customers.toggle-status', customer.id));
        }
    };

    return (
        <StaffLayout
            showSearch={true}
            searchValue={search}
            onSearchChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
            }}
            searchPlaceholder="Cari kode, nama, kontak, atau alamat pelanggan..."
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
                        href={route('staff.customers.create')}
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
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            resetPage(() => setStatusFilter(e.target.value))
                        }
                        className={selectClass}
                    >
                        <option value="Semua">Semua Status Pelanggan</option>
                        <option value="Aktif">Aktif</option>
                        <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 ease-in-out dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left">
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
                                                    className={`max-w-[330px] truncate whitespace-nowrap px-4 py-3 text-left text-xs font-semibold transition-colors duration-300 ease-in-out ${secondaryTextClass}`}
                                                >
                                                    {customer.address || '-'}
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
                                                                'staff.customers.edit',
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
                                            colSpan="6"
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

                                <span className="text-xs font-bold text-slate-600 dark:text-gray-300">
                                    {currentPage} / {totalPages || 1}
                                </span>

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
        </StaffLayout>
    );
}