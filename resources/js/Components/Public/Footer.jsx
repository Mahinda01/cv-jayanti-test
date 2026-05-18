import Logo from '@/Components/Public/Logo';

export default function Footer() {
    return (
        <footer className="bg-slate-950 px-6 py-14 text-white">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-10 md:grid-cols-3">
                    <div>
                        <Logo />

                        <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                            Distributor hydraulic hose dan perlengkapan hidrolik
                            berkualitas untuk kebutuhan industri.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold">Kontak</h3>

                        <div className="mt-5 space-y-2 text-sm leading-6 text-slate-400">
                            <p>Jl. Industri Raya No. 123</p>
                            <p>Medan, Sumatera Utara</p>
                            <p>+62 812-3456-7890</p>
                            <p>info@jayantimuliatama.com</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold">Jam Operasional</h3>

                        <div className="mt-5 space-y-2 text-sm leading-6 text-slate-400">
                            <p>Senin – Jumat: 08.00 – 17.00</p>
                            <p>Sabtu: 08.00 – 14.00</p>
                            <p>Minggu/Hari Besar: Tutup</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
                    © 2026 CV Jayanti Muliatama. All rights reserved.
                </div>
            </div>
        </footer>
    );
}