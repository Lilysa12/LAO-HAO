<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Table;
use App\Models\Order;
use App\Models\Transaction; 
use App\Models\Inventory;
use App\Models\Menu;

class CashierController extends Controller
{
    // ==========================================
    // MEJA (TABLES)
    // ==========================================
    public function getTables()
    {
        $tables = Table::all();
        if ($tables->isEmpty()) {
            $defaultTables = [
                ['table_number' => '01', 'area' => 'indoor', 'capacity' => 2, 'status' => 'tersedia', 'created_at' => now(), 'updated_at' => now()],
                ['table_number' => '02', 'area' => 'indoor', 'capacity' => 2, 'status' => 'lunas', 'created_at' => now(), 'updated_at' => now()],
                ['table_number' => '03', 'area' => 'indoor', 'capacity' => 4, 'status' => 'tersedia', 'created_at' => now(), 'updated_at' => now()],
                ['table_number' => '04', 'area' => 'indoor', 'capacity' => 4, 'status' => 'pending', 'created_at' => now(), 'updated_at' => now()],
                ['table_number' => '05', 'area' => 'indoor', 'capacity' => 6, 'status' => 'tersedia', 'created_at' => now(), 'updated_at' => now()],
                ['table_number' => 'VIP-1', 'area' => 'indoor', 'capacity' => 8, 'status' => 'lunas', 'created_at' => now(), 'updated_at' => now()],
                ['table_number' => 'OUT-1', 'area' => 'outdoor', 'capacity' => 2, 'status' => 'tersedia', 'created_at' => now(), 'updated_at' => now()],
                ['table_number' => 'OUT-2', 'area' => 'outdoor', 'capacity' => 4, 'status' => 'pending', 'created_at' => now(), 'updated_at' => now()],
                ['table_number' => 'OUT-3', 'area' => 'outdoor', 'capacity' => 4, 'status' => 'tersedia', 'created_at' => now(), 'updated_at' => now()],
            ];
            Table::insert($defaultTables);
            $tables = Table::all(); 
        }
        return response()->json($tables);
    }

    public function updateTableStatus(Request $request, $id)
    {
        $table = Table::find($id);
        if (!$table) return response()->json(['message' => 'Meja tidak ditemukan'], 404);
        $table->status = $request->status;
        $table->save();
        return response()->json(['message' => 'Status meja diperbarui!', 'data' => $table]);
    }

    // ==========================================
    // PESANAN DAPUR (LIVE ORDERS)
    // ==========================================
    public function getOrders()
    {
        $orders = Order::where('status', '!=', 'selesai')->orderBy('created_at', 'asc')->get();

        $formattedOrders = $orders->map(function ($order) {
            $order->formatted_time = $order->created_at ? $order->created_at->format('h:i A') : '00:00';
            if (strtolower($order->status) === 'pending') {
                $order->status = 'diproses';
            }
            if (is_string($order->items)) {
                $order->items = json_decode($order->items, true);
            }
            $order->payment_status = $order->payment_method ? 'LUNAS' : 'BELUM BAYAR';
            return $order;
        });

        return response()->json($formattedOrders);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        $order->status = $request->status;
        $order->save();
        return response()->json(['message' => 'Status pesanan diperbarui!', 'data' => $order]);
    }

    public function storeOrder(Request $request)
    {
        $orderId = 'LHO-' . rand(10000, 99999);

        $order = Order::create([
            'order_id' => $orderId,
            'customer_name' => $request->customer_name,
            'table_number' => $request->table_number ?? 'Takeaway',
            'items' => $request->items, 
            'subtotal' => $request->subtotal,
            'tax' => $request->tax,
            'total_payment' => $request->total_payment,
            'payment_method' => $request->payment_status === 'LUNAS' ? 'CASH' : null,
            'status' => 'diproses',
        ]);

        if ($request->table_number && $request->table_number !== 'Takeaway') {
            $table = Table::where('table_number', $request->table_number)->first();
            if ($table) {
                $table->status = $request->payment_status === 'LUNAS' ? 'lunas' : 'pending';
                $table->save();
            }
        }

        if ($request->payment_status === 'LUNAS') {
            Transaction::insert([
                'invoice_no' => $orderId,
                'customer_name' => $request->customer_name,
                'payment_method' => 'CASH', 
                'total_amount' => 'Rp ' . number_format($request->total_payment, 0, ',', '.'),
                'status' => 'BERHASIL',
                'branch' => 'Pusat (Kasir 01)',
                'transaction_time' => now()->format('d M Y, H:i'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json(['message' => 'Pesanan berhasil diproses!', 'data' => $order]);
    }

    // ==========================================
    // LAPORAN & RIWAYAT (KASIR) - DIPERBARUI
    // ==========================================
    public function getHistory()
    {
        $transactions = Transaction::orderBy('created_at', 'desc')->get();
        
        $formattedHistory = $transactions->map(function ($trx) {
            $statusKasir = 'LUNAS';
            if ($trx->status === 'DIBATALKAN' || $trx->status === 'BATAL') {
                $statusKasir = 'BATAL';
            }
            return [
                'id' => $trx->id, 
                'inv' => $trx->invoice_no, 
                'time' => $trx->transaction_time,
                'date_iso' => $trx->created_at ? $trx->created_at->format('Y-m-d') : now()->format('Y-m-d'), // KUNCI FILTERING
                'customer' => $trx->customer_name, 
                'method' => $trx->payment_method,
                'total' => $trx->total_amount, 
                'status' => $statusKasir,
                'table' => 'M-General', 
                'cashier' => 'Cashier 01' 
            ];
        });

        return response()->json($formattedHistory);
    }

    // ==========================================
    // STOK & MENU (INVENTORY)
    // ==========================================
    public function getInventory()
    {
        $items = Inventory::orderBy('created_at', 'desc')->get();
        $formatted = $items->map(function($item) {
            return [
                'id' => $item->id, 'nama' => $item->name, 'kategori' => $item->category,
                'sisa' => $item->stock, 'unit' => $item->unit, 'min' => $item->min_stock,
                'minUnit' => $item->unit, 'price' => $item->price_per_unit,
                'status' => $item->stock <= $item->min_stock ? 'STOK MENIPIS' : 'AMAN',
                'update' => $item->updated_at ? $item->updated_at->format('d M Y, H:i') : 'Baru Saja'
            ];
        });
        return response()->json($formatted);
    }

    public function storeInventory(Request $request) { /* ... */ }
    public function updateInventory(Request $request, $id) { /* ... */ }
    public function destroyInventory($id) { /* ... */ }

    // ==========================================
    // MANAJEMEN MENU
    // ==========================================
    public function getMenus()
    {
        $menus = Menu::orderBy('id', 'desc')->get();
        $formattedMenus = $menus->map(function ($menu) {
            $imgUrl = (!empty($menu->image_url) && $menu->image_url !== 'default.png') 
                      ? $menu->image_url 
                      : 'https://ui-avatars.com/api/?name='.urlencode($menu->name).'&background=f1f5f9&color=64748b&size=150';
            return [
                'id' => $menu->id, 'name' => $menu->name, 'price' => $menu->price,
                'category' => $menu->category, 'description' => $menu->description,
                'img' => $imgUrl, 'isActive' => true
            ];
        });
        return response()->json($formattedMenus);
    }

    public function storeMenu(Request $request) { /* ... */ }
    public function updateMenu(Request $request, $id) { /* ... */ }
    public function destroyMenu($id) { /* ... */ }
}