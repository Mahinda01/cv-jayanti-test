import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react';

export default function Edit({ userData }) {
    const isMainAccount = userData.is_main_account || userData.id === 1;

    const { data, setData, put, processing, errors } = useForm({
        name: userData.name || '',
        username: userData.username || '',
        role: userData.role || 'staff',
        password: '',
        password_confirmation: '',
        is_active: Boolean(userData.is_active),
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('admin.users.update', userData.id));
    };

    const inputClass =
        'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20';

    const disabledInputClass =
        'h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-medium text-slate-500 outline-none dark:border-[#334155] dark:bg-[#131d31] dark:text-gray-500';

    const labelClass =
        'mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400';

    const errorClass = 'mt-1 text-xs font-medium text-red-500';

    return (
        <AdminLayout>
            <Head title="Edit Akun" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Edit Akun
                    </h1>

                    <Link
                        href={route('admin.users.index')}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-[#155dfc] transition hover:bg-blue-50 dark:border-[#155dfc]/40 dark:bg-[#1d293d] dark:text-[#60a5fa] dark:hover:bg-[#131d31]"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </Link>
                </div>

                {isMainAccount && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-[#155dfc]/30 dark:bg-[#155dfc]/10">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#155dfc] dark:bg-[#131d31] dark:text-[#60a5fa]">
                                <ShieldCheck size={18} strokeWidth={2.6} />
                            </div>

                            <div>
                                <p className="text-sm font-extrabold text-[#155dfc] dark:text-[#60a5fa]">
                                    Akun Utama
                                </p>

                                <p className="mt-0.5 text-xs font-medium text-slate-600 dark:text-gray-300">
                                    Role dan status akun utama tidak dapat
                                    diubah.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>Kode Akun</label>

                                <input
                                    type="text"
                                    value={userData.code}
                                    disabled
                                    className={disabledInputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Role</label>

                                {isMainAccount ? (
                                    <input
                                        type="text"
                                        value="Admin"
                                        disabled
                                        className={disabledInputClass}
                                    />
                                ) : (
                                    <select
                                        value={data.role}
                                        onChange={(e) =>
                                            setData('role', e.target.value)
                                        }
                                        className={inputClass}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="staff">Staff</option>
                                    </select>
                                )}

                                {errors.role && (
                                    <p className={errorClass}>{errors.role}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Nama</label>

                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Masukkan nama akun"
                                    className={inputClass}
                                />

                                {errors.name && (
                                    <p className={errorClass}>{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Username</label>

                                <input
                                    type="text"
                                    value={data.username}
                                    onChange={(e) =>
                                        setData('username', e.target.value)
                                    }
                                    placeholder="Masukkan username"
                                    className={inputClass}
                                />

                                {errors.username && (
                                    <p className={errorClass}>
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Password Baru
                                </label>

                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder="Kosongkan jika tidak diganti"
                                    className={inputClass}
                                />

                                {errors.password && (
                                    <p className={errorClass}>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Konfirmasi Password
                                </label>

                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ulangi password baru"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>

                    {!isMainAccount && (
                        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                            <div>
                                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                                    Status Akun
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
                    )}

                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href={route('admin.users.index')}
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
        </AdminLayout>
    );
}