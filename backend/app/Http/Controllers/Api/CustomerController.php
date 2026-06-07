<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Order;
use App\Models\Promo;
use App\Models\Voucher;
use App\Models\Branch;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function getMenus()
{
    $menus = Menu::query()
        ->orderBy('id')
        ->get();

    return response()->json($menus);
}
    public function getBranches()
{
    $branches = Branch::query()
        ->orderBy('id')
        ->get();

    return response()->json($branches);
}
    public function getPromos()
{
    $promos = Promo::query()
        ->where('status', 'AKTIF')
        ->orderBy('id')
        ->get();

    return response()->json($promos);
}
    public function getPromoDetail($id)
{
    $promo = Promo::find($id);

    if (!$promo) {
        return response()->json([
            'success' => false,
            'message' => 'Promo tidak ditemukan'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $promo
    ]);
}
    public function createOrder(Request $request)
{
    $request->validate([
    'customer_name' => 'required',
    'phone_number' => 'required',
    'items' => 'required',
    'subtotal' => 'required|numeric',
    'total_payment' => 'required|numeric',
    'branch_id' => 'required'
]);

    $order = Order::create([
        'order_id' => 'ORD-' . time(),

        'customer_name' => $request->customer_name,
        'phone_number' => $request->phone_number,

        'table_number' => $request->table_number,

        'items' => $request->items,

        'subtotal' => $request->subtotal,
        'discount_amount' => $request->discount_amount ?? 0,
        'tax' => $request->tax ?? 0,

        'total_payment' => $request->total_payment,

        'payment_method' => $request->payment_method ?? 'CASH',

        'payment_status' => 'UNPAID',

        'status' => 'PENDING',

        'branch_id' => $request->branch_id,

    ]);

    return response()->json([
        'success' => true,
        'message' => 'Order berhasil dibuat',
        'data' => $order
    ], 201);
}
    public function getOrder($order_id)
{
    $order = Order::where('order_id', $order_id)->first();

    if (!$order) {
        return response()->json([
            'success' => false,
            'message' => 'Order tidak ditemukan'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $order
    ]);
}
    public function cancelOrder($order_id)
{
    $order = Order::where('order_id', $order_id)->first();

    if (!$order) {
        return response()->json([
            'success' => false,
            'message' => 'Order tidak ditemukan'
        ], 404);
    }

    if ($order->status !== 'PENDING') {
        return response()->json([
            'success' => false,
            'message' => 'Order tidak bisa dibatalkan'
        ]);
    }

    $order->status = 'CANCELLED';
    $order->save();

    return response()->json([
        'success' => true,
        'message' => 'Order berhasil dibatalkan'
    ]);
}
    public function getOrderStatus($order_id)
{
    $order = Order::where('order_id', $order_id)->first();

    if (!$order) {
        return response()->json([
            'success' => false,
            'message' => 'Order tidak ditemukan'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'order_id' => $order->order_id,
        'status' => $order->status,
        'payment_status' => $order->payment_status
    ]);
}
    public function getOrderHistory($phone_number)
{
    $orders = Order::where(
        'phone_number',
        $phone_number
    )
    ->orderBy('created_at', 'desc')
    ->get();

    return response()->json([
        'success' => true,
        'data' => $orders
    ]);
}
    public function getVouchers()
{
    $vouchers = Voucher::query()
        ->whereDate('expiry_date', '>=', now())
        ->orderBy('id')
        ->get();

    return response()->json($vouchers);
}
    public function getVoucherDetail($id)
{
    $voucher = Voucher::find($id);

    if (!$voucher) {
        return response()->json([
            'success' => false,
            'message' => 'Voucher tidak ditemukan'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $voucher
    ]);
}
    public function validateVoucher(Request $request)
{
    $voucher = Voucher::find($request->voucher_id);

    if (!$voucher) {
        return response()->json([
            'valid' => false,
            'message' => 'Voucher tidak ditemukan'
        ], 404);
    }

    if (strtotime($voucher->expiry_date) < time()) {
        return response()->json([
            'valid' => false,
            'message' => 'Voucher sudah expired'
        ]);
    }

    if ($request->subtotal < $voucher->min_spend) {
        return response()->json([
            'valid' => false,
            'message' => 'Minimum belanja belum terpenuhi'
        ]);
    }

    $discount = 0;

    if ($voucher->type === 'percent') {
        $discount = ($request->subtotal * $voucher->amount) / 100;
    } else {
        $discount = $voucher->amount;
    }

    return response()->json([
        'valid' => true,
        'voucher' => $voucher->title,
        'discount' => $discount,
        'final_total' => $request->subtotal - $discount
    ]);
}
    public function getMenuDetail($id)
{
    $menu = Menu::find($id);

    if (!$menu) {
        return response()->json([
            'success' => false,
            'message' => 'Menu tidak ditemukan'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $menu
    ]);
}

public function searchMenu($keyword)
{
    $menus = Menu::where('name', 'ILIKE', '%' . $keyword . '%')
        ->orderBy('name')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $menus
    ]);
}
}