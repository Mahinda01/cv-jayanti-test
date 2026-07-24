<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ReceivablePayment;
use App\Models\Sale;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();
        $startOfMonth = now()->startOfMonth()->toDateString();
        $endOfMonth = now()->endOfMonth()->toDateString();

        $totalProducts = Product::count();
        $totalCategories = ProductCategory::where('is_active', true)->count();

        $activeCustomers = Customer::where('is_active', true)->count();

        $salesThisMonth = Sale::where('transaction_status', 'Aktif')
            ->whereDate('sale_date', '>=', $startOfMonth)
            ->whereDate('sale_date', '<=', $endOfMonth)
            ->get();

        $salesThisMonthTotal = $salesThisMonth->sum('total_amount');

        $receivableSales = Sale::where('transaction_status', 'Aktif')
            ->where('remaining_amount', '>', 0)
            ->get();

        $totalReceivable = $receivableSales->sum('remaining_amount');

        $notDueReceivables = $receivableSales->filter(function ($sale) use ($today) {
            return !$sale->due_date || $sale->due_date >= $today;
        });

        $overdueReceivables = $receivableSales->filter(function ($sale) use ($today) {
            return $sale->due_date && $sale->due_date < $today;
        });

        $cashSalesIncome = Sale::with('payments')
            ->where('transaction_status', 'Aktif')
            ->whereDate('sale_date', '>=', $startOfMonth)
            ->whereDate('sale_date', '<=', $endOfMonth)
            ->whereIn('payment_method', ['Tunai', 'Transfer'])
            ->sum('total_amount');

        $creditSales = Sale::with('payments')
            ->where('transaction_status', 'Aktif')
            ->whereDate('sale_date', '>=', $startOfMonth)
            ->whereDate('sale_date', '<=', $endOfMonth)
            ->where('payment_method', 'Kredit')
            ->get();

        $creditInitialIncome = $creditSales->sum(function ($sale) {
            $paymentFromReceivable = $sale->payments->sum('amount');

            return max(0, $sale->paid_amount - $paymentFromReceivable);
        });

        $receivablePaymentIncome = ReceivablePayment::whereDate('payment_date', '>=', $startOfMonth)
            ->whereDate('payment_date', '<=', $endOfMonth)
            ->sum('amount');

        $paymentReceivedThisMonth = $cashSalesIncome + $creditInitialIncome + $receivablePaymentIncome;

        $paymentReceivedCount = ReceivablePayment::whereDate('payment_date', '>=', $startOfMonth)
            ->whereDate('payment_date', '<=', $endOfMonth)
            ->count();

        $salesChart = collect(range(6, 0))->map(function ($day) {
            $date = now()->subDays($day);

            $total = Sale::where('transaction_status', 'Aktif')
                ->whereDate('sale_date', $date->toDateString())
                ->sum('total_amount');

            return [
                'date' => $date->toDateString(),
                'label' => $date->format('d M'),
                'total' => $total,
            ];
        });

        $lowStockProducts = Product::with('category')
            ->where('is_active', true)
            ->whereColumn('stock', '<=', 'minimum_stock')
            ->orderBy('stock', 'asc')
            ->take(5)
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
                    'stock_status' => $product->stock <= 0 ? 'Habis' : 'Menipis',
                ];
            });

        $recentSales = Sale::with(['customer', 'items'])
            ->where('transaction_status', 'Aktif')
            ->orderBy('id', 'desc')
            ->take(5)
            ->get()
            ->map(function ($sale) {
                $firstItem = $sale->items->first();

                return [
                    'id' => $sale->id,
                    'invoice_number' => $sale->invoice_number,
                    'customer_name' => $sale->customer?->name ?? 'Umum',
                    'product_summary' => $firstItem
                        ? ($sale->items->count() > 1
                            ? $firstItem->product_name . ' +' . ($sale->items->count() - 1) . ' produk'
                            : $firstItem->product_name)
                        : '-',
                    'total_amount_text' => $this->money($sale->total_amount),
                    'sale_date' => $this->dateText($sale->sale_date),
                    'payment_status' => $sale->payment_status,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'summary' => [
                'total_products' => $totalProducts,
                'total_categories' => $totalCategories,
                'active_customers' => $activeCustomers,
                'sales_this_month_text' => $this->money($salesThisMonthTotal),
                'sales_this_month_count' => $salesThisMonth->count(),
                'total_receivable_text' => $this->money($totalReceivable),
                'receivable_count' => $receivableSales->count(),
            ],

            'receivableSummary' => [
                'not_due_total_text' => $this->money($notDueReceivables->sum('remaining_amount')),
                'not_due_count' => $notDueReceivables->count(),
                'overdue_total_text' => $this->money($overdueReceivables->sum('remaining_amount')),
                'overdue_count' => $overdueReceivables->count(),
                'payment_received_text' => $this->money($paymentReceivedThisMonth),
                'payment_received_count' => $paymentReceivedCount,
            ],

            'salesChart' => $salesChart,
            'lowStockProducts' => $lowStockProducts,
            'recentSales' => $recentSales,
        ]);
    }

    private function money($value): string
    {
        return 'Rp ' . number_format($value ?? 0, 0, ',', '.');
    }

    private function dateText($date): string
    {
        return Carbon::parse($date)->format('d M Y');
    }
}