<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'invoice_no',
        'order_id',
        'branch_id',
        'transaction_time',
        'customer_name',
        'payment_method',
        'total_amount',
        'status',
        'branch',
        'created_at',
        'updated_at',
    ];

    public function branchData(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function orderData(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}