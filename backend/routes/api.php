<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CashierController;
use App\Http\Controllers\API\MidtransController;

Route::post('/midtrans/token', [MidtransController::class, 'getToken']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// --- ROUTE AUTENTIKASI (BARU) ---
Route::post('/login', [AdminController::class, 'login']);

// --- ROUTE UNTUK FRONTEND ROLE ADMIN ---
Route::prefix('admin')->group(function () {
    // Staff
    Route::get('/staff', [AdminController::class, 'getStaff']);
    Route::post('/staff', [AdminController::class, 'storeStaff']);
    Route::post('/staff/{id}/update', [AdminController::class, 'updateStaff']); 
    Route::post('/staff/{id}/delete', [AdminController::class, 'destroyStaff']); 
    
    // Promo
    Route::get('/promos', [AdminController::class, 'getPromos']);
    Route::post('/promos', [AdminController::class, 'storePromo']);
    Route::post('/promos/{id}/update', [AdminController::class, 'updatePromo']); 
    Route::post('/promos/{id}/delete', [AdminController::class, 'destroyPromo']); 
    Route::post('/promos/{id}/toggle-status', [AdminController::class, 'togglePromoStatus']); 
    
    // Transaksi
    Route::get('/transactions', [AdminController::class, 'getTransactions']);

    // Pengaturan
    Route::get('/settings', [AdminController::class, 'getSettings']);
    Route::post('/settings/update', [AdminController::class, 'updateSettings']);
});

// --- ROUTE UNTUK FRONTEND ROLE KASIR ---
Route::prefix('kasir')->group(function () {
    // Meja (Tables)
    Route::get('/tables', [CashierController::class, 'getTables']);
    Route::post('/tables/{id}/status', [CashierController::class, 'updateTableStatus']);

    // Pesanan Dapur (Orders)
    Route::get('/orders', [CashierController::class, 'getOrders']);
    Route::post('/orders/{id}/status', [CashierController::class, 'updateOrderStatus']);

    // Riwayat Transaksi (History)
    Route::get('/history', [CashierController::class, 'getHistory']);

    // Stok & Menu (Inventory)
    Route::get('/inventory', [CashierController::class, 'getInventory']);
    Route::post('/inventory', [CashierController::class, 'storeInventory']);
    Route::post('/inventory/{id}/update', [CashierController::class, 'updateInventory']);
    Route::post('/inventory/{id}/delete', [CashierController::class, 'destroyInventory']);
});

// --- ROUTE UNTUK FRONTEND ROLE KASIR ---
Route::prefix('kasir')->group(function () {
    // Meja (Tables)
    Route::get('/tables', [CashierController::class, 'getTables']);
    Route::post('/tables/{id}/status', [CashierController::class, 'updateTableStatus']);

    // Pesanan Dapur (Orders)
    Route::get('/orders', [CashierController::class, 'getOrders']);
    Route::post('/orders/{id}/status', [CashierController::class, 'updateOrderStatus']);

    // Riwayat Transaksi (History)
    Route::get('/history', [CashierController::class, 'getHistory']);

    // Stok & Menu (Inventory)
    Route::get('/inventory', [CashierController::class, 'getInventory']);
    Route::post('/inventory', [CashierController::class, 'storeInventory']);
    Route::post('/inventory/{id}/update', [CashierController::class, 'updateInventory']);
    Route::post('/inventory/{id}/delete', [CashierController::class, 'destroyInventory']);

    // Manajemen Menu (TAMBAHAN BARU)
    Route::get('/menus', [CashierController::class, 'getMenus']);
    Route::post('/menus', [CashierController::class, 'storeMenu']);
    Route::post('/menus/{id}/update', [CashierController::class, 'updateMenu']);
    Route::post('/menus/{id}/delete', [CashierController::class, 'destroyMenu']);
});