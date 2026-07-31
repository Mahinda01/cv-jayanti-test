<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $loggedInUser = $request->user();

        $users = User::query()
            ->orderBy('id')
            ->get()
            ->map(function (User $user) use ($loggedInUser) {
                return [
                    'id' => $user->id,
                    'code' => 'U' . str_pad($user->id, 3, '0', STR_PAD_LEFT),
                    'name' => $user->name,
                    'username' => $user->username,
                    'role' => $user->role,
                    'role_label' => $user->role === 'admin'
                        ? 'Admin'
                        : 'Staff',
                    'is_active' => (bool) $user->is_active,
                    'is_main_account' => $this->isMainAdmin($user),
                    'is_current_user' => $user->id === $loggedInUser->id,
                    'can_edit' => $this->canEditAccount(
                        $loggedInUser,
                        $user
                    ),
                    'can_toggle_status' => $this->canManageStatus(
                        $loggedInUser,
                        $user
                    ),
                    'created_at' => $user->created_at->format('d M Y'),
                ];
            });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'permissions' => [
                'is_main_admin' => $this->isMainAdmin($loggedInUser),
                'can_create_admin' => $this->isMainAdmin($loggedInUser),
            ],
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Admin/Users/Create', [
            'canCreateAdmin' => $this->isMainAdmin($request->user()),
        ]);
    }

    public function store(Request $request)
    {
        $loggedInUser = $request->user();

        $allowedRoles = $this->isMainAdmin($loggedInUser)
            ? ['admin', 'staff']
            : ['staff'];

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:150',
            ],
            'username' => [
                'required',
                'string',
                'max:100',
                'unique:users,username',
            ],
            'role' => [
                'required',
                Rule::in($allowedRoles),
            ],
            'password' => [
                'required',
                'string',
                'min:6',
                'confirmed',
            ],
        ], [
            'role.in' => 'Anda hanya dapat membuat akun Staff.',
        ]);

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'role' => $validated['role'],
            'password' => $validated['password'],
            'is_main_admin' => false,
            'is_active' => true,
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Akun berhasil ditambahkan.');
    }

    public function edit(Request $request, $id)
    {
        $loggedInUser = $request->user();
        $user = User::findOrFail($id);

        if (! $this->canEditAccount($loggedInUser, $user)) {
            abort(
                403,
                'Anda tidak memiliki akses untuk mengubah akun ini.'
            );
        }

        return Inertia::render('Admin/Users/Edit', [
            'userData' => [
                'id' => $user->id,
                'code' => 'U' . str_pad($user->id, 3, '0', STR_PAD_LEFT),
                'name' => $user->name,
                'username' => $user->username,
                'role' => $user->role,
                'role_label' => $user->role === 'admin'
                    ? 'Admin'
                    : 'Staff',
                'is_main_account' => $this->isMainAdmin($user),
            ],
            'permissions' => [
                'is_self' => $loggedInUser->id === $user->id,
                'can_manage_role' => $this->canManageRole(
                    $loggedInUser,
                    $user
                ),
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $loggedInUser = $request->user();
        $user = User::findOrFail($id);

        if (! $this->canEditAccount($loggedInUser, $user)) {
            abort(
                403,
                'Anda tidak memiliki akses untuk mengubah akun ini.'
            );
        }

        $canManageRole = $this->canManageRole(
            $loggedInUser,
            $user
        );

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:150',
            ],
            'username' => [
                'required',
                'string',
                'max:100',
                Rule::unique('users', 'username')
                    ->ignore($user->id),
            ],
            'role' => [
                'required',
                Rule::in(['admin', 'staff']),
            ],
            'password' => [
                'nullable',
                'string',
                'min:6',
                'confirmed',
            ],
        ]);

        if (
            ! $canManageRole &&
            $validated['role'] !== $user->role
        ) {
            return back()->withErrors([
                'role' => 'Anda tidak memiliki izin untuk mengubah role akun ini.',
            ]);
        }

        $newRole = $canManageRole
            ? $validated['role']
            : $user->role;

        if ($this->isMainAdmin($user)) {
            $newRole = 'admin';
        }

        if (
            $this->willRemoveLastActiveAdmin(
                $user,
                $newRole,
                (bool) $user->is_active
            )
        ) {
            return back()->withErrors([
                'role' => 'Minimal harus tersedia satu akun Admin yang aktif.',
            ]);
        }

        $data = [
            'name' => $validated['name'],
            'username' => $validated['username'],
            'role' => $newRole,
        ];

        if (! empty($validated['password'])) {
            $data['password'] = $validated['password'];
        }

        $user->update($data);

        if ($this->isMainAdmin($user)) {
            $message = 'Akun utama berhasil diperbarui.';
        } elseif ($user->id === $loggedInUser->id) {
            $message = 'Profil akun berhasil diperbarui.';
        } else {
            $message = 'Akun berhasil diperbarui.';
        }

        return redirect()
            ->route('admin.users.index')
            ->with('success', $message);
    }

    public function toggleStatus(Request $request, $id)
    {
        $loggedInUser = $request->user();
        $user = User::findOrFail($id);

        if (! $this->canManageStatus($loggedInUser, $user)) {
            return redirect()
                ->route('admin.users.index')
                ->with(
                    'error',
                    'Anda tidak memiliki izin untuk mengubah status akun tersebut.'
                );
        }

        $newStatus = ! $user->is_active;

        if (
            $this->willRemoveLastActiveAdmin(
                $user,
                $user->role,
                $newStatus
            )
        ) {
            return redirect()
                ->route('admin.users.index')
                ->with(
                    'error',
                    'Minimal harus tersedia satu akun Admin yang aktif.'
                );
        }

        $user->update([
            'is_active' => $newStatus,
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Status akun berhasil diperbarui.');
    }

    private function isMainAdmin(User $user): bool
    {
        return $user->role === 'admin' &&
            (bool) $user->is_main_admin;
    }

    private function canEditAccount(
        User $loggedInUser,
        User $targetUser
    ): bool {
        if ($this->isMainAdmin($loggedInUser)) {
            return true;
        }

        if ($this->isMainAdmin($targetUser)) {
            return false;
        }

        if ($loggedInUser->id === $targetUser->id) {
            return true;
        }

        return $targetUser->role === 'staff';
    }

    private function canManageRole(
        User $loggedInUser,
        User $targetUser
    ): bool {
        if ($loggedInUser->id === $targetUser->id) {
            return false;
        }

        if ($this->isMainAdmin($targetUser)) {
            return false;
        }

        return $this->isMainAdmin($loggedInUser);
    }

    private function canManageStatus(
        User $loggedInUser,
        User $targetUser
    ): bool {
        if ($loggedInUser->id === $targetUser->id) {
            return false;
        }

        if ($this->isMainAdmin($targetUser)) {
            return false;
        }

        if ($this->isMainAdmin($loggedInUser)) {
            return true;
        }

        return $targetUser->role === 'staff';
    }

    private function willRemoveLastActiveAdmin(
        User $user,
        string $newRole,
        bool $newStatus
    ): bool {
        $isActiveAdminNow =
            $user->role === 'admin' &&
            $user->is_active;

        $willNoLongerBeActiveAdmin =
            $newRole !== 'admin' ||
            $newStatus === false;

        if (
            ! $isActiveAdminNow ||
            ! $willNoLongerBeActiveAdmin
        ) {
            return false;
        }

        $otherActiveAdmins = User::query()
            ->where('role', 'admin')
            ->where('is_active', true)
            ->where('id', '!=', $user->id)
            ->count();

        return $otherActiveAdmins === 0;
    }
}