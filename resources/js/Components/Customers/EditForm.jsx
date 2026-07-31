import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditForm({
    Layout,
    customer,
    routePrefix,
    showReceivable = false,
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: customer.name || '',
        contact: customer.contact || '',
        address: customer.address || '',
    });

    const submit = (e) => {
        e.preventDefault();

        put(route(`${routePrefix}.customers.update`, customer.id));
    };

    const inputClass =
        'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20';

    const textareaClass =
        'min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20';

    const disabledInputClass =
        'h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-medium text-slate-500 dark:border-[#334155] dark:bg-[#131d31] dark:text-gray-500';

    const labelClass =
        'mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400';

    const errorClass = 'mt-1 text-xs font-medium text-red-500';

    return (
        <Layout>
            <Head title="Edit Pelanggan" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Edit Pelanggan
                        </h1>

                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                            {customer.code}
                        </p>
                    </div>

                    <Link
                        href={route(`${routePrefix}.customers.index`)}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-[#155dfc] transition hover:bg-blue-50 dark:border-[#155dfc]/40 dark:bg-[#1d293d] dark:text-[#60a5fa] dark:hover:bg-[#131d31]"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="mb-4">
                            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                Informasi Pelanggan
                            </h2>

                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                Perbarui identitas pelanggan tanpa mengubah
                                riwayat transaksi lama.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    Kode Pelanggan
                                </label>

                                <input
                                    type="text"
                                    value={customer.code || ''}
                                    disabled
                                    className={disabledInputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Nama Pelanggan{' '}
                                    <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    maxLength={100}
                                    placeholder="Masukkan nama pelanggan"
                                    className={inputClass}
                                    required
                                />

                                {errors.name && (
                                    <p className={errorClass}>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Kontak{' '}
                                    <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="tel"
                                    inputMode="tel"
                                    value={data.contact}
                                    onChange={(e) =>
                                        setData('contact', e.target.value)
                                    }
                                    maxLength={30}
                                    placeholder="Contoh: 082174369753"
                                    className={inputClass}
                                    required
                                />

                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                    Masukkan nomor telepon atau WhatsApp
                                    pelanggan.
                                </p>

                                {errors.contact && (
                                    <p className={errorClass}>
                                        {errors.contact}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Alamat
                                </label>

                                <textarea
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    maxLength={1000}
                                    placeholder="Masukkan alamat pelanggan"
                                    className={textareaClass}
                                />

                                {errors.address && (
                                    <p className={errorClass}>
                                        {errors.address}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {showReceivable && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                            <div className="mb-4">
                                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                    Informasi Piutang
                                </h2>

                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                    Nilai ini hanya dapat berubah melalui
                                    transaksi piutang dan pembayaran.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className={labelClass}>
                                        Total Piutang
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            customer.total_receivable_text ||
                                            'Rp 0'
                                        }
                                        disabled
                                        className={disabledInputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Status Piutang
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            customer.receivable_status ||
                                            'Tidak Ada Piutang'
                                        }
                                        disabled
                                        className={disabledInputClass}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href={route(
                                `${routePrefix}.customers.index`,
                            )}
                            className="rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-300 dark:bg-[#334155] dark:text-gray-300 dark:hover:bg-[#1d293d]"
                        >
                            Batal
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#155dfc] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-[#155dfc]/20 dark:hover:bg-blue-600"
                        >
                            <Save size={16} />

                            {processing
                                ? 'Menyimpan...'
                                : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}