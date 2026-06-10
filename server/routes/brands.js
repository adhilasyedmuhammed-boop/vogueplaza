const express = require('express');
const Brand = require('../models/Brand');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort('name');
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
