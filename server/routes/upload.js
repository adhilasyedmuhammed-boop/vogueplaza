const express = require('express');
const multer = require('multer');
const router = express.Router();

// Store in memory, convert to base64 data URI
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  }
});

// POST /api/upload — upload single image, returns base64 data URI
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }
  const base64 = req.file.buffer.toString('base64');
  const dataUri = `data:${req.file.mimetype};base64,${base64}`;
  res.json({ url: dataUri });
});

// POST /api/upload/multiple — upload up to 4 images
router.post('/multiple', upload.array('images', 4), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No image files provided' });
  }
  const urls = req.files.map(f => {
    const base64 = f.buffer.toString('base64');
    return { url: `data:${f.mimetype};base64,${base64}` };
  });
  res.json(urls);
});

module.exports = router;
