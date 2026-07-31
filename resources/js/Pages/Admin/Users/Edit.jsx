import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    ShieldCheck,
    UserRound,
} from 'lucide-react';

export default function Edit({
    userData,
    permissions = {},
}) {
    const isMainAccount = Boolean(
        userData.is_main_account,
    );

    const isSelf = Boolean(
        permissions.is_self,
    );

    const canManageRole = Boolean(
        permissions.can_manage_role,
    );

    const {
        data,
        setData,
        put,
        processing,
        errors,
    } = useForm({
        name: userData.name || '',
        username: userData.username || '',
        role: userData.role || 'staff',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        put(
            route(
                'admin.users.update',
                userData.id,
            ),
        );
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
            <Head
                title={
                    isSelf
                        ? 'Edit Profil'
                        : 'Edit Akun'
                }
            />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            {isSelf
                                ? 'Edit Profil Akun'
                                : 'Edit Akun'}
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

                {isMainAccount && (
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
                                    Akun Admin Utama
                                </p>

                                <p className="mt-0.5 text-xs font-medium text-slate-600 dark:text-gray-300">
                                    Role akun Admin Utama tidak
                                    dapat diubah.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {isSelf && !isMainAccount && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-500/30 dark:bg-green-500/10">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-green-600 dark:bg-[#131d31] dark:text-green-400">
                                <UserRound size={18} />
                            </div>

                            <div>
                                <p className="text-sm font-extrabold text-green-700 dark:text-green-400">
                                    Profil Anda
                                </p>

                                <p className="mt-0.5 text-xs font-medium text-slate-600 dark:text-gray-300">
                                    Anda dapat mengubah nama,
                                    username, dan password.
                                    Role tidak dapat diubah
                                    sendiri.
                                </p>
                            </div>
                        </div>
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
                                    value={userData.code}
                                    disabled
                                    className={disabledInputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Role
                                    {canManageRole && (
                                        <RequiredMark />
                                    )}
                                </label>

                                {canManageRole ? (
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
                                        <option value="admin">
                                            Admin
                                        </option>

                                        <option value="staff">
                                            Staff
                                        </option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={
                                            userData.role_label
                                        }
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
                                    Password Baru
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
                                    placeholder="Kosongkan jika tidak diganti"
                                    className={inputClass}
                                    minLength={6}
                                    autoComplete="new-password"
                                />

                                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                    Opsional. Minimal 6 karakter
                                    jika password ingin diganti.
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
                                    {data.password !== '' && (
                                        <RequiredMark />
                                    )}
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
                                    placeholder="Ulangi password baru"
                                    className={inputClass}
                                    minLength={6}
                                    autoComplete="new-password"
                                    required={
                                        data.password !== ''
                                    }
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
                                : isSelf
                                  ? 'Simpan Profil'
                                  : 'Simpan Edit'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}