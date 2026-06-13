const express = require('express');
const Review = require('../models/Review');

const router = express.Router();

// Sanitize input to prevent NoSQL injection
const sanitize = (str) => typeof str === 'string' ? str.replace(/[${}]/g, '').trim().slice(0, 500) : '';

// Get all approved reviews (general/store reviews)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true, product: null }).sort({ createdAt: -1 }).limit(50);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    if (!req.params.productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    const reviews = await Review.find({ product: req.params.productId, isApproved: true }).sort({ createdAt: -1 }).limit(100);
    
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
    const cleanName = sanitize(name);
    const cleanComment = sanitize(comment);
    const cleanTitle = sanitize(title);
    const numRating = Number(rating);

    if (!cleanName || !numRating || !cleanComment) {
      return res.status(400).json({ message: 'Name, rating and comment are required' });
    }
    if (numRating < 1 || numRating > 5 || !Number.isInteger(numRating)) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }
    if (cleanName.length < 2 || cleanName.length > 50) {
      return res.status(400).json({ message: 'Name must be 2-50 characters' });
    }
    if (cleanComment.length < 5 || cleanComment.length > 500) {
      return res.status(400).json({ message: 'Comment must be 5-500 characters' });
    }

    const review = await Review.create({ name: cleanName, rating: numRating, comment: cleanComment, title: cleanTitle, isApproved: false });
    res.status(201).json({ message: 'Review submitted and pending approval', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Post a review for a specific product
router.post('/product/:productId', async (req, res) => {
  try {
    if (!req.params.productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    const { name, rating, comment, title } = req.body;
    const cleanName = sanitize(name);
    const cleanComment = sanitize(comment);
    const cleanTitle = sanitize(title);
    const numRating = Number(rating);

    if (!cleanName || !numRating || !cleanComment) {
      return res.status(400).json({ message: 'Name, rating and comment are required' });
    }
    if (numRating < 1 || numRating > 5 || !Number.isInteger(numRating)) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }
    if (cleanName.length < 2 || cleanName.length > 50) {
      return res.status(400).json({ message: 'Name must be 2-50 characters' });
    }
    if (cleanComment.length < 5 || cleanComment.length > 500) {
      return res.status(400).json({ message: 'Comment must be 5-500 characters' });
    }

    const review = await Review.create({
      product: req.params.productId,
      name: cleanName,
      rating: numRating,
      comment: cleanComment,
      title: cleanTitle,
      isApproved: false,
    });
    res.status(201).json({ message: 'Review submitted and pending approval', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
