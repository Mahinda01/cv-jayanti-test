import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function Create({ categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        product_category_id: '',
        new_category_name: '',
        new_category_default_unit: 'Pcs',
        name: '',
        description: '',
        supplier: '',
        stock: 0,
        minimum_stock: 0,
        unit: 'Pcs',
        location: '',
        purchase_price: 0,
        price: 0,
        image: null,
        is_active: true,
    });

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        const category = categories.find(
            (item) => String(item.id) === selectedCategory,
        );

        setData({
            ...data,
            product_category_id: selectedCategory,
            new_category_name: '',
            new_category_default_unit: 'Pcs',
            unit:
                selectedCategory === '__new__'
                    ? data.new_category_default_unit
                    : category?.default_unit || 'Pcs',
        });
    };

    const handleNewCategoryUnitChange = (e) => {
        setData({
            ...data,
            new_category_default_unit: e.target.value,
            unit: e.target.value,
        });
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.products.store'), {
            forceFormData: true,
        });
    };

    const inputClass =
        'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20';

    const textareaClass =
        'min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20';

    const fileInputClass =
        'block w-full cursor-pointer rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 file:mr-4 file:border-0 file:bg-[#155dfc] file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-white hover:file:bg-blue-700 dark:border-[#334155] dark:bg-[#131d31] dark:text-white';

    const labelClass =
        'mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400';

    const errorClass = 'mt-1 text-xs font-medium text-red-500';

    return (
        <AdminLayout>
            <Head title="Tambah Produk" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Tambah Produk
                    </h1>

                    <Link
                        href={route('admin.products.index')}
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
                                Informasi Produk
                            </h2>
                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                Data ini digunakan sebagai data master produk
                                untuk transaksi dan website publik.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    Kode Produk
                                </label>
                                <input
                                    type="text"
                                    value="Otomatis dibuat oleh sistem"
                                    disabled
                                    className="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-medium text-slate-500 dark:border-[#334155] dark:bg-[#131d31] dark:text-gray-500"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Kategori</label>
                                <select
                                    value={data.product_category_id}
                                    onChange={handleCategoryChange}
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

                                    <option value="__new__">
                                        + Tambah kategori baru
                                    </option>
                                </select>

                                {errors.product_category_id && (
                                    <p className={errorClass}>
                                        {errors.product_category_id}
                                    </p>
                                )}
                            </div>

                            {data.product_category_id === '__new__' && (
                                <>
                                    <div>
                                        <label className={labelClass}>
                                            Nama Kategori Baru
                                        </label>
                                        <input
                                            type="text"
                                            value={data.new_category_name}
                                            onChange={(e) =>
                                                setData(
                                                    'new_category_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Masukkan nama kategori baru"
                                            className={inputClass}
                                        />

                                        {errors.new_category_name && (
                                            <p className={errorClass}>
                                                {errors.new_category_name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Satuan Kategori Baru
                                        </label>
                                        <select
                                            value={data.new_category_default_unit}
                                            onChange={handleNewCategoryUnitChange}
                                            className={inputClass}
                                        >
                                            <option value="Pcs">Pcs</option>
                                            <option value="Meter">Meter</option>
                                            <option value="Unit">Unit</option>
                                            <option value="Set">Set</option>
                                        </select>

                                        {errors.new_category_default_unit && (
                                            <p className={errorClass}>
                                                {errors.new_category_default_unit}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            <div>
                                <label className={labelClass}>
                                    Nama Produk
                                </label>
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
                                <label className={labelClass}>
                                    Satuan Produk
                                </label>
                                <input
                                    type="text"
                                    value={data.unit}
                                    disabled
                                    className="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-medium text-slate-500 dark:border-[#334155] dark:bg-[#131d31] dark:text-gray-500"
                                />
                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                    Satuan otomatis mengikuti kategori produk.
                                </p>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Lokasi Penyimpanan
                                </label>
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
                                <label className={labelClass}>
                                    Harga Beli Acuan
                                </label>
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
                                <label className={labelClass}>
                                    Harga Jual
                                </label>
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

                            <div>
                                <label className={labelClass}>
                                    Minimum Stok
                                </label>
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
                                <label className={labelClass}>Stok Awal</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData('stock', e.target.value)
                                    }
                                    placeholder="Masukkan stok awal"
                                    className={inputClass}
                                />

                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                    Stok awal hanya diisi saat produk pertama
                                    kali ditambahkan.
                                </p>

                                {errors.stock && (
                                    <p className={errorClass}>{errors.stock}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="mb-4">
                            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                Informasi Website Publik
                            </h2>
                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                Gambar dan deskripsi digunakan untuk tampilan
                                produk pada website publik.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Deskripsi Produk
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Masukkan deskripsi produk untuk website publik"
                                    className={textareaClass}
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
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={(e) =>
                                        setData(
                                            'image',
                                            e.target.files[0] ?? null,
                                        )
                                    }
                                    className={fileInputClass}
                                />
                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                    Format gambar: JPG, JPEG, PNG, atau WEBP.
                                    Maksimal 2 MB.
                                </p>

                                {errors.image && (
                                    <p className={errorClass}>
                                        {errors.image}
                                    </p>
                                )}
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
                            href={route('admin.products.index')}
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
                            {processing ? 'Menyimpan...' : 'Simpan Produk'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}