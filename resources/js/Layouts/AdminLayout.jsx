import AdminSidebar from '@/Components/Admin/AdminSidebar';
import AdminTopbar from '@/Components/Admin/AdminTopbar';

export default function AdminLayout({
    children,
    showSearch = false,
    searchValue = '',
    onSearchChange,
    searchPlaceholder = 'Cari data...',
}) {
    return (
        <div className="flex min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-[#131d31]">
            <AdminSidebar />

            <div className="min-w-0 flex-1">
                <AdminTopbar
                    showSearch={showSearch}
                    searchValue={searchValue}
                    onSearchChange={onSearchChange}
                    searchPlaceholder={searchPlaceholder}
                />

                <main className="px-6 py-4">
                    {children}
                </main>
            </div>
        </div>
    );
}