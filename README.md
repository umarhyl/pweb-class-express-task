# Tugas: API Daftar Produk (ExpressJS)

Proyek REST API sederhana menggunakan ExpressJS tanpa database (in-memory array) dengan arsitektur pemisahan Route dan Controller.

---

## 1. Struktur Proyek

```text
express/
├── controllers/
│   └── productController.js   # Logika bisnis & manipulasi data array
├── routes/
│   └── productRoutes.js       # Definisi mapping route & endpoint HTTP
├── app.js                     # Inisialisasi Express & middleware
├── package.json               # Konfigurasi dependensi dan script
├── test.js                    # Script pengujian otomatis endpoint
├── README.md                  # Dokumentasi & bukti pengujian
└── .gitignore
```

---

## 2. Petunjuk Menjalankan

### Persyaratan
- Node.js (v18+)
- npm

### Langkah-langkah

1. **Buka terminal dan masuk ke folder proyek:**
   ```powershell
   cd C:\Users\umarb\Documents\kuliah\semester-3\pemweb\kelas\express
   ```

2. **Install dependensi:**
   ```powershell
   npm install
   ```

3. **Menjalankan Server:**
   ```powershell
   npm start
   ```
   Server akan aktif di `http://localhost:3000`.

4. **Menjalankan Pengujian Otomatis:**
   ```powershell
   npm test
   ```

---

## 3. Daftar Endpoint

| Method | Endpoint | Deskripsi | Status Code | Request Body | Response Sukses |
|---|---|---|---|---|---|
| `GET` | `/products` | Mengambil semua produk | `200 OK` | - | Array produk JSON |
| `GET` | `/products/:id` | Mengambil produk berdasarkan ID | `200 OK` / `404 Not Found` | - | Objek produk JSON / Pesan error |
| `POST` | `/products` | Menambah produk baru | `201 Created` / `400 Bad Request` | `{"name": "...", "price": ...}` | Objek produk baru JSON |

### Contoh Request & Response

#### 1. `GET /products`
- **Response (200 OK):**
```json
[
  { "id": 1, "name": "Buku", "price": 15000 },
  { "id": 2, "name": "Pulpen", "price": 5000 }
]
```

#### 2. `GET /products/1`
- **Response (200 OK):**
```json
{
  "id": 1,
  "name": "Buku",
  "price": 15000
}
```

#### 3. `GET /products/999`
- **Response (404 Not Found):**
```json
{
  "message": "Produk tidak ditemukan"
}
```

#### 4. `POST /products`
- **Request Body (JSON):**
```json
{
  "name": "Penggaris",
  "price": 7000
}
```
- **Response (201 Created):**
```json
{
  "id": 3,
  "name": "Penggaris",
  "price": 7000
}
```

---

## 4. Bukti Pengujian (Uji Skenario & Screenshot)

Screenshot hasil pengujian tersimpan di folder `screenshots/`:
- `screenshots/01-get-products.png` : Pengujian GET /products (Status: 200 OK)
- `screenshots/02-get-product-1.png` : Pengujian GET /products/1 (Status: 200 OK)
- `screenshots/03-get-product-999-404.png` : Pengujian GET /products/999 (Status: 404 Not Found)
- `screenshots/04-post-products-201.png` : Pengujian POST /products (Status: 201 Created)
- `screenshots/05-npm-test-summary.png` : Ringkasan eksekusi otomatis npm test

### Log Eksekusi Pengujian:

```text
=== PENGUJIAN API PRODUK (Port: 54818) ===

[1] Menguji GET /products
Status: 200
Response: [
  {
    "id": 1,
    "name": "Buku",
    "price": 15000
  },
  {
    "id": 2,
    "name": "Pulpen",
    "price": 5000
  }
]
-> SUKSES (200 OK)

[2] Menguji GET /products/1
Status: 200
Response: {
  "id": 1,
  "name": "Buku",
  "price": 15000
}
-> SUKSES (200 OK)

[3] Menguji GET /products/999 (Kasus 404)
Status: 404
Response: {
  "message": "Produk tidak ditemukan"
}
-> SUKSES (404 Not Found)

[4] Menguji POST /products (Menambah produk baru)
Status: 201
Response: {
  "id": 3,
  "name": "Penggaris",
  "price": 7000
}
-> SUKSES (201 Created)

[5] Verifikasi GET /products setelah POST
Status: 200
Daftar Produk Sekarang: [
  {
    "id": 1,
    "name": "Buku",
    "price": 15000
  },
  {
    "id": 2,
    "name": "Pulpen",
    "price": 5000
  },
  {
    "id": 3,
    "name": "Penggaris",
    "price": 7000
  }
]
-> SUKSES (Data bertambah)

=== SEMUA PENGUJIAN SELESAI DENGAN SUKSES ===
```
