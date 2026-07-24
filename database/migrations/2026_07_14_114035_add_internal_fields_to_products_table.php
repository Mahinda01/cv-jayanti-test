<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('supplier', 150)->nullable()->after('description');
            $table->integer('minimum_stock')->default(0)->after('stock');
            $table->string('unit', 50)->default('Pcs')->after('minimum_stock');
            $table->string('location', 150)->nullable()->after('unit');
            $table->decimal('purchase_price', 15, 2)->default(0)->after('location');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'supplier',
                'minimum_stock',
                'unit',
                'location',
                'purchase_price',
            ]);
        });
    }
};