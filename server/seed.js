const bcrypt = require('bcryptjs');
const User = require('./models/User');
const StoreInfo = require('./models/StoreInfo');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const Post = require('./models/Post');
const Review = require('./models/Review');
const Product = require('./models/Product');
const Banner = require('./models/Banner');
const HomeData = require('./models/HomeData');

const defaultStoreInfo = {
  storeName: 'Vogue Plaza — Flagship City Mall',
  address: '3rd Floor, City Mall, MG Road, Kochi, Kerala 682016',
  phone: '+91 484 123 4567',
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
  coordinates: { lat: 9.9312, lng: 76.2673 },
};

const categories = [
  { name: 'Womenswear', slug: 'womenswear', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600', isActive: true },
  { name: 'Menswear', slug: 'menswear', image: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?q=80&w=600', isActive: true },
  { name: 'Accessories & Beauty', slug: 'accessories', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600', isActive: true },
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
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=500',
    caption: 'Embracing the royal silhouette this season. Find our premium embroidered Anarkali line in store now. #EthnicStyle #LuxuryFashion',
    postedDate: 'June 11, 2026',
    isActive: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=500',
    caption: 'The art of bespoke tailoring. Experience premium wool three-piece suits handcrafted to perfection.',
    postedDate: 'June 09, 2026',
    isActive: true,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500',
    caption: 'Curated premium handbags. Timeless elegance defined in luxury leather. #Handbags #Prada',
    postedDate: 'June 05, 2026',
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
    name: 'Aisha Patel',
    rating: 4,
    comment:
      'Wonderful collection of ethnic wear. Found the perfect lehenga for my sister\'s wedding. The staff were very knowledgeable about fabrics and helped me choose the right size. Slightly expensive but you get what you pay for in terms of quality.',
    isApproved: true,
  },
  {
    name: 'Daniel Thompson',
    rating: 5,
    comment:
      'Best menswear section I\'ve seen in Kerala. The sherwani collection is outstanding — got my wedding outfit here and received countless compliments. The tailoring alterations were done perfectly within 3 days.',
    isApproved: true,
  },
  {
    name: 'Priya Nair',
    rating: 4,
    comment:
      'Love the accessories collection! Got a Chanel bag that I had been looking for everywhere. The authenticity guarantee gives real peace of mind. Would recommend to anyone looking for genuine luxury brands.',
    isApproved: true,
  },
  {
    name: 'Rajesh Kumar',
    rating: 3,
    comment:
      'Good store with premium brands but the pricing is on the higher side compared to online. However, the in-store experience and being able to try things on makes up for it. Parking can be difficult during weekends.',
    isApproved: false,
  },
];

const products = [
  // Womenswear (Traditional/Fusion Designer Wear)
  { name: 'Royal Crimson Anarkali Gown', brand: 'Gucci', category: 'womenswear', price: 1299, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600', sizes: ['S', 'M', 'L'], description: 'Deep red Anarkali gown with intricate golden zardozi embroidery' },
  { name: 'Navy Embellished Cape Gown', brand: 'Dior', category: 'womenswear', price: 2099, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600', sizes: ['S', 'M', 'L'], description: 'Midnight navy evening gown featuring a faux fur collar and gold embroidered details' },
  { name: 'Embroidered Silk Lehenga', brand: 'Armani', category: 'womenswear', price: 2499, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600', sizes: ['S', 'M', 'L'], description: 'Premium silk lehenga set with custom artisan work' },
  { name: 'Baroque Pattern Silk Abaya', brand: 'Versace', category: 'womenswear', price: 1499, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600', sizes: ['M', 'L'], description: 'Luxury silk abaya with royal gold and black baroque printing' },

  // Menswear (Tailored Suits & Sherwanis)
  { name: 'Velvet Royal Sherwani', brand: 'Armani', category: 'menswear', price: 2899, image: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?q=80&w=600', sizes: ['M', 'L', 'XL'], description: 'Luxurious velvet sherwani in midnight black with golden details' },
  { name: 'Bespoke Brown Wool Suit', brand: 'Versace', category: 'menswear', price: 1799, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600', sizes: ['48', '50', '52'], description: 'Double breasted premium wool three-piece suit in espresso brown' },
  { name: 'Double-Breasted Tuxedo', brand: 'Burberry', category: 'menswear', price: 1899, image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600', sizes: ['M', 'L', 'XL'], description: 'Traditional Italian-cut tuxedo with satin lapels' },
  { name: 'Linen Casual Shirt Set', brand: 'Burberry', category: 'menswear', price: 399, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600', sizes: ['M', 'L', 'XL'], description: 'Breathable linen shirt set with light beige trousers' },

  // Accessories (Luxury Handbags & Watches)
  { name: 'Saddle Leather Shoulder Bag', brand: 'Prada', category: 'accessories', price: 1599, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600', sizes: ['One Size'], description: 'Classic tan brown leather luxury shoulder bag' },
  { name: 'Gold Oyster Chronograph', brand: 'Rolex', category: 'accessories', price: 12999, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600', sizes: ['One Size'], description: 'Precision timepiece with 18k yellow gold casing and oyster bracelet' },
  { name: 'Classic Flap Chain Bag', brand: 'Chanel', category: 'accessories', price: 2899, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600', sizes: ['One Size'], description: 'Quilted calfskin flap bag with gold tone hardware' },
  { name: 'Plaid Pattern Tote Bag', brand: 'Burberry', category: 'accessories', price: 899, image: 'https://images.unsplash.com/photo-1590874103328-eacb586d5c07?q=80&w=600', sizes: ['One Size'], description: 'Iconic vintage check pattern leather tote bag' },

  // Lipsticks & Beauty Products
  { name: 'Rouge Allure Liquid Lipstick', brand: 'Chanel', category: 'accessories', price: 199, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600', sizes: ['Classic Red', 'Rosewood', 'Velvet Pink'], description: 'Intense satin-finish longwear liquid lipstick' },
  { name: 'Dior Addict Lip Glow', brand: 'Dior', category: 'accessories', price: 179, image: 'https://images.unsplash.com/photo-1631214503008-a14a38968305?q=80&w=600', sizes: ['Pink Glow', 'Coral Glow', 'Berry Glow'], description: 'Color-awakening hydrating lip balm' },

  // Shoes & Footwear
  { name: 'Baroque Leather Heels', brand: 'Versace', category: 'footwear', price: 1199, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600', sizes: ['36', '37', '38', '39'], description: 'Italian-crafted high heel pumps with gold-tone accents' },
  { name: 'GG Monogram Leather Loafers', brand: 'Gucci', category: 'footwear', price: 999, image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600', sizes: ['41', '42', '43', '44'], description: 'Classic black leather loafers with gold horsebit hardware' },

  // Watches & Sunglasses
  { name: 'Oversized Vintage Sunglasses', brand: 'Gucci', category: 'accessories', price: 349, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600', sizes: ['One Size'], description: 'Premium square-frame acetate sunglasses' },
  { name: 'Oyster Perpetual Datejust', brand: 'Rolex', category: 'accessories', price: 9599, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600', sizes: ['36mm', '41mm'], description: 'Luxury calendar watch in stainless steel and yellow gold' }
];

const banners = [
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1800&auto=format&fit=crop',
    label: 'New Season',
    title: 'Summer\nCollection 2026',
    subtitle: 'Discover our curated edit of the finest luxury fashion from around the world.',
    cta: 'Explore Now',
    link: '/new-arrivals',
    order: 1,
    isActive: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1800&auto=format&fit=crop',
    label: "Women's Edit",
    title: 'Effortless\nElegance',
    subtitle: 'Premium womenswear crafted to perfection by the world\'s finest designers.',
    cta: 'Shop Women',
    link: '/products?category=womenswear',
    order: 2,
    isActive: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1800&auto=format&fit=crop',
    label: "Men's Collection",
    title: 'Modern\nMasculinity',
    subtitle: 'Sophisticated menswear for the discerning gentleman who demands excellence.',
    cta: 'Shop Men',
    link: '/products?category=menswear',
    order: 3,
    isActive: true,
  },
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

    // Only seed if collections are empty (preserve admin-added data)
    const existingCategories = await Category.countDocuments();
    if (existingCategories === 0) {
      await Category.create(categories);
      console.log('Categories seeded');
    }

    const existingBrands = await Brand.countDocuments();
    if (existingBrands === 0) {
      await Brand.create(brands);
      console.log('Brands seeded');
    }

    const existingPosts = await Post.countDocuments();
    if (existingPosts === 0) {
      await Post.create(posts);
      console.log('Posts seeded');
    }

    const existingProducts = await Product.countDocuments();
    if (existingProducts === 0) {
      await Product.create(products);
      console.log('Products seeded');
    }

    const existingBanners = await Banner.countDocuments();
    if (existingBanners === 0) {
      await Banner.create(banners);
      console.log('Banners seeded');
    }

    const existingReviews = await Review.countDocuments();
    if (existingReviews === 0) {
      await Review.create(reviews);
      console.log('Reviews seeded');
    }

    // Home Data
    const existingHome = await HomeData.findOne();
    if (!existingHome) {
      await HomeData.create({
        spotlight: {
          brandName: 'BURBERRY',
          tagline: 'The Art of the Trench — Iconic British Heritage & Modern Tailoring',
          eyebrow: 'Brand Spotlight',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-in-a-fashion-show-1165-large.mp4',
          posterImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1800',
          link: '/products?brand=burberry',
        },
        womenSlides: [
          { img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600', text: 'Embroidered Royal Anarkalis' },
          { img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600', text: 'Luxury Cape Gowns' },
          { img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600', text: 'Baroque Silk Abayas' },
          { img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600', text: 'Silk Georgette Collection' },
        ],
        menSlides: [
          { img: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?q=80&w=600', text: 'Velvet Royal Sherwanis' },
          { img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600', text: 'Bespoke Wool Suits' },
          { img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600', text: 'Sharp Double-Breasted Suits' },
          { img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600', text: 'Smart Casual Linen Sets' },
        ],
        contact: {
          heading: 'Our Flagship Store',
          description: 'Experience luxury fashion in person at our flagship store. Our personal stylists are ready to assist you with an unparalleled shopping experience.',
          address: '3rd Floor, City Mall, MG Road, Kochi, Kerala 682016',
          phone: '+91 484 123 4567',
          hours: 'Mon–Thu 10am–10pm | Fri–Sun 10am–11pm',
          whatsapp: '+91 98765 43210',
          mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0!2d76.2673!3d9.9312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b086d4b07ef0e41%3A0x8f7c4ce44e7b3c9a!2sMG%20Road%2C%20Kochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
        },
        newArrivalsLimit: 12,
        trendingLimit: 8,
      });
      console.log('Home data seeded');
    }
  } catch (error) {
    console.error('Error seeding initial data:', error.message);
  }
};

module.exports = seedInitialData;
