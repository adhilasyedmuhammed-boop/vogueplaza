const express = require('express');
const Enquiry = require('../models/Enquiry');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, mobile, email, category, message } = req.body;
    if (!name || !mobile || !email || !category || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const enquiry = await Enquiry.create({ name, mobile, email, category, message });
    res.status(201).json({ message: 'Enquiry received successfully', enquiry });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
