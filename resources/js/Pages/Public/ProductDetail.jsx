import { Link } from '@inertiajs/react';
import { ArrowLeft, ChevronRight, MessageCircle, Package } from 'lucide-react';
import PublicLayout from '../../Layouts/PublicLayout';

export default function ProductDetail({ product, relatedProducts = [] }) {
    const getProductImage = (item) => {
        if (!item) {
            return null;
        }

        if (item.image) {
            if (
                item.image.startsWith('http://') ||
                item.image.startsWith('https://') ||
                item.image.startsWith('/')
            ) {
                return item.image;
            }

            return `/storage/${item.image.replace(/^\/+/, '')}`;
        }

        if (item.image_url) {
            return item.image_url;
        }

        return null;
    };

    const getAvailabilityStatus = (item) => {
        if (item.availability_status) {
            return item.availability_status;
        }

        return Number(item.stock || 0) > 0 ? 'Tersedia' : 'Tidak Tersedia';
    };

    const productStatus = getAvailabilityStatus(product);
    const productAvailable = productStatus === 'Tersedia';

    const whatsappMessage = encodeURIComponent(
        `Halo CV Jayanti Muliatama, saya ingin bertanya tentang ketersediaan produk ${product.name}.`,
    );

    const whatsappLink = `https://wa.me/6282174369753?text=${whatsappMessage}`;
    const productImage = getProductImage(product);

    return (
        <PublicLayout title={`${product.name} - CV Jayanti Muliatama`}>
            <section className="min-h-[calc(100vh-78px)] bg-white px-7 pb-6 pt-4 transition-colors duration-300 dark:bg-[#131d31]">
                <div className="mx-auto max-w-7xl">
                    <Link
                        href="/produk"
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700 dark:text-[#155dfc] dark:hover:text-blue-400"
                    >
                        <ArrowLeft size={18} />
                        Kembali ke Semua Produk
                    </Link>

                    <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm transition-colors duration-300 dark:border-[#334155] dark:bg-[#1d293d] dark:ring-1 dark:ring-[#334155]/30">
                        <div className="grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr]">
                            <div className="flex h-[260px] items-center justify-center overflow-hidden bg-white p-5 transition-colors duration-300 dark:bg-white sm:h-[320px] lg:h-[360px]">
                                {productImage ? (
                                    <img
                                        src={productImage}
                                        alt={product.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-blue-100 dark:bg-[#14316b]">
                                        <Package
                                            size={76}
                                            className="text-blue-500 dark:text-[#3B82F6]"
                                            strokeWidth={1.8}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col justify-center p-6 lg:p-7">
                                <div className="flex flex-wrap items-center gap-3">
                                    <p className="text-sm font-extrabold text-blue-600 dark:text-[#155dfc]">
                                        {product.category}
                                    </p>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                                            productAvailable
                                                ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                                                : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
                                        }`}
                                    >
                                        {productStatus}
                                    </span>
                                </div>

                                <h1 className="mt-2 text-3xl font-extrabold leading-tight text-slate-900 dark:text-white md:text-[42px]">
                                    {product.name}
                                </h1>

                                <p className="mt-3 text-3xl font-extrabold text-blue-600 dark:text-[#155dfc]">
                                    {product.price}
                                </p>

                                {product.description && (
                                    <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-600 dark:text-gray-400">
                                        {product.description}
                                    </p>
                                )}

                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 dark:bg-[#155dfc] dark:shadow-[#155dfc]/25 dark:hover:bg-blue-600"
                                >
                                    <MessageCircle size={18} />
                                    Tanya Produk
                                </a>

                                {!productAvailable && (
                                    <p className="mt-3 text-xs font-medium text-slate-500 dark:text-gray-400">
                                        Produk sedang tidak tersedia. Silakan
                                        hubungi kami untuk informasi
                                        ketersediaan terbaru.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {relatedProducts.length > 0 && (
                        <div className="mt-5">
                            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                Produk Terkait
                            </h2>

                            <div className="mt-3 flex flex-wrap gap-4">
                                {relatedProducts.map((item) => {
                                    const relatedImage = getProductImage(item);
                                    const relatedStatus =
                                        getAvailabilityStatus(item);
                                    const relatedAvailable =
                                        relatedStatus === 'Tersedia';

                                    return (
                                        <Link
                                            key={item.slug}
                                            href={`/produk/${item.slug}`}
                                            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-[#334155] dark:bg-[#1d293d] dark:ring-1 dark:ring-[#334155]/30 sm:w-[300px]"
                                        >
                                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-2 transition-colors duration-300 dark:bg-white">
                                                {relatedImage ? (
                                                    <img
                                                        src={relatedImage}
                                                        alt={item.name}
                                                        className="max-h-full max-w-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-blue-100 dark:bg-[#14316b]">
                                                        <Package
                                                            size={28}
                                                            className="text-blue-500 dark:text-[#3B82F6]"
                                                            strokeWidth={1.9}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-xs font-bold text-blue-600 dark:text-[#155dfc]">
                                                        {item.category}
                                                    </p>

                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                                                            relatedAvailable
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                                                                : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
                                                        }`}
                                                    >
                                                        {relatedStatus}
                                                    </span>
                                                </div>

                                                <h3 className="mt-1 truncate text-sm font-extrabold text-slate-900 dark:text-white">
                                                    {item.name}
                                                </h3>

                                                <p className="mt-1 text-sm font-extrabold text-blue-600 dark:text-[#155dfc]">
                                                    {item.price}
                                                </p>
                                            </div>

                                            <ChevronRight
                                                size={18}
                                                className="flex-shrink-0 text-slate-400 dark:text-gray-400"
                                            />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}