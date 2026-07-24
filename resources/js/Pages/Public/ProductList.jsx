import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronRight, Package, Search } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function ProductList({ products = [], categories = [] }) {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua');

    const categoryNames = categories
        .map((category) =>
            typeof category === 'string' ? category : category.name,
        )
        .filter(Boolean)
        .filter((category) => category !== 'Semua');

    const categoryOptions = [
        'Semua',
        ...new Set([
            ...categoryNames,
            ...products.map((product) => product.category).filter(Boolean),
        ]),
    ];

    const formatPrice = (price) => {
        if (typeof price === 'string' && price.includes('Rp')) {
            return price;
        }

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price || 0);
    };

    const getProductImage = (product) => {
        if (!product) {
            return null;
        }

        if (product.image) {
            if (
                product.image.startsWith('http://') ||
                product.image.startsWith('https://') ||
                product.image.startsWith('/')
            ) {
                return product.image;
            }

            return `/storage/${product.image.replace(/^\/+/, '')}`;
        }

        if (product.image_url) {
            return product.image_url;
        }

        return null;
    };

    const getAvailabilityStatus = (product) => {
        if (product.availability_status) {
            return product.availability_status;
        }

        return Number(product.stock || 0) > 0 ? 'Tersedia' : 'Tidak Tersedia';
    };

    const filteredProducts = products.filter((product) => {
        const productName = String(product.name || '').toLowerCase();
        const productCategory = String(product.category || '').toLowerCase();
        const keyword = search.toLowerCase();

        const matchCategory =
            activeCategory === 'Semua' || product.category === activeCategory;

        const matchSearch =
            productName.includes(keyword) || productCategory.includes(keyword);

        return matchCategory && matchSearch;
    });

    return (
        <PublicLayout title="Produk - CV Jayanti Muliatama">
            <section className="min-h-[calc(100vh-78px)] bg-slate-50 px-7 py-7 transition-colors duration-300 ease-in-out dark:bg-[#131d31]">
                <div className="mx-auto max-w-7xl">
                    <div className="flex items-center gap-3 text-sm font-semibold">
                        <Link
                            href="/"
                            className="text-slate-500 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-[#155dfc]"
                        >
                            Home
                        </Link>

                        <ChevronRight
                            size={16}
                            className="text-slate-500 dark:text-gray-500"
                        />

                        <span className="font-bold text-slate-900 dark:text-white">
                            Produk
                        </span>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="relative w-full lg:max-w-[390px]">
                            <Search
                                size={20}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Cari produk..."
                                className="h-[48px] w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#1d293d] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#155dfc] dark:focus:ring-[#155dfc]/20"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {categoryOptions.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setActiveCategory(category)}
                                    className={`h-[48px] rounded-full border px-5 text-sm font-bold transition ${
                                        activeCategory === category
                                            ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/25 dark:border-[#155dfc] dark:bg-[#155dfc] dark:shadow-[#155dfc]/25'
                                            : 'border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600 dark:border-[#334155] dark:bg-[#1d293d] dark:text-gray-300 dark:hover:border-[#155dfc] dark:hover:text-[#155dfc]'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="mt-7 text-sm font-medium text-slate-600 dark:text-gray-400">
                        Menampilkan{' '}
                        <span className="font-extrabold">
                            {filteredProducts.length}
                        </span>{' '}
                        produk
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {filteredProducts.map((product) => {
                            const productImage = getProductImage(product);
                            const status = getAvailabilityStatus(product);
                            const isAvailable = status === 'Tersedia';

                            return (
                                <div
                                    key={product.slug}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-[#334155] dark:bg-[#1d293d] dark:ring-1 dark:ring-[#334155]/30"
                                >
                                    <div className="flex h-[176px] items-center justify-center overflow-hidden bg-white p-2 dark:bg-white sm:h-[192px]">
                                        {productImage ? (
                                            <img
                                                src={productImage}
                                                alt={product.name}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-blue-100 dark:bg-[#14316b]">
                                                <Package
                                                    size={54}
                                                    className="text-blue-500 dark:text-[#3B82F6]"
                                                    strokeWidth={1.9}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-bold text-blue-600 dark:text-[#155dfc]">
                                                {product.category}
                                            </p>

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                                                    isAvailable
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                                                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
                                                }`}
                                            >
                                                {status}
                                            </span>
                                        </div>

                                        <h2 className="mt-2 line-clamp-2 text-lg font-extrabold text-slate-900 dark:text-white">
                                            {product.name}
                                        </h2>

                                        <p className="mt-3 text-xl font-extrabold text-blue-600 dark:text-[#155dfc]">
                                            {formatPrice(product.price)}
                                        </p>

                                        <Link
                                            href={`/produk/${product.slug}`}
                                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 dark:bg-[#155dfc] dark:shadow-[#155dfc]/20 dark:hover:bg-blue-600"
                                        >
                                            Lihat Detail
                                            <ChevronRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-[#334155] dark:bg-[#1d293d] dark:ring-1 dark:ring-[#334155]/30">
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                Produk tidak ditemukan
                            </h2>

                            <p className="mt-2 text-sm font-medium text-slate-600 dark:text-gray-400">
                                Coba gunakan kata kunci atau kategori produk
                                yang lain.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}