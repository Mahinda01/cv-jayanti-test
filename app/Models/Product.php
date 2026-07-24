<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'product_category_id',
        'name',
        'slug',
        'description',
        'supplier',
        'price',
        'stock',
        'minimum_stock',
        'unit',
        'location',
        'purchase_price',
        'image',
        'is_active',
    ];

    public function category()
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }
}