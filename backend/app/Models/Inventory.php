<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// ============================================================================
// Model Inventory
// ============================================================================
// Model ini mengambil dan menyimpan data bahan baku dari tabel inventories.
// Semua field berasal dari database Supabase, tanpa data dummy atau fallback.
// ============================================================================

class Inventory extends Model
{
    use HasFactory;

    protected $table = 'inventories';

    protected $fillable = [
        'name',
        'category',
        'stock',
        'min_stock',
        'unit',
        'price_per_unit',
        'last_note',
        'last_restock_quantity',
        'last_restock_at',
    ];

    protected $casts = [
        'stock' => 'integer',
        'min_stock' => 'integer',
        'price_per_unit' => 'integer',
        'last_restock_quantity' => 'integer',
        'last_restock_at' => 'datetime',
    ];
}