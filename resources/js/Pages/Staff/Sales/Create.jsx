import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';

export default function Create({ products = [], customers = [] }) {
    const today = new Date().toISOString().slice(0, 10);

    const { data, setData, post, processing, errors } = useForm({
        sale_date: today,
        customer_id: '',
        payment_method: 'Tunai',
        paid_amount: '',
        notes: '',
        items: [
            {
                product_id: '',
                quantity: 1,
            },
        ],
    });

    const inputClass =
        'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20';

    const labelClass =
        'mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400';

    const errorClass = 'mt-1 text-xs font-medium text-red-500';

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value || 0);
    };

    const getProduct = (productId) => {
        return products.find(
            (product) => String(product.id) === String(productId),
        );
    };

    const getItemSubtotal = (item) => {
        const product = getProduct(item.product_id);

        if (!product) {
            return 0;
        }

        return Number(product.price) * Number(item.quantity || 0);
    };

    const totalAmount = data.items.reduce((total, item) => {
        return total + getItemSubtotal(item);
    }, 0);

    const paidAmount =
        data.payment_method === 'Kredit'
            ? Number(data.paid_amount || 0)
            : totalAmount;

    const remainingAmount = Math.max(totalAmount - paidAmount, 0);

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                product_id: '',
                quantity: 1,
            },
        ]);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.items];

        newItems[index] = {
            ...newItems[index],
            [field]: value,
        };

        if (field === 'product_id') {
            newItems[index].quantity = 1;
        }

        setData('items', newItems);
    };

    const removeItem = (index) => {
        if (data.items.length === 1) {
            setData('items', [
                {
                    product_id: '',
                    quantity: 1,
                },
            ]);

            return;
        }

        const newItems = data.items.filter(
            (_, itemIndex) => itemIndex !== index,
        );

        setData('items', newItems);
    };

    const changePaymentMethod = (value) => {
        setData({
            ...data,
            payment_method: value,
            customer_id: data.customer_id,
            paid_amount: value === 'Kredit' ? data.paid_amount : '',
        });
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('staff.sales.store'));
    };

    return (
        <StaffLayout>
            <Head title="Tambah Transaksi" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Tambah Transaksi
                    </h1>

                    <Link
                        href={route('staff.sales.index')}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-[#155dfc] transition hover:bg-blue-50 dark:border-[#155dfc]/40 dark:bg-[#1d293d] dark:text-[#60a5fa] dark:hover:bg-[#131d31]"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className={labelClass}>
                                    Tanggal Transaksi
                                </label>

                                <input
                                    type="date"
                                    value={data.sale_date}
                                    onChange={(e) =>
                                        setData('sale_date', e.target.value)
                                    }
                                    className={inputClass}
                                />

                                {errors.sale_date && (
                                    <p className={errorClass}>
                                        {errors.sale_date}
                                    </p>
                                )}
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
                                    {data.payment_method === 'Kredit' ? (
                                        <option value="">
                                            Pilih pelanggan
                                        </option>
                                    ) : (
                                        <option value="">Umum</option>
                                    )}

                                    {customers.map((customer) => (
                                        <option
                                            key={customer.id}
                                            value={customer.id}
                                        >
                                            {customer.code} - {customer.name}
                                        </option>
                                    ))}
                                </select>

                                {errors.customer_id && (
                                    <p className={errorClass}>
                                        {errors.customer_id}
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
                                        changePaymentMethod(e.target.value)
                                    }
                                    className={inputClass}
                                >
                                    <option value="Tunai">Tunai</option>
                                    <option value="Transfer">Transfer</option>
                                    <option value="Kredit">Kredit</option>
                                </select>

                                {errors.payment_method && (
                                    <p className={errorClass}>
                                        {errors.payment_method}
                                    </p>
                                )}
                            </div>

                            {data.payment_method === 'Kredit' && (
                                <div>
                                    <label className={labelClass}>
                                        Jumlah Dibayar
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={data.paid_amount}
                                        onChange={(e) =>
                                            setData(
                                                'paid_amount',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Masukkan jumlah dibayar"
                                        className={inputClass}
                                    />

                                    {errors.paid_amount && (
                                        <p className={errorClass}>
                                            {errors.paid_amount}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div
                                className={
                                    data.payment_method === 'Kredit'
                                        ? 'md:col-span-2'
                                        : 'md:col-span-3'
                                }
                            >
                                <label className={labelClass}>Catatan</label>

                                <input
                                    type="text"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    placeholder="Catatan transaksi, boleh dikosongkan"
                                    className={inputClass}
                                />

                                {errors.notes && (
                                    <p className={errorClass}>
                                        {errors.notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                Daftar Produk
                            </h2>

                            <button
                                type="button"
                                onClick={addItem}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#155dfc] px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 dark:hover:bg-blue-600"
                            >
                                <Plus size={15} />
                                Tambah Produk
                            </button>
                        </div>

                        {errors.items && (
                            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                                {errors.items}
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[860px] text-left">
                                <thead className="bg-slate-50 dark:bg-[#131d31]">
                                    <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wide text-slate-600 dark:border-[#334155] dark:text-gray-400">
                                        <th className="px-4 py-3">Produk</th>
                                        <th className="px-4 py-3 text-center">
                                            Stok
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Harga
                                        </th>
                                        <th className="px-4 py-3 text-center">
                                            Jumlah
                                        </th>
                                        <th className="px-4 py-3 text-right">
                                            Subtotal
                                        </th>
                                        <th className="px-4 py-3 text-center">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.items.map((item, index) => {
                                        const product = getProduct(
                                            item.product_id,
                                        );

                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-slate-100 last:border-b-0 dark:border-[#334155]"
                                            >
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={item.product_id}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                index,
                                                                'product_id',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className={inputClass}
                                                    >
                                                        <option value="">
                                                            Pilih Produk
                                                        </option>

                                                        {products.map(
                                                            (productItem) => (
                                                                <option
                                                                    key={
                                                                        productItem.id
                                                                    }
                                                                    value={
                                                                        productItem.id
                                                                    }
                                                                >
                                                                    {
                                                                        productItem.code
                                                                    }{' '}
                                                                    -{' '}
                                                                    {
                                                                        productItem.name
                                                                    }
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-gray-300">
                                                    {product
                                                        ? `${product.stock} ${product.unit || ''}`
                                                        : '-'}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-right text-xs font-extrabold text-slate-900 dark:text-white">
                                                    {product
                                                        ? product.price_text
                                                        : 'Rp 0'}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={
                                                            product
                                                                ? product.stock
                                                                : undefined
                                                        }
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                index,
                                                                'quantity',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className={`${inputClass} text-center`}
                                                    />
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-right text-xs font-extrabold text-slate-900 dark:text-white">
                                                    {formatRupiah(
                                                        getItemSubtotal(item),
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeItem(index)
                                                        }
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                                                        title={
                                                            data.items.length ===
                                                            1
                                                                ? 'Kosongkan produk'
                                                                : 'Hapus produk'
                                                        }
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                                Total Transaksi
                            </p>

                            <p className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
                                {formatRupiah(totalAmount)}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                                Dibayar
                            </p>

                            <p className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
                                {formatRupiah(paidAmount)}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                                Sisa Piutang
                            </p>

                            <p
                                className={`mt-2 text-xl font-extrabold ${
                                    remainingAmount > 0
                                        ? 'text-orange-600 dark:text-orange-400'
                                        : 'text-slate-900 dark:text-white'
                                }`}
                            >
                                {formatRupiah(remainingAmount)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href={route('staff.sales.index')}
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
                            {processing ? 'Menyimpan...' : 'Simpan Transaksi'}
                        </button>
                    </div>
                </form>
            </div>
        </StaffLayout>
    );
}