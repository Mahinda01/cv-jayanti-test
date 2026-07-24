import AdminLayout from '@/Layouts/AdminLayout';
import { confirmStatus } from '@/lib/sweetAlert';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';

export default function Index({ products = [] }) {
    const { props } = usePage();
    const successMessage = props.flash?.success;

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Semua');
    const [supplierFilter, setSupplierFilter] = useState('Semua');
    const [locationFilter, setLocationFilter] = useState('Semua');
    const [stockFilter, setStockFilter] = useState('Semua');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [currentPage, setCurrentPage] = useState(1);

    const productsPerPage = 10;

    const smoothClass = 'transition-colors duration-300 ease-in-out';

    const selectClass =
        'h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none transition-colors duration-300 ease-in-out focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:focus:ring-[#155dfc]/20';

    const categories = [
        'Semua',
        ...new Set(products.map((product) => product.category).filter(Boolean)),
    ];

    const suppliers = [
        'Semua',
        ...new Set(products.map((product) => product.supplier).filter(Boolean)),
    ];

    const locations = [
        'Semua',
        ...new Set(products.map((product) => product.location).filter(Boolean)),
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value || 0);
    };

    const getStockStatus = (product) => {
        if (product.stock <= 0) {
            return {
                label: 'Habis',
                className:
                    'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
            };
        }

        if (product.stock <= product.minimum_stock) {
            return {
                label: 'Menipis',
                className:
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
            };
        }

        return {
            label: 'Aman',
            className:
                'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
        };
    };

    const filteredProducts = products.filter((product) => {
        const stockStatus = getStockStatus(product).label;

        const productCode = String(product.code || '').toLowerCase();
        const productName = String(product.name || '').toLowerCase();
        const keyword = search.toLowerCase();

        const matchSearch =
            productCode.includes(keyword) || productName.includes(keyword);

        const matchCategory =
            categoryFilter === 'Semua' || product.category === categoryFilter;

        const matchSupplier =
            supplierFilter === 'Semua' || product.supplier === supplierFilter;

        const matchLocation =
            locationFilter === 'Semua' || product.location === locationFilter;

        const matchStock =
            stockFilter === 'Semua' || stockStatus === stockFilter;

        const matchStatus =
            statusFilter === 'Semua' ||
            (statusFilter === 'Aktif' && product.is_active) ||
            (statusFilter === 'Tidak Aktif' && !product.is_active);

        return (
            matchSearch &&
            matchCategory &&
            matchSupplier &&
            matchLocation &&
            matchStock &&
            matchStatus
        );
    });

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;

    const currentProducts = filteredProducts.slice(
        startIndex,
        startIndex + productsPerPage,
    );

    const resetPage = (callback) => {
        setCurrentPage(1);
        callback();
    };

    const changeStatus = async (product) => {
        const title = product.is_active
            ? 'Nonaktifkan produk ini?'
            : 'Aktifkan produk ini?';

        const text = product.is_active
            ? 'Produk akan berubah menjadi tidak aktif.'
            : 'Produk akan kembali menjadi aktif.';

        const confirmButtonText = product.is_active
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
            route('admin.products.toggle-status', product.id),
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
            searchPlaceholder="Cari kode atau nama produk..."
        >
            <Head title="Data Produk" />

            <div className={`space-y-3 ${smoothClass}`}>
                <div className="flex items-center justify-between">
                    <h1
                        className={`text-xl font-extrabold text-slate-900 dark:text-white ${smoothClass}`}
                    >
                        Data Produk
                    </h1>

                    <Link
                        href={route('admin.products.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#155dfc] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-colors duration-300 ease-in-out hover:bg-blue-700 dark:bg-[#155dfc] dark:shadow-[#155dfc]/20 dark:hover:bg-blue-600"
                    >
                        <Plus size={17} />
                        Tambah Produk
                    </Link>
                </div>

                {successMessage && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition-colors duration-300 ease-in-out dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400">
                        {successMessage}
                    </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm transition-colors duration-300 ease-in-out dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                        <select
                            value={categoryFilter}
                            onChange={(e) =>
                                resetPage(() =>
                                    setCategoryFilter(e.target.value),
                                )
                            }
                            className={selectClass}
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === 'Semua'
                                        ? 'Semua Kategori'
                                        : category}
                                </option>
                            ))}
                        </select>

                        <select
                            value={supplierFilter}
                            onChange={(e) =>
                                resetPage(() =>
                                    setSupplierFilter(e.target.value),
                                )
                            }
                            className={selectClass}
                        >
                            {suppliers.map((supplier) => (
                                <option key={supplier} value={supplier}>
                                    {supplier === 'Semua'
                                        ? 'Semua Supplier'
                                        : supplier}
                                </option>
                            ))}
                        </select>

                        <select
                            value={locationFilter}
                            onChange={(e) =>
                                resetPage(() =>
                                    setLocationFilter(e.target.value),
                                )
                            }
                            className={selectClass}
                        >
                            {locations.map((location) => (
                                <option key={location} value={location}>
                                    {location === 'Semua'
                                        ? 'Semua Lokasi'
                                        : location}
                                </option>
                            ))}
                        </select>

                        <select
                            value={stockFilter}
                            onChange={(e) =>
                                resetPage(() => setStockFilter(e.target.value))
                            }
                            className={selectClass}
                        >
                            <option value="Semua">Semua Status Stok</option>
                            <option value="Aman">Aman</option>
                            <option value="Menipis">Menipis</option>
                            <option value="Habis">Habis</option>
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
                            <option value="Semua">Semua Status Produk</option>
                            <option value="Aktif">Aktif</option>
                            <option value="Tidak Aktif">Tidak Aktif</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 ease-in-out dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1080px] text-left">
                            <thead className="bg-slate-50 transition-colors duration-300 ease-in-out dark:bg-[#131d31]">
                                <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wide text-slate-600 transition-colors duration-300 ease-in-out dark:border-[#334155] dark:text-gray-400">
                                    <th className="whitespace-nowrap px-4 py-3 text-center">
                                        Kode
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left">
                                        Nama Produk
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left">
                                        Kategori
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left">
                                        Supplier
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-center">
                                        Stok
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-center">
                                        Min. Stok
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-left">
                                        Lokasi
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-center">
                                        Status Stok
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-right">
                                        Harga Beli
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-right">
                                        Harga Jual
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-center">
                                        Status
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentProducts.length > 0 ? (
                                    currentProducts.map((product) => {
                                        const stockStatus =
                                            getStockStatus(product);

                                        const rowClass = product.is_active
                                            ? 'border-l-4 border-l-transparent bg-white hover:bg-slate-50 dark:bg-[#1d293d] dark:hover:bg-[#131d31]'
                                            : 'border-l-4 border-l-slate-400 bg-slate-100 hover:bg-slate-200 dark:border-l-white/50 dark:bg-[#182235] dark:hover:bg-[#1d293d]';

                                        const mainTextClass = product.is_active
                                            ? 'text-slate-900 dark:text-white'
                                            : 'text-slate-600 dark:text-gray-300';

                                        const secondaryTextClass =
                                            product.is_active
                                                ? 'text-slate-600 dark:text-gray-300'
                                                : 'text-slate-500 dark:text-gray-400';

                                        return (
                                            <tr
                                                key={product.id}
                                                className={`border-b border-slate-100 transition-colors duration-300 ease-in-out last:border-b-0 dark:border-[#334155] ${rowClass}`}
                                            >
                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-center text-xs font-extrabold transition-colors duration-300 ease-in-out ${mainTextClass}`}
                                                >
                                                    {product.code}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-left">
                                                    <span
                                                        className={`text-xs font-extrabold transition-colors duration-300 ease-in-out ${mainTextClass}`}
                                                    >
                                                        {product.name}
                                                    </span>
                                                </td>

                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-left text-xs font-semibold transition-colors duration-300 ease-in-out ${secondaryTextClass}`}
                                                >
                                                    {product.category || '-'}
                                                </td>

                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-left text-xs font-semibold transition-colors duration-300 ease-in-out ${secondaryTextClass}`}
                                                >
                                                    {product.supplier || '-'}
                                                </td>

                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-center text-xs font-bold transition-colors duration-300 ease-in-out ${secondaryTextClass}`}
                                                >
                                                    {product.stock}{' '}
                                                    {product.unit}
                                                </td>

                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-center text-xs font-bold transition-colors duration-300 ease-in-out ${secondaryTextClass}`}
                                                >
                                                    {product.minimum_stock}{' '}
                                                    {product.unit}
                                                </td>

                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-left text-xs font-semibold transition-colors duration-300 ease-in-out ${secondaryTextClass}`}
                                                >
                                                    {product.location || '-'}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-center">
                                                    <span
                                                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold transition-colors duration-300 ease-in-out ${
                                                            product.is_active
                                                                ? stockStatus.className
                                                                : 'bg-slate-200 text-slate-600 ring-1 ring-slate-300 dark:bg-[#475569] dark:text-white dark:ring-[#94a3b8]/60'
                                                        }`}
                                                    >
                                                        {product.is_active
                                                            ? stockStatus.label
                                                            : 'Nonaktif'}
                                                    </span>
                                                </td>

                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-right text-xs font-bold transition-colors duration-300 ease-in-out ${secondaryTextClass}`}
                                                >
                                                    {formatCurrency(
                                                        product.purchase_price,
                                                    )}
                                                </td>

                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-right text-xs font-extrabold transition-colors duration-300 ease-in-out ${mainTextClass}`}
                                                >
                                                    {formatCurrency(
                                                        product.price,
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <div className="flex justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                changeStatus(
                                                                    product,
                                                                )
                                                            }
                                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ease-in-out ${
                                                                product.is_active
                                                                    ? 'bg-[#155dfc]'
                                                                    : 'bg-slate-400 dark:bg-[#334155]'
                                                            }`}
                                                            title={
                                                                product.is_active
                                                                    ? 'Nonaktifkan produk'
                                                                    : 'Aktifkan produk'
                                                            }
                                                        >
                                                            <span
                                                                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
                                                                    product.is_active
                                                                        ? 'translate-x-4'
                                                                        : 'translate-x-1'
                                                                }`}
                                                            />
                                                        </button>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <div className="flex justify-center">
                                                        <Link
                                                            href={route(
                                                                'admin.products.edit',
                                                                product.id,
                                                            )}
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#155dfc] transition-colors duration-300 ease-in-out hover:bg-blue-50 dark:text-[#3B82F6] dark:hover:bg-[#131d31]"
                                                            title="Edit Produk"
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
                                            colSpan="12"
                                            className="px-4 py-10 text-center"
                                        >
                                            <h2 className="text-base font-extrabold text-slate-900 transition-colors duration-300 ease-in-out dark:text-white">
                                                Produk tidak ditemukan
                                            </h2>

                                            <p className="mt-1 text-xs font-medium text-slate-500 transition-colors duration-300 ease-in-out dark:text-gray-400">
                                                Coba ubah pencarian atau filter produk.
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
                                {filteredProducts.length}
                            </span>{' '}
                            produk
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