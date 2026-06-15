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
app.use(express.json());

// MongoDB connection (cached for serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
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
  await connectDB();
  next();
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

module.exports = app;
