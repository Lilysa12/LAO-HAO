<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Promo;
use App\Models\Setting;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // ============================================================================
    // MANAJEMEN STAF
    // ============================================================================

    public function getStaff()
    {
        $staff = User::query()
            ->with('branchData')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'initial' => strtoupper(substr((string) $user->name, 0, 1)),
                    'role' => $user->role,
                    'branch' => optional($user->branchData)->name ?? $user->branch,
                    'branch_id' => $user->branch_id,
                    'branch_name' => optional($user->branchData)->name,
                    'roleClass' => $this->getRoleClass($user->role),
                    'status' => $user->status,
                    'lastLogin' => $user->last_login_at
                        ? $user->last_login_at->format('d M Y, H:i')
                        : 'Belum pernah login',
                    'isVerified' => (bool) $user->is_verified,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                ];
            });

        return response()->json($staff);
    }

    public function storeStaff(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'role' => 'required|string|max:100',
            'branch' => 'nullable|string|max:255',
            'branch_id' => 'nullable|integer|exists:branches,id',
            'password' => 'required|string|min:6',
            'status' => 'nullable|string|max:50',
            'is_verified' => 'nullable|boolean',
        ]);

        $branch = $this->resolveBranch($request);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => strtoupper($validated['role']),
            'branch' => optional($branch)->name ?? ($validated['branch'] ?? null),
            'branch_id' => optional($branch)->id,
            'status' => $validated['status'] ?? 'AKTIF',
            'is_verified' => $validated['is_verified'] ?? false,
        ]);

        return response()->json([
            'message' => 'Staf berhasil ditambahkan.',
            'data' => $user->fresh('branchData'),
        ], 201);
    }

    public function updateStaff(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Staf tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'required|string|max:100',
            'branch' => 'nullable|string|max:255',
            'branch_id' => 'nullable|integer|exists:branches,id',
            'password' => 'nullable|string|min:6',
            'status' => 'nullable|string|max:50',
            'is_verified' => 'nullable|boolean',
        ]);

        $branch = $this->resolveBranch($request);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = strtoupper($validated['role']);
        $user->branch = optional($branch)->name ?? ($validated['branch'] ?? $user->branch);
        $user->branch_id = optional($branch)->id ?? $user->branch_id;

        if ($request->filled('password')) {
            $user->password = Hash::make($validated['password']);
        }

        if ($request->filled('status')) {
            $user->status = $validated['status'];
        }

        if ($request->has('is_verified')) {
            $user->is_verified = (bool) $validated['is_verified'];
        }

        $user->save();

        return response()->json([
            'message' => 'Data staf berhasil diperbarui.',
            'data' => $user->fresh('branchData'),
        ]);
    }

    public function destroyStaff($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Staf tidak ditemukan.',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'message' => 'Staf berhasil dihapus.',
        ]);
    }

    // ============================================================================
    // MANAJEMEN PROMO
    // ============================================================================

    public function getPromos()
    {
        $promos = Promo::query()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($promo) {
                return [
                    'id' => $promo->id,
                    'code' => $promo->code,
                    'desc' => $promo->description,
                    'description' => $promo->description,
                    'value' => $promo->value,
                    'type' => $promo->type,
                    'min' => $promo->min_purchase,
                    'min_purchase' => $promo->min_purchase,
                    'exp' => $promo->expired_at,
                    'expired_at' => $promo->expired_at,
                    'status' => $promo->status,
                    'created_at' => $promo->created_at,
                    'updated_at' => $promo->updated_at,
                ];
            });

        return response()->json($promos);
    }

    public function storePromo(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:100|unique:promos,code',
            'description' => 'required|string',
            'value' => 'required|string',
            'type' => 'required|string|max:100',
            'min_purchase' => 'nullable|string|max:100',
            'expired_at' => 'required|string|max:100',
            'status' => 'nullable|string|max:50',
        ]);

        $promo = Promo::create([
            'code' => strtoupper($validated['code']),
            'description' => $validated['description'],
            'value' => $this->formatPromoValue($validated['value'], $validated['type']),
            'type' => $this->normalizePromoType($validated['type']),
            'min_purchase' => $validated['min_purchase'] ?? 'Rp 0',
            'expired_at' => $validated['expired_at'],
            'status' => $validated['status'] ?? 'AKTIF',
        ]);

        return response()->json([
            'message' => 'Promo berhasil ditambahkan.',
            'data' => $promo,
        ], 201);
    }

    public function updatePromo(Request $request, $id)
    {
        $promo = Promo::find($id);

        if (!$promo) {
            return response()->json([
                'message' => 'Promo tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'code' => 'required|string|max:100|unique:promos,code,' . $id,
            'description' => 'required|string',
            'value' => 'required|string',
            'type' => 'required|string|max:100',
            'min_purchase' => 'nullable|string|max:100',
            'expired_at' => 'required|string|max:100',
            'status' => 'nullable|string|max:50',
        ]);

        $promo->code = strtoupper($validated['code']);
        $promo->description = $validated['description'];
        $promo->value = $this->formatPromoValue($validated['value'], $validated['type']);
        $promo->type = $this->normalizePromoType($validated['type']);
        $promo->min_purchase = $validated['min_purchase'] ?? $promo->min_purchase;
        $promo->expired_at = $validated['expired_at'];

        if ($request->filled('status')) {
            $promo->status = $validated['status'];
        }

        $promo->save();

        return response()->json([
            'message' => 'Data promo berhasil diperbarui.',
            'data' => $promo,
        ]);
    }

    public function destroyPromo($id)
    {
        $promo = Promo::find($id);

        if (!$promo) {
            return response()->json([
                'message' => 'Promo tidak ditemukan.',
            ], 404);
        }

        $promo->delete();

        return response()->json([
            'message' => 'Promo berhasil dihapus.',
        ]);
    }

    public function togglePromoStatus($id)
    {
        $promo = Promo::find($id);

        if (!$promo) {
            return response()->json([
                'message' => 'Promo tidak ditemukan.',
            ], 404);
        }

        $promo->status = strtoupper((string) $promo->status) === 'AKTIF'
            ? 'NONAKTIF'
            : 'AKTIF';

        $promo->save();

        return response()->json([
            'message' => 'Status promo berhasil diubah.',
            'data' => $promo,
        ]);
    }

    // ============================================================================
    // TRANSAKSI
    // ============================================================================

    public function getTransactions()
    {
        $transactions = Transaction::query()
            ->with(['branchData', 'orderData.tableData'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($transaction) {
                $order = $transaction->orderData;
                $branch = $transaction->branchData;

                return [
                    'id' => $transaction->id,
                    'inv' => $transaction->invoice_no,
                    'invoice_no' => $transaction->invoice_no,
                    'time' => $transaction->transaction_time,
                    'date_iso' => $transaction->created_at
                        ? $transaction->created_at->format('Y-m-d')
                        : null,
                    'user' => $transaction->customer_name,
                    'customer_name' => $transaction->customer_name,
                    'method' => $transaction->payment_method,
                    'payment_method' => $transaction->payment_method,
                    'total' => $transaction->total_amount,
                    'total_amount' => $transaction->total_amount,
                    'status' => $transaction->status,
                    'branch' => optional($branch)->name ?? $transaction->branch,
                    'branch_id' => $transaction->branch_id,
                    'order_id' => $transaction->order_id,
                    'order_code' => optional($order)->order_id,
                    'table_id' => optional($order)->table_id,
                    'table_number' => optional(optional($order)->tableData)->table_number ?? optional($order)->table_number,
                    'created_at' => $transaction->created_at,
                    'updated_at' => $transaction->updated_at,
                ];
            });

        return response()->json($transactions);
    }

    // ============================================================================
    // CABANG
    // ============================================================================

    public function getBranches()
    {
        $branches = Branch::query()
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($branches);
    }

    // ============================================================================
    // PENGATURAN
    // ============================================================================

    public function getSettings()
    {
        $setting = Setting::query()
            ->orderBy('id', 'asc')
            ->first();

        return response()->json($setting);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'restaurant_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'tax_active' => 'nullable',
            'tax_percentage' => 'nullable|numeric',
            'service_charge' => 'nullable|numeric',
            'receipt_footer' => 'nullable|string',
        ]);

        $setting = Setting::query()
            ->orderBy('id', 'asc')
            ->first();

        if (!$setting) {
            return response()->json([
                'message' => 'Data pengaturan belum tersedia di database.',
            ], 404);
        }

        if ($request->has('restaurant_name')) {
            $setting->restaurant_name = $validated['restaurant_name'];
        }

        if ($request->has('phone')) {
            $setting->phone = $validated['phone'];
        }

        if ($request->has('address')) {
            $setting->address = $validated['address'];
        }

        if ($request->has('tax_active')) {
            $setting->tax_active = filter_var($request->tax_active, FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->has('tax_percentage')) {
            $setting->tax_percentage = (int) $validated['tax_percentage'];
        }

        if ($request->has('service_charge')) {
            $setting->service_charge = (int) $validated['service_charge'];
        }

        if ($request->has('receipt_footer')) {
            $setting->receipt_footer = $validated['receipt_footer'];
        }

        $setting->save();

        return response()->json([
            'message' => 'Pengaturan berhasil disimpan.',
            'data' => $setting,
        ]);
    }

    // ============================================================================
    // HELPER
    // ============================================================================

    private function getRoleClass(?string $role): string
    {
        $normalizedRole = strtoupper((string) $role);

        return match ($normalizedRole) {
            'SUPER ADMIN' => 'role-superadmin',
            'KASIR' => 'role-kasir',
            'DAPUR', 'KITCHEN', 'DAPUR / KITCHEN' => 'role-dapur',
            default => 'role-staff',
        };
    }

    private function resolveBranch(Request $request): ?Branch
    {
        if ($request->filled('branch_id')) {
            return Branch::find($request->branch_id);
        }

        if (!$request->filled('branch')) {
            return null;
        }

        $branchName = trim($request->branch);

        return Branch::query()
            ->whereRaw('lower(name) = ?', [strtolower($branchName)])
            ->orWhereRaw(
                "lower(?) = lower('Cabang ' || replace(name, 'Laoban Kopitiam ', ''))",
                [$branchName]
            )
            ->first();
    }

    private function normalizePromoType(string $type): string
    {
        $normalizedType = strtolower(trim($type));

        if (str_contains($normalizedType, 'persen') || str_contains($normalizedType, 'percent')) {
            return 'Persentase';
        }

        if (str_contains($normalizedType, 'nominal') || str_contains($normalizedType, 'fixed')) {
            return 'Nominal';
        }

        return $type;
    }

    private function formatPromoValue(string $value, string $type): string
    {
        $normalizedType = strtolower(trim($type));
        $cleanValue = trim($value);

        if (str_contains($cleanValue, 'Rp') || str_contains($cleanValue, '%')) {
            return $cleanValue;
        }

        if (str_contains($normalizedType, 'persen') || str_contains($normalizedType, 'percent')) {
            return $cleanValue . '%';
        }

        return 'Rp ' . number_format((float) $cleanValue, 0, ',', '.');
    }
}