<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Table;
use App\Models\Order;
use App\Models\Transaction; 
use App\Models\Inventory; // <-- WAJIB TAMBAHKAN INI

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

        if (Order::count() == 0) {
            Order::create([
                'order_id' => 'ORD-003', 'table_number' => '15', 'customer_name' => 'Andi',
                'items' => [['qty' => 3, 'name' => 'Kopi Susu Lao-Hao'], ['qty' => 2, 'name' => 'Roti Bakar Kaya']],
                'payment_status' => 'LUNAS', 'status' => 'diproses'
            ]);

            Order::create([
                'order_id' => 'ORD-004', 'table_number' => '04', 'customer_name' => 'Joko',
                'items' => [['qty' => 1, 'name' => 'Nasi Lemak'], ['qty' => 1, 'name' => 'Kopi Hitam']],
                'payment_status' => 'LUNAS', 'status' => 'siap'
            ]);
            $orders = Order::where('status', '!=', 'selesai')->orderBy('created_at', 'asc')->get();
        }

        $formattedOrders = $orders->map(function ($order) {
            $order->formatted_time = $order->created_at->format('h:i A');
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

    // ==========================================
    // LAPORAN & RIWAYAT (KASIR)
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
                'id' => $trx->id, 'inv' => $trx->invoice_no, 'time' => $trx->transaction_time,
                'customer' => $trx->customer_name, 'method' => $trx->payment_method,
                'total' => $trx->total_amount, 'status' => $statusKasir,
                'table' => 'M-General', 'cashier' => 'Cashier 01' 
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

        // LOGIKA PINTAR: Suntik data awal jika kosong
        if ($items->isEmpty()) {
            $defaultItems = [
                ['name' => 'Beras Pandan Wangi', 'category' => 'Bahan Pokok', 'stock' => 45, 'unit' => 'kg', 'min_stock' => 20, 'price_per_unit' => 15000, 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Minyak Goreng', 'category' => 'Bahan Pokok', 'stock' => 12, 'unit' => 'liter', 'min_stock' => 15, 'price_per_unit' => 18000, 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Biji Kopi Robusta', 'category' => 'Minuman', 'stock' => 5, 'unit' => 'kg', 'min_stock' => 10, 'price_per_unit' => 85000, 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Telur Ayam', 'category' => 'Bahan Pokok', 'stock' => 150, 'unit' => 'butir', 'min_stock' => 50, 'price_per_unit' => 2500, 'created_at' => now(), 'updated_at' => now()],
                ['name' => 'Roti Tawar', 'category' => 'Cemilan', 'stock' => 8, 'unit' => 'bungkus', 'min_stock' => 20, 'price_per_unit' => 16000, 'created_at' => now(), 'updated_at' => now()],
            ];
            Inventory::insert($defaultItems);
            $items = Inventory::orderBy('created_at', 'desc')->get();
        }

        $formatted = $items->map(function($item) {
            return [
                'id' => $item->id,
                'nama' => $item->name,
                'kategori' => $item->category,
                'sisa' => $item->stock,
                'unit' => $item->unit,
                'min' => $item->min_stock,
                'minUnit' => $item->unit,
                'price' => $item->price_per_unit,
                'status' => $item->stock <= $item->min_stock ? 'STOK MENIPIS' : 'AMAN',
                'update' => $item->updated_at->format('d M Y, H:i')
            ];
        });

        return response()->json($formatted);
    }

    public function storeInventory(Request $request)
    {
        $item = Inventory::create($request->all());
        return response()->json(['message' => 'Bahan berhasil ditambahkan!', 'data' => $item]);
    }

    public function updateInventory(Request $request, $id)
    {
        $item = Inventory::find($id);
        if (!$item) return response()->json(['message' => 'Data tidak ditemukan'], 404);
        
        $item->update($request->all());
        return response()->json(['message' => 'Stok berhasil diperbarui!', 'data' => $item]);
    }

    public function destroyInventory($id)
    {
        $item = Inventory::find($id);
        if ($item) {
            $item->delete();
            return response()->json(['message' => 'Bahan berhasil dihapus.']);
        }
        return response()->json(['message' => 'Data tidak ditemukan.'], 404);
    }
}