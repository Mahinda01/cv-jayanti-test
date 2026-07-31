import { confirmStatus } from '@/lib/sweetAlert';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';

export default function IndexContent({
    Layout,
    customers = [],
    routePrefix,
    showReceivable = false,
}) {
    const { props } = usePage();

    const successMessage = props.flash?.success;
    const errorMessage = props.flash?.error;

    const [search, setSearch] = useState('');
    const [receivableFilter, setReceivableFilter] = useState('Semua');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [currentPage, setCurrentPage] = useState(1);

    const customersPerPage = 10;

    const selectClass =
        'h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:focus:ring-[#155dfc]/20';

    const isCustomerActive = (customer) => {
        return (
            customer.is_active === true ||
            customer.is_active === 1 ||
            customer.is_active === '1'
        );
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(value) || 0);
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
        const customerAddress = String(customer.address || '').toLowerCase();
        const keyword = search.trim().toLowerCase();
        const active = isCustomerActive(customer);

        const matchSearch =
            customerCode.includes(keyword) ||
            customerName.includes(keyword) ||
            customerContact.includes(keyword) ||
            customerAddress.includes(keyword);

        const matchStatus =
            statusFilter === 'Semua' ||
            (statusFilter === 'Aktif' && active) ||
            (statusFilter === 'Tidak Aktif' && !active);

        const matchReceivable =
            !showReceivable ||
            receivableFilter === 'Semua' ||
            customer.receivable_status === receivableFilter;

        return matchSearch && matchStatus && matchReceivable;
    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredCustomers.length / customersPerPage),
    );

    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * customersPerPage;

    const currentCustomers = filteredCustomers.slice(
        startIndex,
        startIndex + customersPerPage,
    );

    const resetPage = (callback) => {
        setCurrentPage(1);
        callback();
    };

    const changeStatus = async (customer) => {
        const active = isCustomerActive(customer);

        const confirmed = await confirmStatus({
            title: active
                ? 'Nonaktifkan pelanggan ini?'
                : 'Aktifkan pelanggan ini?',
            text: active
                ? 'Pelanggan akan berubah menjadi tidak aktif.'
                : 'Pelanggan akan kembali menjadi aktif.',
            confirmButtonText: active
                ? 'Ya, Nonaktifkan'
                : 'Ya, Aktifkan',
        });

        if (!confirmed) {
            return;
        }

        router.patch(
            route(
                `${routePrefix}.customers.toggle-status`,
                customer.id,
            ),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const columnCount = showReceivable ? 8 : 6;

    return (
        <Layout
            showSearch={true}
            searchValue={search}
            onSearchChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
            }}
            searchPlaceholder="Cari kode, nama, kontak, atau alamat pelanggan..."
        >
            <Head title="Data Pelanggan" />

            <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Data Pelanggan
                    </h1>

                    <Link
                        href={route(
                            `${routePrefix}.customers.create`,
                        )}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#155dfc] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 dark:shadow-[#155dfc]/20 dark:hover:bg-blue-600"
                    >
                        <Plus size={17} />
                        Tambah Pelanggan
                    </Link>
                </div>

                {successMessage && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                        {errorMessage}
                    </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div
                        className={`grid grid-cols-1 gap-3 ${
                            showReceivable
                                ? 'md:grid-cols-2'
                                : ''
                        }`}
                    >
                        {showReceivable && (
                            <select
                                value={receivableFilter}
                                onChange={(e) =>
                                    resetPage(() =>
                                        setReceivableFilter(
                                            e.target.value,
                                        ),
                                    )
                                }
                                className={selectClass}
                            >
                                <option value="Semua">
                                    Semua Status Piutang
                                </option>

                                <option value="Tidak Ada Piutang">
                                    Tidak Ada Piutang
                                </option>

                                <option value="Belum Lunas">
                                    Belum Lunas
                                </option>

                                <option value="Jatuh Tempo">
                                    Jatuh Tempo
                                </option>
                            </select>
                        )}

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                resetPage(() =>
                                    setStatusFilter(e.target.value),
                                )
                            }
                            className={selectClass}
                        >
                            <option value="Semua">
                                Semua Status Pelanggan
                            </option>

                            <option value="Aktif">
                                Aktif
                            </option>

                            <option value="Tidak Aktif">
                                Tidak Aktif
                            </option>
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="overflow-x-auto">
                        <table
                            className={`w-full text-left ${
                                showReceivable
                                    ? 'min-w-[980px]'
                                    : 'min-w-[800px]'
                            }`}
                        >
                            <thead className="bg-slate-50 dark:bg-[#131d31]">
                                <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wide text-slate-600 dark:border-[#334155] dark:text-gray-400">
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

                                    {showReceivable && (
                                        <>
                                            <th className="whitespace-nowrap px-4 py-3 text-right">
                                                Total Piutang
                                            </th>

                                            <th className="whitespace-nowrap px-4 py-3 text-center">
                                                Status Piutang
                                            </th>
                                        </>
                                    )}

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
                                    currentCustomers.map(
                                        (customer) => {
                                            const active =
                                                isCustomerActive(
                                                    customer,
                                                );

                                            const rowClass = active
                                                ? 'border-l-4 border-l-transparent bg-white hover:bg-slate-50 dark:bg-[#1d293d] dark:hover:bg-[#131d31]'
                                                : 'border-l-4 border-l-slate-400 bg-slate-100 hover:bg-slate-200 dark:border-l-slate-300/50 dark:bg-[#182235] dark:hover:bg-[#1d293d]';

                                            const mainTextClass =
                                                active
                                                    ? 'text-slate-900 dark:text-white'
                                                    : 'text-slate-600 dark:text-gray-300';

                                            const secondaryTextClass =
                                                active
                                                    ? 'text-slate-600 dark:text-gray-300'
                                                    : 'text-slate-500 dark:text-gray-400';

                                            return (
                                                <tr
                                                    key={
                                                        customer.id
                                                    }
                                                    className={`border-b border-slate-100 transition last:border-b-0 dark:border-[#334155] ${rowClass}`}
                                                >
                                                    <td
                                                        className={`whitespace-nowrap px-4 py-3 text-center text-xs font-extrabold ${mainTextClass}`}
                                                    >
                                                        {
                                                            customer.code
                                                        }
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3 text-left">
                                                        <span
                                                            className={`text-xs font-extrabold ${mainTextClass}`}
                                                        >
                                                            {
                                                                customer.name
                                                            }
                                                        </span>
                                                    </td>

                                                    <td
                                                        className={`whitespace-nowrap px-4 py-3 text-left text-xs font-semibold ${secondaryTextClass}`}
                                                    >
                                                        {customer.contact ||
                                                            '-'}
                                                    </td>

                                                    <td
                                                        className={`max-w-[300px] truncate whitespace-nowrap px-4 py-3 text-left text-xs font-semibold ${secondaryTextClass}`}
                                                        title={
                                                            customer.address ||
                                                            ''
                                                        }
                                                    >
                                                        {customer.address ||
                                                            '-'}
                                                    </td>

                                                    {showReceivable && (
                                                        <>
                                                            <td
                                                                className={`whitespace-nowrap px-4 py-3 text-right text-xs font-extrabold ${mainTextClass}`}
                                                            >
                                                                {formatCurrency(
                                                                    customer.total_receivable,
                                                                )}
                                                            </td>

                                                            <td className="whitespace-nowrap px-4 py-3 text-center">
                                                                <span
                                                                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${getReceivableStatusClass(
                                                                        customer.receivable_status,
                                                                    )}`}
                                                                >
                                                                    {customer.receivable_status ||
                                                                        'Tidak Ada Piutang'}
                                                                </span>
                                                            </td>
                                                        </>
                                                    )}

                                                    <td className="w-[170px] whitespace-nowrap px-4 py-3">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    changeStatus(
                                                                        customer,
                                                                    )
                                                                }
                                                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
                                                                    active
                                                                        ? 'bg-[#155dfc]'
                                                                        : 'bg-slate-400 dark:bg-[#334155]'
                                                                }`}
                                                                title={
                                                                    active
                                                                        ? 'Nonaktifkan pelanggan'
                                                                        : 'Aktifkan pelanggan'
                                                                }
                                                            >
                                                                <span
                                                                    className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                                                        active
                                                                            ? 'translate-x-4'
                                                                            : 'translate-x-1'
                                                                    }`}
                                                                />
                                                            </button>

                                                            <span
                                                                className={`text-xs font-extrabold ${
                                                                    active
                                                                        ? 'text-[#155dfc] dark:text-[#60a5fa]'
                                                                        : 'text-slate-500 dark:text-gray-400'
                                                                }`}
                                                            >
                                                                {active
                                                                    ? 'Aktif'
                                                                    : 'Tidak Aktif'}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3">
                                                        <div className="flex justify-center">
                                                            <Link
                                                                href={route(
                                                                    `${routePrefix}.customers.edit`,
                                                                    customer.id,
                                                                )}
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#155dfc] transition hover:bg-blue-50 dark:text-[#3B82F6] dark:hover:bg-[#131d31]"
                                                                title="Edit Pelanggan"
                                                            >
                                                                <Edit
                                                                    size={
                                                                        17
                                                                    }
                                                                />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={columnCount}
                                            className="px-4 py-10 text-center"
                                        >
                                            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                                                Pelanggan tidak
                                                ditemukan
                                            </h2>

                                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                                Coba ubah pencarian
                                                atau filter pelanggan.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 dark:border-[#334155] md:flex-row md:items-center md:justify-between">
                        <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
                            Menampilkan{' '}
                            <span className="font-extrabold text-slate-700 dark:text-white">
                                {filteredCustomers.length}
                            </span>{' '}
                            pelanggan
                        </p>

                        {filteredCustomers.length > 0 &&
                            totalPages > 1 && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.max(
                                                    safeCurrentPage -
                                                        1,
                                                    1,
                                                ),
                                            )
                                        }
                                        disabled={
                                            safeCurrentPage === 1
                                        }
                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#334155] dark:text-gray-300 dark:hover:bg-[#131d31]"
                                    >
                                        Sebelumnya
                                    </button>

                                    {Array.from(
                                        {
                                            length: totalPages,
                                        },
                                        (_, index) =>
                                            index + 1,
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() =>
                                                setCurrentPage(
                                                    page,
                                                )
                                            }
                                            className={`h-8 w-8 rounded-lg text-xs font-extrabold transition ${
                                                safeCurrentPage ===
                                                page
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
                                            setCurrentPage(
                                                Math.min(
                                                    safeCurrentPage +
                                                        1,
                                                    totalPages,
                                                ),
                                            )
                                        }
                                        disabled={
                                            safeCurrentPage ===
                                            totalPages
                                        }
                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#334155] dark:text-gray-300 dark:hover:bg-[#131d31]"
                                    >
                                        Selanjutnya
                                    </button>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}