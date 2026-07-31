<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleItem extends Model
{
    protected $fillable = [
        'sale_id',
        'product_id',
        'product_name',
        'product_unit',
        'purchase_price',
        'price',
        'quantity',
        'purchase_subtotal',
        'subtotal',
        'profit',
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'price' => 'decimal:2',
        'quantity' => 'integer',
        'purchase_subtotal' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'profit' => 'decimal:2',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}