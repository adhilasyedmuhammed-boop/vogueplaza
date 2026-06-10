const express = require('express');
const router = express.Router();

// In-memory wishlist per session (can be upgraded to DB with user auth)
// For authenticated users, store in DB using User model

// GET /api/wishlist — get wishlist (session-based placeholder)
router.get('/', async (req, res) => {
  res.json([]);
});

// POST /api/wishlist — add to wishlist
router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });
    res.status(201).json({ message: 'Added to wishlist', productId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/wishlist/:id — remove from wishlist
router.delete('/:id', async (req, res) => {
  try {
    res.json({ message: 'Removed from wishlist', productId: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
