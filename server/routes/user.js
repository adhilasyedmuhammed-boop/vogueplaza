const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

// GET /api/user/profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -verificationToken -verificationExpires');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/user/profile — update name, phone
router.put('/profile', async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    await user.save();
    res.json({ name: user.name, email: user.email, phone: user.phone, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/user/password — change password
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== ADDRESSES ====================

// GET /api/user/addresses
router.get('/addresses', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.json(user.addresses || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/user/addresses — add a new address
router.post('/addresses', async (req, res) => {
  try {
    const { fullName, phone, street, city, state, pincode, landmark, isDefault } = req.body;
    if (!street || !city || !state || !pincode) {
      return res.status(400).json({ message: 'Street, city, state and pincode are required' });
    }

    const user = await User.findById(req.user._id);
    if (isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }
    user.addresses.push({ fullName, phone, street, city, state, pincode, landmark, isDefault: isDefault || user.addresses.length === 0 });
    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/user/addresses/:id
router.put('/addresses/:id', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    const { fullName, phone, street, city, state, pincode, landmark, isDefault } = req.body;
    if (isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }
    Object.assign(addr, { fullName, phone, street, city, state, pincode, landmark, isDefault });
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/user/addresses/:id
router.delete('/addresses/:id', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.pull(req.params.id);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
