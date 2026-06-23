<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\Menu;
use App\Models\Order;
use App\Models\Table;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CashierController extends Controller
{
    // ============================================================================
    // MEJA
    // ============================================================================

    public function getTables()
    {
        $tables = Table::query()
            ->orderByRaw("
                case
                    when table_number ~ '^[0-9]+$' then 1
                    when table_number like 'VIP%' then 2
                    when table_number like 'OUT%' then 3
                    else 4
                end
            ")
            ->orderBy('id')
            ->get();

        return response()->json($tables);
    }

    public function storeTable(Request $request)
    {
        $validated = $request->validate([
            'table_number' => 'required|string|max:50|unique:tables,table_number',
            'area' => 'required|string|max:50',
            'capacity' => 'required|integer|min:1',
            'status' => 'required|string|max:50',
            'branch_id' => 'nullable|integer|exists:branches,id',
        ]);

        $table = Table::create([
            'table_number' => $validated['table_number'],
            'area' => $validated['area'],
            'capacity' => $validated['capacity'],
            'status' => $validated['status'],
            'branch_id' => $validated['branch_id'] ?? null,
        ]);

        return response()->json([
            'message' => 'Meja berhasil ditambahkan.',
            'data' => $table,
        ], 201);
    }

    public function updateTable(Request $request, $id)
    {
        $table = Table::find($id);

        if (!$table) {
            return response()->json([
                'message' => 'Meja tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'table_number' => 'required|string|max:50|unique:tables,table_number,' . $table->id,
            'area' => 'required|string|max:50',
            'capacity' => 'required|integer|min:1',
            'status' => 'required|string|max:50',
            'branch_id' => 'nullable|integer|exists:branches,id',
        ]);

        $table->update([
            'table_number' => $validated['table_number'],
            'area' => $validated['area'],
            'capacity' => $validated['capacity'],
            'status' => $validated['status'],
            'branch_id' => $validated['branch_id'] ?? null,
        ]);

        return response()->json([
            'message' => 'Meja berhasil diperbarui.',
            'data' => $table->fresh(),
        ]);
    }

    public function destroyTable($id)
    {
        $table = Table::find($id);

        if (!$table) {
            return response()->json([
                'message' => 'Meja tidak ditemukan.',
            ], 404);
        }

        $table->delete();

        return response()->json([
            'message' => 'Meja berhasil dihapus.',
        ]);
    }

    public function updateTableStatus(Request $request, $id)
    {
        $table = Table::find($id);

        if (!$table) {
            return response()->json([
                'message' => 'Meja tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|max:50',
        ]);

        $table->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Status meja berhasil diperbarui.',
            'data' => $table->fresh(),
        ]);
    }

    // ============================================================================
    // PESANAN KASIR / DAPUR
    // ============================================================================

    public function getOrders()
    {
        $orders = Order::query()
            ->with(['branchData', 'tableData'])
            ->whereNotIn(DB::raw('lower(status)'), ['selesai'])
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($order) {
                return $this->formatOrder($order);
            });

        return response()->json($orders);
    }

    public function storeOrder(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'nullable|string|max:100|unique:orders,order_id',
            'customer_name' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:50',
            'table_number' => 'nullable|string|max:50',
            'items' => 'nullable',
            'subtotal' => 'required|numeric',
            'discount_amount' => 'nullable|numeric',
            'tax' => 'nullable|numeric',
            'total_payment' => 'required|numeric',
            'payment_method' => 'nullable|string|max:100',
            'payment_status' => 'nullable|string|max:50',
            'status' => 'required|string|max:50',
            'branch_id' => 'nullable|integer|exists:branches,id',
            'table_id' => 'nullable|integer|exists:tables,id',
        ]);

        $order = DB::transaction(function () use ($validated) {
            $order = Order::create([
                'order_id' => $validated['order_id'] ?? $this->generateOrderCode(),
                'customer_name' => $validated['customer_name'] ?? null,
                'phone_number' => $validated['phone_number'] ?? null,
                'table_number' => $validated['table_number'] ?? null,
                'items' => $this->encodeItems($validated['items'] ?? null),
                'subtotal' => $validated['subtotal'],
                'discount_amount' => $validated['discount_amount'] ?? null,
                'tax' => $validated['tax'] ?? null,
                'total_payment' => $validated['total_payment'],
                'payment_method' => $validated['payment_method'] ?? null,
                'payment_status' => $validated['payment_status'] ?? null,
                'status' => $validated['status'],
                'branch_id' => $validated['branch_id'] ?? null,
                'table_id' => $validated['table_id'] ?? null,
            ]);

            $isPaid = in_array(strtoupper((string) ($validated['payment_status'] ?? $validated['status'])), [
                'PAID',
                'LUNAS',
                'BERHASIL',
                'SELESAI',
            ], true);

            if ($isPaid) {
                Transaction::create([
                    'invoice_no' => $order->order_id,
                    'order_id' => $order->id,
                    'branch_id' => $order->branch_id,
                    'transaction_time' => now()->format('d M Y, H:i'),
                    'customer_name' => $order->customer_name,
                    'payment_method' => $order->payment_method,
                    'total_amount' => $this->formatRupiahValue($order->total_payment),
                    'status' => 'BERHASIL',
                    'branch' => optional($order->branchData)->name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return $order->fresh(['branchData', 'tableData']);
        });

        return response()->json([
            'message' => 'Pesanan berhasil ditambahkan.',
            'data' => $this->formatOrder($order),
        ], 201);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Pesanan tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|max:50',
            'payment_status' => 'nullable|string|max:50',
        ]);

        $order->status = $validated['status'];

        if (array_key_exists('payment_status', $validated)) {
            $order->payment_status = $validated['payment_status'];
        }

        $order->save();

        return response()->json([
            'message' => 'Status pesanan berhasil diperbarui.',
            'data' => $this->formatOrder($order->fresh(['branchData', 'tableData'])),
        ]);
    }

    // ============================================================================
    // RIWAYAT KASIR
    // ============================================================================

    public function getHistory()
    {
        $transactions = Transaction::query()
            ->with(['branchData', 'orderData.tableData'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($transaction) {
                return $this->formatTransaction($transaction);
            });

        return response()->json($transactions);
    }

    // ============================================================================
    // INVENTORY
    // ============================================================================

    public function getInventory()
    {
        $items = Inventory::query()
            ->orderBy('id')
            ->get()
            ->map(function ($item) {
                return $this->formatInventory($item);
            });

        return response()->json($items);
    }

    public function storeInventory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'stock' => 'required|integer|min:0',
            'unit' => 'nullable|string|max:50',
            'min_stock' => 'nullable|integer|min:0',
            'price_per_unit' => 'nullable|integer|min:0',
            'last_note' => 'nullable|string',
            'last_restock_quantity' => 'nullable|integer|min:0',
            'last_restock_at' => 'nullable|date',
        ]);

        $inventory = Inventory::create([
            'name' => $validated['name'],
            'category' => $validated['category'] ?? null,
            'stock' => $validated['stock'],
            'unit' => $validated['unit'] ?? null,
            'min_stock' => $validated['min_stock'] ?? null,
            'price_per_unit' => $validated['price_per_unit'] ?? null,
            'last_note' => $validated['last_note'] ?? null,
            'last_restock_quantity' => $validated['last_restock_quantity'] ?? null,
            'last_restock_at' => $validated['last_restock_at'] ?? null,
        ]);

        return response()->json([
            'message' => 'Inventory berhasil ditambahkan.',
            'data' => $this->formatInventory($inventory),
        ], 201);
    }

    public function updateInventory(Request $request, $id)
    {
        $inventory = Inventory::find($id);

        if (!$inventory) {
            return response()->json([
                'message' => 'Inventory tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'stock' => 'required|integer|min:0',
            'unit' => 'nullable|string|max:50',
            'min_stock' => 'nullable|integer|min:0',
            'price_per_unit' => 'nullable|integer|min:0',
            'last_note' => 'nullable|string',
            'last_restock_quantity' => 'nullable|integer|min:0',
            'last_restock_at' => 'nullable|date',
        ]);

        $inventory->update([
            'name' => $validated['name'],
            'category' => $validated['category'] ?? null,
            'stock' => $validated['stock'],
            'unit' => $validated['unit'] ?? null,
            'min_stock' => $validated['min_stock'] ?? null,
            'price_per_unit' => $validated['price_per_unit'] ?? null,
            'last_note' => $validated['last_note'] ?? null,
            'last_restock_quantity' => $validated['last_restock_quantity'] ?? null,
            'last_restock_at' => $validated['last_restock_at'] ?? null,
        ]);

        return response()->json([
            'message' => 'Inventory berhasil diperbarui.',
            'data' => $this->formatInventory($inventory->fresh()),
        ]);
    }

    public function destroyInventory($id)
    {
        $inventory = Inventory::find($id);

        if (!$inventory) {
            return response()->json([
                'message' => 'Inventory tidak ditemukan.',
            ], 404);
        }

        $inventory->delete();

        return response()->json([
            'message' => 'Inventory berhasil dihapus.',
        ]);
    }

    // ============================================================================
    // MENU
    // ============================================================================

    public function getMenus()
    {
        $menus = Menu::query()
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($menu) {
                return $this->formatMenu($menu);
            });

        return response()->json($menus);
    }

    public function storeMenu(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        $menu = Menu::create([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'category' => $validated['category'] ?? null,
            'description' => $validated['description'] ?? null,
            'image_url' => $validated['image_url'] ?? null,
        ]);

        return response()->json([
            'message' => 'Menu berhasil ditambahkan.',
            'data' => $this->formatMenu($menu),
        ], 201);
    }

    public function updateMenu(Request $request, $id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'message' => 'Menu tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        $menu->update([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'category' => $validated['category'] ?? null,
            'description' => $validated['description'] ?? null,
            'image_url' => $validated['image_url'] ?? null,
        ]);

        return response()->json([
            'message' => 'Menu berhasil diperbarui.',
            'data' => $this->formatMenu($menu->fresh()),
        ]);
    }

    public function destroyMenu($id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'message' => 'Menu tidak ditemukan.',
            ], 404);
        }

        $menu->delete();

        return response()->json([
            'message' => 'Menu berhasil dihapus.',
        ]);
    }

    // ============================================================================
    // HELPER
    // ============================================================================

    private function formatOrder(Order $order): array
    {
        return [
            'id' => $order->id,
            'order_id' => $order->order_id,
            'customer_name' => $order->customer_name,
            'phone_number' => $order->phone_number,
            'table_number' => $order->table_number,
            'table_id' => $order->table_id,
            'items' => $this->decodeItems($order->items),
            'subtotal' => $order->subtotal,
            'discount_amount' => $order->discount_amount,
            'tax' => $order->tax,
            'total_payment' => $order->total_payment,
            'payment_method' => $order->payment_method,
            'payment_status' => $order->payment_status,
            'status' => $order->status,
            'branch_id' => $order->branch_id,
            'branch' => $order->branchData ? $order->branchData->name : null,
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
            'formatted_time' => $order->created_at ? $order->created_at->format('h:i A') : null,
            'tableData' => $order->tableData,
            'branchData' => $order->branchData,
        ];
    }

    private function formatTransaction(Transaction $transaction): array
    {
        $order = $transaction->orderData;
        $table = $order ? $order->tableData : null;
        $displayTable = $this->getDisplayTable($order, $table);

        return [
            'id' => $transaction->id,
            'invoice_no' => $transaction->invoice_no,
            'transaction_time' => $transaction->transaction_time,
            'customer_name' => $transaction->customer_name,
            'payment_method' => $transaction->payment_method,
            'total_amount' => $transaction->total_amount,
            'status' => $transaction->status,
            'branch' => optional($transaction->branchData)->name,
            'branch_id' => $transaction->branch_id,
            'order_id' => $transaction->order_id,
            'created_at' => $transaction->created_at,
            'updated_at' => $transaction->updated_at,
            'branchData' => $transaction->branchData,
            'orderData' => $transaction->orderData,

            // Field kompatibilitas frontend kasir.
            // Semua value berasal dari Supabase dan relasi tabel.
            'inv' => $transaction->invoice_no,
            'time' => $transaction->transaction_time,
            'date_iso' => $transaction->created_at ? $transaction->created_at->format('Y-m-d') : null,
            'customer' => $transaction->customer_name,
            'method' => $transaction->payment_method,
            'total' => $transaction->total_amount,
            'table' => $displayTable,
        ];
    }

    private function formatInventory(Inventory $item): array
    {
        $stock = (int) $item->stock;
        $minStock = (int) $item->min_stock;

        return [
            'id' => $item->id,
            'name' => $item->name,
            'category' => $item->category,
            'stock' => $stock,
            'unit' => $item->unit,
            'min_stock' => $minStock,
            'price_per_unit' => $item->price_per_unit,
            'last_note' => $item->last_note,
            'last_restock_quantity' => $item->last_restock_quantity,
            'last_restock_at' => $item->last_restock_at,
            'created_at' => $item->created_at,
            'updated_at' => $item->updated_at,

            // Field kompatibilitas frontend lama.
            // Semua value tetap berasal dari Supabase.
            'nama' => $item->name,
            'kategori' => $item->category,
            'sisa' => $stock,
            'min' => $minStock,
            'minUnit' => $item->unit,
            'price' => $item->price_per_unit,
            'status' => $stock <= $minStock ? 'STOK MENIPIS' : 'AMAN',
            'update' => $item->updated_at,
            'catatan' => $item->last_note,
        ];
    }

    private function formatMenu(Menu $menu): array
    {
        return [
            'id' => $menu->id,
            'name' => $menu->name,
            'price' => $menu->price,
            'category' => $menu->category,
            'description' => $menu->description,
            'image_url' => $menu->image_url,

            // Field kompatibilitas frontend.
            // Nilainya tetap berasal dari kolom image_url Supabase.
            'img' => $menu->image_url,
        ];
    }

    private function getDisplayTable(?Order $order, ?Table $table): string
    {
        if ($table && $table->table_number) {
            return 'M-' . str_pad($table->table_number, 2, '0', STR_PAD_LEFT);
        }

        if ($order && $order->table_number) {
            return $order->table_number;
        }

        return '-';
    }

    private function encodeItems($items): ?string
    {
        if ($items === null) {
            return null;
        }

        if (is_string($items)) {
            return $items;
        }

        return json_encode($items);
    }

    private function decodeItems($items)
    {
        if ($items === null) {
            return null;
        }

        // Jika sudah berbentuk array (jarang terjadi di pgsql string, tapi jaga-jaga)
        if (is_array($items)) {
            return $items;
        }

        if (!is_string($items) || trim($items) === '') {
            return null;
        }

        // Coba decode JSON
        $decoded = json_decode($items, true);

        // Jika berhasil decode dan bentuknya array, kembalikan array tersebut
        if (is_array($decoded)) {
            return $decoded;
        }

        // ✅ PERBAIKAN: Jika BUKAN JSON (teks murni seperti "Nasi Ayam (1)"), 
        // jangan kembalikan null! Kembalikan saja string aslinya agar React bisa memprosesnya.
        return trim($items);
    }

    private function generateOrderCode(): string
    {
        do {
            $orderCode = 'LHO-' . random_int(10000, 99999);
        } while (Order::where('order_id', $orderCode)->exists());

        return $orderCode;
    }

    private function formatRupiahValue($amount): string
    {
        return 'Rp ' . number_format((float) $amount, 0, ',', '.');
    }
}