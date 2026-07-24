<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    private const MAIN_ACCOUNT_ID = 1;

    public function index()
    {
        $users = User::orderBy('id', 'asc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'code' => 'U' . str_pad($user->id, 3, '0', STR_PAD_LEFT),
                    'name' => $user->name,
                    'username' => $user->username,
                    'role' => $user->role,
                    'role_label' => $user->role === 'admin' ? 'Admin' : 'Staff',
                    'is_active' => $user->is_active,
                    'is_main_account' => $user->id === self::MAIN_ACCOUNT_ID,
                    'created_at' => $user->created_at->format('d M Y'),
                ];
            });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'username' => ['required', 'string', 'max:100', 'unique:users,username'],
            'role' => ['required', Rule::in(['admin', 'staff'])],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'is_active' => ['required', 'boolean'],
        ]);

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'role' => $validated['role'],
            'password' => $validated['password'],
            'is_active' => $validated['is_active'],
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Akun berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);

        return Inertia::render('Admin/Users/Edit', [
            'userData' => [
                'id' => $user->id,
                'code' => 'U' . str_pad($user->id, 3, '0', STR_PAD_LEFT),
                'name' => $user->name,
                'username' => $user->username,
                'role' => $user->role,
                'is_active' => $user->is_active,
                'is_main_account' => $this->isMainAccount($user),
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'username' => [
                'required',
                'string',
                'max:100',
                Rule::unique('users', 'username')->ignore($user->id),
            ],
            'role' => ['required', Rule::in(['admin', 'staff'])],
            'password' => ['nullable', 'string', 'min:6', 'confirmed'],
            'is_active' => ['required', 'boolean'],
        ]);

        if ($this->isMainAccount($user)) {
            $data = [
                'name' => $validated['name'],
                'username' => $validated['username'],
                'role' => 'admin',
                'is_active' => true,
            ];

            if (! empty($validated['password'])) {
                $data['password'] = $validated['password'];
            }

            $user->update($data);

            return redirect()
                ->route('admin.users.index')
                ->with('success', 'Akun utama berhasil diperbarui.');
        }

        if ($user->id === Auth::id() && $validated['is_active'] === false) {
            return redirect()
                ->route('admin.users.index')
                ->with('success', 'Akun yang sedang digunakan tidak boleh dinonaktifkan.');
        }

        if ($user->id === Auth::id() && $user->role !== $validated['role']) {
            return redirect()
                ->route('admin.users.index')
                ->with('success', 'Role akun yang sedang digunakan tidak boleh diubah.');
        }

        if ($this->willRemoveLastActiveAdmin($user, $validated['role'], $validated['is_active'])) {
            return redirect()
                ->route('admin.users.index')
                ->with('success', 'Minimal harus ada satu akun admin aktif di sistem.');
        }

        $data = [
            'name' => $validated['name'],
            'username' => $validated['username'],
            'role' => $validated['role'],
            'is_active' => $validated['is_active'],
        ];

        if (! empty($validated['password'])) {
            $data['password'] = $validated['password'];
        }

        $user->update($data);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Akun berhasil diperbarui.');
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);

        if ($this->isMainAccount($user)) {
            return redirect()
                ->route('admin.users.index')
                ->with('success', 'Akun utama tidak dapat dinonaktifkan.');
        }

        if ($user->id === Auth::id()) {
            return redirect()
                ->route('admin.users.index')
                ->with('success', 'Akun yang sedang digunakan tidak boleh dinonaktifkan.');
        }

        if ($user->role === 'admin' && $user->is_active && $this->activeAdminCount() <= 1) {
            return redirect()
                ->route('admin.users.index')
                ->with('success', 'Minimal harus ada satu akun admin aktif di sistem.');
        }

        $user->update([
            'is_active' => ! $user->is_active,
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Status akun berhasil diperbarui.');
    }

    private function isMainAccount(User $user): bool
    {
        return $user->id === self::MAIN_ACCOUNT_ID;
    }

    private function activeAdminCount(): int
    {
        return User::where('role', 'admin')
            ->where('is_active', true)
            ->count();
    }

    private function willRemoveLastActiveAdmin(User $user, string $newRole, bool $newStatus): bool
    {
        $isActiveAdminNow = $user->role === 'admin' && $user->is_active;
        $willNoLongerBeActiveAdmin = $newRole !== 'admin' || $newStatus === false;

        if (! $isActiveAdminNow || ! $willNoLongerBeActiveAdmin) {
            return false;
        }

        $otherActiveAdmins = User::where('role', 'admin')
            ->where('is_active', true)
            ->where('id', '!=', $user->id)
            ->count();

        return $otherActiveAdmins === 0;
    }
}