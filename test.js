const app = require('./app');
const prisma = require('./config/prisma');

async function runTests() {
  // Reset and seed database before running tests
  await prisma.product.deleteMany();
  await prisma.product.createMany({
    data: [
      { id: 1, name: 'Buku', price: 15000 },
      { id: 2, name: 'Pulpen', price: 5000 },
    ],
  });

  const server = app.listen(0, async () => {
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;
    console.log(`=== PENGUJIAN API PRODUK PRISMA ORM (Port: ${port}) ===\n`);

    try {
      // 1. GET /products (Ambil seluruh data)
      console.log('[1] Menguji GET /products (Semua data produk)');
      const resAll = await fetch(`${baseUrl}/products`);
      const dataAll = await resAll.json();
      console.log(`Status: ${resAll.status}`);
      console.log('Response:', JSON.stringify(dataAll, null, 2));
      console.log(resAll.status === 200 && Array.isArray(dataAll) && dataAll.length === 2 ? '-> SUKSES (200 OK)\n' : '-> GAGAL\n');

      // 2. GET /products/1 (Ambil data berdasarkan ID)
      console.log('[2] Menguji GET /products/1');
      const resOne = await fetch(`${baseUrl}/products/1`);
      const dataOne = await resOne.json();
      console.log(`Status: ${resOne.status}`);
      console.log('Response:', JSON.stringify(dataOne, null, 2));
      console.log(resOne.status === 200 && dataOne.name === 'Buku' ? '-> SUKSES (200 OK)\n' : '-> GAGAL\n');

      // 3. GET /products/999 (Kasus 404 Not Found)
      console.log('[3] Menguji GET /products/999 (Kasus 404)');
      const resNotFound = await fetch(`${baseUrl}/products/999`);
      const dataNotFound = await resNotFound.json();
      console.log(`Status: ${resNotFound.status}`);
      console.log('Response:', JSON.stringify(dataNotFound, null, 2));
      console.log(resNotFound.status === 404 ? '-> SUKSES (404 Not Found)\n' : '-> GAGAL\n');

      // 4. POST /products (Membuat produk baru)
      console.log('[4] Menguji POST /products (Menambah produk baru)');
      const payloadPost = { name: 'Penghapus', price: 3000 };
      const resPost = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadPost),
      });
      const dataPost = await resPost.json();
      console.log(`Status: ${resPost.status}`);
      console.log('Response:', JSON.stringify(dataPost, null, 2));
      console.log(resPost.status === 201 && dataPost.name === 'Penghapus' ? '-> SUKSES (201 Created)\n' : '-> GAGAL\n');

      // 5. POST /products (Validasi error - nama kosong)
      console.log('[5] Menguji POST /products (Validasi error - nama kosong)');
      const resPostInvalid = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: 5000 }),
      });
      const dataPostInvalid = await resPostInvalid.json();
      console.log(`Status: ${resPostInvalid.status}`);
      console.log('Response:', JSON.stringify(dataPostInvalid, null, 2));
      console.log(resPostInvalid.status === 400 ? '-> SUKSES (400 Bad Request)\n' : '-> GAGAL\n');

      // 6. PUT /products (Update produk dengan body memiliki ID sesuai ketentuan soal)
      console.log('[6] Menguji PUT /products (Update produk dengan id di body)');
      const payloadPut = { id: 2, name: 'Pulpen Gel Hitam', price: 8000 };
      const resPut = await fetch(`${baseUrl}/products`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadPut),
      });
      const dataPut = await resPut.json();
      console.log(`Status: ${resPut.status}`);
      console.log('Response:', JSON.stringify(dataPut, null, 2));
      console.log(resPut.status === 200 && dataPut.name === 'Pulpen Gel Hitam' && dataPut.price === 8000 ? '-> SUKSES (200 OK)\n' : '-> GAGAL\n');

      // 7. PUT /products (Update ID tidak ditemukan - Kasus 404)
      console.log('[7] Menguji PUT /products (ID tidak ditemukan di database)');
      const resPut404 = await fetch(`${baseUrl}/products`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 9999, name: 'Barang Gaib', price: 1000 }),
      });
      const dataPut404 = await resPut404.json();
      console.log(`Status: ${resPut404.status}`);
      console.log('Response:', JSON.stringify(dataPut404, null, 2));
      console.log(resPut404.status === 404 ? '-> SUKSES (404 Not Found)\n' : '-> GAGAL\n');

      // 8. DELETE /products/:id (Hapus produk berdasarkan ID)
      console.log('[8] Menguji DELETE /products/1 (Menghapus produk ID: 1)');
      const resDelete = await fetch(`${baseUrl}/products/1`, {
        method: 'DELETE',
      });
      const dataDelete = await resDelete.json();
      console.log(`Status: ${resDelete.status}`);
      console.log('Response:', JSON.stringify(dataDelete, null, 2));
      console.log(resDelete.status === 200 ? '-> SUKSES (200 OK)\n' : '-> GAGAL\n');

      // 9. DELETE /products/999 (Kasus 404 Not Found)
      console.log('[9] Menguji DELETE /products/999 (Kasus 404)');
      const resDelete404 = await fetch(`${baseUrl}/products/999`, {
        method: 'DELETE',
      });
      const dataDelete404 = await resDelete404.json();
      console.log(`Status: ${resDelete404.status}`);
      console.log('Response:', JSON.stringify(dataDelete404, null, 2));
      console.log(resDelete404.status === 404 ? '-> SUKSES (404 Not Found)\n' : '-> GAGAL\n');

      // 10. Verifikasi Akhir di Database
      console.log('[10] Verifikasi Akhir Data di Database via GET /products');
      const resFinal = await fetch(`${baseUrl}/products`);
      const dataFinal = await resFinal.json();
      console.log(`Status: ${resFinal.status}`);
      console.log('Daftar Produk Sekarang di Database:', JSON.stringify(dataFinal, null, 2));
      const isVerified = dataFinal.length === 2 && !dataFinal.some((p) => p.id === 1);
      console.log(isVerified ? '-> SUKSES (Data tersinkronisasi di SQLite via Prisma)\n' : '-> GAGAL\n');

      console.log('=== SEMUA PENGUJIAN SELESAI DENGAN SUKSES ===');
    } catch (err) {
      console.error('Error saat pengujian:', err);
    } finally {
      server.close();
      await prisma.$disconnect();
    }
  });
}

runTests();
