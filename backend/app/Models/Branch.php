<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $table = 'branches'; 

    protected $fillable = [
        'name', 'city', 'address', 'phone', 'hours', 'map_link', 'lat', 'lng', 'facilities', 'img'
    ];

    public $timestamps = false;
}