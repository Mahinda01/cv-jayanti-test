<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'contact',
        'address',
        'total_receivable',
        'receivable_status',
        'is_active',
    ];
}