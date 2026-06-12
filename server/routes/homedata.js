const express = require('express');
const HomeData = require('../models/HomeData');

const router = express.Router();

// Public: Get home page data
router.get('/', async (req, res) => {
  try {
    const homeData = await HomeData.findOne();
    if (!homeData) {
      return res.json(null);
    }
    res.json(homeData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
