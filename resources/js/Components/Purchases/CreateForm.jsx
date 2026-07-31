import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';

const getLocalDate = () => {
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset() * 60000;

    return new Date(date.getTime() - timezoneOffset)
        .toISOString()
        .slice(0, 10);
};

export default function CreateForm({
    Layout,
    products = [],
    routePrefix,
}) {
    const today = getLocalDate();

    const { data, setData, post, processing, errors } = useForm({
        purchase_date: today,
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
        }).format(Number(value) || 0);
    };

    const getProduct = (productId) => {
        return products.find(
            (product) =>
                String(product.id) === String(productId),
        );
    };

    const getItemError = (index, field) => {
        return errors[`items.${index}.${field}`];
    };

    const isProductSelected = (productId, currentIndex) => {
        return data.items.some(
            (item, index) =>
                index !== currentIndex &&
                String(item.product_id) === String(productId),
        );
    };

    const updateItem = (index, field, value) => {
        const updatedItems = data.items.map(
            (item, itemIndex) => {
                if (itemIndex !== index) {
                    return item;
                }

                if (field === 'product_id') {
                    const product = getProduct(value);

                    return {
                        ...item,
                        product_id: value,
                        purchase_price:
                            product?.purchase_price || 0,
                    };
                }

                return {
                    ...item,
                    [field]: value,
                };
            },
        );

        setData('items', updatedItems);
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
            data.items.filter(
                (_, itemIndex) => itemIndex !== index,
            ),
        );
    };

    const totalAmount = data.items.reduce((total, item) => {
        const quantity = Number(item.quantity) || 0;
        const purchasePrice =
            Number(item.purchase_price) || 0;

        return total + quantity * purchasePrice;
    }, 0);

    const submit = (e) => {
        e.preventDefault();

        post(route(`${routePrefix}.purchases.store`));
    };

    const inputClass =
        'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20';

    const textareaClass =
        'min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20';

    const disabledInputClass =
        'h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-bold text-slate-600 dark:border-[#334155] dark:bg-[#131d31] dark:text-gray-400';

    const labelClass =
        'mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400';

    const errorClass =
        'mt-1 text-xs font-medium text-red-500';

    return (
        <Layout>
            <Head title="Tambah Pembelian" />

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Tambah Pembelian
                    </h1>

                    <Link
                        href={route(
                            `${routePrefix}.purchases.index`,
                        )}
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
                                Informasi Pembelian
                            </h2>

                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                Masukkan tanggal, supplier, dan catatan
                                transaksi pembelian.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    Tanggal Pembelian{' '}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="date"
                                    value={data.purchase_date}
                                    max={today}
                                    onChange={(e) =>
                                        setData(
                                            'purchase_date',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    required
                                />

                                {errors.purchase_date && (
                                    <p className={errorClass}>
                                        {errors.purchase_date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Supplier{' '}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    value={data.supplier}
                                    onChange={(e) =>
                                        setData(
                                            'supplier',
                                            e.target.value,
                                        )
                                    }
                                    maxLength={255}
                                    placeholder="Masukkan nama supplier"
                                    className={inputClass}
                                    required
                                />

                                {errors.supplier && (
                                    <p className={errorClass}>
                                        {errors.supplier}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Catatan
                                </label>

                                <textarea
                                    value={data.note}
                                    onChange={(e) =>
                                        setData(
                                            'note',
                                            e.target.value,
                                        )
                                    }
                                    maxLength={1000}
                                    placeholder="Masukkan catatan tambahan"
                                    className={textareaClass}
                                />

                                {errors.note && (
                                    <p className={errorClass}>
                                        {errors.note}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                    Produk Pembelian
                                </h2>

                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                    Stok dan harga modal akan
                                    diperbarui setelah transaksi
                                    disimpan.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addItem}
                                disabled={
                                    data.items.length >=
                                    products.length
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-[#155dfc] transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#131d31] dark:hover:bg-[#334155]"
                            >
                                <Plus size={16} />
                                Tambah Item
                            </button>
                        </div>

                        {products.length === 0 && (
                            <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400">
                                Belum ada produk aktif yang dapat
                                dipilih.
                            </div>
                        )}

                        <div className="space-y-3">
                            {data.items.map((item, index) => {
                                const selectedProduct =
                                    getProduct(item.product_id);

                                const subtotal =
                                    (Number(item.quantity) || 0) *
                                    (Number(
                                        item.purchase_price,
                                    ) || 0);

                                return (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 p-4 dark:border-[#334155] lg:grid-cols-[1.6fr_0.7fr_0.9fr_0.9fr_auto]"
                                    >
                                        <div>
                                            <label
                                                className={
                                                    labelClass
                                                }
                                            >
                                                Produk{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>

                                            <select
                                                value={
                                                    item.product_id
                                                }
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        'product_id',
                                                        e.target
                                                            .value,
                                                    )
                                                }
                                                className={
                                                    inputClass
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Pilih produk
                                                </option>

                                                {products.map(
                                                    (product) => (
                                                        <option
                                                            key={
                                                                product.id
                                                            }
                                                            value={
                                                                product.id
                                                            }
                                                            disabled={isProductSelected(
                                                                product.id,
                                                                index,
                                                            )}
                                                        >
                                                            {
                                                                product.name
                                                            }
                                                            {product.category
                                                                ? ` - ${product.category}`
                                                                : ''}
                                                        </option>
                                                    ),
                                                )}
                                            </select>

                                            {selectedProduct && (
                                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                                    Stok saat ini:{' '}
                                                    {
                                                        selectedProduct.stock
                                                    }{' '}
                                                    {
                                                        selectedProduct.unit
                                                    }
                                                </p>
                                            )}

                                            {getItemError(
                                                index,
                                                'product_id',
                                            ) && (
                                                <p
                                                    className={
                                                        errorClass
                                                    }
                                                >
                                                    {getItemError(
                                                        index,
                                                        'product_id',
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                className={
                                                    labelClass
                                                }
                                            >
                                                Jumlah{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>

                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={
                                                    item.quantity
                                                }
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        'quantity',
                                                        e.target
                                                            .value,
                                                    )
                                                }
                                                className={
                                                    inputClass
                                                }
                                                required
                                            />

                                            {getItemError(
                                                index,
                                                'quantity',
                                            ) && (
                                                <p
                                                    className={
                                                        errorClass
                                                    }
                                                >
                                                    {getItemError(
                                                        index,
                                                        'quantity',
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                className={
                                                    labelClass
                                                }
                                            >
                                                Harga Beli{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>

                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={
                                                    item.purchase_price
                                                }
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        'purchase_price',
                                                        e.target
                                                            .value,
                                                    )
                                                }
                                                className={
                                                    inputClass
                                                }
                                                required
                                            />

                                            {getItemError(
                                                index,
                                                'purchase_price',
                                            ) && (
                                                <p
                                                    className={
                                                        errorClass
                                                    }
                                                >
                                                    {getItemError(
                                                        index,
                                                        'purchase_price',
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                className={
                                                    labelClass
                                                }
                                            >
                                                Subtotal
                                            </label>

                                            <input
                                                type="text"
                                                value={formatRupiah(
                                                    subtotal,
                                                )}
                                                disabled
                                                className={
                                                    disabledInputClass
                                                }
                                            />
                                        </div>

                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(
                                                        index,
                                                    )
                                                }
                                                disabled={
                                                    data.items
                                                        .length === 1
                                                }
                                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500/10 dark:text-red-400"
                                                title="Hapus item"
                                            >
                                                <Trash2
                                                    size={16}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {errors.items && (
                            <p className={errorClass}>
                                {errors.items}
                            </p>
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
                            disabled={
                                processing ||
                                products.length === 0
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155dfc] px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-[#155dfc]/20 dark:hover:bg-blue-600"
                        >
                            <Save size={16} />

                            {processing
                                ? 'Menyimpan...'
                                : 'Simpan Pembelian'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}