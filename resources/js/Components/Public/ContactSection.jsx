import { useEffect, useState } from 'react';
import { Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { Map, MapMarker, MarkerContent } from '../../../../components/ui/map';

export default function ContactSection() {
    const [mapTheme, setMapTheme] = useState('light');

    const whatsappLink =
        'https://wa.me/6282174369753?text=Halo%20CV%20Jayanti%20Muliatama,%20saya%20ingin%20bertanya%20tentang%20produk%20hidrolik.';

    const mapLink =
        'https://www.google.com/maps/search/?api=1&query=3.5689366441973083,98.66365652935305';

    const longitude = 98.66365652935305;
    const latitude = 3.5689366441973083;

    const cartoLightStyle = {
        version: 8,
        sources: {
            carto: {
                type: 'raster',
                tiles: [
                    'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                    'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                    'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                ],
                tileSize: 256,
                attribution: '© CARTO, © OpenStreetMap contributors',
            },
        },
        layers: [
            {
                id: 'carto-light',
                type: 'raster',
                source: 'carto',
            },
        ],
    };

    const cartoDarkStyle = {
        version: 8,
        sources: {
            carto: {
                type: 'raster',
                tiles: [
                    'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                    'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                    'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                ],
                tileSize: 256,
                attribution: '© CARTO, © OpenStreetMap contributors',
            },
        },
        layers: [
            {
                id: 'carto-dark',
                type: 'raster',
                source: 'carto',
                paint: {
                    'raster-brightness-min': 0.32,
                    'raster-brightness-max': 1,
                    'raster-contrast': 0.08,
                    'raster-saturation': -0.05,
                },
            },
        ],
    };

    const contacts = [
        {
            title: 'Alamat',
            detail: 'Jl. Karya Sehati No.20, Polonia, Kec. Medan Polonia, Kota Medan, Sumatera Utara 20157',
            icon: MapPin,
        },
        {
            title: 'Telepon / WhatsApp',
            detail: '0821-7436-9753',
            icon: Phone,
            whatsapp: true,
        },
        {
            title: 'Email',
            detail: 'cvjayantimuliatama@gmail.com',
            icon: Mail,
        },
        {
            title: 'Jam Operasional',
            detail: 'Setiap hari: 08.00 - 21.00 WIB',
            icon: Clock,
        },
    ];

    useEffect(() => {
        function updateMapTheme() {
            const isDark = document.documentElement.classList.contains('dark');
            setMapTheme(isDark ? 'dark' : 'light');
        }

        updateMapTheme();

        const observer = new MutationObserver(updateMapTheme);

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <section
            id="contact"
            className="scroll-mt-[78px] bg-white transition-colors duration-300 dark:bg-[#131d31]"
        >
            <div className="mx-auto w-full max-w-7xl px-6 pb-10 pt-10">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white md:text-4xl">
                        Hubungi Kami
                    </h2>

                    <p className="mt-2 text-sm font-medium text-slate-600 dark:text-gray-400 md:text-base">
                        Kami siap melayani kebutuhan hidrolik Anda
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-[1.05fr_0.95fr] md:items-stretch">
                    <div className="space-y-3">
                        {contacts.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-colors duration-300 dark:border-[#334155] dark:bg-[#1d293d]"
                                >
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors duration-300 dark:bg-[#203a65] dark:text-[#3B82F6]">
                                        <Icon size={20} />
                                    </div>

                                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                                {item.title}
                                            </h3>

                                            <p className="mt-1 break-words text-sm font-medium leading-snug text-slate-600 dark:text-gray-400">
                                                {item.detail}
                                            </p>
                                        </div>

                                        {item.whatsapp && (
                                            <a
                                                href={whatsappLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="shrink-0 rounded-lg bg-[#16A34A] px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-green-600/20 transition hover:bg-[#15803D]"
                                            >
                                                WhatsApp
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="h-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm transition-colors duration-300 dark:border-[#334155] dark:bg-[#1d293d] dark:shadow-none md:h-full">
                        <div className="relative h-full w-full">
                            <Map
                                center={[longitude, latitude]}
                                zoom={17}
                                theme={mapTheme}
                                styles={{
                                    light: cartoLightStyle,
                                    dark: cartoDarkStyle,
                                }}
                            >
                                <MapMarker
                                    longitude={longitude}
                                    latitude={latitude}
                                >
                                    <MarkerContent>
                                        <div className="relative flex flex-col items-center">
                                            <span className="absolute h-12 w-12 rounded-full bg-blue-500/25 blur-md dark:bg-[#155dfc]/25" />
                                            <span className="absolute h-10 w-10 animate-ping rounded-full bg-blue-500/25 dark:bg-[#155dfc]/25" />

                                            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/35 ring-2 ring-white/90 transition-colors duration-300 dark:bg-[#155dfc] dark:shadow-[#155dfc]/30 dark:ring-[#1d293d]">
                                                <MapPin
                                                    size={17}
                                                    strokeWidth={2.5}
                                                />
                                            </div>

                                            <div className="mt-1 h-2 w-2 rotate-45 rounded-sm bg-blue-600 shadow-sm dark:bg-[#155dfc]" />
                                        </div>
                                    </MarkerContent>
                                </MapMarker>
                            </Map>

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-white/10 dark:from-[#131d31]/30 dark:via-transparent dark:to-[#131d31]/10" />

                            <a
                                href={mapLink}
                                target="_blank"
                                rel="noreferrer"
                                className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-extrabold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 dark:bg-[#155dfc] dark:shadow-[#155dfc]/25 dark:hover:bg-blue-600"
                            >
                                Lihat Lokasi
                                <ExternalLink size={14} />
                            </a>

                            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-slate-900/5 dark:ring-[#155dfc]/10" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}