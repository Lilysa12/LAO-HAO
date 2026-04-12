<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            // Kita pasang pengecekan agar tidak error jika kolom sudah ada
            if (!Schema::hasColumn('settings', 'restaurant_name')) {
                $table->string('restaurant_name')->nullable();
                $table->string('phone')->nullable();
                $table->text('address')->nullable();
                $table->boolean('tax_active')->default(true);
                $table->integer('tax_percentage')->default(10);
                $table->integer('service_charge')->default(5);
                $table->text('receipt_footer')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn([
                'restaurant_name', 'phone', 'address', 'tax_active', 
                'tax_percentage', 'service_charge', 'receipt_footer'
            ]);
        });
    }
};