<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminController;
;

Route::get('/test', function () {
    return response()->json(['message' => 'Backend terhubung!']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

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