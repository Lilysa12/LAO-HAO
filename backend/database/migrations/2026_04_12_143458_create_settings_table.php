<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('restaurant_name')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->boolean('tax_active')->default(true);
            $table->integer('tax_percentage')->default(10);
            $table->integer('service_charge')->default(5);
            $table->text('receipt_footer')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};