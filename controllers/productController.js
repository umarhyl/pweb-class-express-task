// Data awal produk sesuai ketentuan tugas
let products = [
  { id: 1, name: 'Buku', price: 15000 },
  { id: 2, name: 'Pulpen', price: 5000 },
];

// GET /products - Ambil seluruh produk (status 200)
const getAllProducts = (req, res) => {
  return res.status(200).json(products);
};

// GET /products/:id - Ambil produk berdasarkan ID (status 200 atau 404)
const getProductById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  return res.status(200).json(product);
};

// POST /products - Tambah produk baru (status 201)
const createProduct = (req, res) => {
  const { name, price } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ message: 'Nama dan harga produk wajib diisi' });
  }

  const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const newProduct = {
    id: newId,
    name,
    price: Number(price),
  };

  products.push(newProduct);
  return res.status(201).json(newProduct);
};

module.exports = {
  products,
  getAllProducts,
  getProductById,
  createProduct,
};
