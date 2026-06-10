const express = require('express');
const Review = require('../models/Review');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    if (!name || !rating || !comment) {
      return res.status(400).json({ message: 'Name, rating and comment are required' });
    }
    const review = await Review.create({ name, rating, comment, isApproved: false });
    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
