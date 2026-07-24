<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();

        $totalProducts = Product::count();

        $totalCustomers = Customer::where('is_active', true)
            ->count();

        $todaySalesCount = Sale::where('transaction_status', 'Aktif')
            ->whereDate('sale_date', $today)
            ->count();

        $todaySalesTotal = Sale::where('transaction_status', 'Aktif')
            ->whereDate('sale_date', $today)
            ->sum('total_amount');

        $lowStockCount = Product::where('is_active', true)
            ->whereColumn('stock', '<=', 'minimum_stock')
            ->count();

        $lowStockProducts = Product::where('is_active', true)
            ->whereColumn('stock', '<=', 'minimum_stock')
            ->orderBy('stock', 'asc')
            ->orderBy('id', 'asc')
            ->take(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'code' => 'P' . str_pad($product->id, 3, '0', STR_PAD_LEFT),
                    'name' => $product->name,
                    'stock' => $product->stock,
                    'minimum_stock' => $product->minimum_stock,
                    'unit' => $product->unit,
                    'location' => $product->location ?? '-',
                ];
            });

        $recentSales = Sale::with(['customer', 'user'])
            ->orderBy('id', 'desc')
            ->take(8)
            ->get()
            ->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'invoice_number' => $sale->invoice_number,
                    'customer_name' => $sale->customer?->name ?? 'Umum',
                    'sale_date' => date('d M Y', strtotime($sale->sale_date)),
                    'total_amount' => $sale->total_amount,
                    'total_amount_text' => 'Rp ' . number_format($sale->total_amount, 0, ',', '.'),
                    'payment_method' => $sale->payment_method,
                    'payment_status' => $sale->payment_status,
                    'transaction_status' => $sale->transaction_status ?? 'Aktif',
                    'created_by' => $sale->user?->name ?? '-',
                ];
            });

        return Inertia::render('Staff/Dashboard', [
            'summary' => [
                'total_products' => $totalProducts,
                'total_customers' => $totalCustomers,
                'today_sales_count' => $todaySalesCount,
                'today_sales_total' => 'Rp ' . number_format($todaySalesTotal, 0, ',', '.'),
                'low_stock_count' => $lowStockCount,
            ],
            'lowStockProducts' => $lowStockProducts,
            'recentSales' => $recentSales,
            'user' => [
                'name' => Auth::user()?->name,
                'username' => Auth::user()?->username,
                'role' => Auth::user()?->role,
            ],
        ]);
    }
}