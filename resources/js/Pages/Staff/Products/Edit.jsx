import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';

export default function Edit({ product, categories = [] }) {
    const [previewImage, setPreviewImage] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        product_category_id: product.product_category_id || '',
        name: product.name || '',
        description: product.description || '',
        supplier: product.supplier || '',
        minimum_stock: product.minimum_stock || 0,
        unit: product.unit || 'Pcs',
        location: product.location || '',
        purchase_price: product.purchase_price || 0,
        price: product.price || 0,
        image: null,
        is_active: Boolean(product.is_active),
    });

    const getProductImage = () => {
        if (previewImage) {
            return previewImage;
        }

        if (product.image_url) {
            return product.image_url;
        }

        if (!product.image) {
            return null;
        }

        if (
            product.image.startsWith('http://') ||
            product.image.startsWith('https://') ||
            product.image.startsWith('/')
        ) {
            return product.image;
        }

        return `/storage/${product.image.replace(/^\/+/, '')}`;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        setData('image', file || null);

        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage(null);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('staff.products.update', product.id), {
            forceFormData: true,
        });
    };

    const inputClass =
        'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20';

    const labelClass =
        'mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400';

    const errorClass = 'mt-1 text-xs font-medium text-red-500';

    const productImage = getProductImage();

    return (
        <StaffLayout>
            <Head title="Edit Produk" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Edit Produk
                    </h1>

                    <Link
                        href={route('staff.products.index')}
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
                                <label className={labelClass}>Kode Produk</label>
                                <input
                                    type="text"
                                    value={product.code}
                                    disabled
                                    className="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-medium text-slate-500 dark:border-[#334155] dark:bg-[#131d31] dark:text-gray-500"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Kategori</label>
                                <select
                                    value={data.product_category_id}
                                    onChange={(e) =>
                                        setData(
                                            'product_category_id',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                >
                                    <option value="">Pilih kategori</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                {errors.product_category_id && (
                                    <p className={errorClass}>
                                        {errors.product_category_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Nama Produk</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Masukkan nama produk"
                                    className={inputClass}
                                />

                                {errors.name && (
                                    <p className={errorClass}>{errors.name}</p>
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
                                    placeholder="Masukkan nama supplier"
                                    className={inputClass}
                                />

                                {errors.supplier && (
                                    <p className={errorClass}>
                                        {errors.supplier}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Stok Saat Ini</label>
                                <input
                                    type="text"
                                    value={`${product.stock || 0} ${data.unit || ''}`}
                                    disabled
                                    className="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-medium text-slate-500 dark:border-[#334155] dark:bg-[#131d31] dark:text-gray-500"
                                />
                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                    Stok tidak diubah dari Edit Produk.
                                </p>
                            </div>

                            <div>
                                <label className={labelClass}>Minimum Stok</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.minimum_stock}
                                    onChange={(e) =>
                                        setData(
                                            'minimum_stock',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                />

                                {errors.minimum_stock && (
                                    <p className={errorClass}>
                                        {errors.minimum_stock}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Satuan</label>
                                <select
                                    value={data.unit}
                                    onChange={(e) =>
                                        setData('unit', e.target.value)
                                    }
                                    className={inputClass}
                                >
                                    <option value="Pcs">Pcs</option>
                                    <option value="Meter">Meter</option>
                                    <option value="Unit">Unit</option>
                                    <option value="Set">Set</option>
                                </select>

                                {errors.unit && (
                                    <p className={errorClass}>{errors.unit}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Lokasi</label>
                                <select
                                    value={data.location}
                                    onChange={(e) =>
                                        setData('location', e.target.value)
                                    }
                                    className={inputClass}
                                >
                                    <option value="">Pilih lokasi</option>
                                    <option value="Gudang Dalam">
                                        Gudang Dalam
                                    </option>
                                    <option value="Gudang Samping">
                                        Gudang Samping
                                    </option>
                                    <option value="Jolly Box Merah">
                                        Jolly Box Merah
                                    </option>
                                    <option value="Jolly Box Biru">
                                        Jolly Box Biru
                                    </option>
                                    <option value="Jolly Box Kuning">
                                        Jolly Box Kuning
                                    </option>
                                    <option value="Jolly Box Hijau">
                                        Jolly Box Hijau
                                    </option>
                                </select>

                                {errors.location && (
                                    <p className={errorClass}>
                                        {errors.location}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Harga Beli</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.purchase_price}
                                    onChange={(e) =>
                                        setData(
                                            'purchase_price',
                                            e.target.value,
                                        )
                                    }
                                    className={inputClass}
                                />

                                {errors.purchase_price && (
                                    <p className={errorClass}>
                                        {errors.purchase_price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Harga Jual</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData('price', e.target.value)
                                    }
                                    className={inputClass}
                                />

                                {errors.price && (
                                    <p className={errorClass}>{errors.price}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Deskripsi Produk
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows="4"
                                    placeholder="Masukkan deskripsi produk untuk website publik"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20"
                                />

                                {errors.description && (
                                    <p className={errorClass}>
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Gambar Produk
                                </label>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-[220px_1fr]">
                                    <div className="flex h-40 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 dark:border-[#334155] dark:bg-white">
                                        {productImage ? (
                                            <img
                                                src={productImage}
                                                alt={data.name}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        ) : (
                                            <p className="text-center text-xs font-bold text-slate-400">
                                                Belum ada gambar
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#155dfc] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white dark:border-[#334155] dark:bg-[#131d31] dark:text-white"
                                        />

                                        <p className="mt-2 text-xs font-medium text-slate-500 dark:text-gray-400">
                                            Kosongkan jika tidak ingin mengganti gambar.
                                        </p>

                                        {errors.image && (
                                            <p className={errorClass}>
                                                {errors.image}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div>
                            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                                Status Produk
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
                            href={route('staff.products.index')}
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
        </StaffLayout>
    );
}