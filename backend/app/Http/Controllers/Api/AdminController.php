<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Promo;
use App\Models\Transaction;

class AdminController extends Controller
{
    // ==========================================
    // MANAJEMEN STAF
    // ==========================================
    public function getStaff()
    {
        $staff = User::all()->map(function ($user) {
            $roleClass = 'role-dapur';
            if ($user->role === 'SUPER ADMIN') {
                $roleClass = 'role-superadmin';
            } elseif ($user->role === 'KASIR') {
                $roleClass = 'role-kasir';
            }

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'initial' => substr($user->name, 0, 1),
                'role' => $user->role,
                'roleClass' => $roleClass,
                'status' => $user->status,
                'lastLogin' => $user->last_login_at ? $user->last_login_at->format('d M Y, H:i') : 'Belum pernah login',
                'isVerified' => (bool) $user->is_verified
            ];
        });
        
        return response()->json($staff);
    }

    public function storeStaff(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => strtoupper($validated['role']),
            'status' => 'AKTIF',
            'is_verified' => false,
        ]);

        return response()->json(['message' => 'Staf berhasil ditambahkan!', 'data' => $user], 201);
    }

    public function destroyStaff($id)
    {
        try {
            $user = User::find($id);
            if ($user) {
                $user->delete();
                return response()->json(['message' => 'Staf berhasil dihapus.']);
            }
            return response()->json(['message' => 'Staf tidak ditemukan.'], 404);
        } catch (\Exception $e) {
            // Menangkap error agar tidak membuat server crash
            return response()->json(['message' => 'Gagal menghapus staf: ' . $e->getMessage()], 500);
        }
    }

    // ==========================================
    // MANAJEMEN PROMO
    // ==========================================
    public function getPromos()
    {
        $promos = Promo::orderBy('created_at', 'desc')->get();
        $formattedPromos = $promos->map(function ($promo) {
            return [
                'id' => $promo->id, 'code' => $promo->code, 'desc' => $promo->description,
                'value' => $promo->value, 'type' => $promo->type, 'min' => $promo->min_purchase,
                'exp' => $promo->expired_at, 'status' => $promo->status,
            ];
        });
        return response()->json($formattedPromos);
    }

    public function storePromo(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:promos',
            'description' => 'required|string',
            'value' => 'required|string',
            'type' => 'required|string',
            'expired_at' => 'required|string',
        ]);

        $promo = Promo::create([
            'code' => strtoupper($validated['code']),
            'description' => $validated['description'],
            'value' => $validated['type'] === 'Persentase (%)' ? $validated['value'] . '%' : 'Rp ' . number_format((float)$validated['value'], 0, ',', '.'),
            'type' => $validated['type'] === 'Persentase (%)' ? 'Persentase' : 'Nominal',
            'min_purchase' => 'Rp 0',
            'expired_at' => $validated['expired_at'],
            'status' => 'AKTIF',
        ]);

        return response()->json(['message' => 'Promo berhasil ditambahkan!', 'data' => $promo], 201);
    }

    public function destroyPromo($id)
    {
        try {
            $promo = Promo::find($id);
            if ($promo) {
                $promo->delete();
                return response()->json(['message' => 'Promo berhasil dihapus.']);
            }
            return response()->json(['message' => 'Promo tidak ditemukan.'], 404);
        } catch (\Exception $e) {
            // Menangkap error agar tidak membuat server crash
            return response()->json(['message' => 'Gagal menghapus promo: ' . $e->getMessage()], 500);
        }
    }

    // ==========================================
    // TRANSAKSI
    // ==========================================
    public function getTransactions()
    {
        $transactions = Transaction::orderBy('created_at', 'desc')->get();
        $formattedTransactions = $transactions->map(function ($transaction) {
            return [
                'id' => $transaction->id, 'inv' => $transaction->invoice_no, 'time' => $transaction->transaction_time,
                'user' => $transaction->customer_name, 'method' => $transaction->payment_method,
                'total' => $transaction->total_amount, 'status' => $transaction->status,
            ];
        });
        return response()->json($formattedTransactions);
    }
}