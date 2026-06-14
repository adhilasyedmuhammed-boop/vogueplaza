const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedInitialData = require('./seed');

dotenv.config({ path: path.resolve(__dirname, '.env') });

// Validate critical env vars
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set!');
  process.exit(1);
}

const storeRoutes = require('./routes/store');
const categoryRoutes = require('./routes/categories');
const brandRoutes = require('./routes/brands');
const postRoutes = require('./routes/posts');
const reviewRoutes = require('./routes/reviews');
const enquiryRoutes = require('./routes/enquiries');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const wishlistRoutes = require('./routes/wishlist');
const adminRoutes = require('./routes/admin');
const bannerRoutes = require('./routes/banners');
const homeDataRoutes = require('./routes/homedata');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/user');

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Disabled for SPA flexibility
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  'https://vogueplaza.vercel.app',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

connectDB().then(() => seedInitialData());

if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.send('Vogue Plaza API is running');
  });
}

app.use('/api/store', storeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reviews', apiLimiter, reviewRoutes);
app.use('/api/enquiries', apiLimiter, enquiryRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/homedata', homeDataRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', apiLimiter, orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/upload', require('./routes/upload'));
app.use('/api/newsletter', apiLimiter, require('./routes/newsletter'));
app.use('/api/promo', require('./routes/promo'));
app.use('/api/cart', require('./routes/cart'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
