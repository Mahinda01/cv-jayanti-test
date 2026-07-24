import { BadgeDollarSign, Medal, Zap } from 'lucide-react';

export default function AboutSection() {
    const benefits = [
        {
            title: 'Kualitas Terjamin',
            description: 'Produk berkualitas tinggi dengan standar internasional',
            icon: Medal,
        },
        {
            title: 'Layanan Cepat',
            description: 'Respon dan pengiriman yang cepat dan efisien',
            icon: Zap,
        },
        {
            title: 'Harga Kompetitif',
            description: 'Harga bersaing dengan kualitas terbaik',
            icon: BadgeDollarSign,
        },
    ];

    return (
        <section
            id="about"
            className="min-h-[calc(100vh-78px)] scroll-mt-[78px] bg-white transition-colors duration-300 dark:bg-[#131d31]"
        >
            <div className="mx-auto w-full max-w-6xl px-6 pb-12 pt-12 lg:pt-14">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl">
                        Tentang Kami
                    </h2>

                    <p className="mt-5 text-base font-medium leading-relaxed text-slate-600 dark:text-gray-400">
                        CV Jayanti Muliatama adalah distributor terpercaya yang menyediakan hydraulic hose dan perlengkapan hidrolik berkualitas tinggi untuk berbagai industri.
                    </p>
                </div>

                <div className="mt-11 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {benefits.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-8 py-9 text-center transition hover:-translate-y-1 hover:shadow-lg dark:border-[#334155] dark:bg-[#1d293d] dark:ring-1 dark:ring-[#334155]/30 dark:hover:shadow-none"
                            >
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors duration-300 dark:bg-[#203a65] dark:text-[#3B82F6]">
                                    <Icon size={27} strokeWidth={2.3} />
                                </div>

                                <h3 className="mt-6 text-base font-extrabold text-slate-900 dark:text-white">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600 dark:text-gray-400">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}