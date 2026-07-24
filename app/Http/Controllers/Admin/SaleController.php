<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index()
    {
        $sales = Sale::with(['customer', 'user', 'items', 'cancelledBy'])
            ->withCount('payments')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'invoice_number' => $sale->invoice_number,
                    'customer_name' => $sale->customer?->name ?? 'Umum',
                    'customer_address' => $sale->customer?->address ?? '-',
                    'user_name' => $sale->user?->name ?? '-',
                    'sale_date' => date('d M Y', strtotime($sale->sale_date)),
                    'sale_date_raw' => date('Y-m-d', strtotime($sale->sale_date)),
                    'due_date' => $sale->due_date
                        ? date('d M Y', strtotime($sale->due_date))
                        : '-',
                    'due_date_raw' => $sale->due_date
                        ? date('Y-m-d', strtotime($sale->due_date))
                        : null,
                    'total_amount' => $sale->total_amount,
                    'total_amount_text' => $this->formatRupiah($sale->total_amount),
                    'paid_amount' => $sale->paid_amount,
                    'paid_amount_text' => $this->formatRupiah($sale->paid_amount),
                    'remaining_amount' => $sale->remaining_amount,
                    'remaining_amount_text' => $this->formatRupiah($sale->remaining_amount),
                    'payment_method' => $sale->payment_method,
                    'payment_status' => $sale->payment_status,
                    'transaction_status' => $sale->transaction_status ?? 'Aktif',
                    'cancel_reason' => $sale->cancel_reason,
                    'cancelled_by' => $sale->cancelledBy?->name,
                    'cancelled_at' => $sale->cancelled_at
                        ? date('d M Y H:i', strtotime($sale->cancelled_at))
                        : null,
                    'payments_count' => $sale->payments_count ?? 0,
                    'items_count' => $sale->items->count(),
                    'created_at' => $sale->created_at->format('d M Y'),
                ];
            });

        return Inertia::render($this->view('Sales/Index'), [
            'sales' => $sales,
        ]);
    }

    public function create()
    {
        $products = Product::where('is_active', true)
            ->where('stock', '>', 0)
            ->orderBy('id')
            ->get()
            ->map(function ($product) {
                $purchasePrice = (float) ($product->purchase_price ?? 0);
                $price = (float) ($product->price ?? 0);
                $profit = $price - $purchasePrice;

                return [
                    'id' => $product->id,
                    'code' => 'P' . str_pad($product->id, 3, '0', STR_PAD_LEFT),
                    'name' => $product->name,
                    'purchase_price' => $purchasePrice,
                    'purchase_price_text' => $this->formatRupiah($purchasePrice),
                    'price' => $price,
                    'price_text' => $this->formatRupiah($price),
                    'profit' => $profit,
                    'profit_text' => $this->formatRupiah($profit),
                    'stock' => $product->stock,
                    'unit' => $product->unit,
                ];
            });

        $customers = Customer::where('is_active', true)
            ->orderBy('id')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'code' => 'C' . str_pad($customer->id, 3, '0', STR_PAD_LEFT),
                    'name' => $customer->name,
                    'contact' => $customer->contact,
                    'address' => $customer->address,
                    'total_receivable' => $customer->total_receivable,
                    'receivable_status' => $customer->receivable_status,
                ];
            });

        return Inertia::render($this->view('Sales/Create'), [
            'products' => $products,
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sale_date' => ['required', 'date'],
            'due_date' => ['nullable', 'date', 'after_or_equal:sale_date'],
            'customer_id' => ['nullable', 'exists:customers,id'],
            'payment_method' => ['required', Rule::in(['Tunai', 'Transfer', 'Kredit'])],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        DB::transaction(function () use ($validated) {
            $itemsByProduct = collect($validated['items'])
                ->groupBy('product_id')
                ->map(function ($items) {
                    return $items->sum('quantity');
                });

            $products = Product::whereIn('id', $itemsByProduct->keys())
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $totalAmount = 0;
            $saleItems = [];

            foreach ($itemsByProduct as $productId => $quantity) {
                $product = $products->get((int) $productId);

                if (! $product || ! $product->is_active) {
                    throw ValidationException::withMessages([
                        'items' => 'Produk tidak valid atau sudah tidak aktif.',
                    ]);
                }

                if ($quantity > $product->stock) {
                    throw ValidationException::withMessages([
                        'items' => 'Stok produk ' . $product->name . ' tidak mencukupi.',
                    ]);
                }

                $purchasePrice = (float) ($product->purchase_price ?? 0);
                $price = (float) ($product->price ?? 0);

                $purchaseSubtotal = $purchasePrice * $quantity;
                $subtotal = $price * $quantity;
                $profit = $subtotal - $purchaseSubtotal;

                $totalAmount += $subtotal;

                $saleItems[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'purchase_price' => $purchasePrice,
                    'price' => $price,
                    'purchase_subtotal' => $purchaseSubtotal,
                    'subtotal' => $subtotal,
                    'profit' => $profit,
                ];
            }

            $paidAmount = $validated['payment_method'] === 'Kredit'
                ? (float) ($validated['paid_amount'] ?? 0)
                : $totalAmount;

            if ($paidAmount > $totalAmount) {
                throw ValidationException::withMessages([
                    'paid_amount' => 'Jumlah bayar tidak boleh lebih besar dari total transaksi.',
                ]);
            }

            $remainingAmount = $totalAmount - $paidAmount;
            $paymentStatus = $remainingAmount > 0 ? 'Belum Lunas' : 'Lunas';

            if ($remainingAmount > 0 && empty($validated['customer_id'])) {
                throw ValidationException::withMessages([
                    'customer_id' => 'Pelanggan wajib dipilih untuk transaksi kredit/piutang.',
                ]);
            }

            $dueDate = null;

            if ($validated['payment_method'] === 'Kredit') {
                $dueDate = $validated['due_date']
                    ?? Carbon::parse($validated['sale_date'])->addDays(30)->toDateString();
            }

            $sale = Sale::create([
                'invoice_number' => $this->generateInvoiceNumber(),
                'customer_id' => $validated['customer_id'] ?? null,
                'user_id' => Auth::id(),
                'sale_date' => $validated['sale_date'],
                'due_date' => $dueDate,
                'total_amount' => $totalAmount,
                'paid_amount' => $paidAmount,
                'remaining_amount' => $remainingAmount,
                'payment_method' => $validated['payment_method'],
                'payment_status' => $paymentStatus,
                'transaction_status' => 'Aktif',
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($saleItems as $item) {
                $product = $item['product'];

                $sale->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_unit' => $product->unit,

                    // Harga saat transaksi dibuat.
                    // Nilai ini tidak akan berubah walaupun harga produk diubah nanti.
                    'purchase_price' => $item['purchase_price'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'purchase_subtotal' => $item['purchase_subtotal'],
                    'subtotal' => $item['subtotal'],
                    'profit' => $item['profit'],
                ]);

                $product->update([
                    'stock' => $product->stock - $item['quantity'],
                ]);
            }

            if ($remainingAmount > 0) {
                $customer = Customer::where('id', $validated['customer_id'])
                    ->lockForUpdate()
                    ->first();

                $this->syncCustomerReceivable($customer);
            }
        });

        return redirect()
            ->route($this->routeName('sales.index'))
            ->with('success', 'Transaksi penjualan berhasil disimpan.');
    }

    public function bon($id)
    {
        $sale = Sale::with(['customer', 'user', 'cancelledBy', 'items.product'])
            ->findOrFail($id);

        return Inertia::render($this->view('Sales/Bon'), [
            'sale' => [
                'id' => $sale->id,
                'invoice_number' => $sale->invoice_number,
                'customer_name' => $sale->customer?->name ?? 'Umum',
                'customer_address' => $sale->customer?->address ?? '-',
                'customer_contact' => $sale->customer?->contact ?? '-',
                'user_name' => $sale->user?->name ?? '-',
                'sale_date' => date('d M Y', strtotime($sale->sale_date)),
                'due_date' => $sale->due_date
                    ? date('d M Y', strtotime($sale->due_date))
                    : '-',
                'total_amount' => $sale->total_amount,
                'total_amount_text' => $this->formatRupiah($sale->total_amount),
                'paid_amount' => $sale->paid_amount,
                'paid_amount_text' => $this->formatRupiah($sale->paid_amount),
                'remaining_amount' => $sale->remaining_amount,
                'remaining_amount_text' => $this->formatRupiah($sale->remaining_amount),
                'payment_method' => $sale->payment_method,
                'payment_status' => $sale->payment_status,
                'transaction_status' => $sale->transaction_status ?? 'Aktif',
                'notes' => $sale->notes,
                'cancel_reason' => $sale->cancel_reason,
                'cancelled_by' => $sale->cancelledBy?->name,
                'cancelled_at' => $sale->cancelled_at
                    ? date('d M Y H:i', strtotime($sale->cancelled_at))
                    : null,
                'items' => $sale->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'product_unit' => $item->product_unit,
                        'price' => $item->price,
                        'price_text' => $this->formatRupiah($item->price),
                        'quantity' => $item->quantity,
                        'subtotal' => $item->subtotal,
                        'subtotal_text' => $this->formatRupiah($item->subtotal),
                    ];
                }),
            ],
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $validated = $request->validate([
            'cancel_reason' => ['required', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($id, $validated) {
            $sale = Sale::with(['items', 'customer'])
                ->where('id', $id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($sale->transaction_status === 'Dibatalkan') {
                throw ValidationException::withMessages([
                    'cancel_reason' => 'Transaksi ini sudah dibatalkan.',
                ]);
            }

            if (
                $sale->payment_method === 'Kredit' &&
                $sale->payments()->exists()
            ) {
                throw ValidationException::withMessages([
                    'cancel_reason' => 'Transaksi kredit yang sudah memiliki pembayaran piutang tidak dapat dibatalkan.',
                ]);
            }

            foreach ($sale->items as $item) {
                if ($item->product_id) {
                    $product = Product::where('id', $item->product_id)
                        ->lockForUpdate()
                        ->first();

                    if ($product) {
                        $product->update([
                            'stock' => $product->stock + $item->quantity,
                        ]);
                    }
                }
            }

            $customer = null;

            if ($sale->customer_id) {
                $customer = Customer::where('id', $sale->customer_id)
                    ->lockForUpdate()
                    ->first();
            }

            $sale->update([
                'transaction_status' => 'Dibatalkan',
                'cancelled_at' => now(),
                'cancelled_by' => Auth::id(),
                'cancel_reason' => $validated['cancel_reason'] ?? null,
            ]);

            if ($customer) {
                $this->syncCustomerReceivable($customer);
            }
        });

        return redirect()
            ->route($this->routeName('sales.index'))
            ->with('success', 'Transaksi berhasil dibatalkan.');
    }

    private function generateInvoiceNumber(): string
    {
        $today = now()->format('Ymd');

        $lastSale = Sale::where('invoice_number', 'like', 'INV-' . $today . '-%')
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = 1;

        if ($lastSale) {
            $lastNumber = (int) substr($lastSale->invoice_number, -4);
            $nextNumber = $lastNumber + 1;
        }

        return 'INV-' . $today . '-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    private function syncCustomerReceivable(Customer $customer): void
    {
        $totalReceivable = Sale::where('customer_id', $customer->id)
            ->where('transaction_status', 'Aktif')
            ->sum('remaining_amount');

        $hasOverdue = Sale::where('customer_id', $customer->id)
            ->where('transaction_status', 'Aktif')
            ->where('remaining_amount', '>', 0)
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', now()->toDateString())
            ->exists();

        $customer->update([
            'total_receivable' => $totalReceivable,
            'receivable_status' => $totalReceivable <= 0
                ? 'Tidak Ada Piutang'
                : ($hasOverdue ? 'Jatuh Tempo' : 'Belum Lunas'),
        ]);
    }

    private function formatRupiah($value): string
    {
        return 'Rp ' . number_format((float) $value, 0, ',', '.');
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