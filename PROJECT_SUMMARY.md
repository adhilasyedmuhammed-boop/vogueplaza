# VOGUE PLAZA — Project Summary & Presentation

---

## 📌 Project Overview

**Vogue Plaza** is a premium full-stack e-commerce platform designed for a luxury fashion retail brand. It provides a complete online shopping experience for customers and a powerful management dashboard for administrators.

| Item | Detail |
|------|--------|
| **Platform Type** | E-commerce (Fashion & Luxury Retail) |
| **Live URL** | https://vogueplaza.vercel.app |
| **Admin Panel** | https://vogueplaza.vercel.app/admin |
| **Architecture** | Full-Stack (React SPA + Node.js API + MongoDB) |
| **Hosting** | Vercel (Serverless) |

---

## 🏗️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite (Fast SPA) |
| **Backend** | Node.js + Express.js 5 (REST API) |
| **Database** | MongoDB (Cloud) via Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) |
| **Image Storage** | Cloudinary (Cloud-hosted media) |
| **Payment Gateway** | Razorpay Integration |
| **Deployment** | Vercel (Auto-deploy from Git) |
| **Security** | Helmet.js, Rate Limiting, Input Validation, bcrypt Password Hashing |

---

## 🛍️ Customer-Facing Features

### 1. Product Browsing & Discovery
- Full product catalog with high-quality images (up to 4 per product)
- Filter by **Category**, **Brand**, **Price Range**, and **Search**
- Sort by Price, Popularity, or Rating
- Server-side pagination for fast loading
- Product badges: "New Arrival", "Sale", "Out of Stock"
- Recently viewed products tracking
- Quick View modal (preview without leaving page)

### 2. Product Categories (6 Departments)
| # | Category |
|---|----------|
| 1 | Womenswear |
| 2 | Menswear |
| 3 | Accessories |
| 4 | Kids |
| 5 | Home Decor |
| 6 | Footwear |

### 3. Luxury Brands Supported
Gucci, Prada, Dior, Chanel, Burberry, Armani, Versace, Rolex, Hugo Boss, and more — with dedicated brand pages, logos, and brand-filtered shopping.

### 4. Shopping Cart
- Add/remove items with size & quantity selection
- Maximum 5 per item (inventory control)
- Persistent cart (saved locally + synced to server on login)
- Cart merges when user logs in from another device
- Server-side price verification (prevents price manipulation)

### 5. Wishlist
- Add/remove products to wishlist
- Heart icon toggle on all product cards
- Persistent across sessions
- Move to cart functionality

### 6. Checkout & Payment
- Complete shipping address form with saved addresses
- **6 Payment Methods**: COD, UPI, Card, Netbanking, EMI, Razorpay
- Automatic shipping calculation:
  - Free shipping over ₹5,000
  - ₹99 flat rate below ₹5,000
- 5% tax calculation (server-verified)
- Promo code application at checkout

### 7. Order Tracking
- Full order history with status updates
- **Order Statuses**: Placed → Confirmed → Packed → Shipped → Out for Delivery → Delivered
- Tracking number support
- Estimated delivery dates
- Payment status visibility

### 8. User Account
- Registration & Login (Email + Password)
- Email verification system
- Password reset capability
- Profile management (name, phone)
- Multiple saved addresses (with default selection)
- Order history view
- Wishlist & cart access

### 9. Reviews & Ratings
- Submit product reviews (1–5 stars)
- View average ratings & star distribution
- Verified purchase badges
- Admin-moderated (quality control)

### 10. Customer Engagement
- Newsletter subscription
- Contact/enquiry form (with category selection)
- WhatsApp direct chat bubble
- Social sharing buttons (share products)
- Style Feed (Instagram-style posts)

---

## 🖥️ Admin Panel Features

### Dashboard & Analytics
| Metric | Description |
|--------|-------------|
| Revenue Overview | Total, monthly, with growth % comparison |
| Order Metrics | Today / This Week / This Month vs. Last Month |
| Top 5 Products | By sales volume |
| Sales by Category | Breakdown across 6 departments |
| Orders by Status | Distribution visualization |
| Low Stock Alerts | Products with < 5 units |
| Out of Stock Count | Immediate attention items |
| Customer Growth | New registrations vs. previous month |
| Daily Sales (7 days) | Chart-ready data |
| Recent Activity Feed | Latest orders, reviews, products, enquiries |

### Content Management System (CMS)

| Module | Capabilities |
|--------|-------------|
| **Products** | Create, edit, delete, manage stock, upload images, set pricing/discounts |
| **Categories** | Create, edit, toggle visibility, upload category images |
| **Brands** | Create, edit, logo upload, activation toggle |
| **Banners** | Create hero banners with title, subtitle, CTA, custom links, ordering |
| **Home Page** | Manage brand spotlight, women/men slides, contact info, featured limits |
| **Posts (Style Feed)** | Create/edit social posts with images, captions, toggle visibility |
| **Promo Codes** | Create codes, set discount %, min order, usage limits, expiry dates |
| **Store Info** | Store name, address, hours, map coordinates, WhatsApp setup |

### Order Management
- View all orders with full details
- Update order status through workflow
- Track payment status & method
- Add tracking numbers
- Set estimated delivery dates
- Cancel/return orders

### Customer Management
- View all registered users
- Access user details & contact info
- Manage user roles (user/admin)
- View & respond to enquiries (mark read/unread)
- Moderate reviews (approve/reject/delete)

### Newsletter & Marketing
- View subscriber list
- Manage promo codes with analytics (usage tracking)
- Configure promotional banners

---

## 🎨 UI/UX Highlights

| Feature | Description |
|---------|-------------|
| **Responsive Design** | Fully mobile-optimized with bottom navigation |
| **Video Hero** | Brand spotlight with video/poster fallback |
| **Image Carousels** | Auto-rotating banners (3-second interval) |
| **Product Hover Effects** | Image swap on hover |
| **Quick View Modal** | Preview products without navigation |
| **Size Guide Modal** | Size chart reference |
| **Toast Notifications** | Non-intrusive success/error feedback |
| **Lazy Loading** | Images load on demand for performance |
| **Back to Top** | Scroll-triggered floating button |
| **Masonry Grid** | Pinterest-style category layout |
| **Brand Scroller** | Horizontal logo carousel |
| **Skeleton Loading** | Smooth loading states |
| **Mega Menu** | Desktop dropdown navigation with sub-categories |
| **SEO Optimized** | Meta tags, OG tags, structured navigation |

---

## 🔐 Security Features

| Security Layer | Implementation |
|----------------|---------------|
| Password Hashing | bcrypt (industry standard) |
| Authentication | JWT tokens (7-day expiry) |
| Security Headers | Helmet.js (XSS, MIME sniffing, clickjacking protection) |
| Rate Limiting | 30 attempts per 15 min on auth routes |
| Input Validation | express-validator on all forms |
| Input Sanitization | Review/enquiry content sanitized |
| CORS Protection | Whitelisted origins only |
| Server-side Price Verification | Prevents cart manipulation |
| Admin Route Protection | Middleware-enforced role checking |
| Email Verification | 24-hour token expiry |

---

## 🗄️ Database Models (13 Collections)

| # | Model | Purpose |
|---|-------|---------|
| 1 | **User** | Customer accounts, addresses, cart, wishlist |
| 2 | **Product** | Catalog with pricing, images, stock, ratings |
| 3 | **Order** | Purchases with tracking, payment, status history |
| 4 | **Category** | Product departments |
| 5 | **Brand** | Luxury brand information |
| 6 | **Review** | Customer reviews & ratings (product + store) |
| 7 | **Banner** | Promotional hero banners |
| 8 | **Post** | Style feed social posts |
| 9 | **Enquiry** | Customer contact messages |
| 10 | **PromoCode** | Discount codes with rules |
| 11 | **Newsletter** | Email subscribers |
| 12 | **HomeData** | Homepage configuration |
| 13 | **StoreInfo** | Store details & business hours |

---

## 🚀 Deployment & Infrastructure

```
┌─────────────────────────────────────────────────┐
│                   VERCEL                         │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐    ┌────────────────────┐    │
│  │  Static SPA  │    │  Serverless API    │    │
│  │  (React App) │    │  (Node.js/Express) │    │
│  │              │    │                    │    │
│  │  index.html  │    │  /api/* routes     │    │
│  │  admin.html  │    │                    │    │
│  └──────────────┘    └─────────┬──────────┘    │
│                                │               │
└────────────────────────────────┼───────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
              ┌─────▼─────┐ ┌───▼───┐ ┌─────▼─────┐
              │  MongoDB  │ │Cloudi- │ │ Razorpay  │
              │  (Cloud)  │ │nary   │ │ (Payments)│
              └───────────┘ └───────┘ └───────────┘
```

| Aspect | Detail |
|--------|--------|
| **Hosting** | Vercel (auto-deploy from Git) |
| **Frontend** | Static SPA with client-side routing |
| **Backend** | Serverless Node.js functions |
| **Database** | MongoDB Atlas (cached connections) |
| **Media** | Cloudinary CDN (image optimization) |
| **Payments** | Razorpay (UPI, Cards, Netbanking, EMI) |
| **SSL** | Automatic HTTPS via Vercel |
| **CI/CD** | Git push → Auto deployment |

---

## 📊 API Endpoints Summary

| Route Group | Endpoints | Description |
|-------------|-----------|-------------|
| `/api/auth` | 7 | Login, Register, Verify, Reset Password |
| `/api/products` | 5 | CRUD + Filtering/Pagination |
| `/api/categories` | 1+ | Category management |
| `/api/brands` | 1+ | Brand management |
| `/api/cart` | 5 | Cart sync, add, remove, clear |
| `/api/wishlist` | 3 | Wishlist management |
| `/api/orders` | 4 | Place, view, track orders |
| `/api/reviews` | 4+ | Submit & view reviews |
| `/api/enquiries` | 2+ | Customer contact |
| `/api/newsletter` | 1 | Email subscription |
| `/api/banners` | 1+ | Promotional banners |
| `/api/posts` | 1+ | Style feed |
| `/api/store` | 1+ | Store info |
| `/api/homedata` | 1+ | Homepage config |
| `/api/promo` | 2+ | Promo code validation |
| `/api/user` | 6+ | Profile & address management |
| `/api/admin` | 20+ | Full admin operations |
| `/api/upload` | 1+ | Image upload (Cloudinary) |

**Total: 60+ API endpoints**

---

## 💰 Business Value Delivered

| Value | Impact |
|-------|--------|
| **Complete E-commerce** | Ready-to-sell platform from day one |
| **No Monthly Fees** | Vercel free tier + MongoDB free tier available |
| **Scalable** | Serverless auto-scales with traffic |
| **Mobile-Ready** | Full responsive experience (60%+ traffic is mobile) |
| **SEO Optimized** | Meta tags, fast loading, structured data |
| **Secure** | Industry-standard security practices |
| **Self-Managed** | Full admin panel — no developer needed for daily operations |
| **Payment Ready** | Razorpay integration for Indian market |
| **Marketing Tools** | Promo codes, newsletter, reviews, style feed |
| **Analytics** | Built-in dashboard with revenue & growth metrics |
| **Fast Performance** | Vite build, lazy loading, CDN images |
| **Multi-device Cart** | Cart syncs across devices on login |

---

## 📁 Project Structure

```
vogue-plaza/
├── api/              → Vercel serverless entry point
├── client/           → React frontend (Vite)
│   ├── src/
│   │   ├── components/   → 30+ reusable UI components
│   │   ├── pages/        → 11 customer pages + 12 admin pages
│   │   ├── context/      → Cart & Wishlist state management
│   │   ├── api/          → Axios HTTP client config
│   │   └── styles/       → CSS stylesheets
│   └── public/           → Static assets (brand logos)
├── server/           → Express.js backend
│   ├── models/       → 13 MongoDB schemas
│   ├── routes/       → 18 route modules
│   ├── middleware/   → Auth & admin protection
│   └── config/       → Database & Cloudinary setup
├── vercel.json       → Deployment configuration
└── package.json      → Root scripts & dependencies
```

---

## ✅ Project Deliverables Checklist

- [x] Responsive customer-facing website
- [x] Full product catalog with filtering & search
- [x] Shopping cart with size/quantity selection
- [x] Wishlist functionality
- [x] User registration & login (with email verification)
- [x] Checkout with multiple payment options
- [x] Order placement & tracking
- [x] Promo code system
- [x] Customer reviews & ratings
- [x] Newsletter subscription
- [x] Contact/enquiry system
- [x] WhatsApp integration
- [x] Admin dashboard with analytics
- [x] Product management (CRUD)
- [x] Category & brand management
- [x] Banner & homepage CMS
- [x] Order management & status updates
- [x] User management
- [x] Review moderation
- [x] Promo code management
- [x] Store information management
- [x] Style feed (social posts)
- [x] Image upload via Cloudinary
- [x] Razorpay payment integration
- [x] SEO meta tags
- [x] Security (JWT, rate limiting, input validation)
- [x] Vercel deployment (CI/CD)
- [x] Mobile-responsive design

---

*Document generated for client presentation — Vogue Plaza E-commerce Platform*
