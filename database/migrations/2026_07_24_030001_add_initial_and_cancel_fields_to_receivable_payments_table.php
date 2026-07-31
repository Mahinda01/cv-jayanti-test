<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('receivable_payments', function (Blueprint $table) {
            if (! Schema::hasColumn('receivable_payments', 'initial_receivable_id')) {
                $table->foreignId('initial_receivable_id')
                    ->nullable()
                    ->after('sale_id')
                    ->constrained('initial_receivables')
                    ->cascadeOnDelete();
            }

            if (! Schema::hasColumn('receivable_payments', 'status')) {
                $table->string('status')->default('Aktif')->after('amount');
            }

            if (! Schema::hasColumn('receivable_payments', 'cancel_reason')) {
                $table->text('cancel_reason')->nullable()->after('notes');
            }

            if (! Schema::hasColumn('receivable_payments', 'cancelled_at')) {
                $table->timestamp('cancelled_at')->nullable()->after('cancel_reason');
            }

            if (! Schema::hasColumn('receivable_payments', 'cancelled_by')) {
                $table->foreignId('cancelled_by')
                    ->nullable()
                    ->after('cancelled_at')
                    ->constrained('users')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('receivable_payments', function (Blueprint $table) {
            if (Schema::hasColumn('receivable_payments', 'cancelled_by')) {
                $table->dropConstrainedForeignId('cancelled_by');
            }

            if (Schema::hasColumn('receivable_payments', 'cancelled_at')) {
                $table->dropColumn('cancelled_at');
            }

            if (Schema::hasColumn('receivable_payments', 'cancel_reason')) {
                $table->dropColumn('cancel_reason');
            }

            if (Schema::hasColumn('receivable_payments', 'status')) {
                $table->dropColumn('status');
            }

            if (Schema::hasColumn('receivable_payments', 'initial_receivable_id')) {
                $table->dropConstrainedForeignId('initial_receivable_id');
            }
        });
    }
};