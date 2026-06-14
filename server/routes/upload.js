const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store in memory for Cloudinary upload
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

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'vogueplaza/products', resource_type: 'image', format: 'webp', quality: 'auto:good', transformation: [{ width: 800, height: 1000, crop: 'limit' }] },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// POST /api/upload — upload single image
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  // If Cloudinary is configured, use it; otherwise fallback to base64
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    try {
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      return res.json({ url: result.secure_url, public_id: result.public_id });
    } catch (err) {
      console.error('Cloudinary upload failed:', err.message);
      return res.status(500).json({ message: 'Image upload failed' });
    }
  }

  // Fallback: base64 data URI (not recommended for production)
  const base64 = req.file.buffer.toString('base64');
  const dataUri = `data:${req.file.mimetype};base64,${base64}`;
  res.json({ url: dataUri });
});

// POST /api/upload/multiple — upload up to 4 images
router.post('/multiple', upload.array('images', 4), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No image files provided' });
  }

  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    try {
      const results = await Promise.all(
        req.files.map(f => uploadToCloudinary(f.buffer, f.mimetype))
      );
      return res.json(results.map(r => ({ url: r.secure_url, public_id: r.public_id })));
    } catch (err) {
      return res.status(500).json({ message: 'Image upload failed' });
    }
  }

  // Fallback
  const urls = req.files.map(f => {
    const base64 = f.buffer.toString('base64');
    return { url: `data:${f.mimetype};base64,${base64}` };
  });
  res.json(urls);
});

module.exports = router;
