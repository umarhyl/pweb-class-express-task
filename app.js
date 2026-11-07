const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk memproses request body JSON
app.use(express.json());

// Routing produk
app.use('/products', productRoutes);

// Root route opsional untuk cek status API
app.get('/', (req, res) => {
  res.json({ message: 'API Produk berjalan aktif' });
});

// Jalankan server jika dijalankan langsung
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
