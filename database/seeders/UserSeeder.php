<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $mainAdmin = User::query()
            ->where('is_main_admin', true)
            ->first();

        if (! $mainAdmin) {
            $mainAdmin = User::query()
                ->where('username', 'admin')
                ->first();
        }

        if (! $mainAdmin) {
            $mainAdmin = User::query()
                ->where('role', 'admin')
                ->orderBy('id')
                ->first();
        }

        if ($mainAdmin) {
            $mainAdmin->forceFill([
                'role' => 'admin',
                'is_main_admin' => true,
                'is_active' => true,
            ])->save();
        } else {
            $mainAdmin = User::create([
                'name' => 'Administrator',
                'username' => 'admin',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'is_main_admin' => true,
                'is_active' => true,
            ]);
        }

        User::query()
            ->where('id', '!=', $mainAdmin->id)
            ->where('is_main_admin', true)
            ->update([
                'is_main_admin' => false,
            ]);

        User::updateOrCreate(
            [
                'username' => 'staff',
            ],
            [
                'name' => 'Staff Operasional',
                'password' => Hash::make('staff123'),
                'role' => 'staff',
                'is_main_admin' => false,
                'is_active' => true,
            ]
        );
    }
}