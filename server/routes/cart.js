const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

// GET /api/cart — get user's cart
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    const cart = (user.cart || [])
      .filter(item => item.product) // filter out removed products
      .map(item => ({
        _id: item.product._id,
        name: item.product.name,
        brand: item.product.brand,
        price: item.product.price,
        image: item.product.image,
        sizes: item.product.sizes,
        originalPrice: item.product.originalPrice,
        discount: item.product.discount,
        inStock: item.product.inStock,
        size: item.size,
        quantity: item.quantity,
      }));
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/cart — sync entire cart (called on login to merge guest cart)
router.put('/', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ message: 'items array required' });

    const user = await User.findById(req.user._id);
    user.cart = items.slice(0, 50).map(item => ({
      product: item._id || item.product,
      size: String(item.size || 'One Size').slice(0, 20),
      quantity: Math.min(Math.max(Number(item.quantity) || 1, 1), 5),
    }));
    await user.save();
    res.json({ message: 'Cart synced' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/cart/add — add single item
router.post('/add', async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });

    const user = await User.findById(req.user._id);
    const existing = user.cart.find(
      item => item.product.toString() === productId && item.size === (size || 'One Size')
    );

    if (existing) {
      existing.quantity = Math.min((existing.quantity || 1) + (quantity || 1), 5);
    } else {
      user.cart.push({
        product: productId,
        size: size || 'One Size',
        quantity: Math.min(quantity || 1, 5),
      });
    }
    await user.save();
    res.json({ message: 'Added to cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/cart/:productId/:size — remove item
router.delete('/:productId/:size', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(
      item => !(item.product.toString() === req.params.productId && item.size === decodeURIComponent(req.params.size))
    );
    await user.save();
    res.json({ message: 'Removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/cart — clear cart
router.delete('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
