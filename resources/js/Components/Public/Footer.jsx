import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

export default function Footer() {
    const whatsappLink =
        'https://wa.me/6282174369753?text=Halo%20CV%20Jayanti%20Muliatama,%20saya%20ingin%20bertanya%20tentang%20produk%20hidrolik.';

    const mapLink =
        'https://www.google.com/maps/search/?api=1&query=3.5689366441973083,98.66365652935305';

    return (
        <footer className="border-t border-[#334155]/70 bg-[#131d31] px-6 py-10 text-white">
            <div className="mx-auto max-w-3xl text-center">
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-3">
                        <div className="site-logo flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                            <img
                                src="/images/logo/logo-cv-jayanti.png"
                                alt="Logo CV Jayanti Muliatama"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div className="text-left leading-none">
                            <h2 className="text-xl font-extrabold leading-tight text-white">
                                CV Jayanti Muliatama
                            </h2>

                            <p className="mt-0.5 text-sm font-medium leading-tight text-gray-400">
                                Hydraulic Solutions
                            </p>
                        </div>
                    </div>
                </div>

                <p className="mx-auto mt-6 max-w-2xl text-sm font-medium leading-7 text-gray-400">
                    <span className="block">
                        Distributor hydraulic hose dan perlengkapan hidrolik
                        berkualitas
                    </span>
                    <span className="block">
                        untuk mendukung kebutuhan industri.
                    </span>
                </p>

                <div className="mt-7 flex justify-center gap-4">
                    <a
                        href="tel:082174369753"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#334155] bg-[#1d293d] text-[#3B82F6] transition hover:border-[#155dfc] hover:bg-[#203a65]"
                        aria-label="Telepon"
                    >
                        <Phone size={20} />
                    </a>

                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#334155] bg-[#1d293d] text-[#3B82F6] transition hover:border-[#16A34A] hover:bg-[#203a65] hover:text-[#16A34A]"
                        aria-label="WhatsApp"
                    >
                        <MessageCircle size={20} />
                    </a>

                    <a
                        href="mailto:cvjayantimuliatama@gmail.com"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#334155] bg-[#1d293d] text-[#3B82F6] transition hover:border-[#155dfc] hover:bg-[#203a65]"
                        aria-label="Email"
                    >
                        <Mail size={20} />
                    </a>

                    <a
                        href={mapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-[#334155] bg-[#1d293d] text-[#3B82F6] transition hover:border-[#155dfc] hover:bg-[#203a65]"
                        aria-label="Lokasi"
                    >
                        <MapPin size={20} />
                    </a>
                </div>

                <div className="mt-8 border-t border-[#334155]/50 pt-6 text-sm font-medium text-gray-500">
                    © 2026 CV Jayanti Muliatama. All rights reserved.
                </div>
            </div>
        </footer>
    );
}