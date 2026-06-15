const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Load env only in non-production (Vercel sets env vars automatically)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../server/.env') });
}

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// MongoDB connection (cached for serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  if (mongoose.connection.readyState === 1) { isConnected = true; return; }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });
    isConnected = true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

// Import routes
const storeRoutes = require('../server/routes/store');
const categoryRoutes = require('../server/routes/categories');
const brandRoutes = require('../server/routes/brands');
const postRoutes = require('../server/routes/posts');
const reviewRoutes = require('../server/routes/reviews');
const enquiryRoutes = require('../server/routes/enquiries');
const authRoutes = require('../server/routes/auth');
const productRoutes = require('../server/routes/products');
const wishlistRoutes = require('../server/routes/wishlist');
const bannerRoutes = require('../server/routes/banners');
const homeDataRoutes = require('../server/routes/homedata');
const adminRoutes = require('../server/routes/admin');
const orderRoutes = require('../server/routes/orders');
const userRoutes = require('../server/routes/user');
const cartRoutes = require('../server/routes/cart');
const uploadRoutes = require('../server/routes/upload');
const newsletterRoutes = require('../server/routes/newsletter');
const promoRoutes = require('../server/routes/promo');

// Connect to DB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(503).json({ message: 'Database connection failed. Please try again.' });
  }
});

// Mount routes
app.use('/api/store', storeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/homedata', homeDataRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/promo', promoRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Vogue Plaza API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
