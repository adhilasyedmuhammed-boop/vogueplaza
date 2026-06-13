const express = require('express');
const Enquiry = require('../models/Enquiry');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^\+?[\d\s-]{10,15}$/;

router.post('/', async (req, res) => {
  try {
    const { name, mobile, email, category, message } = req.body;
    if (!name || !mobile || !email || !category || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const cleanName = String(name).trim().slice(0, 100);
    const cleanEmail = String(email).toLowerCase().trim().slice(0, 100);
    const cleanMobile = String(mobile).trim().slice(0, 15);
    const cleanMessage = String(message).trim().slice(0, 1000);
    const cleanCategory = String(category).trim().slice(0, 50);

    if (cleanName.length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    if (!phoneRegex.test(cleanMobile)) {
      return res.status(400).json({ message: 'Please provide a valid phone number' });
    }
    if (cleanMessage.length < 10) {
      return res.status(400).json({ message: 'Message must be at least 10 characters' });
    }

    const enquiry = await Enquiry.create({ name: cleanName, mobile: cleanMobile, email: cleanEmail, category: cleanCategory, message: cleanMessage });
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
