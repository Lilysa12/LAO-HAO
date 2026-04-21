<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MidtransController extends Controller
{
    public function getToken(Request $request)
    {
        // Maksa Header CORS dari dalam Controller
        header('Access-Control-Allow-Origin: http://localhost:5173');
        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            return response('', 200);
        }

        try {
            $serverKey = env('MIDTRANS_SERVER_KEY');
            
            // Siapkan payload manual
            $payload = json_encode([
                'transaction_details' => [
                    'order_id' => 'LHO-' . time(),
                    'gross_amount' => (int) $request->total,
                ],
                'customer_details' => [
                    'first_name' => $request->name ?? 'Guest',
                ]
            ]);

            $url = "https://app.sandbox.midtrans.com/snap/v1/transactions";
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Authorization: Basic ' . base64_encode($serverKey . ':')
            ]);
            
            $result = curl_exec($ch);
            curl_close($ch);

            return response($result, 200);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}