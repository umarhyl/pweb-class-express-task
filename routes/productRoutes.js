const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /products - Menampilkan seluruh data produk
router.get('/', productController.getAllProducts);

// GET /products/:id - Menampilkan detail produk berdasarkan ID
router.get('/:id', productController.getProductById);

// POST /products - Membuat data produk baru
router.post('/', productController.createProduct);

// PUT /products & PUT /products/:id - Mengupdate produk yang sudah ada
router.put('/', productController.updateProduct);
router.put('/:id', productController.updateProduct);

// DELETE /products/:id & DELETE /products - Menghapus produk berdasarkan ID
router.delete('/:id', productController.deleteProduct);
router.delete('/', productController.deleteProduct);

module.exports = router;
