<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $table = 'menus'; 

    // MATIKAN TIMESTAMPS AGAR TIDAK ERROR 500
    public $timestamps = false;

    protected $fillable = ['name', 'price', 'category', 'description', 'image_url'];
}