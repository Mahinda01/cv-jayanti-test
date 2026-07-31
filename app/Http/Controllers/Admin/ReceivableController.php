<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\InitialReceivable;
use App\Models\ReceivablePayment;
use App\Models\Sale;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ReceivableController extends Controller
{
    public function index()
    {
        $receivables = collect();

        $sales = Sale::with('customer')
            ->where('payment_method', 'Kredit')
            ->where('transaction_status', '!=', 'Dibatalkan')
            ->orderBy('sale_date', 'desc')
            ->get();

        foreach ($sales as $sale) {
            $receivables->push($this->formatSaleReceivable($sale));
        }

        $initialReceivables = InitialReceivable::with('customer')
            ->orderBy('record_date', 'desc')
            ->get();

        foreach ($initialReceivables as $initial) {
            $receivables->push($this->formatInitialReceivable($initial));
        }

        $receivables = $receivables
            ->sortByDesc('sort_date')
            ->values();

        $customers = Customer::where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'contact' => $customer->contact,
                    'total_receivable' => $customer->total_receivable,
                    'total_receivable_text' => $this->formatRupiah($customer->total_receivable),
                    'receivable_status' => $customer->receivable_status,
                    'summary_url' => route('admin.receivables.summary', $customer->id),
                ];
            });

        return Inertia::render('Admin/Receivables/Index', [
            'receivables' => $receivables,
            'customers' => $customers,
            'summary' => [
                'total_receivable' => $this->formatRupiah($receivables->sum('remaining_amount')),
                'total_customer' => $customers->where('total_receivable', '>', 0)->count(),
                'total_overdue' => $receivables->where('status', 'Jatuh Tempo')->count(),
            ],
        ]);
    }

    public function createInitial()
    {
        $customers = Customer::where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'contact' => $customer->contact,
                    'address' => $customer->address,
                ];
            });

        return Inertia::render('Admin/Receivables/CreateInitial', [
            'customers' => $customers,
            'receivable_number' => $this->generateInitialReceivableNumber(),
        ]);
    }

    public function storeInitial(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'record_date' => ['required', 'date'],
            'due_date' => ['nullable', 'date'],
            'old_bon_number' => ['nullable', 'string', 'max:100'],
            'total_amount' => ['required', 'numeric', 'min:1'],
            'notes' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($validated) {
            $remainingAmount = $validated['total_amount'];

            InitialReceivable::create([
                'receivable_number' => $this->generateInitialReceivableNumber(),
                'customer_id' => $validated['customer_id'],
                'user_id' => auth()->id(),
                'record_date' => $validated['record_date'],
                'due_date' => $validated['due_date'] ?? null,
                'old_bon_number' => $validated['old_bon_number'] ?? null,
                'total_amount' => $validated['total_amount'],
                'paid_amount' => 0,
                'remaining_amount' => $remainingAmount,
                'status' => $this->getReceivableStatus($remainingAmount, $validated['due_date'] ?? null),
                'notes' => $validated['notes'] ?? null,
            ]);

            $this->recalculateCustomerReceivable($validated['customer_id']);
        });

        return redirect()
            ->route('admin.receivables.index')
            ->with('success', 'Piutang awal berhasil disimpan.');
    }

    public function showSale(Sale $sale)
    {
        $sale->load('customer');

        return Inertia::render('Admin/Receivables/Show', [
            'receivable' => $this->formatSaleReceivable($sale, true),
            'payments' => $this->formatPayments(
                ReceivablePayment::with(['user', 'canceller'])
                    ->where('sale_id', $sale->id)
                    ->orderBy('id', 'desc')
                    ->get()
            ),
        ]);
    }

    public function showInitial(InitialReceivable $initialReceivable)
    {
        $initialReceivable->load('customer');

        return Inertia::render('Admin/Receivables/Show', [
            'receivable' => $this->formatInitialReceivable($initialReceivable, true),
            'payments' => $this->formatPayments(
                ReceivablePayment::with(['user', 'canceller'])
                    ->where('initial_receivable_id', $initialReceivable->id)
                    ->orderBy('id', 'desc')
                    ->get()
            ),
        ]);
    }

    public function storePayment(Request $request)
    {
        $validated = $request->validate([
            'source_type' => ['required', 'in:sale,initial'],
            'source_id' => ['required', 'integer'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', 'in:Tunai,Transfer'],
            'amount' => ['required', 'numeric', 'min:1'],
            'notes' => ['nullable', 'string'],
        ]);

        if ($validated['source_type'] === 'sale') {
            return $this->storeSalePayment($validated);
        }

        return $this->storeInitialPayment($validated);
    }

    public function cancelPayment(Request $request, ReceivablePayment $payment)
    {
        $validated = $request->validate([
            'cancel_reason' => ['required', 'string', 'max:255'],
        ]);

        if ($payment->status === 'Dibatalkan') {
            return back()->with('error', 'Pembayaran sudah dibatalkan.');
        }

        DB::transaction(function () use ($payment, $validated) {
            $payment->update([
                'status' => 'Dibatalkan',
                'cancel_reason' => $validated['cancel_reason'],
                'cancelled_at' => now(),
                'cancelled_by' => auth()->id(),
            ]);

            if ($payment->sale_id) {
                $sale = Sale::findOrFail($payment->sale_id);

                $paidAmount = max(0, $sale->paid_amount - $payment->amount);
                $remainingAmount = min($sale->total_amount, $sale->remaining_amount + $payment->amount);

                $sale->update([
                    'paid_amount' => $paidAmount,
                    'remaining_amount' => $remainingAmount,
                    'payment_status' => $remainingAmount <= 0 ? 'Lunas' : 'Belum Lunas',
                ]);

                $this->recalculateCustomerReceivable($sale->customer_id);
            }

            if ($payment->initial_receivable_id) {
                $initial = InitialReceivable::findOrFail($payment->initial_receivable_id);

                $paidAmount = max(0, $initial->paid_amount - $payment->amount);
                $remainingAmount = min($initial->total_amount, $initial->remaining_amount + $payment->amount);

                $initial->update([
                    'paid_amount' => $paidAmount,
                    'remaining_amount' => $remainingAmount,
                    'status' => $this->getReceivableStatus($remainingAmount, $initial->due_date),
                ]);

                $this->recalculateCustomerReceivable($initial->customer_id);
            }
        });

        return back()->with('success', 'Pembayaran piutang berhasil dibatalkan.');
    }

    public function summary(Customer $customer)
    {
        $data = $this->getCustomerReceivableSummary($customer);

        return Inertia::render('Admin/Receivables/Summary', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'contact' => $customer->contact,
                'address' => $customer->address,
            ],
            'receivables' => $data['receivables'],
            'summary' => $data['summary'],
            'pdf_url' => route('admin.receivables.pdf', $customer->id),
            'whatsapp_url' => $this->makeWhatsappUrl($customer, $data['summary']['remaining_amount_text']),
        ]);
    }

    public function pdf(Customer $customer)
    {
        $data = $this->getCustomerReceivableSummary($customer);

        $pdf = Pdf::loadView('pdf.receivable-summary', [
            'customer' => $customer,
            'receivables' => $data['receivables'],
            'summary' => $data['summary'],
            'createdAt' => now()->format('d M Y H:i'),
            'logoPath' => public_path('images/logo/logo-cv-jayanti.png'),
        ])->setPaper('a4', 'portrait');

        $fileName = 'rincian-piutang-' . Str::slug($customer->name) . '.pdf';

        return $pdf->download($fileName);
    }

    private function storeSalePayment(array $validated)
    {
        $sale = Sale::with('customer')->findOrFail($validated['source_id']);

        if ($sale->remaining_amount <= 0) {
            return back()->with('error', 'Piutang ini sudah lunas.');
        }

        if ($validated['amount'] > $sale->remaining_amount) {
            return back()->with('error', 'Jumlah pembayaran melebihi sisa piutang.');
        }

        DB::transaction(function () use ($sale, $validated) {
            ReceivablePayment::create([
                'sale_id' => $sale->id,
                'initial_receivable_id' => null,
                'customer_id' => $sale->customer_id,
                'user_id' => auth()->id(),
                'payment_date' => $validated['payment_date'],
                'payment_method' => $validated['payment_method'],
                'amount' => $validated['amount'],
                'status' => 'Aktif',
                'notes' => $validated['notes'] ?? null,
            ]);

            $remainingAmount = max(0, $sale->remaining_amount - $validated['amount']);
            $paidAmount = $sale->paid_amount + $validated['amount'];

            $sale->update([
                'paid_amount' => $paidAmount,
                'remaining_amount' => $remainingAmount,
                'payment_status' => $remainingAmount <= 0 ? 'Lunas' : 'Belum Lunas',
            ]);

            $this->recalculateCustomerReceivable($sale->customer_id);
        });

        return redirect()
            ->route('admin.receivables.sale.show', $sale->id)
            ->with('success', 'Pembayaran piutang berhasil disimpan.');
    }

    private function storeInitialPayment(array $validated)
    {
        $initial = InitialReceivable::with('customer')->findOrFail($validated['source_id']);

        if ($initial->remaining_amount <= 0) {
            return back()->with('error', 'Piutang ini sudah lunas.');
        }

        if ($validated['amount'] > $initial->remaining_amount) {
            return back()->with('error', 'Jumlah pembayaran melebihi sisa piutang.');
        }

        DB::transaction(function () use ($initial, $validated) {
            ReceivablePayment::create([
                'sale_id' => null,
                'initial_receivable_id' => $initial->id,
                'customer_id' => $initial->customer_id,
                'user_id' => auth()->id(),
                'payment_date' => $validated['payment_date'],
                'payment_method' => $validated['payment_method'],
                'amount' => $validated['amount'],
                'status' => 'Aktif',
                'notes' => $validated['notes'] ?? null,
            ]);

            $remainingAmount = max(0, $initial->remaining_amount - $validated['amount']);
            $paidAmount = $initial->paid_amount + $validated['amount'];

            $initial->update([
                'paid_amount' => $paidAmount,
                'remaining_amount' => $remainingAmount,
                'status' => $this->getReceivableStatus($remainingAmount, $initial->due_date),
            ]);

            $this->recalculateCustomerReceivable($initial->customer_id);
        });

        return redirect()
            ->route('admin.receivables.initial.show', $initial->id)
            ->with('success', 'Pembayaran piutang berhasil disimpan.');
    }

    private function formatSaleReceivable(Sale $sale, bool $detail = false)
    {
        $status = $this->getReceivableStatus($sale->remaining_amount, $sale->due_date);

        return [
            'id' => $sale->id,
            'source_type' => 'sale',
            'source_label' => 'Penjualan Kredit',
            'number' => $sale->invoice_number,
            'customer_id' => $sale->customer_id,
            'customer_name' => $sale->customer?->name ?: '-',
            'customer_contact' => $sale->customer?->contact,
            'customer_address' => $sale->customer?->address,
            'transaction_date' => $this->formatDate($sale->sale_date),
            'due_date' => $this->formatDate($sale->due_date),
            'total_amount' => (float) $sale->total_amount,
            'paid_amount' => (float) $sale->paid_amount,
            'remaining_amount' => (float) $sale->remaining_amount,
            'total_amount_text' => $this->formatRupiah($sale->total_amount),
            'paid_amount_text' => $this->formatRupiah($sale->paid_amount),
            'remaining_amount_text' => $this->formatRupiah($sale->remaining_amount),
            'status' => $status,
            'notes' => $sale->notes,
            'sort_date' => $sale->sale_date,
            'detail_url' => route('admin.receivables.sale.show', $sale->id),
            'summary_url' => route('admin.receivables.summary', $sale->customer_id),
        ];
    }

    private function formatInitialReceivable(InitialReceivable $initial, bool $detail = false)
    {
        $status = $this->getReceivableStatus($initial->remaining_amount, $initial->due_date);

        return [
            'id' => $initial->id,
            'source_type' => 'initial',
            'source_label' => 'Piutang Awal',
            'number' => $initial->old_bon_number ?: $initial->receivable_number,
            'customer_id' => $initial->customer_id,
            'customer_name' => $initial->customer?->name ?: '-',
            'customer_contact' => $initial->customer?->contact,
            'customer_address' => $initial->customer?->address,
            'transaction_date' => $this->formatDate($initial->record_date),
            'due_date' => $this->formatDate($initial->due_date),
            'total_amount' => (float) $initial->total_amount,
            'paid_amount' => (float) $initial->paid_amount,
            'remaining_amount' => (float) $initial->remaining_amount,
            'total_amount_text' => $this->formatRupiah($initial->total_amount),
            'paid_amount_text' => $this->formatRupiah($initial->paid_amount),
            'remaining_amount_text' => $this->formatRupiah($initial->remaining_amount),
            'status' => $status,
            'notes' => $initial->notes,
            'sort_date' => $initial->record_date,
            'detail_url' => route('admin.receivables.initial.show', $initial->id),
            'summary_url' => route('admin.receivables.summary', $initial->customer_id),
        ];
    }

    private function formatPayments($payments)
    {
        return $payments->map(function ($payment) {
            return [
                'id' => $payment->id,
                'payment_date' => $this->formatDate($payment->payment_date),
                'payment_method' => $payment->payment_method,
                'amount' => (float) $payment->amount,
                'amount_text' => $this->formatRupiah($payment->amount),
                'status' => $payment->status ?: 'Aktif',
                'notes' => $payment->notes,
                'created_by' => $payment->user?->name ?: '-',
                'cancel_reason' => $payment->cancel_reason,
                'cancelled_at' => $payment->cancelled_at
                    ? $payment->cancelled_at->format('d M Y H:i')
                    : null,
                'cancelled_by' => $payment->canceller?->name,
                'cancel_url' => route('admin.receivables.payments.cancel', $payment->id),
            ];
        });
    }

    private function getCustomerReceivableSummary(Customer $customer)
    {
        $items = collect();

        $sales = Sale::with('customer')
            ->where('customer_id', $customer->id)
            ->where('payment_method', 'Kredit')
            ->where('transaction_status', '!=', 'Dibatalkan')
            ->where('remaining_amount', '>', 0)
            ->orderBy('sale_date')
            ->get();

        foreach ($sales as $sale) {
            $items->push($this->formatSaleReceivable($sale));
        }

        $initials = InitialReceivable::with('customer')
            ->where('customer_id', $customer->id)
            ->where('remaining_amount', '>', 0)
            ->orderBy('record_date')
            ->get();

        foreach ($initials as $initial) {
            $items->push($this->formatInitialReceivable($initial));
        }

        $items = $items->sortBy('sort_date')->values();

        $totalAmount = $items->sum('total_amount');
        $paidAmount = $items->sum('paid_amount');
        $remainingAmount = $items->sum('remaining_amount');

        return [
            'receivables' => $items,
            'summary' => [
                'total_amount' => $totalAmount,
                'paid_amount' => $paidAmount,
                'remaining_amount' => $remainingAmount,
                'active_count' => $items->count(),
                'total_amount_text' => $this->formatRupiah($totalAmount),
                'paid_amount_text' => $this->formatRupiah($paidAmount),
                'remaining_amount_text' => $this->formatRupiah($remainingAmount),
                'status' => $remainingAmount <= 0
                    ? 'Lunas'
                    : ($items->where('status', 'Jatuh Tempo')->count() > 0 ? 'Jatuh Tempo' : 'Belum Lunas'),
            ],
        ];
    }

    private function recalculateCustomerReceivable($customerId)
    {
        $saleRemaining = Sale::where('customer_id', $customerId)
            ->where('payment_method', 'Kredit')
            ->where('transaction_status', '!=', 'Dibatalkan')
            ->sum('remaining_amount');

        $initialRemaining = InitialReceivable::where('customer_id', $customerId)
            ->sum('remaining_amount');

        $totalReceivable = $saleRemaining + $initialRemaining;

        $hasOverdueSale = Sale::where('customer_id', $customerId)
            ->where('payment_method', 'Kredit')
            ->where('transaction_status', '!=', 'Dibatalkan')
            ->where('remaining_amount', '>', 0)
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', today())
            ->exists();

        $hasOverdueInitial = InitialReceivable::where('customer_id', $customerId)
            ->where('remaining_amount', '>', 0)
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', today())
            ->exists();

        $status = 'Lunas';

        if ($totalReceivable > 0) {
            $status = ($hasOverdueSale || $hasOverdueInitial)
                ? 'Jatuh Tempo'
                : 'Belum Lunas';
        }

        Customer::where('id', $customerId)->update([
            'total_receivable' => $totalReceivable,
            'receivable_status' => $status,
        ]);
    }

    private function getReceivableStatus($remainingAmount, $dueDate = null)
    {
        if ($remainingAmount <= 0) {
            return 'Lunas';
        }

        if ($dueDate && Carbon::parse($dueDate)->isPast()) {
            return 'Jatuh Tempo';
        }

        return 'Belum Lunas';
    }

    private function generateInitialReceivableNumber()
    {
        $prefix = 'PA-' . now()->format('Ymd') . '-';

        $last = InitialReceivable::where('receivable_number', 'like', $prefix . '%')
            ->orderBy('id', 'desc')
            ->first();

        $number = $last ? ((int) substr($last->receivable_number, -4)) + 1 : 1;

        return $prefix . str_pad($number, 4, '0', STR_PAD_LEFT);
    }

    private function makeWhatsappUrl(Customer $customer, $remainingAmountText)
    {
        if (! $customer->contact) {
            return null;
        }

        $phone = preg_replace('/\D/', '', $customer->contact);

        if ($phone === '') {
            return null;
        }

        if (Str::startsWith($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        } elseif (Str::startsWith($phone, '8')) {
            $phone = '62' . $phone;
        }

        $message = "Halo Bapak/Ibu {$customer->name}, kami dari CV Jayanti Muliatama ingin menyampaikan rincian piutang terbaru. Total sisa piutang saat ini adalah {$remainingAmountText}. PDF rincian piutang akan kami lampirkan pada pesan ini. Terima kasih.";

        return 'https://wa.me/' . $phone . '?text=' . rawurlencode($message);
    }

    private function formatDate($date)
    {
        if (! $date) {
            return '-';
        }

        return Carbon::parse($date)->format('d M Y');
    }

    private function formatRupiah($value)
    {
        return 'Rp ' . number_format($value ?? 0, 0, ',', '.');
    }
}