<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ReceivablePayment;
use App\Models\Sale;
use App\Models\SaleItem;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        [$startDate, $endDate] = $this->getDateRange($request);

        /*
        |--------------------------------------------------------------------------
        | Laporan Stok
        |--------------------------------------------------------------------------
        */

        $products = Product::with('category')
            ->orderBy('id')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'code' => 'P' . str_pad($product->id, 3, '0', STR_PAD_LEFT),
                    'name' => $product->name,
                    'category' => $product->category?->name ?? '-',
                    'stock' => $product->stock,
                    'minimum_stock' => $product->minimum_stock,
                    'unit' => $product->unit,
                    'location' => $product->location ?? '-',
                    'is_active' => $product->is_active,
                    'stock_status' => $this->stockStatus($product),
                    'product_status' => $product->is_active
                        ? 'Aktif'
                        : 'Tidak Aktif',
                ];
            });

        /*
        |--------------------------------------------------------------------------
        | Laporan Penjualan
        |--------------------------------------------------------------------------
        */

        $salesData = $this->getSalesReportData($startDate, $endDate);

        /*
        |--------------------------------------------------------------------------
        | Laporan Piutang
        |--------------------------------------------------------------------------
        */

        $receivables = Sale::with(['customer', 'user'])
            ->where('transaction_status', 'Aktif')
            ->where('remaining_amount', '>', 0)
            ->whereDate('sale_date', '>=', $startDate)
            ->whereDate('sale_date', '<=', $endDate)
            ->orderByRaw('due_date IS NULL')
            ->orderBy('due_date', 'asc')
            ->orderBy('id', 'desc')
            ->get();

        $receivableReport = $receivables->map(function ($sale) {
            $isOverdue = $sale->due_date
                && strtotime($sale->due_date) < strtotime(now()->toDateString());

            return [
                'id' => $sale->id,
                'invoice_number' => $sale->invoice_number,
                'customer_code' => $sale->customer
                    ? 'C' . str_pad($sale->customer->id, 3, '0', STR_PAD_LEFT)
                    : '-',
                'customer_name' => $sale->customer?->name ?? '-',
                'customer_contact' => $sale->customer?->contact ?? '-',
                'sale_date' => $this->dateText($sale->sale_date),
                'due_date' => $sale->due_date
                    ? $this->dateText($sale->due_date)
                    : '-',
                'total_amount' => $sale->total_amount,
                'total_amount_text' => $this->money($sale->total_amount),
                'paid_amount' => $sale->paid_amount,
                'paid_amount_text' => $this->money($sale->paid_amount),
                'remaining_amount' => $sale->remaining_amount,
                'remaining_amount_text' => $this->money(
                    $sale->remaining_amount,
                ),
                'receivable_status' => $isOverdue
                    ? 'Jatuh Tempo'
                    : 'Belum Lunas',
                'created_by' => $sale->user?->name ?? '-',
            ];
        });

        /*
        |--------------------------------------------------------------------------
        | Laporan Keuangan
        |--------------------------------------------------------------------------
        */

        $financeSales = Sale::with(['items.product', 'payments'])
            ->where('transaction_status', 'Aktif')
            ->whereDate('sale_date', '>=', $startDate)
            ->whereDate('sale_date', '<=', $endDate)
            ->get();

        $cashSalesIncome = $financeSales
            ->whereIn('payment_method', ['Tunai', 'Transfer'])
            ->sum('total_amount');

        $creditInitialIncome = $financeSales
            ->where('payment_method', 'Kredit')
            ->sum(function ($sale) {
                $paymentFromReceivable = $sale->payments->sum('amount');

                return max(
                    0,
                    $sale->paid_amount - $paymentFromReceivable,
                );
            });

        $receivablePaymentIncome = ReceivablePayment::whereDate(
            'payment_date',
            '>=',
            $startDate,
        )
            ->whereDate('payment_date', '<=', $endDate)
            ->sum('amount');

        $totalSalesAmount = $financeSales->sum('total_amount');

        $totalIncome =
            $cashSalesIncome
            + $creditInitialIncome
            + $receivablePaymentIncome;

        $totalReceivable = $financeSales->sum('remaining_amount');

        $saleItems = SaleItem::with('product')
            ->whereHas('sale', function ($query) use ($startDate, $endDate) {
                $query
                    ->where('transaction_status', 'Aktif')
                    ->whereDate('sale_date', '>=', $startDate)
                    ->whereDate('sale_date', '<=', $endDate);
            })
            ->get();

        $productCost = $saleItems->sum(function ($item) {
            return ($item->product?->purchase_price ?? 0)
                * $item->quantity;
        });

        $grossProfit = $totalSalesAmount - $productCost;
        $cashProfit = $totalIncome - $productCost;

        return Inertia::render('Admin/Reports/Index', [
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],

            'salesReport' => [
                'summary' => $salesData['summary'],
                'sales' => $salesData['sales'],
            ],

            'stockReport' => [
                'summary' => [
                    'total_products' => $products->count(),
                    'active_products' => $products
                        ->where('is_active', true)
                        ->count(),
                    'low_stock_products' => $products
                        ->where('stock_status', 'Menipis')
                        ->count(),
                    'empty_stock_products' => $products
                        ->where('stock_status', 'Habis')
                        ->count(),
                    'inactive_products' => $products
                        ->where('is_active', false)
                        ->count(),
                ],
                'products' => $products,
            ],

            'receivableReport' => [
                'summary' => [
                    'receivable_count' => $receivables->count(),
                    'total_receivable' => $this->money(
                        $receivables->sum('remaining_amount'),
                    ),
                    'not_due_count' => $receivableReport
                        ->where('receivable_status', 'Belum Lunas')
                        ->count(),
                    'overdue_count' => $receivableReport
                        ->where('receivable_status', 'Jatuh Tempo')
                        ->count(),
                ],
                'receivables' => $receivableReport,
            ],

            'financialReport' => [
                'summary' => [
                    'total_sales' => $this->money($totalSalesAmount),
                    'total_income' => $this->money($totalIncome),
                    'product_cost' => $this->money($productCost),
                    'gross_profit' => $this->money($grossProfit),
                    'cash_profit' => $this->money($cashProfit),
                    'total_receivable' => $this->money($totalReceivable),
                ],

                'rows' => [
                    [
                        'name' => 'Total Penjualan',
                        'amount' => $this->money($totalSalesAmount),
                        'description' =>
                            'Total nilai transaksi aktif pada periode laporan.',
                    ],
                    [
                        'name' => 'Pemasukan Tunai / Transfer',
                        'amount' => $this->money($cashSalesIncome),
                        'description' =>
                            'Pemasukan dari transaksi tunai dan transfer.',
                    ],
                    [
                        'name' => 'Uang Muka Transaksi Kredit',
                        'amount' => $this->money($creditInitialIncome),
                        'description' =>
                            'Pembayaran awal dari transaksi kredit.',
                    ],
                    [
                        'name' => 'Pembayaran Piutang',
                        'amount' => $this->money(
                            $receivablePaymentIncome,
                        ),
                        'description' =>
                            'Pembayaran piutang yang diterima pada periode laporan.',
                    ],
                    [
                        'name' => 'Total Pemasukan Diterima',
                        'amount' => $this->money($totalIncome),
                        'description' =>
                            'Total kas masuk yang diterima perusahaan.',
                    ],
                    [
                        'name' => 'Estimasi Modal Produk Terjual',
                        'amount' => $this->money($productCost),
                        'description' =>
                            'Estimasi modal berdasarkan harga beli produk dan jumlah terjual.',
                    ],
                    [
                        'name' => 'Laba Kotor Penjualan',
                        'amount' => $this->money($grossProfit),
                        'description' =>
                            'Total penjualan dikurangi estimasi modal produk terjual.',
                    ],
                    [
                        'name' => 'Laba / Rugi Kas Sementara',
                        'amount' => $this->money($cashProfit),
                        'description' =>
                            'Total pemasukan diterima dikurangi estimasi modal produk terjual.',
                    ],
                    [
                        'name' => 'Sisa Piutang Berjalan',
                        'amount' => $this->money($totalReceivable),
                        'description' =>
                            'Sisa pembayaran dari transaksi kredit yang belum lunas.',
                    ],
                ],
            ],
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Export PDF Laporan Penjualan
    |--------------------------------------------------------------------------
    */

    public function salesPdf(Request $request)
    {
        [$startDate, $endDate] = $this->getDateRange($request);

        $salesData = $this->getSalesReportData(
            $startDate,
            $endDate,
        );

        $pdf = Pdf::loadView(
            'admin.reports.sales-pdf',
            [
                'summary' => $salesData['summary'],
                'sales' => $salesData['sales'],
                'startDate' => $startDate,
                'endDate' => $endDate,
                'startDateText' => $this->longDateText(
                    $startDate,
                ),
                'endDateText' => $this->longDateText($endDate),
                'printedAt' => $this->printedAtText(),
            ],
        )->setPaper('a4', 'landscape');

        $fileName =
            'laporan-penjualan-'
            . $startDate
            . '-sampai-'
            . $endDate
            . '.pdf';

        return $pdf->download($fileName);
    }

    /*
    |--------------------------------------------------------------------------
    | Print Laporan Penjualan
    |--------------------------------------------------------------------------
    */

    public function salesPrint(Request $request)
    {
        [$startDate, $endDate] = $this->getDateRange($request);

        $salesData = $this->getSalesReportData(
            $startDate,
            $endDate,
        );

        return view('admin.reports.sales-print', [
            'summary' => $salesData['summary'],
            'sales' => $salesData['sales'],
            'startDate' => $startDate,
            'endDate' => $endDate,
            'startDateText' => $this->longDateText($startDate),
            'endDateText' => $this->longDateText($endDate),
            'printedAt' => $this->printedAtText(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Data Laporan Penjualan
    |--------------------------------------------------------------------------
    */

    private function getSalesReportData(
        string $startDate,
        string $endDate,
    ): array {
        $sales = Sale::with(['customer', 'user'])
            ->where('transaction_status', 'Aktif')
            ->whereDate('sale_date', '>=', $startDate)
            ->whereDate('sale_date', '<=', $endDate)
            ->orderBy('sale_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        $salesReport = $sales->map(function ($sale) {
            return [
                'id' => $sale->id,
                'invoice_number' => $sale->invoice_number,
                'customer_name' => $sale->customer?->name ?? 'Umum',
                'sale_date' => $this->dateText($sale->sale_date),
                'payment_method' => $sale->payment_method,
                'payment_status' => $sale->payment_status,
                'total_amount' => $sale->total_amount,
                'total_amount_text' => $this->money(
                    $sale->total_amount,
                ),
                'paid_amount' => $sale->paid_amount,
                'paid_amount_text' => $this->money(
                    $sale->paid_amount,
                ),
                'remaining_amount' => $sale->remaining_amount,
                'remaining_amount_text' => $this->money(
                    $sale->remaining_amount,
                ),
                'created_by' => $sale->user?->name ?? '-',
            ];
        });

        return [
            'summary' => [
                'transaction_count' => $sales->count(),
                'total_sales' => $this->money(
                    $sales->sum('total_amount'),
                ),
                'total_paid' => $this->money(
                    $sales->sum('paid_amount'),
                ),
                'total_remaining' => $this->money(
                    $sales->sum('remaining_amount'),
                ),
            ],

            'sales' => $salesReport,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Filter Tanggal
    |--------------------------------------------------------------------------
    */

    private function getDateRange(Request $request): array
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => [
                'nullable',
                'date',
                'after_or_equal:start_date',
            ],
        ]);

        $startDate =
            $validated['start_date']
            ?? now()->startOfMonth()->toDateString();

        $endDate =
            $validated['end_date']
            ?? now()->toDateString();

        return [$startDate, $endDate];
    }

    private function stockStatus(Product $product): string
    {
        if (!$product->is_active) {
            return 'Nonaktif';
        }

        if ($product->stock <= 0) {
            return 'Habis';
        }

        if ($product->stock <= $product->minimum_stock) {
            return 'Menipis';
        }

        return 'Aman';
    }

    private function money($value): string
    {
        return 'Rp ' . number_format(
            $value ?? 0,
            0,
            ',',
            '.',
        );
    }

    private function dateText($date): string
    {
        if (!$date) {
            return '-';
        }

        $monthNames = [
            1 => 'Jan',
            2 => 'Feb',
            3 => 'Mar',
            4 => 'Apr',
            5 => 'Mei',
            6 => 'Jun',
            7 => 'Jul',
            8 => 'Agu',
            9 => 'Sep',
            10 => 'Okt',
            11 => 'Nov',
            12 => 'Des',
        ];

        $timestamp = strtotime($date);
        $day = date('d', $timestamp);
        $month = $monthNames[(int) date('n', $timestamp)];
        $year = date('Y', $timestamp);

        return $day . ' ' . $month . ' ' . $year;
    }

    private function longDateText($date): string
    {
        if (!$date) {
            return '-';
        }

        $monthNames = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember',
        ];

        $timestamp = strtotime($date);
        $day = date('d', $timestamp);
        $month = $monthNames[(int) date('n', $timestamp)];
        $year = date('Y', $timestamp);

        return $day . ' ' . $month . ' ' . $year;
    }

    private function printedAtText(): string
    {
        return now('Asia/Jakarta')->format(
            'd/m/Y H:i',
        ) . ' WIB';
    }
}