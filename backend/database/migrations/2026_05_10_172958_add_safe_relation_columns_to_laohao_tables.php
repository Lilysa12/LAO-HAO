<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ============================================================================
// Migration: Tambah Kolom Relasi Aman Lao-Hao
// ============================================================================
// Kolom dibuat nullable agar data lama tetap aman dan tidak wajib langsung
// memiliki relasi. Kolom lama seperti branch, table_number, dan status tidak
// dihapus untuk menjaga kompatibilitas dengan data dan kode existing.
// ============================================================================

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'branch_id')) {
                $table->unsignedBigInteger('branch_id')->nullable()->after('branch');
                $table->index('branch_id');
            }
        });

        Schema::table('transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('transactions', 'branch_id')) {
                $table->unsignedBigInteger('branch_id')->nullable()->after('branch');
                $table->index('branch_id');
            }

            if (!Schema::hasColumn('transactions', 'order_id')) {
                $table->unsignedBigInteger('order_id')->nullable()->after('id');
                $table->index('order_id');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'branch_id')) {
                $table->unsignedBigInteger('branch_id')->nullable()->after('id');
                $table->index('branch_id');
            }

            if (!Schema::hasColumn('orders', 'table_id')) {
                $table->unsignedBigInteger('table_id')->nullable()->after('table_number');
                $table->index('table_id');
            }

            if (!Schema::hasColumn('orders', 'payment_status')) {
                $table->string('payment_status')->nullable()->after('payment_method');
            }
        });

        Schema::table('tables', function (Blueprint $table) {
            if (!Schema::hasColumn('tables', 'branch_id')) {
                $table->unsignedBigInteger('branch_id')->nullable()->after('id');
                $table->index('branch_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tables', function (Blueprint $table) {
            if (Schema::hasColumn('tables', 'branch_id')) {
                $table->dropIndex(['branch_id']);
                $table->dropColumn('branch_id');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'payment_status')) {
                $table->dropColumn('payment_status');
            }

            if (Schema::hasColumn('orders', 'table_id')) {
                $table->dropIndex(['table_id']);
                $table->dropColumn('table_id');
            }

            if (Schema::hasColumn('orders', 'branch_id')) {
                $table->dropIndex(['branch_id']);
                $table->dropColumn('branch_id');
            }
        });

        Schema::table('transactions', function (Blueprint $table) {
            if (Schema::hasColumn('transactions', 'order_id')) {
                $table->dropIndex(['order_id']);
                $table->dropColumn('order_id');
            }

            if (Schema::hasColumn('transactions', 'branch_id')) {
                $table->dropIndex(['branch_id']);
                $table->dropColumn('branch_id');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'brphp artisan migrateanch_id')) {
                $table->dropIndex(['branch_id']);
                $table->dropColumn('branch_id');
            }
        });
    }
};