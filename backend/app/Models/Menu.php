<?php

namespace App\Models;

use Illuminate\Database.Eloquent\Model;

class Menu extends Model
{
    // Nama tabel di database kamu (Supabase)
    protected $table = 'menus'; 

    // Kolom yang boleh diisi
    protected $fillable = ['name', 'price', 'category', 'description', 'image_url'];
}