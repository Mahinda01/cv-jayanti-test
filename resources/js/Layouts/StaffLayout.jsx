import StaffSidebar from '@/Components/Staff/StaffSidebar';
import StaffTopbar from '@/Components/Staff/StaffTopbar';

export default function StaffLayout({
    children,
    showSearch = false,
    searchValue = '',
    onSearchChange,
    searchPlaceholder = 'Cari data...',
}) {
    return (
        <div className="flex min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-[#131d31]">
            <StaffSidebar />

            <div className="min-w-0 flex-1">
                <StaffTopbar
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