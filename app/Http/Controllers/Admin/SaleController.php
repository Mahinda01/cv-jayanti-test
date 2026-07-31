<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\InitialReceivable;
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
        $sales = Sale::with([
            'customer',
            'user',
            'items',
            'cancelledBy',
        ])
            ->withCount([
                'payments as active_payments_count' => function ($query) {
                    $query->where('status', 'Aktif');
                },
            ])
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'invoice_number' => $sale->invoice_number,
                    'customer_name' => $sale->customer_name
                        ?: $sale->customer?->name
                        ?: 'Umum',
                    'customer_address' => $sale->customer_address
                        ?: $sale->customer?->address
                        ?: '-',
                    'user_name' => $sale->user?->name ?? '-',
                    'sale_date' => Carbon::parse(
                        $sale->sale_date
                    )->format('d M Y'),
                    'sale_date_raw' => Carbon::parse(
                        $sale->sale_date
                    )->format('Y-m-d'),
                    'due_date' => $sale->due_date
                        ? Carbon::parse(
                            $sale->due_date
                        )->format('d M Y')
                        : '-',
                    'due_date_raw' => $sale->due_date
                        ? Carbon::parse(
                            $sale->due_date
                        )->format('Y-m-d')
                        : null,
                    'total_amount' => $sale->total_amount,
                    'total_amount_text' => $this->formatRupiah(
                        $sale->total_amount
                    ),
                    'paid_amount' => $sale->paid_amount,
                    'paid_amount_text' => $this->formatRupiah(
                        $sale->paid_amount
                    ),
                    'remaining_amount' => $sale->remaining_amount,
                    'remaining_amount_text' => $this->formatRupiah(
                        $sale->remaining_amount
                    ),
                    'payment_method' => $sale->payment_method,
                    'payment_status' => $sale->payment_status,
                    'transaction_status' =>
                        $sale->transaction_status ?? 'Aktif',
                    'cancel_reason' => $sale->cancel_reason,
                    'cancelled_by' => $sale->cancelledBy?->name,
                    'cancelled_at' => $sale->cancelled_at
                        ? Carbon::parse(
                            $sale->cancelled_at
                        )->format('d M Y H:i')
                        : null,
                    'payments_count' =>
                        $sale->active_payments_count ?? 0,
                    'items_count' => $sale->items->count(),
                    'created_at' => $sale->created_at
                        ->format('d M Y'),
                ];
            });

        return Inertia::render(
            $this->view('Sales/Index'),
            [
                'sales' => $sales,
            ]
        );
    }

    public function create()
    {
        $isStaff = $this->isStaffRequest();

        $products = Product::where('is_active', true)
            ->where('stock', '>', 0)
            ->orderBy('name')
            ->get()
            ->map(function ($product) use ($isStaff) {
                $price = (float) $product->price;

                $data = [
                    'id' => $product->id,
                    'code' => 'P' . str_pad(
                        $product->id,
                        3,
                        '0',
                        STR_PAD_LEFT
                    ),
                    'name' => $product->name,
                    'price' => $price,
                    'price_text' => $this->formatRupiah(
                        $price
                    ),
                    'stock' => (int) $product->stock,
                    'unit' => $product->unit,
                ];

                if (! $isStaff) {
                    $purchasePrice = (float) (
                        $product->purchase_price ?? 0
                    );

                    $profit = $price - $purchasePrice;

                    $data['purchase_price'] = $purchasePrice;
                    $data['purchase_price_text'] =
                        $this->formatRupiah($purchasePrice);
                    $data['profit'] = $profit;
                    $data['profit_text'] =
                        $this->formatRupiah($profit);
                }

                return $data;
            });

        $customers = Customer::where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'code' => 'C' . str_pad(
                        $customer->id,
                        3,
                        '0',
                        STR_PAD_LEFT
                    ),
                    'name' => $customer->name,
                    'contact' => $customer->contact,
                    'address' => $customer->address,
                ];
            });

        return Inertia::render(
            $this->view('Sales/Create'),
            [
                'products' => $products,
                'customers' => $customers,
                'showCost' => ! $isStaff,
            ]
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sale_date' => [
                'required',
                'date',
                'before_or_equal:today',
            ],
            'due_date' => [
                Rule::requiredIf(
                    $request->input('payment_method') === 'Kredit'
                ),
                'nullable',
                'date',
                'after_or_equal:sale_date',
            ],
            'customer_id' => [
                Rule::requiredIf(
                    $request->input('payment_method') === 'Kredit'
                ),
                'nullable',
                'integer',
                Rule::exists(
                    'customers',
                    'id'
                )->where(function ($query) {
                    $query->where('is_active', true);
                }),
            ],
            'payment_method' => [
                'required',
                Rule::in([
                    'Tunai',
                    'Transfer',
                    'Kredit',
                ]),
            ],
            'paid_amount' => [
                'nullable',
                'numeric',
                'min:0',
            ],
            'notes' => [
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
                Rule::exists(
                    'products',
                    'id'
                )->where(function ($query) {
                    $query->where('is_active', true);
                }),
            ],
            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],
        ]);

        DB::transaction(function () use ($validated) {
            $productIds = collect(
                $validated['items']
            )
                ->pluck('product_id')
                ->map(function ($productId) {
                    return (int) $productId;
                })
                ->values();

            $products = Product::whereIn(
                'id',
                $productIds
            )
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $customer = null;

            if (! empty($validated['customer_id'])) {
                $customer = Customer::whereKey(
                    $validated['customer_id']
                )
                    ->where('is_active', true)
                    ->lockForUpdate()
                    ->first();

                if (! $customer) {
                    throw ValidationException::withMessages([
                        'customer_id' =>
                            'Pelanggan tidak valid atau sudah tidak aktif.',
                    ]);
                }
            }

            if (
                $validated['payment_method'] === 'Kredit'
                && ! $customer
            ) {
                throw ValidationException::withMessages([
                    'customer_id' =>
                        'Pelanggan wajib dipilih untuk transaksi kredit.',
                ]);
            }

            $totalAmount = 0;
            $saleItems = [];

            foreach ($validated['items'] as $item) {
                $product = $products->get(
                    (int) $item['product_id']
                );

                $quantity = (int) $item['quantity'];

                if (! $product || ! $product->is_active) {
                    throw ValidationException::withMessages([
                        'items' =>
                            'Produk tidak valid atau sudah tidak aktif.',
                    ]);
                }

                if ($quantity > (int) $product->stock) {
                    throw ValidationException::withMessages([
                        'items' =>
                            'Stok produk '
                            . $product->name
                            . ' tidak mencukupi.',
                    ]);
                }

                $purchasePrice = (float) (
                    $product->purchase_price ?? 0
                );

                $price = (float) $product->price;

                if ($price <= 0) {
                    throw ValidationException::withMessages([
                        'items' =>
                            'Harga jual produk '
                            . $product->name
                            . ' belum valid.',
                    ]);
                }

                $purchaseSubtotal =
                    $purchasePrice * $quantity;

                $subtotal = $price * $quantity;

                $profit =
                    $subtotal - $purchaseSubtotal;

                $totalAmount += $subtotal;

                $saleItems[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'purchase_price' => $purchasePrice,
                    'price' => $price,
                    'purchase_subtotal' =>
                        $purchaseSubtotal,
                    'subtotal' => $subtotal,
                    'profit' => $profit,
                ];
            }

            $totalAmount = round(
                $totalAmount,
                2
            );

            if (
                $validated['payment_method'] === 'Kredit'
            ) {
                $paidAmount = round(
                    (float) (
                        $validated['paid_amount'] ?? 0
                    ),
                    2
                );

                if ($paidAmount >= $totalAmount) {
                    throw ValidationException::withMessages([
                        'paid_amount' =>
                            'Untuk metode Kredit, jumlah dibayar harus lebih kecil dari total transaksi. Gunakan Tunai atau Transfer jika pembayaran lunas.',
                    ]);
                }

                $remainingAmount = round(
                    $totalAmount - $paidAmount,
                    2
                );

                $dueDate = $validated['due_date'];
            } else {
                $paidAmount = $totalAmount;
                $remainingAmount = 0;
                $dueDate = null;
            }

            $paymentStatus =
                $remainingAmount > 0
                    ? 'Belum Lunas'
                    : 'Lunas';

            $notes = trim(
                $validated['notes'] ?? ''
            );

            $sale = Sale::create([
                'invoice_number' =>
                    $this->generateInvoiceNumber(),
                'customer_id' => $customer?->id,
                'customer_name' =>
                    $customer?->name ?? 'Umum',
                'customer_contact' =>
                    $customer?->contact,
                'customer_address' =>
                    $customer?->address,
                'user_id' => Auth::id(),
                'sale_date' =>
                    $validated['sale_date'],
                'due_date' => $dueDate,
                'total_amount' => $totalAmount,
                'paid_amount' => $paidAmount,
                'remaining_amount' =>
                    $remainingAmount,
                'payment_method' =>
                    $validated['payment_method'],
                'payment_status' =>
                    $paymentStatus,
                'transaction_status' => 'Aktif',
                'notes' =>
                    $notes !== '' ? $notes : null,
            ]);

            foreach ($saleItems as $item) {
                $product = $item['product'];

                $sale->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_unit' => $product->unit,
                    'purchase_price' => round(
                        $item['purchase_price'],
                        2
                    ),
                    'price' => round(
                        $item['price'],
                        2
                    ),
                    'quantity' =>
                        $item['quantity'],
                    'purchase_subtotal' => round(
                        $item['purchase_subtotal'],
                        2
                    ),
                    'subtotal' => round(
                        $item['subtotal'],
                        2
                    ),
                    'profit' => round(
                        $item['profit'],
                        2
                    ),
                ]);

                $product->update([
                    'stock' =>
                        (int) $product->stock
                        - $item['quantity'],
                ]);
            }

            if ($customer) {
                $this->syncCustomerReceivable(
                    $customer
                );
            }
        });

        return redirect()
            ->route(
                $this->routeName('sales.index')
            )
            ->with(
                'success',
                'Transaksi penjualan berhasil disimpan.'
            );
    }

    public function bon($id)
    {
        $sale = Sale::with([
            'customer',
            'user',
            'cancelledBy',
            'items',
        ])->findOrFail($id);

        return Inertia::render(
            $this->view('Sales/Bon'),
            [
                'sale' => [
                    'id' => $sale->id,
                    'invoice_number' =>
                        $sale->invoice_number,
                    'customer_name' =>
                        $sale->customer_name
                        ?: $sale->customer?->name
                        ?: 'Umum',
                    'customer_address' =>
                        $sale->customer_address
                        ?: $sale->customer?->address
                        ?: '-',
                    'customer_contact' =>
                        $sale->customer_contact
                        ?: $sale->customer?->contact
                        ?: '-',
                    'user_name' =>
                        $sale->user?->name ?? '-',
                    'sale_date' => Carbon::parse(
                        $sale->sale_date
                    )->format('d M Y'),
                    'due_date' => $sale->due_date
                        ? Carbon::parse(
                            $sale->due_date
                        )->format('d M Y')
                        : '-',
                    'total_amount' =>
                        $sale->total_amount,
                    'total_amount_text' =>
                        $this->formatRupiah(
                            $sale->total_amount
                        ),
                    'paid_amount' =>
                        $sale->paid_amount,
                    'paid_amount_text' =>
                        $this->formatRupiah(
                            $sale->paid_amount
                        ),
                    'remaining_amount' =>
                        $sale->remaining_amount,
                    'remaining_amount_text' =>
                        $this->formatRupiah(
                            $sale->remaining_amount
                        ),
                    'payment_method' =>
                        $sale->payment_method,
                    'payment_status' =>
                        $sale->payment_status,
                    'transaction_status' =>
                        $sale->transaction_status
                        ?? 'Aktif',
                    'notes' => $sale->notes,
                    'cancel_reason' =>
                        $sale->cancel_reason,
                    'cancelled_by' =>
                        $sale->cancelledBy?->name,
                    'cancelled_at' =>
                        $sale->cancelled_at
                            ? Carbon::parse(
                                $sale->cancelled_at
                            )->format('d M Y H:i')
                            : null,
                    'items' => $sale->items
                        ->map(function ($item) {
                            return [
                                'id' => $item->id,
                                'product_name' =>
                                    $item->product_name,
                                'product_unit' =>
                                    $item->product_unit,
                                'price' =>
                                    $item->price,
                                'price_text' =>
                                    $this->formatRupiah(
                                        $item->price
                                    ),
                                'quantity' =>
                                    $item->quantity,
                                'subtotal' =>
                                    $item->subtotal,
                                'subtotal_text' =>
                                    $this->formatRupiah(
                                        $item->subtotal
                                    ),
                            ];
                        }),
                ],
            ]
        );
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

        DB::transaction(function () use (
            $id,
            $validated
        ) {
            $sale = Sale::with('items')
                ->whereKey($id)
                ->lockForUpdate()
                ->firstOrFail();

            if (
                $sale->transaction_status ===
                'Dibatalkan'
            ) {
                throw ValidationException::withMessages([
                    'cancel_reason' =>
                        'Transaksi ini sudah dibatalkan.',
                ]);
            }

            $hasActivePayment = $sale->payments()
                ->where('status', 'Aktif')
                ->exists();

            if ($hasActivePayment) {
                throw ValidationException::withMessages([
                    'cancel_reason' =>
                        'Transaksi yang sudah memiliki pembayaran piutang aktif tidak dapat dibatalkan.',
                ]);
            }

            foreach ($sale->items as $item) {
                if (! $item->product_id) {
                    throw ValidationException::withMessages([
                        'cancel_reason' =>
                            'Produk pada transaksi ini tidak ditemukan.',
                    ]);
                }

                $product = Product::whereKey(
                    $item->product_id
                )
                    ->lockForUpdate()
                    ->first();

                if (! $product) {
                    throw ValidationException::withMessages([
                        'cancel_reason' =>
                            'Produk pada transaksi ini tidak ditemukan.',
                    ]);
                }

                $currentStock =
                    (int) $product->stock;

                $currentPurchasePrice =
                    (float) $product->purchase_price;

                $returnedQuantity =
                    (int) $item->quantity;

                $returnedPurchasePrice =
                    (float) $item->purchase_price;

                $newStock =
                    $currentStock
                    + $returnedQuantity;

                $newPurchasePrice =
                    $newStock > 0
                        ? (
                            (
                                $currentStock
                                * $currentPurchasePrice
                            )
                            + (
                                $returnedQuantity
                                * $returnedPurchasePrice
                            )
                        ) / $newStock
                        : 0;

                $product->update([
                    'stock' => $newStock,
                    'purchase_price' => round(
                        $newPurchasePrice,
                        2
                    ),
                ]);
            }

            $customer = null;

            if ($sale->customer_id) {
                $customer = Customer::whereKey(
                    $sale->customer_id
                )
                    ->lockForUpdate()
                    ->first();
            }

            $sale->update([
                'transaction_status' =>
                    'Dibatalkan',
                'cancelled_at' => now(),
                'cancelled_by' => Auth::id(),
                'cancel_reason' => trim(
                    $validated['cancel_reason']
                ),
            ]);

            if ($customer) {
                $this->syncCustomerReceivable(
                    $customer
                );
            }
        });

        return redirect()
            ->route(
                $this->routeName('sales.index')
            )
            ->with(
                'success',
                'Transaksi berhasil dibatalkan.'
            );
    }

    protected function generateInvoiceNumber(): string
    {
        $prefix =
            'INV-' . now()->format('Ymd') . '-';

        $lastSale = Sale::where(
            'invoice_number',
            'like',
            $prefix . '%'
        )
            ->lockForUpdate()
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = 1;

        if ($lastSale) {
            $lastNumber = (int) substr(
                $lastSale->invoice_number,
                -4
            );

            $nextNumber = $lastNumber + 1;
        }

        return $prefix
            . str_pad(
                $nextNumber,
                4,
                '0',
                STR_PAD_LEFT
            );
    }

    protected function syncCustomerReceivable(
        Customer $customer
    ): void {
        $salesReceivable = Sale::where(
            'customer_id',
            $customer->id
        )
            ->where(
                'transaction_status',
                'Aktif'
            )
            ->sum('remaining_amount');

        $initialReceivable =
            InitialReceivable::where(
                'customer_id',
                $customer->id
            )->sum('remaining_amount');

        $totalReceivable =
            (float) $salesReceivable
            + (float) $initialReceivable;

        $hasOverdueSale = Sale::where(
            'customer_id',
            $customer->id
        )
            ->where(
                'transaction_status',
                'Aktif'
            )
            ->where(
                'remaining_amount',
                '>',
                0
            )
            ->whereNotNull('due_date')
            ->whereDate(
                'due_date',
                '<',
                now()->toDateString()
            )
            ->exists();

        $hasOverdueInitial =
            InitialReceivable::where(
                'customer_id',
                $customer->id
            )
                ->where(
                    'remaining_amount',
                    '>',
                    0
                )
                ->whereNotNull('due_date')
                ->whereDate(
                    'due_date',
                    '<',
                    now()->toDateString()
                )
                ->exists();

        $customer->update([
            'total_receivable' => round(
                $totalReceivable,
                2
            ),
            'receivable_status' =>
                $totalReceivable <= 0
                    ? 'Tidak Ada Piutang'
                    : (
                        $hasOverdueSale
                        || $hasOverdueInitial
                            ? 'Jatuh Tempo'
                            : 'Belum Lunas'
                    ),
        ]);
    }

    protected function formatRupiah($value): string
    {
        return 'Rp ' . number_format(
            (float) $value,
            0,
            ',',
            '.'
        );
    }

    protected function isStaffRequest(): bool
    {
        return request()->routeIs('staff.*');
    }

    protected function view(string $page): string
    {
        return $this->isStaffRequest()
            ? 'Staff/' . $page
            : 'Admin/' . $page;
    }

    protected function routeName(string $name): string
    {
        return $this->isStaffRequest()
            ? 'staff.' . $name
            : 'admin.' . $name;
    }
}