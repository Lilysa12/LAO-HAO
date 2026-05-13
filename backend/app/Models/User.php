<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

// ============================================================================
// Model User
// ============================================================================
// Model ini mewakili akun pengguna sistem.
// Kolom branch lama tetap dipertahankan agar data lama tidak rusak.
// Kolom branch_id dipakai sebagai relasi baru ke tabel branches.
// ============================================================================

class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'branch',
        'branch_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'branch_id' => 'integer',
        ];
    }

    public function branchData(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }
}