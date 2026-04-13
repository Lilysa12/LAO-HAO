<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'table_number', 'customer_name', 'items', 'payment_status', 'status'];

    // Mengubah JSON di database menjadi Array di Laravel secara otomatis
    protected $casts = [
        'items' => 'array',
    ];
}