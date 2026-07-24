import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function Edit({ customer }) {
    const { data, setData, put, processing, errors } = useForm({
        name: customer.name || '',
        contact: customer.contact || '',
        address: customer.address || '',
        total_receivable: customer.total_receivable || 0,
        receivable_status: customer.receivable_status || 'Tidak Ada Piutang',
        is_active: Boolean(customer.is_active),
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.customers.update', customer.id));
    };

    const inputClass =
        'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20';

    const labelClass =
        'mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400';

    const errorClass = 'mt-1 text-xs font-medium text-red-500';

    return (
        <AdminLayout>
            <Head title="Edit Pelanggan" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Edit Pelanggan
                    </h1>

                    <Link
                        href={route('admin.customers.index')}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-[#155dfc] transition hover:bg-blue-50 dark:border-[#155dfc]/40 dark:bg-[#1d293d] dark:text-[#60a5fa] dark:hover:bg-[#131d31]"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    Kode Pelanggan
                                </label>

                                <input
                                    type="text"
                                    value={customer.code}
                                    disabled
                                    className="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-medium text-slate-500 dark:border-[#334155] dark:bg-[#131d31] dark:text-gray-500"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Nama Pelanggan
                                </label>

                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Masukkan nama pelanggan"
                                    className={inputClass}
                                />

                                {errors.name && (
                                    <p className={errorClass}>{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Kontak</label>

                                <input
                                    type="text"
                                    value={data.contact}
                                    onChange={(e) =>
                                        setData('contact', e.target.value)
                                    }
                                    placeholder="Masukkan kontak pelanggan"
                                    className={inputClass}
                                />

                                {errors.contact && (
                                    <p className={errorClass}>
                                        {errors.contact}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Alamat</label>

                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    placeholder="Masukkan alamat pelanggan"
                                    className={inputClass}
                                />

                                {errors.address && (
                                    <p className={errorClass}>
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Total Piutang
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={data.total_receivable}
                                    onChange={(e) =>
                                        setData(
                                            'total_receivable',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                />

                                {errors.total_receivable && (
                                    <p className={errorClass}>
                                        {errors.total_receivable}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Status Piutang
                                </label>

                                <select
                                    value={data.receivable_status}
                                    onChange={(e) =>
                                        setData(
                                            'receivable_status',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                >
                                    <option value="Tidak Ada Piutang">
                                        Tidak Ada Piutang
                                    </option>
                                    <option value="Belum Lunas">
                                        Belum Lunas
                                    </option>
                                    <option value="Jatuh Tempo">
                                        Jatuh Tempo
                                    </option>
                                </select>

                                {errors.receivable_status && (
                                    <p className={errorClass}>
                                        {errors.receivable_status}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div>
                            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                                Status Pelanggan
                            </p>

                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                {data.is_active ? 'Aktif' : 'Tidak Aktif'}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setData('is_active', !data.is_active)
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                                data.is_active
                                    ? 'bg-[#155dfc]'
                                    : 'bg-slate-300 dark:bg-[#334155]'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition ${
                                    data.is_active
                                        ? 'translate-x-5'
                                        : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href={route('admin.customers.index')}
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
                            {processing ? 'Menyimpan...' : 'Simpan Edit'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}