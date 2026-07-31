import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, XCircle } from 'lucide-react';

export default function Show({ receivable, payments = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        source_type: receivable.source_type,
        source_id: receivable.id,
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: 'Tunai',
        amount: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.receivables.payments.store'), {
            onSuccess: () => reset('amount', 'notes'),
        });
    };

    const cancelPayment = (payment) => {
        const reason = window.prompt('Masukkan alasan pembatalan pembayaran:');

        if (!reason) {
            return;
        }

        router.patch(payment.cancel_url, {
            cancel_reason: reason,
        });
    };

    const statusClass = (value) => {
        if (value === 'Lunas') {
            return 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400';
        }

        if (value === 'Jatuh Tempo') {
            return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
        }

        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400';
    };

    const inputClass =
        'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-[#155dfc] dark:border-[#334155] dark:bg-[#131d31] dark:text-white';

    const labelClass =
        'mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400';

    const errorClass = 'mt-1 text-xs font-medium text-red-500';

    return (
        <AdminLayout>
            <Head title="Detail Piutang" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Detail Piutang
                        </h1>
                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                            {receivable.source_label} - {receivable.number}
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

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d] lg:col-span-2">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    {receivable.customer_name}
                                </h2>
                                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                                    {receivable.customer_contact || '-'}
                                </p>
                            </div>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-extrabold ${statusClass(
                                    receivable.status,
                                )}`}
                            >
                                {receivable.status}
                            </span>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Info label="Sumber Piutang" value={receivable.source_label} />
                            <Info label="Nomor Transaksi / Bon" value={receivable.number} />
                            <Info label="Tanggal Transaksi" value={receivable.transaction_date} />
                            <Info label="Tanggal Jatuh Tempo" value={receivable.due_date} />
                            <Info label="Total Tagihan" value={receivable.total_amount_text} />
                            <Info label="Jumlah Pembayaran" value={receivable.paid_amount_text} />
                            <Info label="Sisa Piutang" value={receivable.remaining_amount_text} highlight />
                            <Info label="Alamat Pelanggan" value={receivable.customer_address || '-'} />
                        </div>

                        {receivable.notes && (
                            <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-[#131d31]">
                                <p className="text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                    Keterangan
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-700 dark:text-gray-300">
                                    {receivable.notes}
                                </p>
                            </div>
                        )}
                    </div>

                    <form
                        onSubmit={submit}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]"
                    >
                        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            Catat Pembayaran
                        </h2>

                        {receivable.remaining_amount <= 0 ? (
                            <p className="mt-4 rounded-xl bg-green-50 p-4 text-sm font-bold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                                Piutang ini sudah lunas.
                            </p>
                        ) : (
                            <div className="mt-4 space-y-3">
                                <div>
                                    <label className={labelClass}>
                                        Tanggal Pembayaran
                                    </label>
                                    <input
                                        type="date"
                                        value={data.payment_date}
                                        onChange={(e) =>
                                            setData('payment_date', e.target.value)
                                        }
                                        className={inputClass}
                                    />
                                    {errors.payment_date && (
                                        <p className={errorClass}>
                                            {errors.payment_date}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Metode Pembayaran
                                    </label>
                                    <select
                                        value={data.payment_method}
                                        onChange={(e) =>
                                            setData('payment_method', e.target.value)
                                        }
                                        className={inputClass}
                                    >
                                        <option value="Tunai">Tunai</option>
                                        <option value="Transfer">Transfer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Jumlah Pembayaran
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={receivable.remaining_amount}
                                        value={data.amount}
                                        onChange={(e) =>
                                            setData('amount', e.target.value)
                                        }
                                        className={inputClass}
                                    />
                                    {errors.amount && (
                                        <p className={errorClass}>{errors.amount}</p>
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>Catatan</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData('notes', e.target.value)
                                        }
                                        rows="3"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none focus:border-[#155dfc] dark:border-[#334155] dark:bg-[#131d31] dark:text-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#155dfc] px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-70"
                                >
                                    <Save size={16} />
                                    {processing ? 'Menyimpan...' : 'Simpan Pembayaran'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="border-b border-slate-200 p-5 dark:border-[#334155]">
                        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            Riwayat Pembayaran
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-[#334155]">
                            <thead className="bg-slate-50 dark:bg-[#131d31]">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        Tanggal
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        Metode
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        Jumlah
                                    </th>
                                    <th className="px-5 py-3 text-left text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        Status
                                    </th>
                                    <th className="px-5 py-3 text-right text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200 dark:divide-[#334155]">
                                {payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td className="px-5 py-4 text-sm font-bold text-slate-700 dark:text-gray-300">
                                            {payment.payment_date}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-bold text-slate-700 dark:text-gray-300">
                                            {payment.payment_method}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-extrabold text-[#155dfc]">
                                            {payment.amount_text}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                                                    payment.status === 'Dibatalkan'
                                                        ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                                                        : 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                                                }`}
                                            >
                                                {payment.status}
                                            </span>

                                            {payment.cancel_reason && (
                                                <p className="mt-1 text-xs font-medium text-red-500">
                                                    Alasan: {payment.cancel_reason}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end">
                                                {payment.status !== 'Dibatalkan' && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            cancelPayment(payment)
                                                        }
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                                                        title="Batalkan Pembayaran"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {payments.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-5 py-10 text-center text-sm font-bold text-slate-500 dark:text-gray-400"
                                        >
                                            Belum ada pembayaran.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function Info({ label, value, highlight = false }) {
    return (
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-[#131d31]">
            <p className="text-xs font-extrabold uppercase text-slate-500 dark:text-gray-400">
                {label}
            </p>
            <p
                className={`mt-1 text-sm font-extrabold ${
                    highlight
                        ? 'text-[#155dfc]'
                        : 'text-slate-900 dark:text-white'
                }`}
            >
                {value}
            </p>
        </div>
    );
}