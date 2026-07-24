import { Link } from '@inertiajs/react';

export default function LoginLayout({ children }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-slate-900 dark:bg-slate-950 dark:text-white">
            <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <Link href="/">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            CV Jayanti Muliatama
                        </h1>
                    </Link>

                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        Sistem Informasi Internal
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
                    {children}
                </div>
            </div>
        </div>
    );
}