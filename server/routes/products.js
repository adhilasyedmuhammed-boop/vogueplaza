const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Escape regex special chars to prevent ReDoS
const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 100);

// GET /api/products — with filters: category, brand, search, limit, sort, page
router.get('/', async (req, res) => {
  try {
    const { category, brand, search, limit, sort, sale, page } = req.query;
    let query = {};

    if (category && category !== 'all') query.category = String(category).slice(0, 50);
    if (brand) query.brand = { $regex: new RegExp(escapeRegex(brand), 'i') };
    if (sale === 'true') query.onSale = true;
    if (search) {
      const safeSearch = escapeRegex(search);
      query.$or = [
        { name: { $regex: new RegExp(safeSearch, 'i') } },
        { brand: { $regex: new RegExp(safeSearch, 'i') } },
        { description: { $regex: new RegExp(safeSearch, 'i') } },
      ];
    }

    // Server-side pagination
    const pageNum = parseInt(page) || 1;
    const perPage = parseInt(limit) || 10;
    const skip = (pageNum - 1) * perPage;

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(perPage);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: perPage,
        total,
        totalPages: Math.ceil(total / perPage)
      }
    });
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
