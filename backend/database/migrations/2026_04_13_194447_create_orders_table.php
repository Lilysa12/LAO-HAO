<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique(); // Contoh: ORD-003
            $table->string('table_number'); // Contoh: 15
            $table->string('customer_name'); // Contoh: Andi
            $table->json('items'); // Menyimpan daftar pesanan (nama & jumlah)
            $table->string('payment_status')->default('LUNAS'); 
            $table->string('status')->default('diproses'); // diproses, siap, selesai
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};