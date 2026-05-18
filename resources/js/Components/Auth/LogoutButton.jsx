import { Link } from '@inertiajs/react';

export default function LogoutButton() {
    return (
        <Link
            href="/logout"
            method="post"
            as="button"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
            Logout
        </Link>
    );
}