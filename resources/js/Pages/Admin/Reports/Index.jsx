import SalesReport from '@/Components/Admin/Reports/SalesReport';
import StockReport from '@/Components/Admin/Reports/StockReport';
import ReceivableReport from '@/Components/Admin/Reports/ReceivableReport';
import FinancialReport from '@/Components/Admin/Reports/FinancialReport';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { Download, Filter, Printer, RefreshCcw } from 'lucide-react';
import { useState } from 'react';

export default function Index({
    filters = {},
    salesReport = {},
    stockReport = {},
    receivableReport = {},
    financialReport = {},
}) {
    const [activeReport, setActiveReport] = useState(() => {
        if (typeof window === 'undefined') {
            return 'sales';
        }

        const report = new URLSearchParams(window.location.search).get('report');

        return ['sales', 'stock', 'receivables', 'financial'].includes(report)
            ? report
            : 'sales';
    });
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [stockSearch, setStockSearch] = useState('');
    const [stockStatus, setStockStatus] = useState('Semua');
    const [receivableStatus, setReceivableStatus] = useState('Semua');

    const reportTabs = [
        { key: 'sales', label: 'Laporan Penjualan' },
        { key: 'stock', label: 'Laporan Stok' },
        { key: 'receivables', label: 'Laporan Piutang' },
        { key: 'financial', label: 'Laporan Keuangan' },
    ];

    const activeTab = reportTabs.find((item) => item.key === activeReport);

    const inputClass =
        'h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100 dark:border-[#334155] dark:bg-[#131d31] dark:text-white dark:focus:ring-[#155dfc]/20';

    const dateInputClass =
        `${inputClass} dark:[&::-webkit-calendar-picker-indicator]:cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:opacity-100 dark:[&::-webkit-calendar-picker-indicator]:[filter:invert(43%)_sepia(99%)_saturate(1843%)_hue-rotate(207deg)_brightness(100%)_contrast(98%)]`;

    const buttonClass =
        'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-extrabold text-white transition';

    const handleFilter = (e) => {
        e.preventDefault();

        if (activeReport === 'stock') {
            return;
        }

        router.get(
            route('admin.reports.index'),
            {
                report: activeReport,
                start_date: startDate,
                end_date: endDate,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const resetDateFilter = () => {
        setReceivableStatus('Semua');

        router.get(
            route('admin.reports.index'),
            {
                report: activeReport,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const resetStockFilter = () => {
        setStockSearch('');
        setStockStatus('Semua');
    };

    const printReport = () => {
        window.print();
    };

    return (
        <AdminLayout>
            <div className="space-y-4">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white print:text-black">
                    Laporan
                </h1>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#334155] dark:bg-[#1d293d] print:border-slate-300 print:shadow-none">
                    <div className="flex flex-wrap gap-2 border-b border-slate-200 px-3 py-3 dark:border-[#334155] print:hidden">
                        {reportTabs.map((tab) => {
                            const isActive = activeReport === tab.key;

                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveReport(tab.key)}
                                    className={`rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${
                                        isActive
                                            ? 'bg-[#155dfc] text-white shadow-md shadow-blue-600/20'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-gray-300 dark:hover:bg-[#131d31] dark:hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-4">
                        <form
                            onSubmit={handleFilter}
                            className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-[#334155] dark:bg-[#131d31] print:hidden"
                        >
                            <div className="overflow-x-auto pb-1">
                                <div className="flex w-full min-w-max items-end justify-between gap-5">
                                    {activeReport === 'stock' ? (
                                        <div className="flex shrink-0 items-end gap-3">
                                            <div className="w-[270px]">
                                                <label className="mb-1.5 block text-xs font-extrabold text-slate-600 dark:text-gray-300">
                                                    Cari Produk
                                                </label>

                                                <input
                                                    type="text"
                                                    value={stockSearch}
                                                    onChange={(e) =>
                                                        setStockSearch(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Cari kode, nama, kategori, lokasi..."
                                                    className={`${inputClass} w-full`}
                                                />
                                            </div>

                                            <div className="w-[155px]">
                                                <label className="mb-1.5 block text-xs font-extrabold text-slate-600 dark:text-gray-300">
                                                    Status Stok
                                                </label>

                                                <select
                                                    value={stockStatus}
                                                    onChange={(e) =>
                                                        setStockStatus(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`${inputClass} w-full`}
                                                >
                                                    <option value="Semua">
                                                        Semua
                                                    </option>
                                                    <option value="Aman">
                                                        Aman
                                                    </option>
                                                    <option value="Menipis">
                                                        Menipis
                                                    </option>
                                                    <option value="Habis">
                                                        Habis
                                                    </option>
                                                    <option value="Nonaktif">
                                                        Nonaktif
                                                    </option>
                                                </select>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={resetStockFilter}
                                                className={`${buttonClass} bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600`}
                                            >
                                                <RefreshCcw size={16} />
                                                Reset
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex shrink-0 items-end gap-3">
                                            <div className="w-[170px]">
                                                <label className="mb-1.5 block text-xs font-extrabold text-slate-600 dark:text-gray-300">
                                                    Dari Tanggal
                                                </label>

                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) =>
                                                        setStartDate(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`${dateInputClass} w-full`}
                                                />
                                            </div>

                                            <div className="w-[170px]">
                                                <label className="mb-1.5 block text-xs font-extrabold text-slate-600 dark:text-gray-300">
                                                    Sampai Tanggal
                                                </label>

                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) =>
                                                        setEndDate(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={`${dateInputClass} w-full`}
                                                />
                                            </div>

                                            {activeReport ===
                                                'receivables' && (
                                                <div className="w-[155px]">
                                                    <label className="mb-1.5 block text-xs font-extrabold text-slate-600 dark:text-gray-300">
                                                        Status Piutang
                                                    </label>

                                                    <select
                                                        value={
                                                            receivableStatus
                                                        }
                                                        onChange={(e) =>
                                                            setReceivableStatus(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className={`${inputClass} w-full`}
                                                    >
                                                        <option value="Semua">
                                                            Semua
                                                        </option>
                                                        <option value="Belum Lunas">
                                                            Belum Lunas
                                                        </option>
                                                        <option value="Jatuh Tempo">
                                                            Jatuh Tempo
                                                        </option>
                                                    </select>
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                className={`${buttonClass} bg-[#155dfc] hover:bg-blue-700`}
                                            >
                                                <Filter size={16} />
                                                Terapkan
                                            </button>

                                            <button
                                                type="button"
                                                onClick={resetDateFilter}
                                                className={`${buttonClass} bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600`}
                                            >
                                                <RefreshCcw size={16} />
                                                Reset
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex shrink-0 items-end gap-3">
                                        <button
                                            type="button"
                                            onClick={printReport}
                                            className={`${buttonClass} bg-red-600 hover:bg-red-700`}
                                        >
                                            <Download size={16} />
                                            Export PDF
                                        </button>

                                        <button
                                            type="button"
                                            onClick={printReport}
                                            className={`${buttonClass} bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-600`}
                                        >
                                            <Printer size={16} />
                                            Print
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="mb-5 hidden print:block">
                            <h2 className="text-lg font-extrabold text-black">
                                {activeTab?.label}
                            </h2>

                            {activeReport === 'stock' ? (
                                <p className="mt-1 text-xs font-semibold text-slate-700">
                                    Kondisi stok produk saat laporan dibuat.
                                </p>
                            ) : (
                                <p className="mt-1 text-xs font-semibold text-slate-700">
                                    Periode {filters.start_date} sampai{' '}
                                    {filters.end_date}
                                </p>
                            )}
                        </div>

                        {activeReport === 'sales' && (
                            <SalesReport report={salesReport} />
                        )}

                        {activeReport === 'stock' && (
                            <StockReport
                                report={stockReport}
                                searchValue={stockSearch}
                                statusValue={stockStatus}
                            />
                        )}

                        {activeReport === 'receivables' && (
                            <ReceivableReport
                                report={receivableReport}
                                statusValue={receivableStatus}
                            />
                        )}

                        {activeReport === 'financial' && (
                            <FinancialReport report={financialReport} />
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}