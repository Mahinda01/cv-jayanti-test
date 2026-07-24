<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\ReceivablePayment;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ReceivableController extends Controller
{
    public function index()
    {
        $receivables = Sale::with(['customer', 'user'])
            ->where('transaction_status', 'Aktif')
            ->where('remaining_amount', '>', 0)
            ->orderByRaw('due_date IS NULL')
            ->orderBy('due_date', 'asc')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($sale) {
                $isOverdue = $sale->due_date
                    && strtotime($sale->due_date) < strtotime(now()->toDateString());

                return [
                    'id' => $sale->id,
                    'invoice_number' => $sale->invoice_number,
                    'customer_id' => $sale->customer_id,
                    'customer_code' => $sale->customer
                        ? 'C' . str_pad($sale->customer->id, 3, '0', STR_PAD_LEFT)
                        : '-',
                    'customer_name' => $sale->customer?->name ?? '-',
                    'customer_contact' => $sale->customer?->contact ?? '-',
                    'sale_date' => date('d M Y', strtotime($sale->sale_date)),
                    'sale_date_raw' => date('Y-m-d', strtotime($sale->sale_date)),
                    'due_date' => $sale->due_date
                        ? date('d M Y', strtotime($sale->due_date))
                        : '-',
                    'due_date_raw' => $sale->due_date
                        ? date('Y-m-d', strtotime($sale->due_date))
                        : null,
                    'total_amount' => $sale->total_amount,
                    'total_amount_text' => 'Rp ' . number_format($sale->total_amount, 0, ',', '.'),
                    'paid_amount' => $sale->paid_amount,
                    'paid_amount_text' => 'Rp ' . number_format($sale->paid_amount, 0, ',', '.'),
                    'remaining_amount' => $sale->remaining_amount,
                    'remaining_amount_text' => 'Rp ' . number_format($sale->remaining_amount, 0, ',', '.'),
                    'receivable_status' => $isOverdue ? 'Jatuh Tempo' : 'Belum Lunas',
                    'created_by' => $sale->user?->name ?? '-',
                ];
            });

        $payments = ReceivablePayment::with(['sale', 'customer', 'user'])
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'invoice_number' => $payment->sale?->invoice_number ?? '-',
                    'customer_name' => $payment->customer?->name ?? '-',
                    'payment_date' => date('d M Y', strtotime($payment->payment_date)),
                    'payment_date_raw' => date('Y-m-d', strtotime($payment->payment_date)),
                    'payment_method' => $payment->payment_method ?? 'Tunai',
                    'amount' => $payment->amount,
                    'amount_text' => 'Rp ' . number_format($payment->amount, 0, ',', '.'),
                    'notes' => $payment->notes,
                    'user_name' => $payment->user?->name ?? '-',
                    'created_at' => $payment->created_at->format('d M Y'),
                ];
            });

        return Inertia::render('Admin/Receivables/Index', [
            'receivables' => $receivables,
            'payments' => $payments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sale_id' => ['required', 'exists:sales,id'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', 'in:Tunai,Transfer'],
            'amount' => ['required', 'numeric', 'min:1'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($validated) {
            $sale = Sale::with('customer')
                ->where('id', $validated['sale_id'])
                ->lockForUpdate()
                ->firstOrFail();

            if ($sale->transaction_status === 'Dibatalkan') {
                throw ValidationException::withMessages([
                    'sale_id' => 'Transaksi yang sudah dibatalkan tidak bisa dibayar.',
                ]);
            }

            if ($sale->remaining_amount <= 0) {
                throw ValidationException::withMessages([
                    'sale_id' => 'Piutang transaksi ini sudah lunas.',
                ]);
            }

            if ($validated['amount'] > $sale->remaining_amount) {
                throw ValidationException::withMessages([
                    'amount' => 'Jumlah pembayaran tidak boleh lebih besar dari sisa piutang.',
                ]);
            }

            $customer = Customer::where('id', $sale->customer_id)
                ->lockForUpdate()
                ->firstOrFail();

            ReceivablePayment::create([
                'sale_id' => $sale->id,
                'customer_id' => $customer->id,
                'user_id' => Auth::id(),
                'payment_date' => $validated['payment_date'],
                'payment_method' => $validated['payment_method'],
                'amount' => $validated['amount'],
                'notes' => $validated['notes'] ?? null,
            ]);

            $newPaidAmount = $sale->paid_amount + $validated['amount'];
            $newRemainingAmount = max(0, $sale->remaining_amount - $validated['amount']);

            $sale->update([
                'paid_amount' => $newPaidAmount,
                'remaining_amount' => $newRemainingAmount,
                'payment_status' => $newRemainingAmount > 0 ? 'Belum Lunas' : 'Lunas',
            ]);

            $this->syncCustomerReceivable($customer);
        });

        return redirect()
            ->route('admin.receivables.index')
            ->with('success', 'Pembayaran piutang berhasil disimpan.');
    }

    public function updateDueDate(Request $request, $id)
    {
        $validated = $request->validate([
            'due_date' => ['required', 'date'],
        ]);

        DB::transaction(function () use ($validated, $id) {
            $sale = Sale::with('customer')
                ->where('id', $id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($sale->transaction_status === 'Dibatalkan') {
                throw ValidationException::withMessages([
                    'due_date' => 'Tanggal jatuh tempo tidak bisa diubah karena transaksi sudah dibatalkan.',
                ]);
            }

            if ($sale->remaining_amount <= 0) {
                throw ValidationException::withMessages([
                    'due_date' => 'Tanggal jatuh tempo tidak bisa diubah karena piutang sudah lunas.',
                ]);
            }

            if (strtotime($validated['due_date']) < strtotime($sale->sale_date)) {
                throw ValidationException::withMessages([
                    'due_date' => 'Tanggal jatuh tempo tidak boleh lebih awal dari tanggal transaksi.',
                ]);
            }

            $sale->update([
                'due_date' => $validated['due_date'],
            ]);

            if ($sale->customer) {
                $this->syncCustomerReceivable($sale->customer);
            }
        });

        return redirect()
            ->route('admin.receivables.index')
            ->with('success', 'Tanggal jatuh tempo berhasil diperbarui.');
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
}