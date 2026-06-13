const express = require('express');
const Newsletter = require('../models/Newsletter');

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// POST /api/newsletter — subscribe
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const cleanEmail = String(email).toLowerCase().trim().slice(0, 100);
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const existing = await Newsletter.findOne({ email: cleanEmail });
    if (existing) {
      return res.json({ message: 'You are already subscribed.' });
    }

    await Newsletter.create({ email: cleanEmail });
    res.status(201).json({ message: 'Successfully subscribed to our newsletter.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
