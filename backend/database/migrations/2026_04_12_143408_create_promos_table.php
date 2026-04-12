<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promos', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('description');
            $table->string('value'); // cth: '20%', 'Rp 50.000'
            $table->string('type'); // Persentase, Nominal, Layanan
            $table->string('min_purchase'); // cth: 'Rp 50.000'
            $table->string('expired_at'); 
            $table->string('status')->default('AKTIF'); // AKTIF, NONAKTIF, KEDALUWARSA
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promos');
    }
};