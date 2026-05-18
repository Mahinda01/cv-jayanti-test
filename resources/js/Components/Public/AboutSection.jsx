import { Award, DollarSign, Zap } from 'lucide-react';

const features = [
    {
        icon: Award,
        title: 'Kualitas Terjamin',
        description: 'Produk berkualitas tinggi dengan standar internasional',
    },
    {
        icon: Zap,
        title: 'Layanan Cepat',
        description: 'Respon dan pengiriman yang cepat dan efisien',
    },
    {
        icon: DollarSign,
        title: 'Harga Kompetitif',
        description: 'Harga bersaing dengan kualitas terbaik',
    },
];

export default function AboutSection() {
    return (
        <section
            id="about"
            className="bg-slate-50 px-6 py-20 dark:bg-slate-900"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-4xl font-bold text-slate-950 dark:text-white">
                        Tentang Kami
                    </h2>

                    <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
                        CV Jayanti Muliatama adalah distributor terpercaya yang menyediakan
                        hydraulic hose dan perlengkapan hidrolik berkualitas tinggi untuk
                        berbagai industri.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                            >
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-400">
                                    <Icon size={26} />
                                </div>

                                <h3 className="mt-6 font-bold text-slate-950 dark:text-white">
                                    {feature.title}
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}