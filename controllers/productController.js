const prisma = require('../config/prisma');

// GET /products - Menampilkan seluruh data produk
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

// GET /products/:id - Menampilkan produk berdasarkan ID
const getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID produk harus berupa angka' });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

// POST /products - Membuat data produk baru
const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined || price === null || String(name).trim() === '') {
      return res.status(400).json({ message: 'Nama dan harga produk wajib diisi' });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: 'Harga produk harus berupa angka positif' });
    }

    const newProduct = await prisma.product.create({
      data: {
        name: String(name).trim(),
        price: numericPrice,
      },
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

// PUT /products atau PUT /products/:id - Mengupdate data produk yang sudah ada
const updateProduct = async (req, res) => {
  try {
    const rawId = req.body.id !== undefined ? req.body.id : req.params.id;
    const id = parseInt(rawId, 10);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID produk harus berupa angka dan wajib diisi' });
    }

    const { name, price } = req.body;
    if (!name || price === undefined || price === null || String(name).trim() === '') {
      return res.status(400).json({ message: 'Nama dan harga produk wajib diisi' });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: 'Harga produk harus berupa angka positif' });
    }

    // Pastikan produk dengan ID tersebut ada
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: String(name).trim(),
        price: numericPrice,
      },
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

// DELETE /products/:id atau DELETE /products - Menghapus data produk berdasarkan ID
const deleteProduct = async (req, res) => {
  try {
    const rawId = req.params.id !== undefined ? req.params.id : req.body.id;
    const id = parseInt(rawId, 10);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID produk harus berupa angka dan wajib disertakan' });
    }

    // Pastikan produk dengan ID tersebut ada
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    await prisma.product.delete({
      where: { id },
    });

    return res.status(200).json({
      message: 'Produk berhasil dihapus',
      deletedProduct: existingProduct,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
