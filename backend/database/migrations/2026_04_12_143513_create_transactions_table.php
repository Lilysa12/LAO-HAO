<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no')->unique();
            $table->string('transaction_time'); // cth: '12 Okt 2026, 14:30'
            $table->string('customer_name');
            $table->string('payment_method'); // QRIS, Cash, Debit
            $table->string('total_amount'); // cth: 'Rp 125.000'
            $table->string('status'); // BERHASIL, DIBATALKAN
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};