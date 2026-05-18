import PublicLayout from '@/Layouts/PublicLayout';

export default function ProductDetail({ slug }) {
    return (
        <PublicLayout>
            <section className="mx-auto max-w-5xl px-6 py-20">
                <a href="/" className="text-sm font-semibold text-blue-600">
                    ← Kembali ke Beranda
                </a>

                <h1 className="mt-6 text-4xl font-bold">
                    Detail Produk
                </h1>

                <p className="mt-4 text-slate-600 dark:text-slate-300">
                    Halaman detail produk: {slug}
                </p>
            </section>
        </PublicLayout>
    );
}