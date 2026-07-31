import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    ShieldCheck,
} from 'lucide-react';

export default function Create({
    canCreateAdmin = false,
}) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        name: '',
        username: '',
        role: 'staff',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.users.store'));
    };

    const inputClass =
        'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-[#155dfc]/20';

    const disabledInputClass =
        'h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-medium text-slate-500 outline-none dark:border-[#334155] dark:bg-[#131d31] dark:text-gray-500';

    const labelClass =
        'mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-slate-600 dark:text-gray-400';

    const errorClass =
        'mt-1 text-xs font-medium text-red-500';

    const RequiredMark = () => (
        <span className="text-red-500">
            {' '}*
        </span>
    );

    return (
        <AdminLayout>
            <Head title="Tambah Akun" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            {canCreateAdmin
                                ? 'Tambah Akun'
                                : 'Tambah Staff'}
                        </h1>

                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                            Kolom dengan tanda{' '}
                            <span className="font-extrabold text-red-500">
                                *
                            </span>{' '}
                            wajib diisi.
                        </p>
                    </div>

                    <Link
                        href={route('admin.users.index')}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-[#155dfc] transition hover:bg-blue-50 dark:border-[#155dfc]/40 dark:bg-[#1d293d] dark:text-[#60a5fa] dark:hover:bg-[#131d31]"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </Link>
                </div>

                {!canCreateAdmin && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-[#155dfc]/30 dark:bg-[#155dfc]/10">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#155dfc] dark:bg-[#131d31] dark:text-[#60a5fa]">
                                <ShieldCheck
                                    size={18}
                                    strokeWidth={2.6}
                                />
                            </div>

                            <div>
                                <p className="text-sm font-extrabold text-[#155dfc] dark:text-[#60a5fa]">
                                    Pembuatan Akun Staff
                                </p>

                                <p className="mt-0.5 text-xs font-medium text-slate-600 dark:text-gray-300">
                                    Admin biasa hanya dapat
                                    membuat akun Staff. Akun baru
                                    otomatis berstatus aktif.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {canCreateAdmin && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400">
                        Akun baru otomatis berstatus aktif dan
                        statusnya dapat dikelola dari halaman
                        Manajemen Akun.
                    </div>
                )}

                <form
                    onSubmit={submit}
                    className="space-y-4"
                >
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    Kode Akun
                                </label>

                                <input
                                    type="text"
                                    value="Otomatis dibuat oleh sistem"
                                    disabled
                                    className={disabledInputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Role
                                    <RequiredMark />
                                </label>

                                {canCreateAdmin ? (
                                    <select
                                        value={data.role}
                                        onChange={(e) =>
                                            setData(
                                                'role',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                        required
                                    >
                                        <option value="staff">
                                            Staff
                                        </option>

                                        <option value="admin">
                                            Admin
                                        </option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value="Staff"
                                        disabled
                                        className={disabledInputClass}
                                    />
                                )}

                                {errors.role && (
                                    <p className={errorClass}>
                                        {errors.role}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Nama
                                    <RequiredMark />
                                </label>

                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Masukkan nama akun"
                                    className={inputClass}
                                    maxLength={150}
                                    required
                                />

                                {errors.name && (
                                    <p className={errorClass}>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Username
                                    <RequiredMark />
                                </label>

                                <input
                                    type="text"
                                    value={data.username}
                                    onChange={(e) =>
                                        setData(
                                            'username',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Masukkan username"
                                    className={inputClass}
                                    maxLength={100}
                                    autoComplete="username"
                                    required
                                />

                                {errors.username && (
                                    <p className={errorClass}>
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Password
                                    <RequiredMark />
                                </label>

                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Minimal 6 karakter"
                                    className={inputClass}
                                    minLength={6}
                                    autoComplete="new-password"
                                    required
                                />

                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                    Password minimal 6 karakter.
                                </p>

                                {errors.password && (
                                    <p className={errorClass}>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Konfirmasi Password
                                    <RequiredMark />
                                </label>

                                <input
                                    type="password"
                                    value={
                                        data.password_confirmation
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ulangi password"
                                    className={inputClass}
                                    minLength={6}
                                    autoComplete="new-password"
                                    required
                                />

                                {errors.password_confirmation && (
                                    <p className={errorClass}>
                                        {
                                            errors.password_confirmation
                                        }
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href={route(
                                'admin.users.index',
                            )}
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

                            {processing
                                ? 'Menyimpan...'
                                : 'Simpan Akun'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}