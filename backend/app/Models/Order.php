<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';

    protected $primaryKey = 'id';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = true;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'order_id',
        'customer_name',
        'phone_number',
        'table_number',
        'items',
        'subtotal',
        'discount_amount',
        'tax',
        'total_payment',
        'payment_method',
        'payment_status',
        'status',
        'branch',
        'branch_id',
        'table_id',
        'created_at',
    ];

    protected $casts = [
        'id' => 'integer',
        'branch_id' => 'integer',
        'table_id' => 'integer',
        'subtotal' => 'float',
        'discount_amount' => 'float',
        'tax' => 'float',
        'total_payment' => 'float',
        'created_at' => 'datetime',
    ];

    public function branchData()
    {
        return $this->belongsTo(Branch::class, 'branch_id', 'id');
    }

    public function tableData()
    {
        return $this->belongsTo(Table::class, 'table_id', 'id');
    }
}