import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';

export default function Create({ products = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        purchase_date: new Date().toISOString().slice(0, 10),
        supplier: '',
        note: '',
        items: [
            {
                product_id: '',
                quantity: 1,
                purchase_price: 0,
            },
        ],
    });

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value || 0);
    };

    const getProduct = (productId) => {
        return products.find((product) => String(product.id) === String(productId));
    };

    const updateItem = (index, field, value) => {
        const items = [...data.items];
        items[index][field] = value;

        if (field === 'product_id') {
            const product = getProduct(value);
            items[index].purchase_price = product?.purchase_price || 0;
        }

        setData('items', items);
    };

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                product_id: '',
                quantity: 1,
                purchase_price: 0,
            },
        ]);
    };

    const removeItem = (index) => {
        if (data.items.length === 1) {
            return;
        }

        setData(
            'items',
            data.items.filter((_, itemIndex) => itemIndex !== index),
        );
    };

    const totalAmount = data.items.reduce((total, item) => {
        return total + Number(item.quantity || 0) * Number(item.purchase_price || 0);
    }, 0);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.purchases.store'));
    };

    const inputClass =
        'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20';

    const labelClass =
        'mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400';

    const errorClass = 'mt-1 text-xs font-medium text-red-500';

    return (
        <AdminLayout>
            <Head title="Tambah Pembelian" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Tambah Pembelian
                    </h1>

                    <Link
                        href={route('admin.purchases.index')}
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
                                    Tanggal Pembelian
                                </label>
                                <input
                                    type="date"
                                    value={data.purchase_date}
                                    onChange={(e) =>
                                        setData('purchase_date', e.target.value)
                                    }
                                    className={inputClass}
                                />
                                {errors.purchase_date && (
                                    <p className={errorClass}>
                                        {errors.purchase_date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Supplier</label>
                                <input
                                    type="text"
                                    value={data.supplier}
                                    onChange={(e) =>
                                        setData('supplier', e.target.value)
                                    }
                                    placeholder="Nama supplier"
                                    className={inputClass}
                                />
                                {errors.supplier && (
                                    <p className={errorClass}>
                                        {errors.supplier}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>Catatan</label>
                                <textarea
                                    value={data.note}
                                    onChange={(e) =>
                                        setData('note', e.target.value)
                                    }
                                    placeholder="Catatan tambahan"
                                    rows="3"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                    Produk Pembelian
                                </h2>
                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                    Stok produk akan bertambah setelah transaksi disimpan.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addItem}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-[#155dfc] transition hover:bg-blue-100 dark:bg-[#131d31] dark:hover:bg-[#334155]"
                            >
                                <Plus size={16} />
                                Tambah Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {data.items.map((item, index) => {
                                const selectedProduct = getProduct(item.product_id);
                                const subtotal =
                                    Number(item.quantity || 0) *
                                    Number(item.purchase_price || 0);

                                return (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 p-4 dark:border-[#334155] lg:grid-cols-[1.6fr_0.7fr_0.8fr_0.8fr_auto]"
                                    >
                                        <div>
                                            <label className={labelClass}>
                                                Produk
                                            </label>
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
                                                    Pilih produk
                                                </option>
                                                {products.map((product) => (
                                                    <option
                                                        key={product.id}
                                                        value={product.id}
                                                    >
                                                        {product.name}
                                                    </option>
                                                ))}
                                            </select>

                                            {selectedProduct && (
                                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                                    Stok saat ini:{' '}
                                                    {selectedProduct.stock}{' '}
                                                    {selectedProduct.unit}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Jumlah
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        'quantity',
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Harga Beli
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.purchase_price}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        'purchase_price',
                                                        e.target.value,
                                                    )
                                                }
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Subtotal
                                            </label>
                                            <input
                                                type="text"
                                                value={formatRupiah(subtotal)}
                                                disabled
                                                className="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-bold text-slate-600 dark:border-[#334155] dark:bg-[#131d31] dark:text-gray-400"
                                            />
                                        </div>

                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(index)
                                                }
                                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500/10 dark:text-red-400"
                                                disabled={data.items.length === 1}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {errors.items && (
                            <p className={errorClass}>{errors.items}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d] sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-gray-400">
                                Total Pembelian
                            </p>
                            <p className="mt-1 text-2xl font-extrabold text-[#155dfc]">
                                {formatRupiah(totalAmount)}
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155dfc] px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-[#155dfc]/20 dark:hover:bg-blue-600"
                        >
                            <Save size={16} />
                            {processing ? 'Menyimpan...' : 'Simpan Pembelian'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}