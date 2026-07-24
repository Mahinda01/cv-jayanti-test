import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronRight, Package } from 'lucide-react';

export default function ProductSection({ products = [] }) {
    const featuredProducts = products.slice(0, 4);

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

    return (
        <section
            id="products"
            className="min-h-[calc(100vh-72px)] scroll-mt-[72px] bg-white transition-colors duration-300 ease-in-out dark:bg-[#1d293d]"
        >
            <div className="mx-auto w-full max-w-7xl px-6 pb-10 pt-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                            Produk Kami
                        </h2>

                        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-gray-400 md:text-base">
                            Pilihan produk hidrolik untuk kebutuhan industri
                            Anda
                        </p>
                    </div>

                    <Link
                        href="/produk"
                        className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-500 px-6 py-2.5 text-sm font-bold text-blue-600 transition hover:bg-blue-50 dark:border-[#155dfc] dark:text-[#155dfc] dark:hover:bg-[#131d31]"
                    >
                        Lihat Semua Produk
                        <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredProducts.map((product) => {
                        const productImage = getProductImage(product);
                        const status = getAvailabilityStatus(product);
                        const isAvailable = status === 'Tersedia';

                        return (
                            <div
                                key={product.slug}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-[#334155] dark:bg-[#131d31] dark:ring-1 dark:ring-[#334155]/40"
                            >
                                <div className="flex h-40 items-center justify-center overflow-hidden bg-white p-2 dark:bg-white">
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

                                    <h3 className="mt-2 line-clamp-2 text-lg font-extrabold text-slate-900 dark:text-white">
                                        {product.name}
                                    </h3>

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
            </div>
        </section>
    );
}