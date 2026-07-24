import { Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useState } from 'react';
import Logo from '@/Components/Public/Logo';

export default function LoginForm({
    title,
    subtitle,
    buttonText,
    expectedRole,
    position = 'right',
}) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
        expected_role: expectedRole,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login.store'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div
            className={`flex w-1/2 items-center justify-center bg-white px-8 transition-colors duration-300 dark:bg-[#1d293d] ${
                position === 'left' ? 'auth-slide-left' : 'auth-slide-right'
            }`}
        >
            <div className="auth-stagger w-full max-w-[380px]">
                <Logo />

                <div className="mt-7">
                    <h1 className="text-[26px] font-extrabold leading-tight text-[#101828] dark:text-white">
                        {title}
                    </h1>

                    <p className="mt-2 text-[15px] leading-6 text-slate-500 dark:text-gray-400">
                        {subtitle}
                    </p>

                    {errors.login && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                            {errors.login}
                        </div>
                    )}
                </div>

                <form onSubmit={submit} className="mt-7 space-y-4">
                    <div>
                        <label className="mb-2 block text-[14px] font-semibold text-slate-700 dark:text-white">
                            Username
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400"
                            />

                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) =>
                                    setData('username', e.target.value)
                                }
                                placeholder="Masukkan username"
                                autoComplete="username"
                                className={`h-[42px] w-full rounded-[14px] border bg-white pl-11 pr-4 text-[14px] text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#155dfc] dark:focus:ring-[#155dfc]/20 ${
                                    errors.username
                                        ? 'border-red-300 dark:border-red-500/50'
                                        : 'border-slate-300 dark:border-[#334155]'
                                }`}
                            />
                        </div>

                        {errors.username && (
                            <p className="mt-2 text-[13px] text-red-500 dark:text-red-400">
                                {errors.username}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-[14px] font-semibold text-slate-700 dark:text-white">
                            Password
                        </label>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400"
                            />

                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                placeholder="Masukkan password"
                                autoComplete="current-password"
                                className={`h-[42px] w-full rounded-[14px] border bg-white pl-11 pr-11 text-[14px] text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-[#131d31] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#155dfc] dark:focus:ring-[#155dfc]/20 ${
                                    errors.password
                                        ? 'border-red-300 dark:border-red-500/50'
                                        : 'border-slate-300 dark:border-[#334155]'
                                }`}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:text-gray-400 dark:hover:text-white"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="mt-2 text-[13px] text-red-500 dark:text-red-400">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="h-[44px] w-full rounded-[14px] bg-blue-600 text-[15px] font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-[#155dfc] dark:text-white dark:shadow-[#155dfc]/25 dark:hover:bg-blue-600"
                    >
                        {processing ? 'Memproses...' : buttonText}
                    </button>

                    <div className="pt-1 text-center">
                        <Link
                            href="/"
                            className="text-[14px] font-medium text-slate-500 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-[#155dfc]"
                        >
                            ← Kembali ke Beranda
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}