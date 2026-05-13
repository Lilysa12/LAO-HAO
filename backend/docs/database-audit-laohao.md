# Audit Database Lao-Hao

## Backup
- CSV backup: selesai
- SQL schema backup: selesai
- SQL data backup: selesai
- Google Drive backup: selesai

## Temuan utama
- branches memiliki 13 cabang resmi.
- users.branch masih berupa text dan belum cocok langsung dengan branches.name.
- transactions.branch masih berupa text dan belum cocok langsung dengan branches.name.
- orders dan transactions belum punya relasi langsung.
- orders.order_id memakai format LHO-xxxxx.
- transactions.invoice_no memakai format #INV-xxxx.
- orders.status masih bercampur antara status order dan status pembayaran.
- orders.table_number sebagian tidak cocok dengan tables.table_number.
- tables.table_number tidak duplikat.
- Data lama tidak boleh dipaksa foreign key langsung.

## Strategi aman
- Tambah kolom baru nullable.
- Jangan hapus kolom lama.
- Coding baru mulai isi kolom relasi baru.
- Foreign key pakai ON DELETE SET NULL.