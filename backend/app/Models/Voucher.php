<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $table = 'vouchers';

    protected $fillable = [
        'title',
        'description',
        'type',
        'amount',
        'min_spend',
        'category_req',
        'badge_text',
        'badge_class',
        'bg_class',
        'expiry_date'
    ];
}