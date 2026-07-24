<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = [
        'invoice_number',
        'customer_id',
        'user_id',
        'sale_date',
        'due_date',
        'total_amount',
        'paid_amount',
        'remaining_amount',
        'payment_method',
        'payment_status',
        'transaction_status',
        'cancelled_at',
        'cancelled_by',
        'cancel_reason',
        'notes',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cancelledBy()
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function payments()
    {
        return $this->hasMany(ReceivablePayment::class);
    }
}