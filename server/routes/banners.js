const express = require('express');
const Banner = require('../models/Banner');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
