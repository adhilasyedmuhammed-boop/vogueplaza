const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET /api/products — with filters: category, brand, search, limit, sort
router.get('/', async (req, res) => {
  try {
    const { category, brand, search, limit, sort, sale } = req.query;
    let query = {};

    if (category && category !== 'all') query.category = category;
    if (brand) query.brand = { $regex: new RegExp(brand, 'i') };
    if (sale === 'true') query.onSale = true;
    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { brand: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
      ];
    }

    let q = Product.find(query);

    if (sort === 'price-asc') q = q.sort({ price: 1 });
    else if (sort === 'price-desc') q = q.sort({ price: -1 });
    else q = q.sort({ createdAt: -1 }); // newest first by default

    if (limit) q = q.limit(parseInt(limit));

    const products = await q;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id — single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products — create product (admin)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id — update product
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
