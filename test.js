const http = require('http');
const app = require('./app');

const server = app.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`=== PENGUJIAN API PRODUK (Port: ${port}) ===\n`);

  try {
    // 1. Uji GET /products
    console.log('[1] Menguji GET /products');
    const resAll = await fetch(`${baseUrl}/products`);
    const dataAll = await resAll.json();
    console.log(`Status: ${resAll.status}`);
    console.log('Response:', JSON.stringify(dataAll, null, 2));
    console.log(resAll.status === 200 && Array.isArray(dataAll) ? '-> SUKSES (200 OK)\n' : '-> GAGAL\n');

    // 2. Uji GET /products/1
    console.log('[2] Menguji GET /products/1');
    const resOne = await fetch(`${baseUrl}/products/1`);
    const dataOne = await resOne.json();
    console.log(`Status: ${resOne.status}`);
    console.log('Response:', JSON.stringify(dataOne, null, 2));
    console.log(resOne.status === 200 && dataOne.name === 'Buku' ? '-> SUKSES (200 OK)\n' : '-> GAGAL\n');

    // 3. Uji GET /products/999
    console.log('[3] Menguji GET /products/999 (Kasus 404)');
    const resNotFound = await fetch(`${baseUrl}/products/999`);
    const dataNotFound = await resNotFound.json();
    console.log(`Status: ${resNotFound.status}`);
    console.log('Response:', JSON.stringify(dataNotFound, null, 2));
    console.log(resNotFound.status === 404 ? '-> SUKSES (404 Not Found)\n' : '-> GAGAL\n');

    // 4. Uji POST /products
    console.log('[4] Menguji POST /products (Menambah produk baru)');
    const payload = { name: 'Penggaris', price: 7000 };
    const resPost = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const dataPost = await resPost.json();
    console.log(`Status: ${resPost.status}`);
    console.log('Response:', JSON.stringify(dataPost, null, 2));
    console.log(resPost.status === 201 && dataPost.name === 'Penggaris' ? '-> SUKSES (201 Created)\n' : '-> GAGAL\n');

    // 5. Verifikasi GET /products setelah POST
    console.log('[5] Verifikasi GET /products setelah POST');
    const resVerify = await fetch(`${baseUrl}/products`);
    const dataVerify = await resVerify.json();
    console.log(`Status: ${resVerify.status}`);
    console.log('Daftar Produk Sekarang:', JSON.stringify(dataVerify, null, 2));
    console.log(dataVerify.length === 3 ? '-> SUKSES (Data bertambah)\n' : '-> GAGAL\n');

    console.log('=== SEMUA PENGUJIAN SELESAI DENGAN SUKSES ===');
  } catch (err) {
    console.error('Error saat pengujian:', err);
  } finally {
    server.close();
  }
});
