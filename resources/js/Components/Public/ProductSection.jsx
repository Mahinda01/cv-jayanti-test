import { Link } from '@inertiajs/react';
import { ChevronRight, Package } from 'lucide-react';

const products = [
    {
        title: 'Hydraulic Hose',
        slug: 'hydraulic-hose',
        description:
            'Selang hidrolik berkualitas tinggi untuk berbagai aplikasi industri dengan standar internasional',
    },
    {
        title: 'Fittings',
        slug: 'fittings',
        description:
            'Sambungan dan fitting hidrolik dengan presisi tinggi untuk koneksi yang aman dan tahan lama',
    },
    {
        title: 'Accessories',
        slug: 'accessories',
        description:
            'Aksesoris pelengkap sistem hidrolik untuk mendukung performa optimal peralatan Anda',
    },
];

export default function ProductSection() {
    return (
        <section
            id="products"
            className="bg-slate-100 px-6 py-20 dark:bg-slate-800"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-4xl font-bold text-slate-950 dark:text-white">
                        Produk Kami
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                        Kami menyediakan berbagai produk hidrolik berkualitas tinggi untuk
                        memenuhi kebutuhan industri Anda
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {products.map((product) => (
                        <div
                            key={product.slug}
                            className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900"
                        >
                            <div className="flex h-48 items-center justify-center bg-blue-100 dark:bg-blue-950/50">
                                <Package
                                    size={64}
                                    strokeWidth={1.8}
                                    className="text-blue-500"
                                />
                            </div>

                            <div className="p-7">
                                <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                                    {product.title}
                                </h3>

                                <p className="mt-4 min-h-[96px] text-sm leading-7 text-slate-600 dark:text-slate-300">
                                    {product.description}
                                </p>

                                <Link
                                    href={`/produk/${product.slug}`}
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Lihat Detail
                                    <ChevronRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}