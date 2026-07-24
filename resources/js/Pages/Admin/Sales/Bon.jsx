import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';

export default function Bon({ sale }) {
    const isCancelled = sale.transaction_status === 'Dibatalkan';
    const items = sale.items || [];

    const printBon = () => {
        window.print();
    };

    return (
        <AdminLayout>
            <Head title="Bon Penjualan" />

            <style>
                {`
                    @page {
                        size: 148mm 210mm;
                        margin: 8mm;
                    }

                    @media print {
                        body {
                            background: white !important;
                        }

                        body * {
                            visibility: hidden;
                        }

                        .bon-print-area,
                        .bon-print-area * {
                            visibility: visible;
                        }

                        .bon-print-area {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            background: white !important;
                            padding: 0 !important;
                        }

                        .bon-paper {
                            width: 132mm !important;
                            max-width: 132mm !important;
                            margin: 0 auto !important;
                            padding: 0 !important;
                            border: none !important;
                            box-shadow: none !important;
                            background: white !important;
                            color: black !important;
                        }

                        .no-print {
                            display: none !important;
                        }

                        .print-text {
                            color: black !important;
                        }

                        .print-border {
                            border-color: #111827 !important;
                        }

                        .print-bg {
                            background: #f3f4f6 !important;
                        }

                        .print-watermark {
                            color: rgba(185, 28, 28, 0.11) !important;
                        }
                    }
                `}
            </style>

            <div className="space-y-4">
                <div className="no-print flex items-center justify-between">
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Bon Penjualan
                    </h1>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.sales.index')}
                            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-[#155dfc] transition hover:bg-blue-50 dark:border-[#155dfc]/40 dark:bg-[#1d293d] dark:text-[#60a5fa] dark:hover:bg-[#131d31]"
                        >
                            <ArrowLeft size={16} />
                            Kembali
                        </Link>

                        <button
                            type="button"
                            onClick={printBon}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#155dfc] px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 dark:hover:bg-blue-600"
                        >
                            <Printer size={16} />
                            Cetak Bon
                        </button>
                    </div>
                </div>

                <div className="bon-print-area">
                    <div className="bon-paper relative mx-auto max-w-[720px] rounded-xl border border-slate-200 bg-white px-7 py-5 shadow-md">
                        {isCancelled && (
                            <div className="print-watermark pointer-events-none absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 -rotate-12 text-5xl font-black uppercase tracking-widest text-red-100">
                                Dibatalkan
                            </div>
                        )}

                        <div className="relative">
                            <div className="text-center">
                                <h2 className="print-text text-xl font-black uppercase tracking-wide text-slate-950">
                                    CV Jayanti Muliatama
                                </h2>

                                <p className="print-text mt-1.5 text-xs font-medium text-slate-600">
                                    Jl. Karya Sehati No.20, Polonia, Kec. Medan
                                    Polonia, Kota Medan
                                </p>

                                <p className="print-text mt-0.5 text-xs font-medium text-slate-600">
                                    Telp/WhatsApp: 082174369753
                                </p>
                            </div>

                            <div className="print-border mt-4 border-t border-slate-300" />

                            <h3 className="print-text mt-4 text-center text-lg font-black uppercase tracking-wide text-slate-950">
                                Bon / Faktur
                            </h3>

                            <div className="mt-4 grid grid-cols-2 gap-8">
                                <div className="space-y-1 text-xs">
                                    <p className="print-text text-slate-700">
                                        <span className="font-black">
                                            No. Invoice:
                                        </span>{' '}
                                        {sale.invoice_number}
                                    </p>

                                    <p className="print-text text-slate-700">
                                        <span className="font-black">
                                            Tanggal:
                                        </span>{' '}
                                        {sale.sale_date}
                                    </p>
                                </div>

                                <div className="space-y-1 text-xs">
                                    <p className="print-text text-slate-700">
                                        <span className="font-black">
                                            Kepada:
                                        </span>{' '}
                                        {sale.customer_name}
                                    </p>

                                    <p className="print-text text-slate-700">
                                        <span className="font-black">
                                            Alamat:
                                        </span>{' '}
                                        {sale.customer_address}
                                    </p>

                                    {isCancelled && (
                                        <p className="text-xs font-black text-red-600">
                                            Status: Dibatalkan
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="print-border mt-4 overflow-hidden border-y border-slate-300">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr className="print-bg bg-slate-100 text-[11px] font-black text-slate-950">
                                            <th className="print-text px-3 py-2">
                                                Banyaknya
                                            </th>

                                            <th className="print-text px-3 py-2">
                                                Part Number & Nama Barang
                                            </th>

                                            <th className="print-text px-3 py-2 text-right">
                                                Harga Satuan
                                            </th>

                                            <th className="print-text px-3 py-2 text-right">
                                                Jumlah Harga
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {items.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-t border-slate-200"
                                            >
                                                <td className="print-text whitespace-nowrap px-3 py-2 text-xs font-medium text-slate-800">
                                                    {item.quantity}{' '}
                                                    {item.product_unit || ''}
                                                </td>

                                                <td className="print-text px-3 py-2 text-xs font-medium text-slate-800">
                                                    {item.product_name}
                                                </td>

                                                <td className="print-text whitespace-nowrap px-3 py-2 text-right text-xs font-medium text-slate-800">
                                                    {item.price_text}
                                                </td>

                                                <td className="print-text whitespace-nowrap px-3 py-2 text-right text-xs font-black text-slate-950">
                                                    {item.subtotal_text}
                                                </td>
                                            </tr>
                                        ))}

                                        <tr className="print-bg border-t border-slate-300 bg-slate-100">
                                            <td
                                                colSpan="3"
                                                className="print-text px-3 py-2.5 text-right text-sm font-black text-slate-950"
                                            >
                                                Total Transaksi:
                                            </td>

                                            <td className="print-text whitespace-nowrap px-3 py-2.5 text-right text-sm font-black text-slate-950">
                                                {sale.total_amount_text}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 rounded-lg bg-slate-50 px-3 py-3">
                                <p className="print-text text-xs font-black text-slate-600">
                                    Catatan:
                                </p>

                                <p className="print-text mt-1 min-h-[18px] text-xs font-medium text-slate-800">
                                    {sale.notes || '-'}
                                </p>
                            </div>

                            <div className="print-border mt-7 border-t border-slate-300 pt-5">
                                <div className="grid grid-cols-2 gap-8 text-center">
                                    <div>
                                        <p className="print-text text-xs font-medium text-slate-700">
                                            Hormat Kami,
                                        </p>

                                        <div className="print-border mt-10 border-t border-slate-950 pt-2">
                                            <p className="print-text text-xs font-black text-slate-950">
                                                CV Jayanti Muliatama
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="print-text text-xs font-medium text-slate-700">
                                            Penerima,
                                        </p>

                                        <div className="print-border mt-10 border-t border-slate-950 pt-2">
                                            <p className="print-text text-xs font-black text-slate-950">
                                                (...........................)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}