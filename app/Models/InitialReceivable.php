<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InitialReceivable extends Model
{
    protected $fillable = [
        'receivable_number',
        'customer_id',
        'customer_name',
        'customer_contact',
        'customer_address',
        'user_id',
        'record_date',
        'due_date',
        'old_bon_number',
        'total_amount',
        'paid_amount',
        'remaining_amount',
        'status',
        'notes',
    ];

    protected $casts = [
        'record_date' => 'date',
        'due_date' => 'date',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payments()
    {
        return $this->hasMany(ReceivablePayment::class);
    }
}