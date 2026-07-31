<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReceivablePayment extends Model
{
    protected $fillable = [
        'sale_id',
        'initial_receivable_id',
        'customer_id',
        'user_id',
        'payment_date',
        'payment_method',
        'amount',
        'status',
        'notes',
        'cancel_reason',
        'cancelled_at',
        'cancelled_by',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
        'cancelled_at' => 'datetime',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function initialReceivable()
    {
        return $this->belongsTo(InitialReceivable::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function canceller()
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }
}