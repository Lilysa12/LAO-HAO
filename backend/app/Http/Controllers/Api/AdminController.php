<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Promo;
use App\Models\Transaction;
use App\Models\Setting;

class AdminController extends Controller
{
    // ==========================================
    // MANAJEMEN STAF
    // ==========================================
    public function getStaff()
    {
        $staff = User::orderBy('created_at', 'desc')->get()->map(function ($user) {
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
                'branch' => $user->branch,
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
            'branch' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => strtoupper($validated['role']),
            'branch' => $validated['branch'],
            'status' => 'AKTIF',
            'is_verified' => false,
        ]);

        return response()->json(['message' => 'Staf berhasil ditambahkan!', 'data' => $user], 201);
    }

    public function updateStaff(Request $request, $id)
    {
        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json(['message' => 'Staf tidak ditemukan.'], 404);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $id,
                'role' => 'required|string',
                'branch' => 'required|string',
            ]);

            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->role = strtoupper($validated['role']);
            $user->branch = $validated['branch'];
            
            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }

            $user->save();

            return response()->json(['message' => 'Data staf berhasil diperbarui!', 'data' => $user]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal mengupdate staf: ' . $e->getMessage()], 500);
        }
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

    public function updatePromo(Request $request, $id)
    {
        try {
            $promo = Promo::find($id);
            if (!$promo) {
                return response()->json(['message' => 'Promo tidak ditemukan.'], 404);
            }

            $validated = $request->validate([
                'code' => 'required|string|unique:promos,code,' . $id,
                'description' => 'required|string',
                'value' => 'required|string',
                'type' => 'required|string',
                'expired_at' => 'required|string',
            ]);

            $promo->code = strtoupper($validated['code']);
            $promo->description = $validated['description'];
            $promo->value = $validated['type'] === 'Persentase (%)' ? $validated['value'] . '%' : 'Rp ' . number_format((float)$validated['value'], 0, ',', '.');
            $promo->type = $validated['type'] === 'Persentase (%)' ? 'Persentase' : 'Nominal';
            $promo->expired_at = $validated['expired_at'];
            
            $promo->save();

            return response()->json(['message' => 'Data promo berhasil diperbarui!', 'data' => $promo]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal mengupdate promo: ' . $e->getMessage()], 500);
        }
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
            return response()->json(['message' => 'Gagal menghapus promo: ' . $e->getMessage()], 500);
        }
    }

    public function togglePromoStatus($id)
    {
        try {
            $promo = Promo::find($id);
            if (!$promo) return response()->json(['message' => 'Promo tidak ditemukan.'], 404);

            $promo->status = $promo->status === 'AKTIF' ? 'NONAKTIF' : 'AKTIF';
            $promo->save();

            return response()->json(['message' => 'Status promo berhasil diubah!', 'data' => $promo]);
        } catch (\Exception $e) { return response()->json(['message' => 'Gagal mengubah status: ' . $e->getMessage()], 500); }
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
                'total' => $transaction->total_amount, 'status' => $transaction->status, 'branch' => $transaction->branch,
            ];
        });
        return response()->json($formattedTransactions);
    }

    // ==========================================
    // PENGATURAN (SETTINGS) - DIPERKUAT
    // ==========================================
    public function getSettings()
    {
        $setting = Setting::first();
        
        // Jika tabel masih kosong, buatkan data default otomatis
        if (!$setting) {
            $setting = Setting::create([
                'restaurant_name' => 'Lao-Hao (Pusat)',
                'phone' => '0812-3456-7890',
                'address' => 'Jl. Merdeka No. 45, Bandung, Jawa Barat',
                'tax_active' => true,
                'tax_percentage' => 10,
                'service_charge' => 5,
                'receipt_footer' => 'Terima kasih telah berkunjung ke Lao-Hao. Kepuasan Anda adalah kebahagiaan kami.'
            ]);
        }

        return response()->json($setting);
    }

    public function updateSettings(Request $request)
    {
        try {
            $setting = Setting::first();
            
            // Penjagaan: Jika tidak ada data, buat instance baru
            if (!$setting) {
                $setting = new Setting();
            }
            
            $setting->restaurant_name = $request->restaurant_name;
            $setting->phone = $request->phone;
            $setting->address = $request->address;
            
            $setting->tax_active = filter_var($request->tax_active, FILTER_VALIDATE_BOOLEAN); 
            
            // Penjagaan: Pastikan di-cast ke integer yang aman
            $setting->tax_percentage = (int) $request->tax_percentage;
            $setting->service_charge = (int) $request->service_charge;
            
            $setting->receipt_footer = $request->receipt_footer;

            $setting->save();

            return response()->json(['message' => 'Pengaturan berhasil disimpan!', 'data' => $setting]);
        } catch (\Exception $e) {
            // Jika masih error, kita akan melihat pesan detail ini di alert React
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}