import { Link } from '@inertiajs/react';

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-3">
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-blue-600 text-[16px] font-bold text-white shadow-sm">
                JM
            </div>

            <div className="leading-tight">
                <div className="text-[15px] font-bold text-[#101828] dark:text-white">
                    CV Jayanti Muliatama
                </div>
                <div className="text-[12px] font-normal text-slate-500 dark:text-slate-400">
                    Hydraulic Solutions
                </div>
            </div>
        </Link>
    );
}