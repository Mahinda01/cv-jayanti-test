<?php

namespace App\Services;

use App\Models\NotificationRead;
use App\Models\Product;
use App\Models\Sale;
use Carbon\Carbon;

class NotificationService
{
    public function getForUser($user): array
    {
        if (!$user || !in_array($user->role, ['admin', 'staff'])) {
            return [
                'count' => 0,
                'items' => [],
            ];
        }

        $items = collect();

        if ($user->role === 'admin') {
            $items = $items
                ->merge($this->overdueReceivables())
                ->merge($this->dueTodayReceivables())
                ->merge($this->dueSoonReceivables());
        }

        $items = $items->merge($this->lowStockProducts($user->role));

        $readKeys = NotificationRead::where('user_id', $user->id)
            ->pluck('notification_key')
            ->toArray();

        $unreadItems = $items
            ->filter(function ($item) use ($readKeys) {
                return !in_array($item['key'], $readKeys);
            })
            ->values();

        return [
            'count' => $unreadItems->count(),
            'items' => $unreadItems->all(),
        ];
    }

    private function overdueReceivables()
    {
        $today = Carbon::today();

        return Sale::with('customer')
            ->where('transaction_status', 'Aktif')
            ->where('payment_method', 'Kredit')
            ->where('remaining_amount', '>', 0)
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', $today)
            ->orderBy('due_date')
            ->get()
            ->map(function ($sale) use ($today) {
                $dueDate = Carbon::parse($sale->due_date)->startOfDay();
                $lateDays = (int) $dueDate->diffInDays($today);

                $key = 'receivable-overdue-' . $sale->id . '-' . $sale->due_date . '-' . $lateDays;

                return [
                    'id' => $key,
                    'key' => $key,
                    'type' => 'danger',
                    'title' => 'Piutang jatuh tempo',
                    'description' => $sale->invoice_number . ' - ' . ($sale->customer?->name ?? 'Umum'),
                    'meta' => 'Terlambat ' . $lateDays . ' hari • Sisa ' . $this->money($sale->remaining_amount),
                    'href' => route('admin.receivables.index'),
                ];
            });
    }

    private function dueTodayReceivables()
    {
        $today = Carbon::today();

        return Sale::with('customer')
            ->where('transaction_status', 'Aktif')
            ->where('payment_method', 'Kredit')
            ->where('remaining_amount', '>', 0)
            ->whereNotNull('due_date')
            ->whereDate('due_date', $today)
            ->orderBy('due_date')
            ->get()
            ->map(function ($sale) {
                $key = 'receivable-due-today-' . $sale->id . '-' . $sale->due_date;

                return [
                    'id' => $key,
                    'key' => $key,
                    'type' => 'warning',
                    'title' => 'Piutang jatuh tempo hari ini',
                    'description' => $sale->invoice_number . ' - ' . ($sale->customer?->name ?? 'Umum'),
                    'meta' => 'Jatuh tempo hari ini • Sisa ' . $this->money($sale->remaining_amount),
                    'href' => route('admin.receivables.index'),
                ];
            });
    }

    private function dueSoonReceivables()
    {
        $today = Carbon::today();
        $limitDate = Carbon::today()->addDays(3);

        return Sale::with('customer')
            ->where('transaction_status', 'Aktif')
            ->where('payment_method', 'Kredit')
            ->where('remaining_amount', '>', 0)
            ->whereNotNull('due_date')
            ->whereDate('due_date', '>', $today)
            ->whereDate('due_date', '<=', $limitDate)
            ->orderBy('due_date')
            ->get()
            ->map(function ($sale) use ($today) {
                $dueDate = Carbon::parse($sale->due_date)->startOfDay();
                $daysLeft = (int) $today->diffInDays($dueDate);

                $key = 'receivable-due-soon-' . $sale->id . '-' . $sale->due_date . '-' . $daysLeft;

                return [
                    'id' => $key,
                    'key' => $key,
                    'type' => 'warning',
                    'title' => 'Piutang mendekati jatuh tempo',
                    'description' => $sale->invoice_number . ' - ' . ($sale->customer?->name ?? 'Umum'),
                    'meta' => 'Jatuh tempo ' . $dueDate->format('d/m/Y') . ' • H-' . $daysLeft,
                    'href' => route('admin.receivables.index'),
                ];
            });
    }

    private function lowStockProducts(string $role)
    {
        $href = $role === 'staff'
            ? route('staff.products.index')
            : route('admin.products.index');

        return Product::where('is_active', true)
            ->whereColumn('stock', '<=', 'minimum_stock')
            ->orderBy('stock')
            ->get()
            ->map(function ($product) use ($href) {
                $key = 'product-low-stock-' . $product->id . '-' . $product->stock . '-' . $product->minimum_stock;

                return [
                    'id' => $key,
                    'key' => $key,
                    'type' => 'info',
                    'title' => 'Stok produk menipis',
                    'description' => $product->name,
                    'meta' => 'Stok ' . $product->stock . ' ' . $product->unit . ' • Minimum ' . $product->minimum_stock . ' ' . $product->unit,
                    'href' => $href,
                ];
            });
    }

    private function money($value): string
    {
        return 'Rp ' . number_format($value, 0, ',', '.');
    }
}