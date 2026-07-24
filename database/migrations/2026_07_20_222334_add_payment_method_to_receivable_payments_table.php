<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('receivable_payments', 'payment_method')) {
            Schema::table('receivable_payments', function (Blueprint $table) {
                $table->string('payment_method', 20)->default('Tunai')->after('payment_date');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('receivable_payments', 'payment_method')) {
            Schema::table('receivable_payments', function (Blueprint $table) {
                $table->dropColumn('payment_method');
            });
        }
    }
};