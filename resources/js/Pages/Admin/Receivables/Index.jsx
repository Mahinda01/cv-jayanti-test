import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Clock3, Eye, Wallet, X } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Index({ receivables = [], payments = [] }) {
    const today = new Date().toISOString().slice(0, 10);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedReceivable, setSelectedReceivable] = useState(null);
    const [selectedDueDate, setSelectedDueDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const receivablesPerPage = 10;

    const dateInputClass =
        'h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:focus:ring-[#155dfc]/20 dark:[&::-webkit-calendar-picker-indicator]:cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:opacity-100 dark:[&::-webkit-calendar-picker-indicator]:[filter:invert(43%)_sepia(99%)_saturate(1843%)_hue-rotate(207deg)_brightness(100%)_contrast(98%)]';

    const modalDateInputClass =
        'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:focus:ring-[#155dfc]/20 dark:[&::-webkit-calendar-picker-indicator]:cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:opacity-100 dark:[&::-webkit-calendar-picker-indicator]:[filter:invert(43%)_sepia(99%)_saturate(1843%)_hue-rotate(207deg)_brightness(100%)_contrast(98%)]';

    const inputClass =
        'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:focus:ring-[#155dfc]/20';

    const paymentForm = useForm({
        sale_id: '',
        payment_date: today,
        payment_method: 'Tunai',
        amount: '',
        notes: '',
    });

    const dueDateForm = useForm({
        due_date: '',
    });

    const filteredReceivables = useMemo(() => {
        return receivables.filter((item) => {
            const keyword = search.toLowerCase();

            const matchSearch =
                item.invoice_number.toLowerCase().includes(keyword) ||
                item.customer_code.toLowerCase().includes(keyword) ||
                item.customer_name.toLowerCase().includes(keyword) ||
                item.customer_contact.toLowerCase().includes(keyword);

            const matchStatus =
                statusFilter === 'Semua' ||
                item.receivable_status === statusFilter;

            const matchDate =
                dateFilter === '' || item.sale_date_raw === dateFilter;

            return matchSearch && matchStatus && matchDate;
        });
    }, [receivables, search, statusFilter, dateFilter]);

    const totalPages = Math.ceil(
        filteredReceivables.length / receivablesPerPage,
    );

    const startIndex = (currentPage - 1) * receivablesPerPage;

    const currentReceivables = filteredReceivables.slice(
        startIndex,
        startIndex + receivablesPerPage,
    );

    const changeSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const changeStatusFilter = (value) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const changeDateFilter = (value) => {
        setDateFilter(value);
        setCurrentPage(1);
    };

    const openPaymentModal = (receivable) => {
        setSelectedReceivable(receivable);

        paymentForm.setData({
            sale_id: receivable.id,
            payment_date: today,
            payment_method: 'Tunai',
            amount: receivable.remaining_amount,
            notes: '',
        });
    };

    const closePaymentModal = () => {
        setSelectedReceivable(null);
        paymentForm.reset();
    };

    const submitPayment = (e) => {
        e.preventDefault();

        paymentForm.post(route('admin.receivables.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closePaymentModal();
            },
        });
    };

    const openDueDateModal = (receivable) => {
        setSelectedDueDate(receivable);

        dueDateForm.setData({
            due_date: receivable.due_date_raw || today,
        });
    };

    const closeDueDateModal = () => {
        setSelectedDueDate(null);
        dueDateForm.reset();
    };

    const submitDueDate = (e) => {
        e.preventDefault();

        dueDateForm.patch(
            route('admin.receivables.update-due-date', selectedDueDate.id),
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeDueDateModal();
                },
            },
        );
    };

    const getStatusClass = (status) => {
        if (status === 'Jatuh Tempo') {
            return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
        }

        return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400';
    };

    const getPaymentMethodClass = (method) => {
        if (method === 'Transfer') {
            return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
        }

        return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
    };

    return (
        <AdminLayout
            showSearch={true}
            searchValue={search}
            onSearchChange={changeSearch}
            searchPlaceholder="Cari invoice, kode, nama, atau kontak pelanggan..."
        >
            <Head title="Piutang Pelanggan" />

            <div className="space-y-4">
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Piutang Pelanggan
                    </h1>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => changeDateFilter(e.target.value)}
                            className={dateInputClass}
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                changeStatusFilter(e.target.value)
                            }
                            className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:focus:ring-[#155dfc]/20"
                        >
                            <option value="Semua">Semua Status</option>
                            <option value="Belum Lunas">Belum Lunas</option>
                            <option value="Jatuh Tempo">Jatuh Tempo</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1120px] text-left">
                            <thead className="bg-slate-50 dark:bg-[#131d31]">
                                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wide text-slate-600 dark:border-[#334155] dark:text-gray-400">
                                    <th className="whitespace-nowrap px-3 py-2.5">
                                        No. Invoice
                                    </th>

                                    <th className="whitespace-nowrap px-3 py-2.5">
                                        Pelanggan
                                    </th>

                                    <th className="whitespace-nowrap px-3 py-2.5">
                                        Tanggal
                                    </th>

                                    <th className="whitespace-nowrap px-3 py-2.5">
                                        Jatuh Tempo
                                    </th>

                                    <th className="whitespace-nowrap px-3 py-2.5 text-right">
                                        Total
                                    </th>

                                    <th className="whitespace-nowrap px-3 py-2.5 text-right">
                                        Dibayar
                                    </th>

                                    <th className="whitespace-nowrap px-3 py-2.5 text-right">
                                        Sisa Piutang
                                    </th>

                                    <th className="whitespace-nowrap px-3 py-2.5 text-center">
                                        Status
                                    </th>

                                    <th className="whitespace-nowrap px-3 py-2.5 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentReceivables.length > 0 ? (
                                    currentReceivables.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50 dark:border-[#334155] dark:hover:bg-[#131d31]"
                                        >
                                            <td className="px-3 py-2.5">
                                                <p className="whitespace-nowrap text-[12px] font-extrabold text-slate-900 dark:text-white">
                                                    {item.invoice_number}
                                                </p>

                                                <p className="mt-1 whitespace-nowrap text-[10px] font-medium text-slate-500 dark:text-gray-400">
                                                    Dibuat oleh{' '}
                                                    {item.created_by}
                                                </p>
                                            </td>

                                            <td className="px-3 py-2.5">
                                                <p className="whitespace-nowrap text-[12px] font-extrabold text-slate-900 dark:text-white">
                                                    {item.customer_name}
                                                </p>

                                                <p className="mt-1 whitespace-nowrap text-[10px] font-medium text-slate-500 dark:text-gray-400">
                                                    {item.customer_code} •{' '}
                                                    {item.customer_contact}
                                                </p>
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2.5 text-[12px] font-semibold text-slate-600 dark:text-gray-300">
                                                {item.sale_date}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2.5 text-[12px] font-semibold text-slate-600 dark:text-gray-300">
                                                {item.due_date}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2.5 text-right text-[12px] font-bold text-slate-700 dark:text-gray-300">
                                                {item.total_amount_text}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2.5 text-right text-[12px] font-bold text-slate-700 dark:text-gray-300">
                                                {item.paid_amount_text}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2.5 text-right text-[12px] font-extrabold text-slate-900 dark:text-white">
                                                {item.remaining_amount_text}
                                            </td>

                                            <td className="px-3 py-2.5 text-center">
                                                <span
                                                    className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-extrabold ${getStatusClass(
                                                        item.receivable_status,
                                                    )}`}
                                                >
                                                    {
                                                        item.receivable_status
                                                    }
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2.5">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Link
                                                        href={route(
                                                            'admin.sales.bon',
                                                            item.id,
                                                        )}
                                                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-[#131d31] dark:hover:text-white"
                                                        title="Lihat Bon"
                                                    >
                                                        <Eye size={15} />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDueDateModal(
                                                                item,
                                                            )
                                                        }
                                                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-[#155dfc] transition hover:bg-blue-100 dark:border-[#155dfc]/40 dark:bg-[#155dfc]/10 dark:text-[#60a5fa] dark:hover:bg-[#155dfc]/20"
                                                        title="Ubah Jatuh Tempo"
                                                    >
                                                        <Clock3 size={15} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openPaymentModal(
                                                                item,
                                                            )
                                                        }
                                                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-600 transition hover:bg-green-100 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/20"
                                                        title="Bayar Piutang"
                                                    >
                                                        <Wallet size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="px-4 py-8 text-center text-[12px] font-semibold text-slate-500 dark:text-gray-400"
                                        >
                                            Data piutang tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-200 px-3 py-2.5 dark:border-[#334155]">
                            <p className="text-[12px] font-medium text-slate-500 dark:text-gray-400">
                                Menampilkan {currentReceivables.length} dari{' '}
                                {filteredReceivables.length} data
                            </p>

                            <div className="flex items-center gap-2">
                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() =>
                                                setCurrentPage(index + 1)
                                            }
                                            className={`h-7 w-7 rounded-lg text-[12px] font-extrabold transition ${
                                                currentPage === index + 1
                                                    ? 'bg-[#155dfc] text-white'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#131d31] dark:text-gray-300 dark:hover:bg-[#334155]'
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="border-b border-slate-200 px-3 py-2.5 dark:border-[#334155]">
                        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            Riwayat Pembayaran Piutang
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[920px] text-left">
                            <thead className="bg-slate-50 dark:bg-[#131d31]">
                                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wide text-slate-600 dark:border-[#334155] dark:text-gray-400">
                                    <th className="whitespace-nowrap px-3 py-2.5">
                                        Tanggal Bayar
                                    </th>

                                    <th className="whitespace-nowrap px-3 py-2.5">
                                        No. Invoice
                                    </th>

                                    <th className="whitespace-nowrap px-3 py-2.5">
                                        Pelanggan
                                    </th>

                                    <th className="whitespace-nowrap px-3 py-2.5 text-center">
                                        Metode Bayar
                                    </th>

                                    <th className="whitespace-nowrap px-3 py-2.5 text-right">
                                        Jumlah Bayar
                                    </th>

                                    <th className="whitespace-nowrap px-3 py-2.5">
                                        Dibuat Oleh
                                    </th>

                                    <th className="whitespace-nowrap px-3 py-2.5">
                                        Catatan
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {payments.length > 0 ? (
                                    payments.slice(0, 10).map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="border-b border-slate-100 last:border-b-0 dark:border-[#334155]"
                                        >
                                            <td className="whitespace-nowrap px-3 py-2.5 text-[12px] font-semibold text-slate-600 dark:text-gray-300">
                                                {payment.payment_date}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2.5 text-[12px] font-extrabold text-slate-900 dark:text-white">
                                                {payment.invoice_number}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2.5 text-[12px] font-semibold text-slate-700 dark:text-gray-300">
                                                {payment.customer_name}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2.5 text-center">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${getPaymentMethodClass(
                                                        payment.payment_method,
                                                    )}`}
                                                >
                                                    {payment.payment_method ||
                                                        '-'}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2.5 text-right text-[12px] font-extrabold text-slate-900 dark:text-white">
                                                {payment.amount_text}
                                            </td>

                                            <td className="whitespace-nowrap px-3 py-2.5 text-[12px] font-semibold text-slate-700 dark:text-gray-300">
                                                {payment.user_name}
                                            </td>

                                            <td className="px-3 py-2.5 text-[12px] font-medium text-slate-500 dark:text-gray-400">
                                                {payment.notes || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-4 py-8 text-center text-[12px] font-semibold text-slate-500 dark:text-gray-400"
                                        >
                                            Belum ada riwayat pembayaran
                                            piutang.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedDueDate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    Ubah Tanggal Jatuh Tempo
                                </h2>

                                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                                    {selectedDueDate.invoice_number}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeDueDateModal}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-[#131d31]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mb-4 rounded-xl bg-slate-50 p-4 dark:bg-[#131d31]">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-slate-500 dark:text-gray-400">
                                    Pelanggan
                                </span>

                                <span className="font-extrabold text-slate-900 dark:text-white">
                                    {selectedDueDate.customer_name}
                                </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between text-sm">
                                <span className="font-semibold text-slate-500 dark:text-gray-400">
                                    Jatuh Tempo Saat Ini
                                </span>

                                <span className="font-extrabold text-slate-900 dark:text-white">
                                    {selectedDueDate.due_date}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={submitDueDate} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400">
                                    Tanggal Jatuh Tempo Baru
                                </label>

                                <input
                                    type="date"
                                    value={dueDateForm.data.due_date}
                                    onChange={(e) =>
                                        dueDateForm.setData(
                                            'due_date',
                                            e.target.value,
                                        )
                                    }
                                    className={modalDateInputClass}
                                />

                                {dueDateForm.errors.due_date && (
                                    <p className="mt-1 text-xs font-medium text-red-500">
                                        {dueDateForm.errors.due_date}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeDueDateModal}
                                    className="rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-[#334155] dark:text-gray-300 dark:hover:bg-[#131d31]"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={dueDateForm.processing}
                                    className="rounded-xl bg-[#155dfc] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-blue-600"
                                >
                                    {dueDateForm.processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Tanggal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedReceivable && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    Bayar Piutang
                                </h2>

                                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                                    {selectedReceivable.invoice_number}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closePaymentModal}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:text-gray-400 dark:hover:bg-[#131d31]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mb-4 rounded-xl bg-slate-50 p-4 dark:bg-[#131d31]">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-slate-500 dark:text-gray-400">
                                    Pelanggan
                                </span>

                                <span className="font-extrabold text-slate-900 dark:text-white">
                                    {selectedReceivable.customer_name}
                                </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between text-sm">
                                <span className="font-semibold text-slate-500 dark:text-gray-400">
                                    Sisa Piutang
                                </span>

                                <span className="font-extrabold text-orange-600 dark:text-orange-400">
                                    {selectedReceivable.remaining_amount_text}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={submitPayment} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400">
                                    Tanggal Bayar
                                </label>

                                <input
                                    type="date"
                                    value={paymentForm.data.payment_date}
                                    onChange={(e) =>
                                        paymentForm.setData(
                                            'payment_date',
                                            e.target.value,
                                        )
                                    }
                                    className={modalDateInputClass}
                                />

                                {paymentForm.errors.payment_date && (
                                    <p className="mt-1 text-xs font-medium text-red-500">
                                        {paymentForm.errors.payment_date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400">
                                    Metode Pembayaran
                                </label>

                                <select
                                    value={paymentForm.data.payment_method}
                                    onChange={(e) =>
                                        paymentForm.setData(
                                            'payment_method',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                >
                                    <option value="Tunai">Tunai</option>
                                    <option value="Transfer">Transfer</option>
                                </select>

                                {paymentForm.errors.payment_method && (
                                    <p className="mt-1 text-xs font-medium text-red-500">
                                        {paymentForm.errors.payment_method}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400">
                                    Jumlah Bayar
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    max={selectedReceivable.remaining_amount}
                                    value={paymentForm.data.amount}
                                    onChange={(e) =>
                                        paymentForm.setData(
                                            'amount',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                />

                                {paymentForm.errors.amount && (
                                    <p className="mt-1 text-xs font-medium text-red-500">
                                        {paymentForm.errors.amount}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400">
                                    Catatan
                                </label>

                                <input
                                    type="text"
                                    value={paymentForm.data.notes}
                                    onChange={(e) =>
                                        paymentForm.setData(
                                            'notes',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Catatan pembayaran, boleh dikosongkan"
                                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20"
                                />

                                {paymentForm.errors.notes && (
                                    <p className="mt-1 text-xs font-medium text-red-500">
                                        {paymentForm.errors.notes}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closePaymentModal}
                                    className="rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-300 dark:bg-[#334155] dark:text-gray-300 dark:hover:bg-[#131d31]"
                                >
                                    Batal
                                </button>

                                <button
                                    type="submit"
                                    disabled={paymentForm.processing}
                                    className="rounded-xl bg-[#155dfc] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-blue-600"
                                >
                                    {paymentForm.processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Pembayaran'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}