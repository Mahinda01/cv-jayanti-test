import AdminLayout from '@/Layouts/AdminLayout';
import { confirmStatus } from '@/lib/sweetAlert';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Edit,
    LockKeyhole,
    Plus,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';

export default function Index({
    users = [],
    permissions = {},
}) {
    const { props } = usePage();

    const successMessage = props.flash?.success;
    const errorMessage = props.flash?.error;

    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('Semua');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [currentPage, setCurrentPage] = useState(1);

    const usersPerPage = 10;

    const isMainAdmin = Boolean(
        permissions.is_main_admin,
    );

    const selectClass =
        'h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:focus:ring-[#155dfc]/20';

    const filteredUsers = users.filter((account) => {
        const keyword = search
            .trim()
            .toLowerCase();

        const accountCode = String(
            account.code || '',
        ).toLowerCase();

        const accountName = String(
            account.name || '',
        ).toLowerCase();

        const accountUsername = String(
            account.username || '',
        ).toLowerCase();

        const matchSearch =
            accountCode.includes(keyword) ||
            accountName.includes(keyword) ||
            accountUsername.includes(keyword);

        const matchRole =
            roleFilter === 'Semua' ||
            account.role === roleFilter;

        const matchStatus =
            statusFilter === 'Semua' ||
            (statusFilter === 'Aktif' &&
                account.is_active) ||
            (statusFilter === 'Tidak Aktif' &&
                !account.is_active);

        return (
            matchSearch &&
            matchRole &&
            matchStatus
        );
    });

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredUsers.length / usersPerPage,
        ),
    );

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages,
    );

    const startIndex =
        (safeCurrentPage - 1) * usersPerPage;

    const currentUsers = filteredUsers.slice(
        startIndex,
        startIndex + usersPerPage,
    );

    const resetPage = (callback) => {
        setCurrentPage(1);
        callback();
    };

    const changeStatus = async (account) => {
        if (!account.can_toggle_status) {
            return;
        }

        const title = account.is_active
            ? 'Nonaktifkan akun ini?'
            : 'Aktifkan akun ini?';

        const text = account.is_active
            ? 'Akun tidak dapat login setelah dinonaktifkan.'
            : 'Akun akan dapat login kembali.';

        const confirmButtonText = account.is_active
            ? 'Ya, Nonaktifkan'
            : 'Ya, Aktifkan';

        const confirmed = await confirmStatus({
            title,
            text,
            confirmButtonText,
        });

        if (!confirmed) {
            return;
        }

        router.patch(
            route(
                'admin.users.toggle-status',
                account.id,
            ),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const getRoleClass = (role) => {
        if (role === 'admin') {
            return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
        }

        return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400';
    };

    return (
        <AdminLayout
            showSearch={true}
            searchValue={search}
            onSearchChange={(value) => {
                setSearch(value);
                setCurrentPage(1);
            }}
            searchPlaceholder="Cari kode, nama, atau username akun..."
        >
            <Head title="Manajemen Akun" />

            <div className="space-y-3">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Manajemen Akun
                        </h1>

                        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-gray-400">
                            Kelola akun Admin dan Staff yang dapat
                            menggunakan sistem.
                        </p>
                    </div>

                    <Link
                        href={route(
                            'admin.users.create',
                        )}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155dfc] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 dark:bg-[#155dfc] dark:shadow-[#155dfc]/20 dark:hover:bg-blue-600"
                    >
                        <Plus size={17} />

                        {isMainAdmin
                            ? 'Tambah Akun'
                            : 'Tambah Staff'}
                    </Link>
                </div>

                {successMessage && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                        {errorMessage}
                    </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <select
                            value={roleFilter}
                            onChange={(e) =>
                                resetPage(() =>
                                    setRoleFilter(
                                        e.target.value,
                                    ),
                                )
                            }
                            className={selectClass}
                        >
                            <option value="Semua">
                                Semua Role
                            </option>

                            <option value="admin">
                                Admin
                            </option>

                            <option value="staff">
                                Staff
                            </option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                resetPage(() =>
                                    setStatusFilter(
                                        e.target.value,
                                    ),
                                )
                            }
                            className={selectClass}
                        >
                            <option value="Semua">
                                Semua Status Akun
                            </option>

                            <option value="Aktif">
                                Aktif
                            </option>

                            <option value="Tidak Aktif">
                                Tidak Aktif
                            </option>
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#334155] dark:bg-[#1d293d]">
                    <div className="overflow-x-auto lg:overflow-x-visible">
                        <table className="w-full min-w-[900px] table-fixed text-left lg:min-w-0">
                            <colgroup>
                                <col className="w-[8%]" />
                                <col className="w-[29%]" />
                                <col className="w-[13%]" />
                                <col className="w-[10%]" />
                                <col className="w-[15%]" />
                                <col className="w-[17%]" />
                                <col className="w-[8%]" />
                            </colgroup>

                            <thead className="bg-slate-50 dark:bg-[#131d31]">
                                <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wide text-slate-600 dark:border-[#334155] dark:text-gray-400">
                                    <th className="px-4 py-3 text-center">
                                        Kode
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Nama
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Username
                                    </th>

                                    <th className="px-4 py-3 text-center">
                                        Role
                                    </th>

                                    <th className="px-4 py-3 text-center">
                                        Tanggal Dibuat
                                    </th>

                                    <th className="px-4 py-3 text-center">
                                        Status Akun
                                    </th>

                                    <th className="px-4 py-3 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentUsers.length > 0 ? (
                                    currentUsers.map((account) => {
                                        const mainAccount =
                                            Boolean(
                                                account.is_main_account,
                                            );

                                        const statusLocked =
                                            !account.can_toggle_status;

                                        const statusTitle =
                                            mainAccount
                                                ? 'Akun Admin Utama selalu aktif'
                                                : account.is_current_user
                                                  ? 'Status akun yang sedang digunakan tidak dapat diubah'
                                                  : statusLocked
                                                    ? 'Anda tidak memiliki izin untuk mengubah status akun ini'
                                                    : account.is_active
                                                      ? 'Nonaktifkan akun'
                                                      : 'Aktifkan akun';

                                        const rowClass =
                                            account.is_active
                                                ? 'border-l-4 border-l-transparent bg-white hover:bg-slate-50 dark:bg-[#1d293d] dark:hover:bg-[#131d31]'
                                                : 'border-l-4 border-l-slate-400 bg-slate-100 hover:bg-slate-200 dark:border-l-slate-300/50 dark:bg-[#182235] dark:hover:bg-[#1d293d]';

                                        const mainTextClass =
                                            account.is_active
                                                ? 'text-slate-900 dark:text-white'
                                                : 'text-slate-600 dark:text-gray-300';

                                        const secondaryTextClass =
                                            account.is_active
                                                ? 'text-slate-600 dark:text-gray-300'
                                                : 'text-slate-500 dark:text-gray-400';

                                        return (
                                            <tr
                                                key={account.id}
                                                className={`border-b border-slate-100 transition last:border-b-0 dark:border-[#334155] ${rowClass}`}
                                            >
                                                <td
                                                    className={`px-4 py-3 text-center text-xs font-extrabold ${mainTextClass}`}
                                                >
                                                    {account.code}
                                                </td>

                                                <td className="px-4 py-3 text-left">
                                                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                                                        <span
                                                            className={`break-words text-xs font-extrabold ${mainTextClass}`}
                                                        >
                                                            {account.name}
                                                        </span>

                                                        {mainAccount && (
                                                            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold text-[#155dfc] dark:bg-[#155dfc]/10 dark:text-[#60a5fa]">
                                                                <ShieldCheck
                                                                    size={12}
                                                                    strokeWidth={
                                                                        2.6
                                                                    }
                                                                />

                                                                Admin Utama
                                                            </span>
                                                        )}

                                                        {account.is_current_user &&
                                                            !mainAccount && (
                                                                <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-extrabold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                                                                    Anda
                                                                </span>
                                                            )}
                                                    </div>
                                                </td>

                                                <td
                                                    className={`break-all px-4 py-3 text-left text-xs font-semibold ${secondaryTextClass}`}
                                                >
                                                    {account.username}
                                                </td>

                                                <td className="px-4 py-3 text-center">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${getRoleClass(
                                                            account.role,
                                                        )}`}
                                                    >
                                                        {account.role_label}
                                                    </span>
                                                </td>

                                                <td
                                                    className={`whitespace-nowrap px-4 py-3 text-center text-xs font-semibold ${secondaryTextClass}`}
                                                >
                                                    {account.created_at}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                statusLocked
                                                            }
                                                            onClick={() =>
                                                                changeStatus(
                                                                    account,
                                                                )
                                                            }
                                                            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
                                                                account.is_active
                                                                    ? 'bg-[#155dfc]'
                                                                    : 'bg-slate-400 dark:bg-[#334155]'
                                                            } ${
                                                                statusLocked
                                                                    ? 'cursor-not-allowed opacity-70'
                                                                    : 'cursor-pointer'
                                                            }`}
                                                            title={
                                                                statusTitle
                                                            }
                                                            aria-label={
                                                                statusTitle
                                                            }
                                                        >
                                                            <span
                                                                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                                                    account.is_active
                                                                        ? 'translate-x-4'
                                                                        : 'translate-x-1'
                                                                }`}
                                                            />
                                                        </button>

                                                        <span
                                                            className={`text-xs font-extrabold ${
                                                                account.is_active
                                                                    ? 'text-[#155dfc] dark:text-[#60a5fa]'
                                                                    : 'text-slate-500 dark:text-gray-400'
                                                            }`}
                                                        >
                                                            {account.is_active
                                                                ? 'Aktif'
                                                                : 'Tidak Aktif'}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center">
                                                        {account.can_edit ? (
                                                            <Link
                                                                href={route(
                                                                    'admin.users.edit',
                                                                    account.id,
                                                                )}
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#155dfc] transition hover:bg-blue-50 dark:text-[#3B82F6] dark:hover:bg-[#131d31]"
                                                                title={
                                                                    account.is_current_user
                                                                        ? 'Edit Profil'
                                                                        : mainAccount
                                                                          ? 'Edit Admin Utama'
                                                                          : 'Edit Akun'
                                                                }
                                                            >
                                                                <Edit
                                                                    size={17}
                                                                />
                                                            </Link>
                                                        ) : (
                                                            <div
                                                                className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-[#131d31] dark:text-gray-500"
                                                                title="Hanya Admin Utama yang dapat mengubah akun ini"
                                                            >
                                                                <LockKeyhole
                                                                    size={15}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-4 py-10 text-center"
                                        >
                                            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                                                Akun tidak ditemukan
                                            </h2>

                                            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-gray-400">
                                                Coba ubah pencarian atau
                                                filter akun.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 dark:border-[#334155] md:flex-row md:items-center md:justify-between">
                        <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
                            Menampilkan{' '}
                            <span className="font-extrabold text-slate-700 dark:text-white">
                                {filteredUsers.length}
                            </span>{' '}
                            akun
                        </p>

                        {filteredUsers.length > 0 &&
                            totalPages > 1 && (
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.max(
                                                    safeCurrentPage - 1,
                                                    1,
                                                ),
                                            )
                                        }
                                        disabled={
                                            safeCurrentPage === 1
                                        }
                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#334155] dark:text-gray-300 dark:hover:bg-[#131d31]"
                                    >
                                        Sebelumnya
                                    </button>

                                    {Array.from(
                                        {
                                            length: totalPages,
                                        },
                                        (_, index) => index + 1,
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() =>
                                                setCurrentPage(
                                                    page,
                                                )
                                            }
                                            className={`h-8 w-8 rounded-lg text-xs font-extrabold transition ${
                                                safeCurrentPage ===
                                                page
                                                    ? 'bg-[#155dfc] text-white'
                                                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-[#334155] dark:text-gray-300 dark:hover:bg-[#131d31]'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.min(
                                                    safeCurrentPage + 1,
                                                    totalPages,
                                                ),
                                            )
                                        }
                                        disabled={
                                            safeCurrentPage ===
                                            totalPages
                                        }
                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#334155] dark:text-gray-300 dark:hover:bg-[#131d31]"
                                    >
                                        Selanjutnya
                                    </button>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}