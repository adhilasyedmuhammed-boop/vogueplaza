const express = require('express');
const PromoCode = require('../models/PromoCode');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/promo/validate — validate a promo code
router.post('/validate', authMiddleware, async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Promo code is required' });

    const promo = await PromoCode.findOne({ code: String(code).toUpperCase().trim() });
    if (!promo) {
      return res.status(404).json({ message: 'Invalid promo code' });
    }
    if (!promo.isActive) {
      return res.status(400).json({ message: 'This promo code is no longer active' });
    }
    if (promo.expiresAt && new Date() > promo.expiresAt) {
      return res.status(400).json({ message: 'This promo code has expired' });
    }
    if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ message: 'This promo code has reached its usage limit' });
    }
    if (promo.minOrder > 0 && orderTotal < promo.minOrder) {
      return res.status(400).json({ message: `Minimum order of ₹${(promo.minOrder / 100).toLocaleString()} required` });
    }

    res.json({
      valid: true,
      discount: promo.discount,
      label: promo.label || `${promo.discount}% off`,
      code: promo.code,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/promo/apply — apply promo (increment usage after order)
router.post('/apply', authMiddleware, async (req, res) => {
  try {
    const { code } = req.body;
    const promo = await PromoCode.findOne({ code: String(code).toUpperCase().trim() });
    if (promo) {
      promo.usedCount += 1;
      await promo.save();
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
