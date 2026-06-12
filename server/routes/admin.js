const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Review = require('../models/Review');
const Post = require('../models/Post');
const Enquiry = require('../models/Enquiry');
const User = require('../models/User');
const StoreInfo = require('../models/StoreInfo');
const Banner = require('../models/Banner');
const HomeData = require('../models/HomeData');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware);

// ==================== DASHBOARD STATS ====================
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalProducts,
      totalCategories,
      totalBrands,
      totalUsers,
      totalEnquiries,
      unreadEnquiries,
      totalReviews,
      pendingReviews,
      totalPosts,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Brand.countDocuments(),
      User.countDocuments(),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ isRead: false }),
      Review.countDocuments(),
      Review.countDocuments({ isApproved: false }),
      Post.countDocuments(),
    ]);

    const recentEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(5);
    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);
    const recentReviews = await Review.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      stats: {
        totalProducts,
        totalCategories,
        totalBrands,
        totalUsers,
        totalEnquiries,
        unreadEnquiries,
        totalReviews,
        pendingReviews,
        totalPosts,
      },
      recentEnquiries,
      recentProducts,
      recentReviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== PRODUCTS ====================
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== CATEGORIES ====================
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const category = new Category(req.body);
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== BRANDS ====================
router.get('/brands', async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/brands', async (req, res) => {
  try {
    const brand = new Brand(req.body);
    const saved = await brand.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/brands/:id', async (req, res) => {
  try {
    const updated = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Brand not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/brands/:id', async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: 'Brand deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== REVIEWS ====================
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/reviews', async (req, res) => {
  try {
    const review = new Review(req.body);
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/reviews/:id', async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Review not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== POSTS ====================
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/posts', async (req, res) => {
  try {
    const post = new Post(req.body);
    const saved = await post.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/posts/:id', async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Post not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== ENQUIRIES ====================
router.get('/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/enquiries/:id', async (req, res) => {
  try {
    const updated = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Enquiry not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/enquiries/:id', async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== USERS ====================
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { role } = req.body;
    const updated = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== STORE INFO ====================
router.get('/store', async (req, res) => {
  try {
    const store = await StoreInfo.findOne();
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/store', async (req, res) => {
  try {
    let store = await StoreInfo.findOne();
    if (store) {
      store = await StoreInfo.findByIdAndUpdate(store._id, req.body, { new: true });
    } else {
      store = await StoreInfo.create(req.body);
    }
    res.json(store);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==================== BANNERS ====================
router.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/banners', async (req, res) => {
  try {
    const banner = new Banner(req.body);
    const saved = await banner.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/banners/:id', async (req, res) => {
  try {
    const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Banner not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/banners/:id', async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== HOME DATA ====================
router.get('/homedata', async (req, res) => {
  try {
    const homeData = await HomeData.findOne();
    res.json(homeData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/homedata', async (req, res) => {
  try {
    let homeData = await HomeData.findOne();
    if (homeData) {
      homeData = await HomeData.findByIdAndUpdate(homeData._id, req.body, { new: true, runValidators: true });
    } else {
      homeData = await HomeData.create(req.body);
    }
    res.json(homeData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
