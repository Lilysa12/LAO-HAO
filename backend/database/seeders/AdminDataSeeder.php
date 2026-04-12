<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Promo;
use App\Models\Transaction;

class AdminDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Data Akun Staf
        User::create([
            'name' => 'Ahmad Syahroni', 'email' => 'ahmad@laohao.com',
            'password' => Hash::make('password123'), 'role' => 'SUPER ADMIN',
            'status' => 'AKTIF', 'last_login_at' => now(), 'is_verified' => true
        ]);
        User::create([
            'name' => 'Budi Santoso', 'email' => 'budi.kasir@laohao.com',
            'password' => Hash::make('password123'), 'role' => 'KASIR',
            'status' => 'AKTIF', 'last_login_at' => now(), 'is_verified' => false
        ]);
        User::create([
            'name' => 'Siti Aminah', 'email' => 'siti.a@laohao.com',
            'password' => Hash::make('password123'), 'role' => 'KASIR',
            'status' => 'NONAKTIF', 'last_login_at' => null, 'is_verified' => false
        ]);
        User::create([
            'name' => 'Dewi Lestari', 'email' => 'dewi.kitchen@laohao.com',
            'password' => Hash::make('password123'), 'role' => 'DAPUR / KITCHEN',
            'status' => 'AKTIF', 'last_login_at' => now(), 'is_verified' => false
        ]);

        // 2. Data Promo
        Promo::create(['code' => 'MANTAP20', 'description' => 'Diskon 20% Semua Menu', 'value' => '20%', 'type' => 'Persentase', 'min_purchase' => 'Rp 50.000', 'expired_at' => '31 Okt 2026', 'status' => 'AKTIF']);
        Promo::create(['code' => 'HEMAT50K', 'description' => 'Potongan Rp 50.000', 'value' => 'Rp 50.000', 'type' => 'Nominal', 'min_purchase' => 'Rp 200.000', 'expired_at' => '15 Nov 2026', 'status' => 'AKTIF']);
        Promo::create(['code' => 'ONGKIRGRATIS', 'description' => 'Gratis Ongkir Delivery', 'value' => '100%', 'type' => 'Layanan', 'min_purchase' => 'Rp 100.000', 'expired_at' => '30 Sep 2026', 'status' => 'KEDALUWARSA']);
        Promo::create(['code' => 'WELCOME10', 'description' => 'Diskon Pengguna Baru', 'value' => '10%', 'type' => 'Persentase', 'min_purchase' => 'Rp 0', 'expired_at' => '31 Des 2026', 'status' => 'NONAKTIF']);

        // 3. Data Transaksi Terakhir
        Transaction::create(['invoice_no' => '#INV-0012', 'transaction_time' => '12 Okt 2026, 14:30', 'customer_name' => 'Budi S.', 'payment_method' => 'QRIS', 'total_amount' => 'Rp 125.000', 'status' => 'BERHASIL']);
        Transaction::create(['invoice_no' => '#INV-0013', 'transaction_time' => '12 Okt 2026, 14:45', 'customer_name' => 'Andi M.', 'payment_method' => 'Cash', 'total_amount' => 'Rp 45.000', 'status' => 'BERHASIL']);
        Transaction::create(['invoice_no' => '#INV-0014', 'transaction_time' => '12 Okt 2026, 15:10', 'customer_name' => 'Siti K.', 'payment_method' => 'Debit', 'total_amount' => 'Rp 210.000', 'status' => 'BERHASIL']);
        Transaction::create(['invoice_no' => '#INV-0015', 'transaction_time' => '12 Okt 2026, 15:30', 'customer_name' => 'Guest', 'payment_method' => 'Cash', 'total_amount' => 'Rp 35.000', 'status' => 'DIBATALKAN']);
        Transaction::create(['invoice_no' => '#INV-0016', 'transaction_time' => '12 Okt 2026, 16:00', 'customer_name' => 'Joko P.', 'payment_method' => 'QRIS', 'total_amount' => 'Rp 85.000', 'status' => 'BERHASIL']);
    }
}