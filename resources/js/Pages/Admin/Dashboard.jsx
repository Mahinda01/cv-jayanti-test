import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard() {
    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-slate-900">
                Dashboard Admin
            </h1>

            <p className="mt-2 text-slate-600">
                Halaman utama admin CV Jayanti Muliatama.
            </p>
        </AdminLayout>
    );
}