<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // Sesuaikan dengan kolom yang ada di Supabase kamu
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
        'status'
    ];

    protected $casts = [
        'items' => 'array',
    ];

    const UPDATED_AT = null; 
}