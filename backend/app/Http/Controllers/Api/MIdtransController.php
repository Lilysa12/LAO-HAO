<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MidtransController extends Controller
{
    public function getToken(Request $request)
    {
        // Cek apakah class Midtrans ada atau tidak
        if (!class_exists('\Midtrans\Config')) {
            return response()->json(['error' => 'Library Midtrans belum terdeteksi. Coba jalankan composer dump-autoload'], 500);
        }

        try {
            // MASUKKAN SERVER KEY ASLI DI SINI (Jangan pake env dulu biar pasti)
            \Midtrans\Config::$serverKey = 'SB-Mid-server-xxxxxxxxxxxxxxxxxxxx'; 
            \Midtrans\Config::$isProduction = false;
            \Midtrans\Config::$isSanitized = true;
            \Midtrans\Config::$is3ds = true;

            $params = [
                'transaction_details' => [
                    'order_id' => 'ORD-' . time(),
                    'gross_amount' => 10000, // Tes angka statis dulu
                ],
                'customer_details' => [
                    'first_name' => "Customer Test",
                ],
            ];

            $snapToken = \Midtrans\Snap::getSnapToken($params);
            return response()->json(['token' => $snapToken]);

        } catch (\Exception $e) {
            return response()->json([
                'error_message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}