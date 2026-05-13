<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

// ============================================================================
// Model Branch
// ============================================================================
// Model ini mewakili cabang resmi Lao-Hao.
// Relasi utama:
// - Satu branch memiliki banyak user.
// - Satu branch memiliki banyak order.
// - Satu branch memiliki banyak transaction.
// - Satu branch memiliki banyak table.
// ============================================================================

class Branch extends Model
{
    protected $fillable = [
        'name',
        'city',
        'address',
        'phone',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function tables(): HasMany
    {
        return $this->hasMany(Table::class);
    }
}