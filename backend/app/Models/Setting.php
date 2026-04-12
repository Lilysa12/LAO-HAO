<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'restaurant_name', 
        'phone', 
        'address', 
        'tax_active', 
        'tax_percentage', 
        'service_charge', 
        'receipt_footer'
    ];
}