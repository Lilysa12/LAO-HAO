<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// --- ROUTE UNTUK FRONTEND ROLE ADMIN ---
Route::prefix('admin')->group(function () {
    // Staff
    Route::get('/staff', [AdminController::class, 'getStaff']);
    Route::post('/staff', [AdminController::class, 'storeStaff']);
    Route::post('/staff/{id}/delete', [AdminController::class, 'destroyStaff']); // UBAH JADI POST
    
    // Promo
    Route::get('/promos', [AdminController::class, 'getPromos']);
    Route::post('/promos', [AdminController::class, 'storePromo']);
    Route::post('/promos/{id}/delete', [AdminController::class, 'destroyPromo']); // UBAH JADI POST
    
    // Transaksi
    Route::get('/transactions', [AdminController::class, 'getTransactions']);
});