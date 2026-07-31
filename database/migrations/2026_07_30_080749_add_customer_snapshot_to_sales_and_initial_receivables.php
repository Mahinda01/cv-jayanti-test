<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->string('customer_name')->nullable()->after('customer_id');
            $table->string('customer_contact')->nullable()->after('customer_name');
            $table->text('customer_address')->nullable()->after('customer_contact');
        });

        Schema::table('initial_receivables', function (Blueprint $table) {
            $table->string('customer_name')->nullable()->after('customer_id');
            $table->string('customer_contact')->nullable()->after('customer_name');
            $table->text('customer_address')->nullable()->after('customer_contact');
        });

        DB::table('sales')
            ->orderBy('id')
            ->chunkById(100, function ($sales) {
                foreach ($sales as $sale) {
                    if (! $sale->customer_id) {
                        DB::table('sales')
                            ->where('id', $sale->id)
                            ->update([
                                'customer_name' => 'Umum',
                            ]);

                        continue;
                    }

                    $customer = DB::table('customers')
                        ->where('id', $sale->customer_id)
                        ->first();

                    if ($customer) {
                        DB::table('sales')
                            ->where('id', $sale->id)
                            ->update([
                                'customer_name' => $customer->name,
                                'customer_contact' => $customer->contact,
                                'customer_address' => $customer->address,
                            ]);
                    }
                }
            });

        DB::table('initial_receivables')
            ->orderBy('id')
            ->chunkById(100, function ($receivables) {
                foreach ($receivables as $receivable) {
                    $customer = DB::table('customers')
                        ->where('id', $receivable->customer_id)
                        ->first();

                    if ($customer) {
                        DB::table('initial_receivables')
                            ->where('id', $receivable->id)
                            ->update([
                                'customer_name' => $customer->name,
                                'customer_contact' => $customer->contact,
                                'customer_address' => $customer->address,
                            ]);
                    }
                }
            });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn([
                'customer_name',
                'customer_contact',
                'customer_address',
            ]);
        });

        Schema::table('initial_receivables', function (Blueprint $table) {
            $table->dropColumn([
                'customer_name',
                'customer_contact',
                'customer_address',
            ]);
        });
    }
};