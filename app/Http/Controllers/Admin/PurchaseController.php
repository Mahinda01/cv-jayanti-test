<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
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
                    'total_amount_text' => $this->formatRupiah(
                        $purchase->total_amount
                    ),
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
                            'purchase_price_text' => $this->formatRupiah(
                                $item->purchase_price
                            ),
                            'quantity' => $item->quantity,
                            'subtotal' => $item->subtotal,
                            'subtotal_text' => $this->formatRupiah(
                                $item->subtotal
                            ),
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
                    'purchase_price_text' => $this->formatRupiah(
                        $product->purchase_price
                    ),
                ];
            });

        return Inertia::render($this->view('Purchases/Create'), [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'purchase_date' => [
                'required',
                'date',
                'before_or_equal:today',
            ],
            'supplier' => [
                'required',
                'string',
                'max:255',
            ],
            'note' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'items' => [
                'required',
                'array',
                'min:1',
            ],
            'items.*.product_id' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('products', 'id')->where(function ($query) {
                    $query->where('is_active', true);
                }),
            ],
            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],
            'items.*.purchase_price' => [
                'required',
                'numeric',
                'min:1',
            ],
        ]);

        DB::transaction(function () use ($validated) {
            $totalAmount = 0;

            foreach ($validated['items'] as $item) {
                $subtotal =
                    (int) $item['quantity']
                    * (float) $item['purchase_price'];

                $totalAmount += $subtotal;
            }

            $purchase = Purchase::create([
                'purchase_number' => $this->generatePurchaseNumber(),
                'purchase_date' => $validated['purchase_date'],
                'supplier' => $validated['supplier'],
                'total_amount' => round($totalAmount, 2),
                'status' => 'Selesai',
                'note' => $validated['note'] ?? null,
                'created_by' => auth()->id(),
            ]);

            foreach ($validated['items'] as $item) {
                $product = Product::whereKey($item['product_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                $quantity = (int) $item['quantity'];
                $purchasePrice = (float) $item['purchase_price'];
                $subtotal = $quantity * $purchasePrice;

                $oldStock = (int) $product->stock;
                $oldPurchasePrice = (float) $product->purchase_price;
                $newStock = $oldStock + $quantity;

                $newPurchasePrice = $this->calculateAveragePurchasePrice(
                    $oldStock,
                    $oldPurchasePrice,
                    $quantity,
                    $purchasePrice
                );

                $purchase->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_unit' => $product->unit,
                    'purchase_price' => $purchasePrice,
                    'quantity' => $quantity,
                    'subtotal' => round($subtotal, 2),
                ]);

                $product->update([
                    'stock' => $newStock,
                    'purchase_price' => $newPurchasePrice,
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
            'cancel_reason' => [
                'required',
                'string',
                'max:500',
            ],
        ]);

        $error = DB::transaction(function () use ($id, $validated) {
            $purchase = Purchase::with('items')
                ->lockForUpdate()
                ->findOrFail($id);

            if ($purchase->status === 'Dibatalkan') {
                return 'Transaksi pembelian sudah dibatalkan.';
            }

            $products = [];

            foreach ($purchase->items as $item) {
                $product = Product::whereKey($item->product_id)
                    ->lockForUpdate()
                    ->first();

                if (! $product) {
                    return 'Produk pada transaksi ini tidak ditemukan.';
                }

                if ((int) $product->stock < (int) $item->quantity) {
                    return 'Stok produk tidak cukup untuk membatalkan pembelian ini.';
                }

                if (
                    $this->hasActiveSaleAfterPurchase(
                        $item->product_id,
                        $purchase
                    )
                ) {
                    return 'Pembelian tidak dapat dibatalkan karena terdapat penjualan aktif setelah transaksi pembelian ini.';
                }

                $products[$item->id] = $product;
            }

            foreach ($purchase->items as $item) {
                $product = $products[$item->id];

                $currentStock = (int) $product->stock;
                $currentPurchasePrice =
                    (float) $product->purchase_price;

                $quantity = (int) $item->quantity;
                $purchaseCost =
                    $quantity * (float) $item->purchase_price;

                $newStock = $currentStock - $quantity;

                $newPurchasePrice =
                    $this->calculatePurchasePriceAfterCancellation(
                        $currentStock,
                        $currentPurchasePrice,
                        $newStock,
                        $purchaseCost
                    );

                $product->update([
                    'stock' => $newStock,
                    'purchase_price' => $newPurchasePrice,
                ]);
            }

            $purchase->update([
                'status' => 'Dibatalkan',
                'cancel_reason' => $validated['cancel_reason'],
                'cancelled_at' => now(),
                'cancelled_by' => auth()->id(),
            ]);

            return null;
        });

        if ($error) {
            return back()->with('error', $error);
        }

        return back()->with(
            'success',
            'Transaksi pembelian berhasil dibatalkan.'
        );
    }

    private function calculateAveragePurchasePrice(
        int $oldStock,
        float $oldPurchasePrice,
        int $quantity,
        float $purchasePrice
    ): float {
        $newStock = $oldStock + $quantity;

        if ($newStock <= 0) {
            return 0;
        }

        $oldValue = $oldStock * $oldPurchasePrice;
        $purchaseValue = $quantity * $purchasePrice;

        return round(
            ($oldValue + $purchaseValue) / $newStock,
            2
        );
    }

    private function calculatePurchasePriceAfterCancellation(
        int $currentStock,
        float $currentPurchasePrice,
        int $newStock,
        float $purchaseCost
    ): float {
        if ($newStock <= 0) {
            return 0;
        }

        $currentValue = $currentStock * $currentPurchasePrice;
        $remainingValue = $currentValue - $purchaseCost;

        return round(
            max(0, $remainingValue / $newStock),
            2
        );
    }

    private function hasActiveSaleAfterPurchase(
        int $productId,
        Purchase $purchase
    ): bool {
        return DB::table('sale_items')
            ->join('sales', 'sales.id', '=', 'sale_items.sale_id')
            ->where('sale_items.product_id', $productId)
            ->where('sales.transaction_status', 'Aktif')
            ->where('sales.created_at', '>=', $purchase->created_at)
            ->exists();
    }

    private function generatePurchaseNumber()
    {
        $prefix = 'PB-' . now()->format('Ymd') . '-';

        $lastPurchase = Purchase::where(
            'purchase_number',
            'like',
            $prefix . '%'
        )
            ->lockForUpdate()
            ->orderBy('id', 'desc')
            ->first();

        $lastNumber = 0;

        if ($lastPurchase) {
            $lastNumber = (int) substr(
                $lastPurchase->purchase_number,
                -4
            );
        }

        return $prefix
            . str_pad(
                $lastNumber + 1,
                4,
                '0',
                STR_PAD_LEFT
            );
    }

    private function formatRupiah($value)
    {
        return 'Rp '
            . number_format(
                $value ?? 0,
                0,
                ',',
                '.'
            );
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