<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_main_admin')
                ->default(false)
                ->after('role');
        });

        $mainAdminId = DB::table('users')
            ->where('username', 'admin')
            ->value('id');

        if (! $mainAdminId) {
            $mainAdminId = DB::table('users')
                ->where('role', 'admin')
                ->orderBy('id')
                ->value('id');
        }

        if ($mainAdminId) {
            DB::table('users')
                ->where('id', $mainAdminId)
                ->update([
                    'role' => 'admin',
                    'is_active' => true,
                    'is_main_admin' => true,
                ]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_main_admin');
        });
    }
};