const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// All wishlist routes require authentication
router.use(authMiddleware);

// GET /api/wishlist — get user's wishlist with populated product data
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/wishlist — add product to wishlist
router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });

    const user = await User.findById(req.user._id);
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Already in wishlist' });
    }
    user.wishlist.push(productId);
    await user.save();
    res.status(201).json({ message: 'Added to wishlist', productId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/wishlist/:id — remove product from wishlist
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.id);
    await user.save();
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
