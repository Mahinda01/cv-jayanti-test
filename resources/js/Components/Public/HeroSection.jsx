export default function HeroSection() {
    const scrollToProducts = () => {
        const section = document.getElementById('products');

        if (section) {
            window.scrollTo({
                top: section.offsetTop - 78,
                behavior: 'smooth',
            });
        }
    };

    const scrollToContact = () => {
        const section = document.getElementById('contact');

        if (section) {
            window.scrollTo({
                top: section.offsetTop - 78,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section
            id="home"
            className="min-h-[calc(100vh-78px)] scroll-mt-[78px] bg-white transition-colors duration-300 dark:bg-[#131d31]"
        >
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-12 pt-14 lg:grid-cols-2 lg:pt-16">
                {/* Bagian teks */}
                <div>
                    <h2 className="max-w-xl text-4xl font-extrabold leading-tight text-slate-900 dark:text-white md:text-5xl">
                        Solusi Hidrolik untuk Industri Anda
                    </h2>

                    <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-slate-600 dark:text-gray-400">
                        Distributor hydraulic hose dan perlengkapan hidrolik
                        berkualitas.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <button
                            type="button"
                            onClick={scrollToProducts}
                            className="rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 dark:bg-[#155dfc] dark:shadow-[#155dfc]/25 dark:hover:bg-blue-600"
                        >
                            Lihat Produk
                        </button>

                        <button
                            type="button"
                            onClick={scrollToContact}
                            className="rounded-xl border-2 border-blue-600 px-8 py-4 text-sm font-bold text-blue-600 transition hover:bg-blue-50 dark:border-[#155dfc] dark:text-[#155dfc] dark:hover:bg-[#1d293d]"
                        >
                            Hubungi Kami
                        </button>
                    </div>
                </div>

                {/* Bagian gambar */}
                <div className="flex justify-center lg:justify-end">
                    <div className="flex aspect-[16/10] w-full max-w-xl items-center justify-center bg-transparent">
                        <img
                            src="/images/hero/hero-hydraulic.png"
                            alt="Excavator dan perlengkapan hydraulic"
                            className="h-full w-full select-none object-contain object-center drop-shadow-[0_14px_18px_rgba(15,23,42,0.18)] transition duration-300 dark:drop-shadow-[0_14px_20px_rgba(0,0,0,0.35)]"
                            loading="eager"
                            draggable="false"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}