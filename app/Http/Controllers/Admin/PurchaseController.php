<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchases = Purchase::with(['items', 'creator', 'canceller'])
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($purchase) {
                return [
                    'id' => $purchase->id,
                    'purchase_number' => $purchase->purchase_number,
                    'purchase_date' => $purchase->purchase_date->format('d M Y'),
                    'supplier' => $purchase->supplier ?: '-',
                    'total_amount' => $purchase->total_amount,
                    'total_amount_text' => $this->formatRupiah($purchase->total_amount),
                    'status' => $purchase->status,
                    'note' => $purchase->note,
                    'cancel_reason' => $purchase->cancel_reason,
                    'created_by' => $purchase->creator?->name ?: '-',
                    'cancelled_by' => $purchase->canceller?->name,
                    'cancelled_at' => $purchase->cancelled_at
                        ? $purchase->cancelled_at->format('d M Y H:i')
                        : null,
                    'items_count' => $purchase->items->count(),
                    'items' => $purchase->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_name' => $item->product_name,
                            'product_unit' => $item->product_unit,
                            'purchase_price' => $item->purchase_price,
                            'purchase_price_text' => $this->formatRupiah($item->purchase_price),
                            'quantity' => $item->quantity,
                            'subtotal' => $item->subtotal,
                            'subtotal_text' => $this->formatRupiah($item->subtotal),
                        ];
                    }),
                ];
            });

        return Inertia::render($this->view('Purchases/Index'), [
            'purchases' => $purchases,
        ]);
    }

    public function create()
    {
        $products = Product::with('category')
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category?->name,
                    'unit' => $product->unit,
                    'stock' => $product->stock,
                    'purchase_price' => $product->purchase_price,
                    'purchase_price_text' => $this->formatRupiah($product->purchase_price),
                ];
            });

        return Inertia::render($this->view('Purchases/Create'), [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'purchase_date' => ['required', 'date'],
            'supplier' => ['nullable', 'string', 'max:150'],
            'note' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.purchase_price' => ['required', 'numeric', 'min:0'],
        ]);

        DB::transaction(function () use ($validated) {
            $totalAmount = 0;

            foreach ($validated['items'] as $item) {
                $totalAmount += $item['quantity'] * $item['purchase_price'];
            }

            $purchase = Purchase::create([
                'purchase_number' => $this->generatePurchaseNumber(),
                'purchase_date' => $validated['purchase_date'],
                'supplier' => $validated['supplier'] ?? null,
                'total_amount' => $totalAmount,
                'status' => 'Selesai',
                'note' => $validated['note'] ?? null,
                'created_by' => auth()->id(),
            ]);

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $subtotal = $item['quantity'] * $item['purchase_price'];

                $purchase->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_unit' => $product->unit,
                    'purchase_price' => $item['purchase_price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $subtotal,
                ]);

                $product->increment('stock', $item['quantity']);

                $product->update([
                    'purchase_price' => $item['purchase_price'],
                ]);
            }
        });

        return redirect()
            ->route($this->routeName('purchases.index'))
            ->with('success', 'Transaksi pembelian berhasil disimpan.');
    }

    public function cancel(Request $request, $id)
    {
        $validated = $request->validate([
            'cancel_reason' => ['required', 'string', 'max:255'],
        ]);

        $purchase = Purchase::with('items.product')->findOrFail($id);

        if ($purchase->status === 'Dibatalkan') {
            return back()->with('error', 'Transaksi pembelian sudah dibatalkan.');
        }

        foreach ($purchase->items as $item) {
            if (! $item->product) {
                return back()->with('error', 'Produk pada transaksi ini tidak ditemukan.');
            }

            if ($item->product->stock < $item->quantity) {
                return back()->with('error', 'Stok produk tidak cukup untuk membatalkan pembelian ini.');
            }
        }

        DB::transaction(function () use ($purchase, $validated) {
            foreach ($purchase->items as $item) {
                $item->product->decrement('stock', $item->quantity);
            }

            $purchase->update([
                'status' => 'Dibatalkan',
                'cancel_reason' => $validated['cancel_reason'],
                'cancelled_at' => now(),
                'cancelled_by' => auth()->id(),
            ]);
        });

        return back()->with('success', 'Transaksi pembelian berhasil dibatalkan.');
    }

    private function generatePurchaseNumber()
    {
        $prefix = 'PB-' . now()->format('Ymd') . '-';

        $lastPurchase = Purchase::where('purchase_number', 'like', $prefix . '%')
            ->orderBy('id', 'desc')
            ->first();

        $lastNumber = 0;

        if ($lastPurchase) {
            $lastNumber = (int) substr($lastPurchase->purchase_number, -4);
        }

        return $prefix . str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
    }

    private function formatRupiah($value)
    {
        return 'Rp ' . number_format($value ?? 0, 0, ',', '.');
    }

    private function view(string $page): string
    {
        return request()->routeIs('staff.*')
            ? 'Staff/' . $page
            : 'Admin/' . $page;
    }

    private function routeName(string $name): string
    {
        return request()->routeIs('staff.*')
            ? 'staff.' . $name
            : 'admin.' . $name;
    }
}