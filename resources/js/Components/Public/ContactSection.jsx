import { Clock, Mail, MapPin, Phone } from 'lucide-react';

export default function ContactSection() {
    return (
        <section
            id="contact"
            className="bg-white px-6 py-20 dark:bg-slate-950"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-4xl font-bold text-slate-950 dark:text-white">
                        Hubungi Kami
                    </h2>

                    <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">
                        Kami siap melayani kebutuhan hidrolik Anda
                    </p>
                </div>

                <div className="mt-12 grid gap-8 lg:grid-cols-2">
                    <div className="space-y-5">
                        <ContactCard
                            icon={MapPin}
                            title="Alamat"
                            description="Jl. Industri Raya No. 123, Medan, Sumatera Utara"
                        />

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                            <div className="flex gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-400">
                                    <Phone size={22} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-950 dark:text-white">
                                        Telepon / WhatsApp
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                        +62 812-3456-7890
                                    </p>

                                    <a
                                        href="https://wa.me/6281234567890"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-4 inline-block rounded-lg bg-green-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
                                    >
                                        Hubungi via WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>

                        <ContactCard
                            icon={Mail}
                            title="Email"
                            description="info@jayantimuliatama.com"
                        />

                        <ContactCard
                            icon={Clock}
                            title="Jam Operasional"
                            description={
                                <>
                                    <span className="block">Senin – Jumat: 08.00 – 17.00</span>
                                    <span className="block">Sabtu: 08.00 – 14.00</span>
                                    <span className="block">Minggu/Hari Besar: Tutup</span>
                                </>
                            }
                        />
                    </div>

                    <div className="flex min-h-[420px] items-center justify-center rounded-2xl bg-slate-200 text-center dark:bg-slate-800">
                        <div>
                            <MapPin
                                size={52}
                                strokeWidth={1.8}
                                className="mx-auto text-slate-400 dark:text-slate-500"
                            />
                            <p className="mt-4 font-semibold text-slate-600 dark:text-slate-300">
                                Google Maps
                            </p>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Lokasi CV Jayanti Muliatama
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ContactCard({ icon: Icon, title, description }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-400">
                    <Icon size={22} />
                </div>

                <div>
                    <h3 className="font-bold text-slate-950 dark:text-white">
                        {title}
                    </h3>

                    <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
}