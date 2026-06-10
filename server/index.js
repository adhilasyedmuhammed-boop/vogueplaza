const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedInitialData = require('./seed');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const storeRoutes = require('./routes/store');
const categoryRoutes = require('./routes/categories');
const brandRoutes = require('./routes/brands');
const postRoutes = require('./routes/posts');
const reviewRoutes = require('./routes/reviews');
const enquiryRoutes = require('./routes/enquiries');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const wishlistRoutes = require('./routes/wishlist');

const app = express();

app.use(cors());
app.use(express.json());

connectDB().then(() => seedInitialData());

app.get('/', (req, res) => {
  res.send('Vogue Plaza API is running');
});

app.use('/api/store', storeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
