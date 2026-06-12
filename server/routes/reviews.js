const express = require('express');
const Review = require('../models/Review');

const router = express.Router();

// Get all approved reviews (general/store reviews)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true, product: null }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true }).sort({ createdAt: -1 });
    
    // Calculate stats
    const total = reviews.length;
    const avgRating = total > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : 0;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => { distribution[r.rating]++; });

    res.json({ reviews, stats: { total, avgRating: Number(avgRating), distribution } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a general review
router.post('/', async (req, res) => {
  try {
    const { name, rating, comment, title } = req.body;
    if (!name || !rating || !comment) {
      return res.status(400).json({ message: 'Name, rating and comment are required' });
    }
    const review = await Review.create({ name, rating, comment, title, isApproved: true });
    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a review for a specific product
router.post('/product/:productId', async (req, res) => {
  try {
    const { name, rating, comment, title } = req.body;
    if (!name || !rating || !comment) {
      return res.status(400).json({ message: 'Name, rating and comment are required' });
    }
    const review = await Review.create({
      product: req.params.productId,
      name,
      rating,
      comment,
      title,
      isApproved: true,
    });
    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
