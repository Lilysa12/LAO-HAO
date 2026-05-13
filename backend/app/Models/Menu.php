<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// ============================================================================
// Model Menu
// ============================================================================
// Model ini mewakili tabel `menus` pada Supabase Lao-Hao.
// Struktur kolom saat ini:
// id, name, price, category, description, image_url
// ============================================================================

class Menu extends Model
{
    // ============================================================================
    // KONFIGURASI TABEL
    // ============================================================================

    protected $table = 'menus';

    // ============================================================================
    // TIMESTAMPS
    // ============================================================================
    // Tabel `menus` di Supabase saat ini tidak memiliki kolom created_at
    // dan updated_at, sehingga timestamps wajib dimatikan.
    // ============================================================================

    public $timestamps = false;

    // ============================================================================
    // KOLOM YANG BOLEH DIISI
    // ============================================================================

    protected $fillable = [
        'name',
        'price',
        'category',
        'description',
        'image_url',
    ];

    // ============================================================================
    // CASTING DATA
    // ============================================================================

    protected $casts = [
        'id' => 'integer',
        'price' => 'integer',
    ];
}