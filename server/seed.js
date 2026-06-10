const bcrypt = require('bcryptjs');
const User = require('./models/User');
const StoreInfo = require('./models/StoreInfo');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const Post = require('./models/Post');
const Review = require('./models/Review');
const Product = require('./models/Product');

const defaultStoreInfo = {
  storeName: 'Vogue Plaza — Flagship City Mall',
  address: '123 Galleria Mall, Premium Avenue, Galleria District, NY 10001',
  phone: '+1 (555) 019-2834',
  businessHours: [
    { day: 'Monday', open: '10:00', close: '22:00' },
    { day: 'Tuesday', open: '10:00', close: '22:00' },
    { day: 'Wednesday', open: '10:00', close: '22:00' },
    { day: 'Thursday', open: '10:00', close: '22:00' },
    { day: 'Friday', open: '10:00', close: '23:00' },
    { day: 'Saturday', open: '10:00', close: '23:00' },
    { day: 'Sunday', open: '11:00', close: '21:00' },
  ],
  aboutText:
    'For decades, Vogue Plaza has stood as a beacon of luxury retail, combining elegance, contemporary design, and unparalleled hospitality. We curate high-performance clothing lines and home decors from designers around the globe, ensuring every piece you take home represents the pinnacle of premium craftsmanship.',
  stats: [
    { label: 'Global Brands', value: '500+' },
    { label: 'Luxury Stores', value: '100+' },
    { label: 'Happy Customers', value: '11M+' },
  ],
  paymentMethods: ['Visa', 'Mastercard', 'Amex', 'Apple Pay'],
  coordinates: { lat: 40.7484405, lng: -73.985428 },
};

const categories = [
  { name: 'Womenswear', slug: 'womenswear', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600', isActive: true },
  { name: 'Menswear', slug: 'menswear', image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=600', isActive: true },
  { name: 'Accessories & Beauty', slug: 'accessories', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600', isActive: true },
  { name: 'Kids Corner', slug: 'kids', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=600', isActive: true },
  { name: 'Home Decor', slug: 'homedecor', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600', isActive: true },
  { name: 'Footwear', slug: 'footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600', isActive: true },
];

const brands = [
  { name: 'Armani', slug: 'armani', initials: 'AR', logo: '', isActive: true },
  { name: 'Gucci', slug: 'gucci', initials: 'GU', logo: '', isActive: true },
  { name: 'Versace', slug: 'versace', initials: 'VE', logo: '', isActive: true },
  { name: 'Burberry', slug: 'burberry', initials: 'BU', logo: '', isActive: true },
  { name: 'Prada', slug: 'prada', initials: 'PR', logo: '', isActive: true },
  { name: 'Rolex', slug: 'rolex', initials: 'RO', logo: '', isActive: true },
  { name: 'Chanel', slug: 'chanel', initials: 'CH', logo: '', isActive: true },
  { name: 'Dior', slug: 'dior', initials: 'DI', logo: '', isActive: true },
];

const posts = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500',
    caption: 'Embracing the minimalist silhouette this season. Find our premium cashmere coat line in store now. #MinimalStyle #WinterWarmth',
    postedDate: 'May 28, 2026',
    isActive: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500',
    caption: 'Unveiling our summer resort line. Earthy tones paired with lightweight, luxury organic linens. #ResortStyle #LinenLove',
    postedDate: 'May 25, 2026',
    isActive: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=500',
    caption: 'Crafted to perfection. A gentleman\'s footwear collection, custom handcrafted in Italy. #ItalianLeather #DapperStyle',
    postedDate: 'May 20, 2026',
    isActive: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5ec?q=80&w=500',
    caption: 'New arrivals in premium evening wear. Tailored silhouettes and statement accessories for the city elite.',
    postedDate: 'May 18, 2026',
    isActive: true,
  },
];

const reviews = [
  {
    name: 'Sophia Henderson',
    rating: 5,
    comment:
      'The selection here is absolutely unmatched. I found beautiful designer options from Gucci and Burberry that weren\'t available anywhere else in the city. The personal shopper service made the experience incredibly smooth and completely stress-free. I will definitely be returning for my wardrobe upgrade next season.',
    isApproved: true,
  },
  {
    name: 'Marcus Vance',
    rating: 5,
    comment:
      'High-end store with fantastic customer care. I had an issue with a designer jacket I bought, and the manager handled it immediately with no questions asked. Extremely professional. It\'s rare to see this level of dedication to service these days. Vogue Plaza remains my favorite retail destination.',
    isApproved: true,
  },
  {
    name: 'Adhila Syedmuhammed',
    rating: 5,
    comment:
      'Elegant environment, clean store, and highly attentive staff. They helped me pick out a bespoke suit and matching shoes within an hour. The customer satisfaction team is top-notch, checking in post-purchase to ensure absolute comfort. Truly a masterclass in modern retail customer service.',
    isApproved: true,
  },
];

const products = [
  { name: 'Cashmere Coat', brand: 'Armani', category: 'womenswear', price: 1299, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=600', sizes: ['S', 'M', 'L'], description: 'Premium cashmere coat for elegant winter style' },
  { name: 'Silk Blouse', brand: 'Gucci', category: 'womenswear', price: 899, image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600', sizes: ['S', 'M', 'L'], description: 'Luxurious silk blouse with timeless design' },
  { name: 'Tailored Suit', brand: 'Versace', category: 'menswear', price: 2499, image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=600', sizes: ['M', 'L', 'XL'], description: 'Impeccably tailored Italian suit' },
  { name: 'Leather Jacket', brand: 'Burberry', category: 'menswear', price: 1899, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600', sizes: ['M', 'L', 'XL'], description: 'Classic leather jacket with modern fit' },
  { name: 'Designer Handbag', brand: 'Prada', category: 'accessories', price: 1599, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600', sizes: ['One Size'], description: 'Iconic designer handbag' },
  { name: 'Luxury Watch', brand: 'Rolex', category: 'accessories', price: 12999, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600', sizes: ['One Size'], description: 'Precision timepiece with Swiss movement' },
  { name: 'Kids Dress', brand: 'Chanel', category: 'kids', price: 499, image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=600', sizes: ['4T', '5T', '6T'], description: 'Elegant dress for little fashionistas' },
  { name: 'Boys Blazer', brand: 'Dior', category: 'kids', price: 599, image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=600', sizes: ['4T', '5T', '6T'], description: 'Sophisticated blazer for young gentlemen' },
  { name: 'Decorative Vase', brand: 'Armani', category: 'homedecor', price: 399, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600', sizes: ['One Size'], description: 'Artisan ceramic vase for modern homes' },
  { name: 'Luxury Throw', brand: 'Gucci', category: 'homedecor', price: 799, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600', sizes: ['One Size'], description: 'Premium cashmere throw blanket' },
  { name: 'Designer Heels', brand: 'Versace', category: 'footwear', price: 1199, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600', sizes: ['6', '7', '8'], description: 'Stunning designer heels' },
  { name: 'Leather Boots', brand: 'Burberry', category: 'footwear', price: 899, image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600', sizes: ['6', '7', '8'], description: 'Classic leather boots with premium craftsmanship' }
];

const mongoose = require('mongoose');

const seedInitialData = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log('Skipping database seeding because MongoDB is not connected.');
    return;
  }
  try {
    const adminEmail = 'admin@vogueplaza.com';
    const existingUser = await User.findOne({ email: adminEmail });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('Admin@1234', 10);
      await User.create({ name: 'Store Admin', email: adminEmail, password: hashedPassword, role: 'admin' });
      console.log('Admin user created');
    }

    const existingStore = await StoreInfo.findOne();
    if (!existingStore) {
      await StoreInfo.create(defaultStoreInfo);
      console.log('Store info seeded');
    }

    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.create(categories);
      console.log('Categories seeded');
    }

    const brandCount = await Brand.countDocuments();
    if (brandCount === 0) {
      await Brand.create(brands);
      console.log('Brands seeded');
    }

    const postCount = await Post.countDocuments();
    if (postCount === 0) {
      await Post.create(posts);
      console.log('Posts seeded');
    }

    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      await Review.create(reviews);
      console.log('Reviews seeded');
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.create(products);
      console.log('Products seeded');
    }
  } catch (error) {
    console.error('Error seeding initial data:', error.message);
  }
};

module.exports = seedInitialData;
