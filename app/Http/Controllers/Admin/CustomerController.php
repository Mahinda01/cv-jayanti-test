<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::orderBy('id')
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'code' => 'C' . str_pad($customer->id, 3, '0', STR_PAD_LEFT),
                    'name' => $customer->name,
                    'contact' => $customer->contact,
                    'address' => $customer->address,
                    'total_receivable' => $customer->total_receivable,
                    'total_receivable_text' => 'Rp ' . number_format($customer->total_receivable, 0, ',', '.'),
                    'receivable_status' => $customer->receivable_status,
                    'is_active' => $customer->is_active,
                ];
            });

        return Inertia::render($this->view('Customers/Index'), [
            'customers' => $customers,
        ]);
    }

    public function create()
    {
        return Inertia::render($this->view('Customers/Create'));
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => ['required', 'string', 'max:100'],
            'contact' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ];

        if (! request()->routeIs('staff.*')) {
            $rules['total_receivable'] = ['nullable', 'numeric', 'min:0'];
            $rules['receivable_status'] = [
                'nullable',
                Rule::in(['Tidak Ada Piutang', 'Belum Lunas', 'Jatuh Tempo']),
            ];
        }

        $validated = $request->validate($rules);

        if (request()->routeIs('staff.*')) {
            $validated['total_receivable'] = 0;
            $validated['receivable_status'] = 'Tidak Ada Piutang';
        } else {
            $validated['total_receivable'] = $validated['total_receivable'] ?? 0;

            if ($validated['total_receivable'] <= 0) {
                $validated['receivable_status'] = 'Tidak Ada Piutang';
            } else {
                $validated['receivable_status'] = $validated['receivable_status'] ?? 'Belum Lunas';
            }
        }

        $validated['is_active'] = $request->boolean('is_active', true);

        Customer::create($validated);

        return redirect()
            ->route($this->routeName('customers.index'))
            ->with('success', 'Data pelanggan berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $customer = Customer::findOrFail($id);

        return Inertia::render($this->view('Customers/Edit'), [
            'customer' => [
                'id' => $customer->id,
                'code' => 'C' . str_pad($customer->id, 3, '0', STR_PAD_LEFT),
                'name' => $customer->name,
                'contact' => $customer->contact,
                'address' => $customer->address,
                'total_receivable' => $customer->total_receivable,
                'receivable_status' => $customer->receivable_status,
                'is_active' => $customer->is_active,
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $rules = [
            'name' => ['required', 'string', 'max:100'],
            'contact' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ];

        if (! request()->routeIs('staff.*')) {
            $rules['total_receivable'] = ['nullable', 'numeric', 'min:0'];
            $rules['receivable_status'] = [
                'nullable',
                Rule::in(['Tidak Ada Piutang', 'Belum Lunas', 'Jatuh Tempo']),
            ];
        }

        $validated = $request->validate($rules);

        if (request()->routeIs('staff.*')) {
            $validated['total_receivable'] = $customer->total_receivable;
            $validated['receivable_status'] = $customer->receivable_status;
        } else {
            $validated['total_receivable'] = $validated['total_receivable'] ?? 0;

            if ($validated['total_receivable'] <= 0) {
                $validated['receivable_status'] = 'Tidak Ada Piutang';
            } else {
                $validated['receivable_status'] = $validated['receivable_status'] ?? 'Belum Lunas';
            }
        }

        $validated['is_active'] = $request->boolean('is_active', true);

        $customer->update($validated);

        return redirect()
            ->route($this->routeName('customers.index'))
            ->with('success', 'Data pelanggan berhasil diperbarui.');
    }

    public function toggleStatus($id)
    {
        $customer = Customer::findOrFail($id);

        $customer->update([
            'is_active' => ! $customer->is_active,
        ]);

        return redirect()
            ->route($this->routeName('customers.index'))
            ->with('success', 'Status pelanggan berhasil diperbarui.');
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