import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function Edit({ customer }) {
    const { data, setData, put, processing, errors } = useForm({
        name: customer.name || '',
        contact: customer.contact || '',
        address: customer.address || '',
        is_active: customer.is_active,
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('staff.customers.update', customer.id));
    };

    return (
        <StaffLayout>
            <Head title="Ubah Pelanggan" />

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Ubah Pelanggan
                        </h1>

                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                            {customer.code}
                        </p>
                    </div>

                    <Link
                        href={route('staff.customers.index')}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 dark:border-[#334155] dark:text-gray-200 dark:hover:bg-[#1d293d]"
                    >
                        <ArrowLeft size={17} />
                        Kembali
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]"
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-bold text-slate-700 dark:text-gray-200">
                                Nama Pelanggan
                            </label>

                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#475569] dark:bg-[#314158] dark:text-white dark:focus:ring-[#155dfc]/20"
                                placeholder="Masukkan nama pelanggan"
                            />

                            {errors.name && (
                                <p className="mt-1 text-xs font-semibold text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-700 dark:text-gray-200">
                                Kontak
                            </label>

                            <input
                                type="text"
                                value={data.contact}
                                onChange={(e) =>
                                    setData('contact', e.target.value)
                                }
                                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#475569] dark:bg-[#314158] dark:text-white dark:focus:ring-[#155dfc]/20"
                                placeholder="Masukkan nomor telepon"
                            />

                            {errors.contact && (
                                <p className="mt-1 text-xs font-semibold text-red-500">
                                    {errors.contact}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-gray-200">
                                Alamat
                            </label>

                            <textarea
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                rows="4"
                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#475569] dark:bg-[#314158] dark:text-white dark:focus:ring-[#155dfc]/20"
                                placeholder="Masukkan alamat pelanggan"
                            />

                            {errors.address && (
                                <p className="mt-1 text-xs font-semibold text-red-500">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="inline-flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData('is_active', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-slate-300 text-[#155dfc] focus:ring-[#155dfc]"
                                />

                                <span className="text-sm font-bold text-slate-700 dark:text-gray-200">
                                    Pelanggan aktif
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#155dfc] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            <Save size={17} />
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </StaffLayout>
    );
}