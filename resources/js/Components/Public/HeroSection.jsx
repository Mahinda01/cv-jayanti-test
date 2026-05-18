import { Package } from 'lucide-react';

export default function HeroSection() {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);

        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <section
            id="home"
            className="bg-gradient-to-br from-blue-50 via-white to-gray-50 px-0 pb-[110px] pt-32 transition-colors duration-300 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-12 md:grid-cols-2">
                    <div>
                        <h1 className="mb-4 w-full max-w-[400px] text-[48px] font-extrabold leading-[60px] tracking-tight text-[#101828] dark:text-white">
                            Solusi Hidrolik untuk Industri Anda
                        </h1>

                        <p className="mb-8 max-w-[520px] text-[18px] font-normal leading-[28px] text-gray-600 dark:text-gray-300">
                            Distributor hydraulic hose dan perlengkapan hidrolik berkualitas.
                        </p>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => scrollToSection('products')}
                                className="rounded-lg bg-blue-600 px-8 py-3.5 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl"
                            >
                                Lihat Produk
                            </button>

                            <button
                                type="button"
                                onClick={() => scrollToSection('contact')}
                                className="rounded-lg border-2 border-blue-600 bg-white px-8 py-3.5 font-semibold text-blue-600 transition-all duration-300 hover:scale-105 hover:bg-blue-50 dark:border-[#3B82F6] dark:bg-[rgba(37,99,235,0.08)] dark:text-[#60A5FA] dark:hover:bg-[#2563EB] dark:hover:text-white"
                            >
                                Hubungi Kami
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="group relative flex h-80 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg">
                            <div className="absolute inset-0 bg-blue-600 opacity-10 transition-opacity duration-500 group-hover:opacity-20"></div>

                            <Package
                                size={120}
                                className="relative z-10 text-blue-600 opacity-40 transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}