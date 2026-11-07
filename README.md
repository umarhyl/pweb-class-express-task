# Tugas 2: API Produk ExpressJS dengan Prisma ORM & SQLite

Kelanjutan dari tugas sebelumnya dengan mengintegrasikan **Prisma ORM** dan database **SQLite** untuk mendukung persistensi data dan operasi CRUD (*Create, Read, Update, Delete*) secara penuh.

---

## 1. Fitur Utama

- **GET `/products`**: Menampilkan seluruh data produk dari database.
- **GET `/products/:id`**: Menampilkan data produk spesifik berdasarkan ID.
- **POST `/products`**: Membuat data produk baru (validasi nama & harga).
- **PUT `/products` & `/products/:id`**: Mengupdate data produk yang sudah ada (mendukung ID pada body request sesuai ketentuan tugas maupun pada parameter URL).
- **DELETE `/products/:id`**: Menghapus data produk yang sudah ada berdasarkan ID.

---

## 2. Struktur Proyek

```text
express/
├── config/
│   └── prisma.js              # Inisialisasi singleton PrismaClient
├── controllers/
│   └── productController.js   # Logika bisnis & query database via Prisma ORM
├── prisma/
│   ├── migrations/            # Riwayat migrasi database
│   ├── schema.prisma          # Skema database SQLite dan model Product
│   └── seed.js                # Data awal (seeder) produk
├── routes/
│   └── productRoutes.js       # Definisi mapping route HTTP (GET, POST, PUT, DELETE)
├── screenshots/               # Bukti pengujian & evidence
├── .env.example               # Contoh konfigurasi environment variable
├── .gitignore                 # File dan folder yang diabaikan Git
├── app.js                     # Setup server Express dan middleware
├── package.json               # Konfigurasi proyek, script npm, dan dependensi
├── README.md                  # Dokumentasi lengkap proyek
└── test.js                    # Script pengujian otomatis seluruh skenario API
```

---

## 3. Petunjuk Menjalankan

### Persyaratan
- Node.js (v18+)
- npm

### Langkah-langkah

1. **Install dependensi:**
   ```powershell
   npm install
   ```

2. **Salin environment file:**
   ```powershell
   Copy-Item .env.example .env
   ```

3. **Jalankan migrasi database:**
   ```powershell
   npx prisma migrate dev
   ```

4. **Seed data awal produk (Buku & Pulpen):**
   ```powershell
   npm run seed
   ```

5. **Menjalankan Server:**
   ```powershell
   npm start
   ```
   Server akan aktif di `http://localhost:3000`.

6. **Menjalankan Pengujian Otomatis:**
   ```powershell
   npm test
   ```

7. **Melihat & Memanipulasi Database via UI (Prisma Studio):**
   ```powershell
   npm run studio
   ```
   Prisma Studio akan terbuka di browser pada `http://localhost:5555`.

---

## 4. Daftar Endpoint API

| Method | Endpoint | Deskripsi | Status Code | Request Body | Response Sukses |
|---|---|---|---|---|---|
| `GET` | `/products` | Mengambil seluruh data produk dari DB | `200 OK` | - | Array produk JSON |
| `GET` | `/products/:id` | Mengambil detail produk berdasarkan ID | `200 OK` / `404 Not Found` | - | Objek produk JSON / Pesan error |
| `POST` | `/products` | Menambah data produk baru | `201 Created` / `400 Bad Request` | `{"name": "...", "price": ...}` | Objek produk baru JSON |
| `PUT` | `/products` | Mengupdate produk (ID di request body) | `200 OK` / `400` / `404` | `{"id": 1, "name": "...", "price": ...}` | Objek produk terupdate JSON |
| `PUT` | `/products/:id` | Mengupdate produk (ID di parameter URL) | `200 OK` / `400` / `404` | `{"name": "...", "price": ...}` | Objek produk terupdate JSON |
| `DELETE` | `/products/:id` | Menghapus data produk berdasarkan ID | `200 OK` / `404 Not Found` | - | Pesan konfirmasi & produk terhapus |

---

## 5. Contoh Request & Response

### 1. `GET /products`
- **Response (200 OK):**
```json
[
  { "id": 1, "name": "Buku", "price": 15000 },
  { "id": 2, "name": "Pulpen", "price": 5000 }
]
```

### 2. `POST /products`
- **Request Body (JSON):**
```json
{
  "name": "Penghapus",
  "price": 3000
}
```
- **Response (201 Created):**
```json
{
  "id": 3,
  "name": "Penghapus",
  "price": 3000
}
```

### 3. `PUT /products` (Sesuai Ketentuan Tugas: Body sama dengan POST + tambahan `id`)
- **Request Body (JSON):**
```json
{
  "id": 2,
  "name": "Pulpen Gel Hitam",
  "price": 8000
}
```
- **Response (200 OK):**
```json
{
  "id": 2,
  "name": "Pulpen Gel Hitam",
  "price": 8000
}
```

### 4. `DELETE /products/1`
- **Response (200 OK):**
```json
{
  "message": "Produk berhasil dihapus",
  "deletedProduct": {
    "id": 1,
    "name": "Buku",
    "price": 15000
  }
}
```

### 5. Kasus Error & Validasi
- **POST `/products` tanpa nama/harga:** Status `400 Bad Request`
  ```json
  { "message": "Nama dan harga produk wajib diisi" }
  ```
- **PUT `/products` tanpa ID:** Status `400 Bad Request`
  ```json
  { "message": "ID produk harus berupa angka dan wajib diisi" }
  ```
- **GET / PUT / DELETE dengan ID tidak ditemukan:** Status `404 Not Found`
  ```json
  { "message": "Produk tidak ditemukan" }
  ```

---

## 6. Laporan Hasil Pengujian Otomatis

Log eksekusi dari skrip pengujian otomatis (`node test.js`):

```text
=== PENGUJIAN API PRODUK PRISMA ORM ===

[1] Menguji GET /products (Semua data produk)
Status: 200 -> SUKSES (200 OK)

[2] Menguji GET /products/1
Status: 200 -> SUKSES (200 OK)

[3] Menguji GET /products/999 (Kasus 404)
Status: 404 -> SUKSES (404 Not Found)

[4] Menguji POST /products (Menambah produk baru)
Status: 201 -> SUKSES (201 Created)

[5] Menguji POST /products (Validasi error - nama kosong)
Status: 400 -> SUKSES (400 Bad Request)

[6] Menguji PUT /products (Update produk dengan id di body)
Status: 200 -> SUKSES (200 OK)

[7] Menguji PUT /products (ID tidak ditemukan di database)
Status: 404 -> SUKSES (404 Not Found)

[8] Menguji DELETE /products/1 (Menghapus produk ID: 1)
Status: 200 -> SUKSES (200 OK)

[9] Menguji DELETE /products/999 (Kasus 404)
Status: 404 -> SUKSES (404 Not Found)

[10] Verifikasi Akhir Data di Database via GET /products
Status: 200 -> SUKSES (Data tersinkronisasi di SQLite via Prisma)

=== SEMUA PENGUJIAN SELESAI DENGAN SUKSES ===
```

---

## 7. Panduan Pengambilan Evidence (Tugas Laporan)

Sesuai instruksi pengumpulan tugas:
1. **Scenario API (Postman / Bruno / Hoppscotch):**
   - Jalankan server dengan `npm start`.
   - Lakukan request untuk setiap skenario (GET semua, POST baru, PUT dengan body berisi id, DELETE dengan id, dan kasus error validasi/404).
   - Screenshot tampilan response di Postman/Bruno.
2. **Perubahan Database (Before - After):**
   - Jalankan `npm run studio` untuk membuka Prisma Studio di browser.
   - Screenshot tabel `Product` sebelum operasi POST/PUT/DELETE dilakukan (*before*).
   - Lakukan penambahan/perubahan/penghapusan data.
   - Screenshot tabel `Product` di Prisma Studio setelah operasi selesai (*after*).
