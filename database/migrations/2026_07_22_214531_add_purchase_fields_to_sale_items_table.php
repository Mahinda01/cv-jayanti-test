<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {
            if (!Schema::hasColumn('sale_items', 'purchase_price')) {
                $table->decimal('purchase_price', 15, 2)->default(0)->after('price');
            }

            if (!Schema::hasColumn('sale_items', 'purchase_subtotal')) {
                $table->decimal('purchase_subtotal', 15, 2)->default(0)->after('subtotal');
            }

            if (!Schema::hasColumn('sale_items', 'profit')) {
                $table->decimal('profit', 15, 2)->default(0)->after('purchase_subtotal');
            }
        });

        DB::statement("
            UPDATE sale_items
            JOIN products ON products.id = sale_items.product_id
            SET
                sale_items.purchase_price = products.purchase_price,
                sale_items.purchase_subtotal = products.purchase_price * sale_items.quantity,
                sale_items.profit = sale_items.subtotal - (products.purchase_price * sale_items.quantity)
        ");
    }

    public function down(): void
    {
        Schema::table('sale_items', function (Blueprint $table) {
            if (Schema::hasColumn('sale_items', 'profit')) {
                $table->dropColumn('profit');
            }

            if (Schema::hasColumn('sale_items', 'purchase_subtotal')) {
                $table->dropColumn('purchase_subtotal');
            }

            if (Schema::hasColumn('sale_items', 'purchase_price')) {
                $table->dropColumn('purchase_price');
            }
        });
    }
};