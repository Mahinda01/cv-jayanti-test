import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function CreateInitial({ customers = [], receivable_number }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        record_date: new Date().toISOString().slice(0, 10),
        due_date: '',
        old_bon_number: '',
        total_amount: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.receivables.initial.store'));
    };

    const inputClass =
        'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-[#155dfc] dark:border-[#334155] dark:bg-[#131d31] dark:text-white';

    const labelClass =
        'mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400';

    const errorClass = 'mt-1 text-xs font-medium text-red-500';

    return (
        <AdminLayout>
            <Head title="Tambah Piutang Awal" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Tambah Piutang Awal
                        </h1>
                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                            Catat piutang pelanggan yang sudah ada sebelum sistem digunakan.
                        </p>
                    </div>

                    <Link
                        href={route('admin.receivables.index')}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-[#155dfc] hover:bg-blue-50 dark:border-[#155dfc]/40 dark:bg-[#1d293d]"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]"
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>Nomor Piutang</label>
                            <input
                                type="text"
                                value={receivable_number}
                                disabled
                                className="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-bold text-slate-500 dark:border-[#334155] dark:bg-[#131d31] dark:text-gray-500"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Pelanggan</label>
                            <select
                                value={data.customer_id}
                                onChange={(e) =>
                                    setData('customer_id', e.target.value)
                                }
                                className={inputClass}
                            >
                                <option value="">Pilih pelanggan</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                            {errors.customer_id && (
                                <p className={errorClass}>{errors.customer_id}</p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Tanggal Pencatatan</label>
                            <input
                                type="date"
                                value={data.record_date}
                                onChange={(e) =>
                                    setData('record_date', e.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.record_date && (
                                <p className={errorClass}>{errors.record_date}</p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Tanggal Jatuh Tempo</label>
                            <input
                                type="date"
                                value={data.due_date}
                                onChange={(e) =>
                                    setData('due_date', e.target.value)
                                }
                                className={inputClass}
                            />
                            {errors.due_date && (
                                <p className={errorClass}>{errors.due_date}</p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Nomor Bon Lama</label>
                            <input
                                type="text"
                                value={data.old_bon_number}
                                onChange={(e) =>
                                    setData('old_bon_number', e.target.value)
                                }
                                placeholder="Opsional"
                                className={inputClass}
                            />
                            {errors.old_bon_number && (
                                <p className={errorClass}>
                                    {errors.old_bon_number}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={labelClass}>Jumlah Piutang</label>
                            <input
                                type="number"
                                min="1"
                                value={data.total_amount}
                                onChange={(e) =>
                                    setData('total_amount', e.target.value)
                                }
                                placeholder="Masukkan jumlah piutang"
                                className={inputClass}
                            />
                            {errors.total_amount && (
                                <p className={errorClass}>{errors.total_amount}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Keterangan</label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows="4"
                                placeholder="Keterangan piutang awal"
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none focus:border-[#155dfc] dark:border-[#334155] dark:bg-[#131d31] dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="mt-5 flex justify-end gap-3">
                        <Link
                            href={route('admin.receivables.index')}
                            className="rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-300 dark:bg-[#334155] dark:text-gray-300"
                        >
                            Batal
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#155dfc] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-70"
                        >
                            <Save size={16} />
                            {processing ? 'Menyimpan...' : 'Simpan Piutang Awal'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}