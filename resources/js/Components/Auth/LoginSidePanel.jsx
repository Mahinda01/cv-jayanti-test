import { Link } from '@inertiajs/react';
import { Users } from 'lucide-react';

export default function LoginSidePanel({
    title,
    description,
    buttonText,
    buttonHref,
    position = 'left',
}) {
    return (
        <div
            className={`relative flex w-1/2 items-center justify-center overflow-hidden bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] text-white ${
                position === 'left' ? 'auth-slide-left' : 'auth-slide-right'
            }`}
        >
            <div className="auth-float-soft absolute -left-24 -top-24 h-60 w-60 rounded-full bg-white/10"></div>
            <div className="auth-float-reverse absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-[#1E40AF]/30"></div>

            <div className="auth-stagger relative z-10 max-w-[320px] text-center">
                <div className="mx-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-white/20 text-white shadow-xl">
                    <Users size={34} />
                </div>

                <h2 className="mt-6 text-[24px] font-extrabold leading-tight text-white">
                    {title}
                </h2>

                <p className="mx-auto mt-4 max-w-[300px] text-[15px] leading-7 text-blue-100">
                    {description}
                </p>

                <Link
                    href={buttonHref}
                    className="mt-7 inline-flex h-[42px] items-center justify-center rounded-[14px] border-2 border-white px-8 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#2563EB] hover:shadow-xl dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-[#2563EB]"
                >
                    {buttonText}
                </Link>

                <div className="mt-16 flex justify-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/55"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-white/55"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-white/55"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-white/55"></span>
                </div>
            </div>
        </div>
    );
}