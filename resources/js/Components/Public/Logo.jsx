import { Link } from '@inertiajs/react';

export default function Logo({ variant = 'default' }) {
    const titleColor =
        variant === 'light'
            ? 'text-white'
            : 'text-slate-900 dark:text-white';

    const subtitleColor =
        variant === 'light'
            ? 'text-gray-400'
            : 'text-slate-500 dark:text-gray-400';

    return (
        <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="site-logo flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                <img
                    src="/images/logo/logo-cv-jayanti.png"
                    alt="Logo CV Jayanti Muliatama"
                    className="h-full w-full object-contain"
                />
            </div>

            <div className="leading-none">
                <h1 className={`text-[17px] font-extrabold leading-tight ${titleColor}`}>
                    CV Jayanti Muliatama
                </h1>

                <p className={`mt-0.5 text-[13px] font-medium leading-tight ${subtitleColor}`}>
                    Hydraulic Solutions
                </p>
            </div>
        </Link>
    );
}