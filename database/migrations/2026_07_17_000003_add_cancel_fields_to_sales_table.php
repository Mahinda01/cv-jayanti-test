<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->string('transaction_status')->default('Aktif')->after('payment_status');
            $table->timestamp('cancelled_at')->nullable()->after('transaction_status');
            $table->foreignId('cancelled_by')->nullable()->after('cancelled_at')->constrained('users')->nullOnDelete();
            $table->text('cancel_reason')->nullable()->after('cancelled_by');
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropForeign(['cancelled_by']);
            $table->dropColumn([
                'transaction_status',
                'cancelled_at',
                'cancelled_by',
                'cancel_reason',
            ]);
        });
    }
};