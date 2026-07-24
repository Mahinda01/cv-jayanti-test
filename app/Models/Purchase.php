<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        'purchase_number',
        'purchase_date',
        'supplier',
        'total_amount',
        'status',
        'note',
        'cancel_reason',
        'cancelled_at',
        'created_by',
        'cancelled_by',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'cancelled_at' => 'datetime',
    ];

    public function items()
    {
        return $this->hasMany(PurchaseItem::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function canceller()
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }
}