<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

// ============================================================================
// Model Table
// ============================================================================
// Model ini mewakili meja restoran.
// Relasi branch_id dipakai agar setiap meja bisa terhubung ke cabang tertentu.
// ============================================================================

class Table extends Model
{
    protected $fillable = [
        'table_number',
        'area',
        'capacity',
        'status',
        'branch_id',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'branch_id' => 'integer',
    ];

    public function branchData(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'table_id');
    }
}