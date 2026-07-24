import { Link } from '@inertiajs/react';

export default function LogoutButton() {
    return (
        <Link
            href={route('logout')}
            method="post"
            as="button"
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
            Logout
        </Link>
    );
}