<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Midtrans\Snap;
use Midtrans\Config;

class MidtransController extends Controller
{
    public function getToken(Request $request)
    {
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = false;

        // 1. Tangkap pilihan dari React
        $selectedMethod = $request->payment_type;
        
// 2. Mapping pilihan React ke kode asli Midtrans
        $enabledPayment = [];
        if ($selectedMethod === 'qris') {
            $enabledPayment = ['other_qris']; // <--- UBAH JADI 'other_qris'
        } elseif ($selectedMethod === 'gopay') {
            $enabledPayment = ['gopay'];
        } elseif ($selectedMethod === 'shopee') {
            $enabledPayment = ['shopeepay'];
        } else {
            $enabledPayment = ['other_qris', 'gopay', 'shopeepay']; // <--- INI JUGA UBAH
        }
        $params = [
            'transaction_details' => [
                'order_id' => $request->order_id ?? 'LHO-' . time(), 
                'gross_amount' => (int) $request->total,
            ],
            'customer_details' => [
                'first_name' => $request->name ?? 'Guest',
                'phone' => $request->phone ?? '-',
            ],
            // 3. Masukkan array yang isinya cuma 1 metode tadi
            'enabled_payments' => $enabledPayment
        ];

        $snapToken = Snap::getSnapToken($params);

        return response()->json([
            'token' => $snapToken
        ]);
    }
}