import LogoutButton from '@/Components/Auth/LogoutButton';

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-100">
            <div className="flex">
                <aside className="flex min-h-screen w-64 flex-col bg-slate-900 p-6 text-white">
                    <div>
                        <h1 className="text-lg font-bold">Admin</h1>

                        <nav className="mt-8 space-y-3 text-sm">
                            <a
                                href="/admin/dashboard"
                                className="block rounded-lg px-3 py-2 hover:bg-slate-800"
                            >
                                Dashboard
                            </a>

                            <a
                                href="#"
                                className="block rounded-lg px-3 py-2 hover:bg-slate-800"
                            >
                                Kelola Akun
                            </a>

                            <a
                                href="#"
                                className="block rounded-lg px-3 py-2 hover:bg-slate-800"
                            >
                                Data Produk
                            </a>

                            <a
                                href="#"
                                className="block rounded-lg px-3 py-2 hover:bg-slate-800"
                            >
                                Data Pelanggan
                            </a>

                            <a
                                href="#"
                                className="block rounded-lg px-3 py-2 hover:bg-slate-800"
                            >
                                Transaksi Penjualan
                            </a>

                            <a
                                href="#"
                                className="block rounded-lg px-3 py-2 hover:bg-slate-800"
                            >
                                Piutang
                            </a>

                            <a
                                href="#"
                                className="block rounded-lg px-3 py-2 hover:bg-slate-800"
                            >
                                Laporan
                            </a>
                        </nav>
                    </div>

                    <div className="mt-auto pt-6">
                        <LogoutButton />
                    </div>
                </aside>

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}