const express = require('express');
const StoreInfo = require('../models/StoreInfo');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let storeInfo = await StoreInfo.findOne();
    if (!storeInfo) {
      return res.status(404).json({ message: 'Store information not found' });
    }
    res.json(storeInfo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
