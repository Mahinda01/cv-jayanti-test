<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'contact',
        'address',
        'total_receivable',
        'receivable_status',
        'is_active',
    ];

    protected $casts = [
        'total_receivable' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function initialReceivables(): HasMany
    {
        return $this->hasMany(InitialReceivable::class);
    }
}