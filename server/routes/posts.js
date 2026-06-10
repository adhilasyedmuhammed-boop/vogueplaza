const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    const total = await Post.countDocuments({ isActive: true });
    const posts = await Post.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.json({ posts, page, total, limit });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
