<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MidtransController extends Controller
{
    public function getToken(Request $request)
    {
        // Header CORS (Pastikan URL sesuai dengan frontend kamu)
        header('Access-Control-Allow-Origin: http://localhost:5173');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

        if ($request->isMethod('options')) {
            return response('', 200);
        }

        try {
            $serverKey = env('MIDTRANS_SERVER_KEY');
            
            if (!$serverKey) {
                return response()->json(['error' => 'Server Key Midtrans belum diatur di .env'], 500);
            }

            // Payload transaksi
            $payload = [
                'transaction_details' => [
                    'order_id' => 'LHO-' . time(),
                    'gross_amount' => (int) $request->total,
                ],
                'customer_details' => [
                    'first_name' => $request->name ?? 'Guest',
                ]
            ];

            $url = "https://app.sandbox.midtrans.com/snap/v1/transactions";
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Authorization: Basic ' . base64_encode($serverKey . ':')
            ]);
            
            $result = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            return response($result, $httpCode)->header('Content-Type', 'application/json');

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}