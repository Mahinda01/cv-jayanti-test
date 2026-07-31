import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Plus,
    Save,
    Trash2,
} from 'lucide-react';

const getLocalDate = () => {
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset() * 60000;

    return new Date(date.getTime() - timezoneOffset)
        .toISOString()
        .slice(0, 10);
};

const addDays = (dateValue, totalDays) => {
    if (!dateValue) {
        return '';
    }

    const date = new Date(`${dateValue}T00:00:00`);
    date.setDate(date.getDate() + totalDays);

    const timezoneOffset = date.getTimezoneOffset() * 60000;

    return new Date(date.getTime() - timezoneOffset)
        .toISOString()
        .slice(0, 10);
};

export default function CreateForm({
    Layout,
    products = [],
    customers = [],
    routePrefix,
    showCost = false,
}) {
    const today = getLocalDate();

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        sale_date: today,
        due_date: '',
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

    const textareaClass =
        'min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20';

    const labelClass =
        'mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400';

    const errorClass =
        'mt-1 text-xs font-medium text-red-500';

    const formatRupiah = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
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

    const isProductSelected = (
        productId,
        currentIndex,
    ) => {
        return data.items.some(
            (item, index) =>
                index !== currentIndex &&
                String(item.product_id) ===
                    String(productId),
        );
    };

    const getItemPurchaseSubtotal = (item) => {
        const product = getProduct(item.product_id);

        if (!product) {
            return 0;
        }

        return (
            Number(product.purchase_price || 0) *
            Number(item.quantity || 0)
        );
    };

    const getItemSubtotal = (item) => {
        const product = getProduct(item.product_id);

        if (!product) {
            return 0;
        }

        return (
            Number(product.price || 0) *
            Number(item.quantity || 0)
        );
    };

    const getItemProfit = (item) => {
        return (
            getItemSubtotal(item) -
            getItemPurchaseSubtotal(item)
        );
    };

    const totalPurchaseAmount = data.items.reduce(
        (total, item) => {
            return (
                total +
                getItemPurchaseSubtotal(item)
            );
        },
        0,
    );

    const totalAmount = data.items.reduce(
        (total, item) => {
            return total + getItemSubtotal(item);
        },
        0,
    );

    const totalProfit =
        totalAmount - totalPurchaseAmount;

    const paidAmount =
        data.payment_method === 'Kredit'
            ? Number(data.paid_amount || 0)
            : totalAmount;

    const remainingAmount = Math.max(
        totalAmount - paidAmount,
        0,
    );

    const changeSaleDate = (value) => {
        setData({
            ...data,
            sale_date: value,
            due_date:
                data.payment_method === 'Kredit'
                    ? addDays(value, 30)
                    : '',
        });
    };

    const changePaymentMethod = (value) => {
        setData({
            ...data,
            payment_method: value,
            paid_amount:
                value === 'Kredit'
                    ? data.paid_amount
                    : '',
            due_date:
                value === 'Kredit'
                    ? addDays(data.sale_date, 30)
                    : '',
        });
    };

    const updateItem = (index, field, value) => {
        const updatedItems = data.items.map(
            (item, itemIndex) => {
                if (itemIndex !== index) {
                    return item;
                }

                if (field === 'product_id') {
                    return {
                        ...item,
                        product_id: value,
                        quantity: 1,
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
            },
        ]);
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

        setData(
            'items',
            data.items.filter(
                (_, itemIndex) => itemIndex !== index,
            ),
        );
    };

    const submit = (e) => {
        e.preventDefault();

        post(route(`${routePrefix}.sales.store`));
    };

    return (
        <Layout>
            <Head title="Tambah Transaksi Penjualan" />

            <div className="space-y-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Tambah Transaksi Penjualan
                        </h1>

                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                            Catat transaksi penjualan dan
                            pengurangan stok produk.
                        </p>
                    </div>

                    <Link
                        href={route(
                            `${routePrefix}.sales.index`,
                        )}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-[#155dfc] transition hover:bg-blue-50 dark:border-[#155dfc]/40 dark:bg-[#1d293d] dark:text-[#60a5fa] dark:hover:bg-[#131d31]"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-4"
                >
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="mb-4">
                            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                Informasi Transaksi
                            </h2>

                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                Tentukan pelanggan dan metode
                                pembayaran transaksi.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label
                                    className={labelClass}
                                >
                                    Tanggal Transaksi{' '}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    type="date"
                                    value={data.sale_date}
                                    max={today}
                                    onChange={(e) =>
                                        changeSaleDate(
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    required
                                />

                                {errors.sale_date && (
                                    <p
                                        className={
                                            errorClass
                                        }
                                    >
                                        {errors.sale_date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    className={labelClass}
                                >
                                    Pelanggan{' '}
                                    {data.payment_method ===
                                        'Kredit' && (
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    )}
                                </label>

                                <select
                                    value={data.customer_id}
                                    onChange={(e) =>
                                        setData(
                                            'customer_id',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    required={
                                        data.payment_method ===
                                        'Kredit'
                                    }
                                >
                                    <option value="">
                                        {data.payment_method ===
                                        'Kredit'
                                            ? 'Pilih pelanggan'
                                            : 'Umum'}
                                    </option>

                                    {customers.map(
                                        (customer) => (
                                            <option
                                                key={
                                                    customer.id
                                                }
                                                value={
                                                    customer.id
                                                }
                                            >
                                                {
                                                    customer.code
                                                }{' '}
                                                -{' '}
                                                {
                                                    customer.name
                                                }
                                            </option>
                                        ),
                                    )}
                                </select>

                                {errors.customer_id && (
                                    <p
                                        className={
                                            errorClass
                                        }
                                    >
                                        {
                                            errors.customer_id
                                        }
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    className={labelClass}
                                >
                                    Metode Pembayaran{' '}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </label>

                                <select
                                    value={
                                        data.payment_method
                                    }
                                    onChange={(e) =>
                                        changePaymentMethod(
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                    required
                                >
                                    <option value="Tunai">
                                        Tunai
                                    </option>

                                    <option value="Transfer">
                                        Transfer
                                    </option>

                                    <option value="Kredit">
                                        Kredit
                                    </option>
                                </select>

                                {errors.payment_method && (
                                    <p
                                        className={
                                            errorClass
                                        }
                                    >
                                        {
                                            errors.payment_method
                                        }
                                    </p>
                                )}
                            </div>

                            {data.payment_method ===
                                'Kredit' && (
                                <>
                                    <div>
                                        <label
                                            className={
                                                labelClass
                                            }
                                        >
                                            Pembayaran Awal
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            max={
                                                totalAmount >
                                                0
                                                    ? Math.max(
                                                          totalAmount -
                                                              1,
                                                          0,
                                                      )
                                                    : undefined
                                            }
                                            step="1"
                                            value={
                                                data.paid_amount
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'paid_amount',
                                                    e.target
                                                        .value,
                                                )
                                            }
                                            placeholder="0"
                                            className={
                                                inputClass
                                            }
                                        />

                                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                            Kosongkan atau isi
                                            0 jika belum ada
                                            pembayaran.
                                        </p>

                                        {errors.paid_amount && (
                                            <p
                                                className={
                                                    errorClass
                                                }
                                            >
                                                {
                                                    errors.paid_amount
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            className={
                                                labelClass
                                            }
                                        >
                                            Tanggal Jatuh
                                            Tempo{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="date"
                                            value={
                                                data.due_date
                                            }
                                            min={
                                                data.sale_date
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'due_date',
                                                    e.target
                                                        .value,
                                                )
                                            }
                                            className={
                                                inputClass
                                            }
                                            required
                                        />

                                        {errors.due_date && (
                                            <p
                                                className={
                                                    errorClass
                                                }
                                            >
                                                {
                                                    errors.due_date
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 dark:border-orange-500/30 dark:bg-orange-500/10">
                                        <p className="text-xs font-bold text-orange-700 dark:text-orange-400">
                                            Transaksi kredit
                                        </p>

                                        <p className="mt-1 text-xs font-medium text-orange-600 dark:text-orange-300">
                                            Pelanggan dan
                                            tanggal jatuh tempo
                                            wajib diisi.
                                        </p>
                                    </div>
                                </>
                            )}

                            <div className="md:col-span-3">
                                <label
                                    className={labelClass}
                                >
                                    Catatan
                                </label>

                                <textarea
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData(
                                            'notes',
                                            e.target.value,
                                        )
                                    }
                                    maxLength={1000}
                                    placeholder="Catatan transaksi, boleh dikosongkan"
                                    className={
                                        textareaClass
                                    }
                                />

                                {errors.notes && (
                                    <p
                                        className={
                                            errorClass
                                        }
                                    >
                                        {errors.notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                    Daftar Produk
                                </h2>

                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                    Harga dan stok mengikuti
                                    kondisi produk saat transaksi
                                    dibuat.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addItem}
                                disabled={
                                    products.length === 0 ||
                                    data.items.length >=
                                        products.length
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155dfc] px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-blue-600"
                            >
                                <Plus size={15} />
                                Tambah Produk
                            </button>
                        </div>

                        {products.length === 0 && (
                            <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-semibold text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400">
                                Tidak ada produk aktif yang
                                memiliki stok.
                            </div>
                        )}

                        {errors.items && (
                            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                                {errors.items}
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table
                                className={`w-full text-left ${
                                    showCost
                                        ? 'min-w-[1250px]'
                                        : 'min-w-[950px]'
                                }`}
                            >
                                <thead className="bg-slate-50 dark:bg-[#131d31]">
                                    <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wide text-slate-600 dark:border-[#334155] dark:text-gray-400">
                                        <th className="px-4 py-3">
                                            Produk
                                        </th>

                                        <th className="px-4 py-3 text-center">
                                            Stok
                                        </th>

                                        {showCost && (
                                            <th className="px-4 py-3 text-right">
                                                Harga Modal
                                            </th>
                                        )}

                                        <th className="px-4 py-3 text-right">
                                            Harga Jual
                                        </th>

                                        <th className="px-4 py-3 text-center">
                                            Jumlah
                                        </th>

                                        <th className="px-4 py-3 text-right">
                                            Subtotal
                                        </th>

                                        {showCost && (
                                            <th className="px-4 py-3 text-right">
                                                Laba
                                            </th>
                                        )}

                                        <th className="px-4 py-3 text-center">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.items.map(
                                        (item, index) => {
                                            const product =
                                                getProduct(
                                                    item.product_id,
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        index
                                                    }
                                                    className="border-b border-slate-100 last:border-b-0 dark:border-[#334155]"
                                                >
                                                    <td className="px-4 py-3">
                                                        <select
                                                            value={
                                                                item.product_id
                                                            }
                                                            onChange={(
                                                                e,
                                                            ) =>
                                                                updateItem(
                                                                    index,
                                                                    'product_id',
                                                                    e
                                                                        .target
                                                                        .value,
                                                                )
                                                            }
                                                            className={
                                                                inputClass
                                                            }
                                                            required
                                                        >
                                                            <option value="">
                                                                Pilih
                                                                produk
                                                            </option>

                                                            {products.map(
                                                                (
                                                                    productItem,
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            productItem.id
                                                                        }
                                                                        value={
                                                                            productItem.id
                                                                        }
                                                                        disabled={isProductSelected(
                                                                            productItem.id,
                                                                            index,
                                                                        )}
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
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-gray-300">
                                                        {product
                                                            ? `${product.stock} ${product.unit || ''}`
                                                            : '-'}
                                                    </td>

                                                    {showCost && (
                                                        <td className="whitespace-nowrap px-4 py-3 text-right text-xs font-extrabold text-slate-700 dark:text-gray-300">
                                                            {product
                                                                ? product.purchase_price_text ||
                                                                  formatRupiah(
                                                                      product.purchase_price,
                                                                  )
                                                                : 'Rp 0'}
                                                        </td>
                                                    )}

                                                    <td className="whitespace-nowrap px-4 py-3 text-right text-xs font-extrabold text-slate-900 dark:text-white">
                                                        {product
                                                            ? product.price_text ||
                                                              formatRupiah(
                                                                  product.price,
                                                              )
                                                            : 'Rp 0'}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                max={
                                                                    product
                                                                        ? product.stock
                                                                        : undefined
                                                                }
                                                                step="1"
                                                                value={
                                                                    item.quantity
                                                                }
                                                                onChange={(
                                                                    e,
                                                                ) =>
                                                                    updateItem(
                                                                        index,
                                                                        'quantity',
                                                                        e
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                className={`${inputClass} max-w-24 text-center`}
                                                                required
                                                            />

                                                            <span className="min-w-10 text-xs font-bold text-slate-500 dark:text-gray-400">
                                                                {product
                                                                    ? product.unit
                                                                    : ''}
                                                            </span>
                                                        </div>

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
                                                    </td>

                                                    <td className="whitespace-nowrap px-4 py-3 text-right text-xs font-extrabold text-[#155dfc]">
                                                        {formatRupiah(
                                                            getItemSubtotal(
                                                                item,
                                                            ),
                                                        )}
                                                    </td>

                                                    {showCost && (
                                                        <td
                                                            className={`whitespace-nowrap px-4 py-3 text-right text-xs font-extrabold ${
                                                                getItemProfit(
                                                                    item,
                                                                ) >=
                                                                0
                                                                    ? 'text-green-600 dark:text-green-400'
                                                                    : 'text-red-600 dark:text-red-400'
                                                            }`}
                                                        >
                                                            {formatRupiah(
                                                                getItemProfit(
                                                                    item,
                                                                ),
                                                            )}
                                                        </td>
                                                    )}

                                                    <td className="px-4 py-3 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeItem(
                                                                    index,
                                                                )
                                                            }
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                                                            title={
                                                                data
                                                                    .items
                                                                    .length ===
                                                                1
                                                                    ? 'Kosongkan produk'
                                                                    : 'Hapus produk'
                                                            }
                                                        >
                                                            <Trash2
                                                                size={
                                                                    16
                                                                }
                                                            />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div
                        className={`grid grid-cols-1 gap-4 ${
                            showCost
                                ? 'md:grid-cols-5'
                                : 'md:grid-cols-3'
                        }`}
                    >
                        {showCost && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                                    Total Harga Modal
                                </p>

                                <p className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
                                    {formatRupiah(
                                        totalPurchaseAmount,
                                    )}
                                </p>
                            </div>
                        )}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                                Total Penjualan
                            </p>

                            <p className="mt-2 text-xl font-extrabold text-[#155dfc]">
                                {formatRupiah(
                                    totalAmount,
                                )}
                            </p>
                        </div>

                        {showCost && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                                    Estimasi Laba
                                </p>

                                <p
                                    className={`mt-2 text-xl font-extrabold ${
                                        totalProfit >= 0
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                    }`}
                                >
                                    {formatRupiah(
                                        totalProfit,
                                    )}
                                </p>
                            </div>
                        )}

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
                                Dibayar
                            </p>

                            <p className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
                                {formatRupiah(
                                    paidAmount,
                                )}
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
                                {formatRupiah(
                                    remainingAmount,
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Link
                            href={route(
                                `${routePrefix}.sales.index`,
                            )}
                            className="inline-flex items-center justify-center rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-300 dark:bg-[#334155] dark:text-gray-300 dark:hover:bg-[#1d293d]"
                        >
                            Batal
                        </Link>

                        <button
                            type="submit"
                            disabled={
                                processing ||
                                products.length === 0 ||
                                totalAmount <= 0
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155dfc] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-[#155dfc]/20 dark:hover:bg-blue-600"
                        >
                            <Save size={16} />

                            {processing
                                ? 'Menyimpan...'
                                : 'Simpan Transaksi'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}