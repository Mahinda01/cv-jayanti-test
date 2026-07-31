<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $isStaff = $this->isStaffRequest();

        $customers = Customer::orderBy('id')
            ->get()
            ->map(function ($customer) use ($isStaff) {
                $data = [
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
                    'is_active' => (bool) $customer->is_active,
                ];

                if (! $isStaff) {
                    $totalReceivable = (float) $customer->total_receivable;

                    $data['total_receivable'] = $totalReceivable;
                    $data['total_receivable_text'] =
                        'Rp ' . number_format(
                            $totalReceivable,
                            0,
                            ',',
                            '.'
                        );

                    $data['receivable_status'] =
                        $totalReceivable > 0
                            ? $customer->receivable_status
                            : 'Tidak Ada Piutang';
                }

                return $data;
            });

        return Inertia::render($this->view('Customers/Index'), [
            'customers' => $customers,
            'showReceivable' => ! $isStaff,
        ]);
    }

    public function create()
    {
        return Inertia::render($this->view('Customers/Create'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
            ],
            'contact' => [
                'required',
                'string',
                'max:30',
            ],
            'address' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $address = trim($validated['address'] ?? '');

        Customer::create([
            'name' => trim($validated['name']),
            'contact' => trim($validated['contact']),
            'address' => $address !== '' ? $address : null,
            'total_receivable' => 0,
            'receivable_status' => 'Tidak Ada Piutang',
            'is_active' => true,
        ]);

        return redirect()
            ->route($this->routeName('customers.index'))
            ->with(
                'success',
                'Data pelanggan berhasil ditambahkan.'
            );
    }

    public function edit($id)
    {
        $customer = Customer::findOrFail($id);
        $isStaff = $this->isStaffRequest();

        $data = [
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
            'is_active' => (bool) $customer->is_active,
        ];

        if (! $isStaff) {
            $totalReceivable = (float) $customer->total_receivable;

            $data['total_receivable'] = $totalReceivable;
            $data['total_receivable_text'] =
                'Rp ' . number_format(
                    $totalReceivable,
                    0,
                    ',',
                    '.'
                );

            $data['receivable_status'] =
                $totalReceivable > 0
                    ? $customer->receivable_status
                    : 'Tidak Ada Piutang';
        }

        return Inertia::render($this->view('Customers/Edit'), [
            'customer' => $data,
            'showReceivable' => ! $isStaff,
        ]);
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:100',
            ],
            'contact' => [
                'required',
                'string',
                'max:30',
            ],
            'address' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        $address = trim($validated['address'] ?? '');

        $customer->update([
            'name' => trim($validated['name']),
            'contact' => trim($validated['contact']),
            'address' => $address !== '' ? $address : null,
        ]);

        return redirect()
            ->route($this->routeName('customers.index'))
            ->with(
                'success',
                'Data pelanggan berhasil diperbarui.'
            );
    }

    public function toggleStatus($id)
    {
        $customer = Customer::findOrFail($id);

        if (
            $customer->is_active &&
            (float) $customer->total_receivable > 0
        ) {
            return redirect()
                ->route($this->routeName('customers.index'))
                ->with(
                    'error',
                    'Pelanggan tidak dapat dinonaktifkan karena masih memiliki piutang.'
                );
        }

        $customer->update([
            'is_active' => ! $customer->is_active,
        ]);

        $message = $customer->is_active
            ? 'Pelanggan berhasil diaktifkan.'
            : 'Pelanggan berhasil dinonaktifkan.';

        return redirect()
            ->route($this->routeName('customers.index'))
            ->with('success', $message);
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