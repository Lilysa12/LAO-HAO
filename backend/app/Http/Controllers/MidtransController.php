<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Midtrans\Snap;
use Midtrans\Config;

class MidtransController extends Controller
{
   public function getToken(Request $request)
{
    try {
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = false; // ganti true kalau production

        $selectedMethod = $request->payment_type;
        
        $enabledPayment = [];
        if ($selectedMethod === 'qris') {
            $enabledPayment = ['other_qris'];
        } elseif ($selectedMethod === 'gopay') {
            $enabledPayment = ['gopay'];
        } elseif ($selectedMethod === 'shopee') {
            $enabledPayment = ['shopeepay'];
        } else {
            $enabledPayment = ['other_qris', 'gopay', 'shopeepay'];
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
            'enabled_payments' => $enabledPayment
        ];

        $snapToken = Snap::getSnapToken($params);

        return response()->json(['token' => $snapToken]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile(),
        ], 500);
    }
}
}