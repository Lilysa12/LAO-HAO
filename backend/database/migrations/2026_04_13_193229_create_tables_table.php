<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tables', function (Blueprint $table) {
            $table->id();
            $table->string('table_number'); // Contoh: 01, VIP-1, OUT-1
            $table->string('area'); // indoor atau outdoor
            $table->integer('capacity'); // 2, 4, 6, 8
            $table->string('status')->default('tersedia'); // tersedia, pending, lunas
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tables');
    }
};